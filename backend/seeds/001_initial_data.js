const bcrypt = require('bcrypt');
const env = require('../src/config/env');

async function seed(client) {
  try {
    await client.query('BEGIN');

    // seed divisions
    const divisions = [
      { name: 'Technology', description: 'Focuses on software and hardware development.' },
      { name: 'Education', description: 'Handles academic and learning initiatives.' },
      { name: 'Human Resources', description: 'Manages member relations and development.' },
      { name: 'Public Relations', description: 'Handles internal and external communications.' },
      { name: 'Creative and Design', description: 'Manages design, branding, and multimedia.' },
      { name: 'Event', description: 'Organizes and executes HIMTI events.' },
      { name: 'Other', description: 'Other divisions not explicitly categorized.' }
    ];

    for (const div of divisions) {
      await client.query(
        `INSERT INTO divisions (name, description) 
         VALUES ($1, $2) 
         ON CONFLICT (name) DO NOTHING`,
        [div.name, div.description]
      );
    }
    console.log('Divisions seeded.');

    // seed admin
    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;
    
    // check if admin exists
    const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, env.BCRYPT_SALT_ROUNDS);
      await client.query(
        `INSERT INTO users (
          full_name, nim, email, phone, study_program, intake_year, campus, password_hash, role
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 'ADMIN'
        )`,
        [
          env.ADMIN_FULL_NAME,
          env.ADMIN_NIM,
          adminEmail,
          '080000000000', // default admin phone
          'Computer Science', // default study program
          new Date().getFullYear(), // current year
          'Kemanggisan', // default campus
          passwordHash
        ]
      );
      console.log('Administrator account seeded.');
    } else {
      console.log('Administrator account already exists.');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

module.exports = { seed };
