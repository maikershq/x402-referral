import { getDb } from './client';
import { Campaign, Affiliate, Click, Conversion, Proof, Payout } from './schema';

export class CampaignRepository {
  static async create(campaign: Omit<Campaign, 'created_at'>): Promise<Campaign> {
    const db = getDb();
    await db('campaigns').insert(campaign);
    return { ...campaign, created_at: new Date() };
  }

  static async findById(id: string): Promise<Campaign | null> {
    const db = getDb();
    return db('campaigns').where({ id }).first();
  }

  static async findByBusiness(businessPubkey: string): Promise<Campaign[]> {
    const db = getDb();
    return db('campaigns').where({ business_pubkey: businessPubkey });
  }

  static async findAll(): Promise<Campaign[]> {
    const db = getDb();
    return db('campaigns').select('*');
  }

  static async updateStatus(id: string, status: 'active' | 'paused' | 'ended'): Promise<void> {
    const db = getDb();
    await db('campaigns').where({ id }).update({ status });
  }
}

export class AffiliateRepository {
  static async create(affiliate: Omit<Affiliate, 'created_at'>): Promise<Affiliate> {
    const db = getDb();
    await db('affiliates').insert(affiliate);
    return { ...affiliate, created_at: new Date() };
  }

  static async findByPubkey(pubkey: string): Promise<Affiliate | null> {
    const db = getDb();
    return db('affiliates').where({ pubkey }).first();
  }

  static async upsert(affiliate: Omit<Affiliate, 'created_at'>): Promise<Affiliate> {
    const existing = await this.findByPubkey(affiliate.pubkey);
    if (existing) {
      return existing;
    }
    return this.create(affiliate);
  }
}

export class ClickRepository {
  static async create(click: Omit<Click, 'clicked_at'>): Promise<Click> {
    const db = getDb();
    await db('clicks').insert(click);
    return { ...click, clicked_at: new Date() };
  }

  static async findByCampaignAndAffiliate(
    campaignId: string,
    affiliateId: string
  ): Promise<Click[]> {
    const db = getDb();
    return db('clicks').where({ campaign_id: campaignId, affiliate_id: affiliateId });
  }
}

export class ConversionRepository {
  static async create(conversion: Omit<Conversion, 'converted_at'>): Promise<Conversion> {
    const db = getDb();
    await db('conversions').insert(conversion);
    return { ...conversion, converted_at: new Date() };
  }

  static async findById(id: string): Promise<Conversion | null> {
    const db = getDb();
    return db('conversions').where({ id }).first();
  }

  static async findByAffiliate(affiliateId: string): Promise<Conversion[]> {
    const db = getDb();
    return db('conversions').where({ affiliate_id: affiliateId });
  }

  static async findByCampaign(campaignId: string): Promise<Conversion[]> {
    const db = getDb();
    return db('conversions').where({ campaign_id: campaignId });
  }

  static async updateStatus(
    id: string,
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<void> {
    const db = getDb();
    await db('conversions').where({ id }).update({ status });
  }
}

export class ProofRepository {
  static async create(proof: Omit<Proof, 'submitted_at'>): Promise<Proof> {
    const db = getDb();
    await db('proofs').insert(proof);
    return { ...proof, submitted_at: new Date() };
  }

  static async findByConversion(conversionId: string): Promise<Proof | null> {
    const db = getDb();
    return db('proofs').where({ conversion_id: conversionId }).first();
  }
}

export class PayoutRepository {
  static async create(payout: Omit<Payout, 'created_at' | 'paid_at'>): Promise<Payout> {
    const db = getDb();
    await db('payouts').insert(payout);
    return { ...payout, created_at: new Date(), paid_at: undefined };
  }

  static async findByAffiliate(affiliateId: string): Promise<Payout[]> {
    const db = getDb();
    return db('payouts').where({ affiliate_id: affiliateId });
  }

  static async updateStatus(
    id: string,
    status: 'pending' | 'processing' | 'paid' | 'failed',
    paymentTx?: string
  ): Promise<void> {
    const db = getDb();
    const updates: any = { status };
    if (paymentTx) {
      updates.payment_tx = paymentTx;
    }
    if (status === 'paid') {
      updates.paid_at = new Date();
    }
    await db('payouts').where({ id }).update(updates);
  }

  static async getTotalEarnings(affiliateId: string): Promise<number> {
    const db = getDb();
    const result = await db('payouts')
      .where({ affiliate_id: affiliateId, status: 'paid' })
      .sum('amount as total')
      .first();
    return result?.total || 0;
  }
}

