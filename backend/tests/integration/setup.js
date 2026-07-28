const { pool } = require('../../src/config/database');
const env = require('../../src/config/env');

beforeAll(async () => {
  // ensure test env to protect prod data
  if (env.NODE_ENV !== 'test') {
    console.warn('WARNING: Running tests outside of test environment. This could be dangerous.');
  }
});

afterAll(async () => {
  await pool.end();
});

// optional table truncate before test suite
// tests should clean their own data
