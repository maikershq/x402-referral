import { NextRequest, NextResponse } from 'next/server';
import { CampaignRepository } from '@/lib/db/repository';
import { getServerProgram } from '@/lib/solana/server-client';
import { ensureDbInitialized } from '@/lib/db/init';

export async function GET(request: NextRequest) {
  await ensureDbInitialized();
  
  try {
    const { searchParams } = new URL(request.url);
    const business = searchParams.get('business');

    let campaigns;
    if (business) {
      campaigns = await CampaignRepository.findByBusiness(business);
    } else {
      campaigns = await CampaignRepository.findAll();
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await ensureDbInitialized();
  
  try {
    const body = await request.json();
    const { campaignPda, businessPubkey, name } = body;

    if (!campaignPda || !businessPubkey || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const program = getServerProgram();
    const campaignData = await program.account.campaign.fetch(campaignPda);

    const campaign = await CampaignRepository.create({
      id: campaignPda,
      business_pubkey: businessPubkey,
      name,
      payout_amount: parseFloat(campaignData.payoutAmount.toString()) / 1_000_000,
      max_payouts: campaignData.maxPayouts.toNumber(),
      start_date: new Date(campaignData.startTimestamp.toNumber() * 1000),
      end_date: campaignData.endTimestamp
        ? new Date(campaignData.endTimestamp.toNumber() * 1000)
        : undefined,
      status: campaignData.status.active
        ? 'active'
        : campaignData.status.paused
        ? 'paused'
        : 'ended',
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

