CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('APPLICANT', 'ADMIN');

CREATE TYPE application_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    nim VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    study_program VARCHAR(100) NOT NULL,
    intake_year INTEGER NOT NULL,
    campus VARCHAR(100) NOT NULL,
    instagram_username VARCHAR(100),
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'APPLICANT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE himti_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    division_id UUID NOT NULL REFERENCES divisions(id),
    motivation TEXT NOT NULL,
    reason_for_joining TEXT NOT NULL,
    relevant_skills TEXT NOT NULL,
    organizational_experience TEXT,
    time_commitment_agreed BOOLEAN NOT NULL,
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    additional_notes TEXT,
    status application_status NOT NULL DEFAULT 'PENDING',
    admin_note TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nim ON users(nim);
CREATE INDEX idx_applications_status ON himti_applications(status);
CREATE INDEX idx_applications_division ON himti_applications(division_id);
CREATE INDEX idx_applications_submitted ON himti_applications(submitted_at);
