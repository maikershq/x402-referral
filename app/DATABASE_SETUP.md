# Database Setup

This application supports both PostgreSQL and SQLite with Knex.js.

## Environment Variables Required

Add these to your `.env` file:

```bash
# Database (choose one)
DATABASE_URL=postgresql://user:password@host:5432/database  # PostgreSQL (production)
# OR
DATABASE_PATH=./data/referrals.db  # SQLite (development)

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here
SOLANA_AUTHORITY_PRIVATE_KEY=your_base58_encoded_private_key_here
```

**Note:** If `DATABASE_URL` is present, PostgreSQL will be used. Otherwise, it falls back to SQLite.

## Setup Instructions

1. Install dependencies:
```bash
pnpm install
```

2. The database will be automatically initialized on first API call, or you can initialize it manually:
```bash
pnpm db:init
```

## Database Schema

The database includes the following tables:

### campaigns
- Stores campaign metadata synced from Solana
- Links on-chain campaign PDAs to business data

### affiliates
- Tracks affiliate wallet addresses
- Optional invoice endpoints for x402 payouts

### clicks
- Records all referral link clicks
- Used for fraud detection and attribution

### conversions
- Stores verified conversion events
- Includes fraud scores and status tracking

### proofs
- On-chain proof submissions
- Links conversions to Solana transactions

### payouts
- Payment records for affiliates
- Tracks payout status and transaction signatures

## Data Flow

1. **Campaign Creation**: Business creates campaign on-chain → API syncs to database
2. **Click Tracking**: User clicks referral link → Stored in clicks table
3. **Conversion**: User converts → Fraud check → Stored in conversions
4. **Proof Submission**: Conversion proof submitted to Solana → Stored in proofs
5. **Payout**: Affiliate payment processed → Stored in payouts

## Database Selection

The app automatically selects the database based on environment variables:

- **PostgreSQL**: Set `DATABASE_URL` (production recommended)
- **SQLite**: Set `DATABASE_PATH` or omit both for default `./data/referrals.db`

## Backup & Maintenance

**PostgreSQL:**
- Use your provider's backup tools (e.g., Neon, Supabase, AWS RDS)

**SQLite:**
```bash
cp data/referrals.db data/referrals.backup.db
```

The database auto-initializes tables on startup if they don't exist.

