import { NextRequest, NextResponse } from 'next/server';
import { PayoutRepository, ConversionRepository } from '@/lib/db/repository';
import { ensureDbInitialized } from '@/lib/db/init';

export async function GET(request: NextRequest) {
  await ensureDbInitialized();
  
  try {
    const { searchParams } = new URL(request.url);
    const affiliateId = searchParams.get('affiliate_id');

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'affiliate_id is required' },
        { status: 400 }
      );
    }

    const payouts = await PayoutRepository.findByAffiliate(affiliateId);
    const conversions = await ConversionRepository.findByAffiliate(affiliateId);
    const totalEarnings = await PayoutRepository.getTotalEarnings(affiliateId);

    const paidPayouts = payouts.filter((p) => p.status === 'paid');
    const verifiedConversions = conversions.filter((c) => c.status === 'verified');

    return NextResponse.json({
      total_earnings: totalEarnings,
      total_payouts: paidPayouts.length,
      total_conversions: verifiedConversions.length,
      pending_conversions: conversions.filter((c) => c.status === 'pending').length,
      payouts,
      conversions,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

