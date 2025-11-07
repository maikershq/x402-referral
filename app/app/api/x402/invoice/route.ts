import { NextRequest, NextResponse } from 'next/server';

// Demo affiliate invoice endpoint
// Returns HTTP 402 with payment request details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amount = searchParams.get('amount');
  const conversionId = searchParams.get('conversion_id');

  // Return HTTP 402 Payment Required
  return new NextResponse(
    JSON.stringify({
      amount: amount || '5.00',
      currency: 'USDC',
      recipient: process.env.AFFILIATE_WALLET_ADDRESS || 'DEMO_WALLET',
      conversion_id: conversionId,
      description: 'Referral payout',
    }),
    {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

