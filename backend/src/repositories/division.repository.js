const { pool } = require('../config/database');

class DivisionRepository {
  async findAllActive() {
    const result = await pool.query(
      'SELECT id, name, description FROM divisions WHERE is_active = true ORDER BY name ASC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM divisions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new DivisionRepository();
