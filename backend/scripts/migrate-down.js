const { pool } = require('../src/config/database');

async function runMigrateDown() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // drop all tables
    await client.query(`
      DROP TABLE IF EXISTS himti_applications CASCADE;
      DROP TABLE IF EXISTS divisions CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS migrations CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
      DROP TYPE IF EXISTS application_status CASCADE;
    `);

    await client.query('COMMIT');
    console.log('all tables dropped successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('migration down failed:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

runMigrateDown();
