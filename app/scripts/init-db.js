const { initDb } = require('../lib/db/client.ts');

async function main() {
  console.log('Initializing database...');
  
  try {
    await initDb();
    console.log('Database initialized successfully!');
    console.log('Tables created: campaigns, affiliates, clicks, conversions, proofs, payouts');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main();

