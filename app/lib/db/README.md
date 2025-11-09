# Database Layer

This directory contains the database implementation using Knex.js and SQLite.

## Files

- `client.ts` - Database connection and table initialization
- `repository.ts` - Data access layer with type-safe queries
- `schema.ts` - TypeScript type definitions
- `init.ts` - Database initialization helper

## Usage

### Repository Pattern

All database access goes through repositories:

```typescript
import { CampaignRepository, ConversionRepository } from '@/lib/db/repository';

// Create a campaign
const campaign = await CampaignRepository.create({
  id: 'campaign_id',
  merchant_pubkey: 'merchant_wallet',
  name: 'Holiday Sale',
  payout_amount: 5.00,
  max_payouts: 100,
  start_date: new Date(),
  status: 'active',
});

// Query campaigns
const campaigns = await CampaignRepository.findByMerchant('merchant_wallet');

// Track conversion
const conversion = await ConversionRepository.create({
  id: 'conv_123',
  campaign_id: 'campaign_id',
  affiliate_id: 'affiliate_wallet',
  conversion_type: 'signup',
  fraud_score: 15.5,
  status: 'pending',
});
```

## Benefits of Repository Pattern

1. **Type Safety**: All queries return properly typed objects
2. **Separation of Concerns**: Business logic stays separate from SQL
3. **Testability**: Easy to mock repositories for testing
4. **Consistency**: Standardized data access across the app
5. **Maintainability**: Single place to update queries

## Adding New Tables

1. Add interface to `schema.ts`
2. Add table creation to `client.ts` in `initDb()`
3. Create repository class in `repository.ts`
4. Export repository from `repository.ts`

