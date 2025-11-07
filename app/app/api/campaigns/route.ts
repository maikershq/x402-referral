import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Query campaigns from database or on-chain
    const campaigns: Array<unknown> = [];

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Validate merchant signature
    // TODO: Create campaign on-chain
    // TODO: Store in database

    return NextResponse.json({ success: true, campaign_id: 'TODO' });
  } catch (error) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

