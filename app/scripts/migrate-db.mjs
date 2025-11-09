import knex from 'knex';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../../.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not load .env file, using existing environment variables');
  }
}

async function migrate() {
  loadEnv();
  
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('Please set DATABASE_URL in your .env file');
    process.exit(1);
  }

  console.log('🔗 Connecting to PostgreSQL...');
  console.log(`   Database: ${databaseUrl.split('@')[1]?.split('?')[0] || 'hidden'}`);

  const db = knex({
    client: 'pg',
    connection: databaseUrl,
    pool: { min: 1, max: 1 },
  });

  try {
    console.log('\n📊 Migrating database schema...\n');

    // campaigns table
    const hasCampaigns = await db.schema.hasTable('campaigns');
    if (!hasCampaigns) {
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
      console.log('✅ Created table: campaigns');
    } else {
      console.log('⏭️  Table already exists: campaigns');
    }

    // affiliates table
    const hasAffiliates = await db.schema.hasTable('affiliates');
    if (!hasAffiliates) {
      await db.schema.createTable('affiliates', (table) => {
        table.string('id').primary();
        table.string('pubkey').notNullable().unique();
        table.string('invoice_endpoint').nullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log('✅ Created table: affiliates');
    } else {
      console.log('⏭️  Table already exists: affiliates');
    }

    // clicks table
    const hasClicks = await db.schema.hasTable('clicks');
    if (!hasClicks) {
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
      console.log('✅ Created table: clicks');
    } else {
      console.log('⏭️  Table already exists: clicks');
    }

    // conversions table
    const hasConversions = await db.schema.hasTable('conversions');
    if (!hasConversions) {
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
      console.log('✅ Created table: conversions');
    } else {
      console.log('⏭️  Table already exists: conversions');
    }

    // proofs table
    const hasProofs = await db.schema.hasTable('proofs');
    if (!hasProofs) {
      await db.schema.createTable('proofs', (table) => {
        table.string('id').primary();
        table.string('conversion_id').notNullable();
        table.string('tx_signature').notNullable();
        table.string('proof_hash').notNullable();
        table.timestamp('submitted_at').defaultTo(db.fn.now());
        table.index(['conversion_id']);
      });
      console.log('✅ Created table: proofs');
    } else {
      console.log('⏭️  Table already exists: proofs');
    }

    // payouts table
    const hasPayouts = await db.schema.hasTable('payouts');
    if (!hasPayouts) {
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
      console.log('✅ Created table: payouts');
    } else {
      console.log('⏭️  Table already exists: payouts');
    }

    console.log('\n🎉 Database migration completed successfully!\n');
    console.log('Tables:');
    console.log('  • campaigns');
    console.log('  • affiliates');
    console.log('  • clicks');
    console.log('  • conversions');
    console.log('  • proofs');
    console.log('  • payouts');

    await db.destroy();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    await db.destroy();
    process.exit(1);
  }
}

migrate();

