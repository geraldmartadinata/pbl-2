const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');
const bcrypt = require('bcrypt');
const env = require('../../src/config/env');

describe('API Integration Tests', () => {
  let applicantToken;
  let adminToken;
  let adminId;
  let testDivisionId;
  let createdApplicationId;

  const testApplicant = {
    fullName: 'Test Applicant',
    nim: `TEST-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    phone: '081234567890',
    studyProgram: 'Computer Science',
    intakeYear: 2026,
    campus: 'Kemanggisan',
    password: 'Password123',
    confirmPassword: 'Password123'
  };

  const testAdmin = {
    email: `admin-${Date.now()}@himti.or.id`,
    password: 'AdminPassword123'
  };

  beforeAll(async () => {
    // clean test data
    await pool.query("DELETE FROM himti_applications");
    await pool.query("DELETE FROM divisions WHERE name = 'Test Division'");
    await pool.query("DELETE FROM users");

    // create test division
    const divisionResult = await pool.query(
      "INSERT INTO divisions (name, description) VALUES ('Test Division', 'For testing') RETURNING id"
    );
    testDivisionId = divisionResult.rows[0].id;

    // create test admin
    const passwordHash = await bcrypt.hash(testAdmin.password, 10);
    const adminResult = await pool.query(
      `INSERT INTO users (
        full_name, nim, email, phone, study_program, intake_year, campus, password_hash, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 'ADMIN'
      ) RETURNING id`,
      [
        'Test Admin',
        `ADMIN-${Date.now()}`,
        testAdmin.email,
        '080000000000',
        'Computer Science',
        2026,
        'Kemanggisan',
        passwordHash
      ]
    );
    adminId = adminResult.rows[0].id;

    // get admin token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });
    adminToken = res.body.data.token;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM himti_applications");
    await pool.query("DELETE FROM divisions WHERE name = 'Test Division'");
    await pool.query("DELETE FROM users");
  });

  describe('1. Health Check', () => {
    it('should return health check success', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('2. Authentication Flows', () => {
    it('should successfully register an account', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testApplicant);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('APPLICANT');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testApplicant, nim: `TEST-${Date.now()}-2` }); // different nim, same email
      
      expect(res.statusCode).toEqual(409);
      expect(res.body.code).toBe('EMAIL_ALREADY_REGISTERED');
    });

    it('should reject duplicate NIM', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...testApplicant, email: `test2-${Date.now()}@example.com` }); // different email, same nim
      
      expect(res.statusCode).toEqual(409);
      expect(res.body.code).toBe('NIM_ALREADY_REGISTERED');
    });

    it('should successfully login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testApplicant.email, password: testApplicant.password });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      applicantToken = res.body.data.token;
    });

    it('should return invalid login for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testApplicant.email, password: 'WrongPassword123' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 for protected route without token', async () => {
      const res = await request(app).get('/api/v1/users/me');
      expect(res.statusCode).toEqual(401);
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.email).toBe(testApplicant.email);
      expect(res.body.data.password_hash).toBeUndefined(); // ensure hash not returned
    });
  });

  describe('3. Divisions', () => {
    it('should return active divisions', async () => {
      const res = await request(app).get('/api/v1/divisions');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.some(d => d.name === 'Test Division')).toBe(true);
    });
  });

  describe('4. Applicant Application Flows', () => {
    const appData = {
      motivation: "Test motivation string must be at least 20 chars.",
      reasonForJoining: "Test reason string must be at least 20 chars.",
      relevantSkills: "JavaScript, React",
      timeCommitmentAgreed: true
    };

    it('should successfully submit HIMTI application', async () => {
      const res = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ ...appData, divisionId: testDivisionId });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      createdApplicationId = res.body.data.applicationId;
    });

    it('should reject duplicate application', async () => {
      const res = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ ...appData, divisionId: testDivisionId });
      
      expect(res.statusCode).toEqual(409);
      expect(res.body.code).toBe('APPLICATION_ALREADY_EXISTS');
    });

    it('should allow viewing own application', async () => {
      const res = await request(app)
        .get('/api/v1/applications/me')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('PENDING');
    });

    it('should allow editing pending application', async () => {
      const res = await request(app)
        .patch('/api/v1/applications/me')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ relevantSkills: "Updated Skills" });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Admin Application Flows', () => {
    it('should block normal applicant from admin endpoint', async () => {
      const res = await request(app)
        .get('/api/v1/admin/statistics')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('should allow admin to view statistics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/statistics')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.totalApplications).toBeGreaterThanOrEqual(1);
    });

    it('should allow admin to view application list', async () => {
      const res = await request(app)
        .get('/api/v1/admin/applications')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    });

    it('should allow admin to update status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/applications/${createdApplicationId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ACCEPTED', adminNote: 'Looks good' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('ACCEPTED');
    });

    it('should reject editing accepted application for applicant', async () => {
      const res = await request(app)
        .patch('/api/v1/applications/me')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({ relevantSkills: "Try to update again" });
      
      expect(res.statusCode).toEqual(422);
      expect(res.body.code).toBe('APPLICATION_NOT_EDITABLE');
    });

    it('applicant should see updated status', async () => {
      const res = await request(app)
        .get('/api/v1/applications/me')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('ACCEPTED');
      expect(res.body.data.admin_note).toBe('Looks good');
    });
  });
});
