import { NextRequest, NextResponse } from 'next/server';
import { checkConversion } from '@/lib/fraud/detector';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaign_id, affiliate_id, conversion_type, metadata } = body;

    // Extract request metadata for fraud check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Run fraud detection
    const fraudCheck = await checkConversion({
      ip,
      userAgent,
      fingerprint: metadata?.fingerprint || '',
      affiliateId: affiliate_id,
      campaignId: campaign_id,
    });

    if (!fraudCheck.passed) {
      return NextResponse.json(
        { error: 'Conversion failed fraud check', reasons: fraudCheck.reasons },
        { status: 400 }
      );
    }

    // TODO: Store conversion in database
    // TODO: Submit proof transaction to Solana
    // TODO: Trigger payout service

    return NextResponse.json({ success: true, conversion_id: 'TODO' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

