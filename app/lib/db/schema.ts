export interface Campaign {
  id: string;
  business_pubkey: string;
  name: string;
  payout_amount: number;
  max_payouts: number;
  start_date: Date;
  end_date?: Date;
  status: 'active' | 'paused' | 'ended';
  created_at: Date;
}

export interface Affiliate {
  id: string;
  pubkey: string;
  invoice_endpoint?: string;
  created_at: Date;
}

export interface Click {
  id: string;
  campaign_id: string;
  affiliate_id: string;
  user_fingerprint: string;
  ip_address: string;
  user_agent: string;
  clicked_at: Date;
}

export interface Conversion {
  id: string;
  campaign_id: string;
  affiliate_id: string;
  click_id?: string;
  conversion_type: string;
  metadata?: Record<string, any>;
  fraud_score?: number;
  status: 'pending' | 'verified' | 'rejected';
  converted_at: Date;
}

export interface Proof {
  id: string;
  conversion_id: string;
  tx_signature: string;
  proof_hash: string;
  submitted_at: Date;
}

export interface Payout {
  id: string;
  conversion_id: string;
  affiliate_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  payment_tx?: string;
  invoice_id?: string;
  created_at: Date;
  paid_at?: Date;
}

