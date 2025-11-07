import { NextRequest, NextResponse } from 'next/server';
import { checkConversion } from '@/lib/fraud/detector';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaign_id, affiliate_id, conversion_type, metadata } = body;

    // Validate required fields
    if (!campaign_id || !affiliate_id || !conversion_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract request metadata for fraud check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Run fraud detection
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

    // Generate conversion ID
    const conversionId = `conv_${Date.now()}_${crypto
      .randomBytes(4)
      .toString('hex')}`;

    // Generate proof hash
    const proofData = `${conversionId}|${affiliate_id}|${Date.now()}|5.00`;
    const proofHash = crypto.createHash('sha256').update(proofData).digest();

    console.log('Conversion tracked:', {
      conversionId,
      campaign_id,
      affiliate_id,
      conversion_type,
      fraudScore: fraudCheck.score,
    });

    // In production:
    // 1. Store conversion in database
    // 2. Submit proof to Solana via Anchor program
    // 3. Trigger payout service

    // For demo, simulate successful conversion
    return NextResponse.json({
      success: true,
      conversion_id: conversionId,
      fraud_score: fraudCheck.score,
      proof_hash: proofHash.toString('hex').slice(0, 16),
      message: 'Conversion tracked successfully',
    });
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

