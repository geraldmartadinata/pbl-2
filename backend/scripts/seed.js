const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function runSeeds() {
  const client = await pool.connect();
  try {
    const seedsDir = path.join(__dirname, '../seeds');
    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.js')).sort();

    for (const file of files) {
      console.log(`running seed: ${file}`);
      const seedModule = require(path.join(seedsDir, file));
      await seedModule.seed(client);
      console.log(`seed completed: ${file}`);
    }

    console.log('all seeds ran successfully.');
  } catch (error) {
    console.error('seed failed:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

runSeeds();
