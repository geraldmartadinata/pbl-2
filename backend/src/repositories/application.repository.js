const { pool } = require('../config/database');

class ApplicationRepository {
  async create(applicationData) {
    const {
      userId,
      divisionId,
      motivation,
      reasonForJoining,
      relevantSkills,
      organizationalExperience,
      timeCommitmentAgreed,
      portfolioUrl,
      linkedinUrl,
      githubUrl,
      additionalNotes,
    } = applicationData;

    const result = await pool.query(
      `INSERT INTO himti_applications (
        user_id, division_id, motivation, reason_for_joining, relevant_skills,
        organizational_experience, time_commitment_agreed, portfolio_url,
        linkedin_url, github_url, additional_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id, status, submitted_at`,
      [
        userId, divisionId, motivation, reasonForJoining, relevantSkills,
        organizationalExperience, timeCommitmentAgreed, portfolioUrl,
        linkedinUrl, githubUrl, additionalNotes
      ]
    );

    return result.rows[0];
  }

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT 
        a.id, a.motivation, a.reason_for_joining, a.relevant_skills,
        a.organizational_experience, a.portfolio_url, a.linkedin_url, a.github_url,
        a.additional_notes, a.status, a.admin_note, a.submitted_at, a.reviewed_at,
        d.id as division_id, d.name as division_name
       FROM himti_applications a
       JOIN divisions d ON a.division_id = d.id
       WHERE a.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async updatePendingApplication(id, updateData) {
    const {
      divisionId,
      motivation,
      reasonForJoining,
      relevantSkills,
      organizationalExperience,
      portfolioUrl,
      linkedinUrl,
      githubUrl,
      additionalNotes,
    } = updateData;

    const result = await pool.query(
      `UPDATE himti_applications
       SET
         division_id = COALESCE($1, division_id),
         motivation = COALESCE($2, motivation),
         reason_for_joining = COALESCE($3, reason_for_joining),
         relevant_skills = COALESCE($4, relevant_skills),
         organizational_experience = COALESCE($5, organizational_experience),
         portfolio_url = COALESCE($6, portfolio_url),
         linkedin_url = COALESCE($7, linkedin_url),
         github_url = COALESCE($8, github_url),
         additional_notes = COALESCE($9, additional_notes),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND status = 'PENDING'
       RETURNING id, status, updated_at`,
      [
        divisionId, motivation, reasonForJoining, relevantSkills,
        organizationalExperience, portfolioUrl, linkedinUrl, githubUrl,
        additionalNotes, id
      ]
    );

    return result.rows[0];
  }

  async getStatistics() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_applications,
        COUNT(*) FILTER (WHERE status = 'ACCEPTED') as accepted_applications,
        COUNT(*) FILTER (WHERE status = 'REJECTED') as rejected_applications
      FROM himti_applications
    `);
    
    return {
      totalApplications: parseInt(result.rows[0].total_applications, 10),
      pendingApplications: parseInt(result.rows[0].pending_applications, 10),
      acceptedApplications: parseInt(result.rows[0].accepted_applications, 10),
      rejectedApplications: parseInt(result.rows[0].rejected_applications, 10),
    };
  }

  async findApplications(params) {
    const { page = 1, limit = 10, search, status, divisionId, intakeYear, sortBy = 'submitted_at', sortOrder = 'DESC' } = params;
    
    const offset = (page - 1) * limit;
    
    let whereClauses = [];
    let queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereClauses.push(`(u.full_name ILIKE $${paramIndex} OR u.nim ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      whereClauses.push(`a.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (divisionId) {
      whereClauses.push(`a.division_id = $${paramIndex}`);
      queryParams.push(divisionId);
      paramIndex++;
    }

    if (intakeYear) {
      whereClauses.push(`u.intake_year = $${paramIndex}`);
      queryParams.push(intakeYear);
      paramIndex++;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // whitelist sort columns
    const allowedSortColumns = {
      'submitted_at': 'a.submitted_at',
      'full_name': 'u.full_name',
      'nim': 'u.nim',
      'status': 'a.status'
    };
    const sortCol = allowedSortColumns[sortBy] || 'a.submitted_at';
    const sortDir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const query = `
      SELECT 
        a.id as application_id, a.status, a.submitted_at,
        u.id as user_id, u.full_name, u.nim, u.email,
        d.name as division_name
      FROM himti_applications a
      JOIN users u ON a.user_id = u.id
      JOIN divisions d ON a.division_id = d.id
      ${whereString}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM himti_applications a
      JOIN users u ON a.user_id = u.id
      ${whereString}
    `;

    const dataParams = [...queryParams, limit, offset];
    
    const [dataResult, countResult] = await Promise.all([
      pool.query(query, dataParams),
      pool.query(countQuery, queryParams)
    ]);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: dataResult.rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems,
        totalPages
      }
    };
  }

  async findByIdWithDetails(id) {
    const result = await pool.query(
      `SELECT 
        a.id as application_id, a.motivation, a.reason_for_joining, a.relevant_skills,
        a.organizational_experience, a.portfolio_url, a.linkedin_url, a.github_url,
        a.additional_notes, a.status, a.admin_note, a.submitted_at, a.reviewed_at,
        u.id as user_id, u.full_name, u.nim, u.email, u.phone, u.study_program,
        u.intake_year, u.campus, u.instagram_username,
        d.name as division_name,
        r.full_name as reviewer_name
       FROM himti_applications a
       JOIN users u ON a.user_id = u.id
       JOIN divisions d ON a.division_id = d.id
       LEFT JOIN users r ON a.reviewed_by = r.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async updateStatus(id, updateData) {
    const { status, adminNote, reviewerId } = updateData;

    const result = await pool.query(
      `UPDATE himti_applications
       SET 
         status = $1,
         admin_note = COALESCE($2, admin_note),
         reviewed_by = $3,
         reviewed_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, status, admin_note, reviewed_at`,
      [status, adminNote, reviewerId, id]
    );

    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM himti_applications WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new ApplicationRepository();
