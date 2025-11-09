import { NextRequest, NextResponse } from 'next/server';
import { checkConversion } from '@/lib/fraud/detector';
import { ConversionRepository, ProofRepository, PayoutRepository, AffiliateRepository } from '@/lib/db/repository';
import { submitProofToChain, getCampaignFromChain } from '@/lib/solana/server-client';
import { ensureDbInitialized } from '@/lib/db/init';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  await ensureDbInitialized();
  
  try {
    const body = await request.json();
    const { campaign_id, affiliate_id, conversion_type, metadata } = body;

    if (!campaign_id || !affiliate_id || !conversion_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const fraudCheck = await checkConversion({
      ip,
      userAgent,
      fingerprint: metadata?.fingerprint || `fp_${Date.now()}`,
      affiliateId: affiliate_id,
      campaignId: campaign_id,
    });

    if (!fraudCheck.passed) {
      console.log('Fraud check failed:', fraudCheck);
      return NextResponse.json(
        {
          error: 'Conversion failed fraud check',
          reasons: fraudCheck.reasons,
          score: fraudCheck.score,
        },
        { status: 400 }
      );
    }

    const conversionId = `conv_${Date.now()}_${crypto
      .randomBytes(4)
      .toString('hex')}`;

    await AffiliateRepository.upsert({
      id: `aff_${crypto.randomBytes(8).toString('hex')}`,
      pubkey: affiliate_id,
    });

    const conversion = await ConversionRepository.create({
      id: conversionId,
      campaign_id,
      affiliate_id,
      conversion_type,
      metadata,
      fraud_score: fraudCheck.score,
      status: 'pending',
    });

    const campaignPda = new PublicKey(campaign_id);
    const campaignData = await getCampaignFromChain(campaignPda);

    if (!campaignData) {
      return NextResponse.json(
        { error: 'Campaign not found on chain' },
        { status: 404 }
      );
    }

    const payoutAmount = campaignData.payoutAmount as BN;
    const proofData = `${conversionId}|${affiliate_id}|${Date.now()}|${payoutAmount.toString()}`;
    const proofHashBuffer = crypto.createHash('sha256').update(proofData).digest();
    const proofHashArray = Array.from(proofHashBuffer).slice(0, 32);

    try {
      const txSignature = await submitProofToChain(
        campaignPda,
        conversionId,
        new PublicKey(affiliate_id),
        payoutAmount,
        proofHashArray
      );

      await ProofRepository.create({
        id: `proof_${crypto.randomBytes(8).toString('hex')}`,
        conversion_id: conversionId,
        tx_signature: txSignature,
        proof_hash: proofHashBuffer.toString('hex'),
      });

      await ConversionRepository.updateStatus(conversionId, 'verified');

      const payout = await PayoutRepository.create({
        id: `payout_${crypto.randomBytes(8).toString('hex')}`,
        conversion_id: conversionId,
        affiliate_id,
        amount: parseFloat(payoutAmount.toString()) / 1_000_000,
        status: 'paid',
        payment_tx: txSignature,
      });

      console.log('Conversion processed successfully:', {
        conversionId,
        txSignature,
        payoutId: payout.id,
      });

      return NextResponse.json({
        success: true,
        conversion_id: conversionId,
        fraud_score: fraudCheck.score,
        proof_hash: proofHashBuffer.toString('hex').slice(0, 16),
        tx_signature: txSignature,
        payout_amount: parseFloat(payoutAmount.toString()) / 1_000_000,
        message: 'Conversion tracked and payout processed',
      });
    } catch (error: any) {
      console.error('Error submitting to chain:', error);
      await ConversionRepository.updateStatus(conversionId, 'rejected');

      return NextResponse.json(
        { error: 'Failed to process payout', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'conversion-webhook',
    timestamp: new Date().toISOString(),
  });
}

