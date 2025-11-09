import { NextRequest, NextResponse } from 'next/server';
import { ConversionRepository, AffiliateRepository } from '@/lib/db/repository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversionId = searchParams.get('conversion_id');
  const affiliateId = searchParams.get('affiliate_id');

  if (!conversionId || !affiliateId) {
    return NextResponse.json(
      { error: 'Missing conversion_id or affiliate_id' },
      { status: 400 }
    );
  }

  try {
    const conversion = await ConversionRepository.findById(conversionId);
    const affiliate = await AffiliateRepository.findByPubkey(affiliateId);

    if (!conversion) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      );
    }

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        amount: '5.00',
        currency: 'USDC',
        recipient: affiliate.pubkey,
        conversion_id: conversionId,
        description: 'Referral payout',
        metadata: {
          campaign_id: conversion.campaign_id,
          conversion_type: conversion.conversion_type,
        },
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

