const { pool } = require('../config/database');

class UserRepository {
  async create(userData) {
    const {
      fullName,
      nim,
      email,
      phone,
      studyProgram,
      intakeYear,
      campus,
      instagramUsername,
      passwordHash,
      role = 'APPLICANT',
    } = userData;

    const result = await pool.query(
      `INSERT INTO users (
        full_name, nim, email, phone, study_program, intake_year, campus, 
        instagram_username, password_hash, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING id, full_name, nim, email, role, created_at`,
      [
        fullName, nim, email, phone, studyProgram, intakeYear, campus,
        instagramUsername, passwordHash, role
      ]
    );

    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async findByNim(nim) {
    const result = await pool.query(
      'SELECT * FROM users WHERE nim = $1',
      [nim]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, full_name, nim, email, phone, study_program, intake_year, campus, instagram_username, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async updateProfile(id, updateData) {
    const {
      fullName,
      phone,
      studyProgram,
      intakeYear,
      campus,
      instagramUsername,
    } = updateData;

    const result = await pool.query(
      `UPDATE users 
       SET 
         full_name = COALESCE($1, full_name),
         phone = COALESCE($2, phone),
         study_program = COALESCE($3, study_program),
         intake_year = COALESCE($4, intake_year),
         campus = COALESCE($5, campus),
         instagram_username = COALESCE($6, instagram_username),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, full_name, nim, email, phone, study_program, intake_year, campus, instagram_username, updated_at`,
      [fullName, phone, studyProgram, intakeYear, campus, instagramUsername, id]
    );

    return result.rows[0];
  }
}

module.exports = new UserRepository();
