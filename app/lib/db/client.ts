import knex, { Knex } from 'knex';

let db: Knex | null = null;

export function getDb(): Knex {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl) {
      db = knex({
        client: 'pg',
        connection: databaseUrl,
        pool: { min: 2, max: 10 },
      });
    } else {
      db = knex({
        client: 'better-sqlite3',
        connection: {
          filename: process.env.DATABASE_PATH || './data/referrals.db',
        },
        useNullAsDefault: true,
      });
    }
  }
  return db;
}

export async function initDb() {
  const db = getDb();

  await db.schema.hasTable('campaigns').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('campaigns', (table) => {
        table.string('id').primary();
        table.string('merchant_pubkey').notNullable();
        table.string('name').notNullable();
        table.decimal('payout_amount', 20, 6).notNullable();
        table.integer('max_payouts').notNullable();
        table.timestamp('start_date').notNullable();
        table.timestamp('end_date').nullable();
        table.string('status').notNullable().defaultTo('active');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.index(['merchant_pubkey']);
      });
    }
  });

  await db.schema.hasTable('affiliates').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('affiliates', (table) => {
        table.string('id').primary();
        table.string('pubkey').notNullable().unique();
        table.string('invoice_endpoint').nullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('clicks').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('clicks', (table) => {
        table.string('id').primary();
        table.string('campaign_id').notNullable();
        table.string('affiliate_id').notNullable();
        table.string('user_fingerprint').notNullable();
        table.string('ip_address').notNullable();
        table.text('user_agent').notNullable();
        table.timestamp('clicked_at').defaultTo(db.fn.now());
        table.index(['campaign_id', 'affiliate_id']);
      });
    }
  });

  await db.schema.hasTable('conversions').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('conversions', (table) => {
        table.string('id').primary();
        table.string('campaign_id').notNullable();
        table.string('affiliate_id').notNullable();
        table.string('click_id').nullable();
        table.string('conversion_type').notNullable();
        table.json('metadata').nullable();
        table.decimal('fraud_score', 5, 2).nullable();
        table.string('status').notNullable().defaultTo('pending');
        table.timestamp('converted_at').defaultTo(db.fn.now());
        table.index(['campaign_id', 'affiliate_id']);
      });
    }
  });

  await db.schema.hasTable('proofs').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('proofs', (table) => {
        table.string('id').primary();
        table.string('conversion_id').notNullable();
        table.string('tx_signature').notNullable();
        table.string('proof_hash').notNullable();
        table.timestamp('submitted_at').defaultTo(db.fn.now());
        table.index(['conversion_id']);
      });
    }
  });

  await db.schema.hasTable('payouts').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('payouts', (table) => {
        table.string('id').primary();
        table.string('conversion_id').notNullable();
        table.string('affiliate_id').notNullable();
        table.decimal('amount', 20, 6).notNullable();
        table.string('status').notNullable().defaultTo('pending');
        table.string('payment_tx').nullable();
        table.string('invoice_id').nullable();
        table.timestamp('paid_at').nullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.index(['affiliate_id']);
      });
    }
  });
}

