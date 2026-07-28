# Database Schema Documentation

This document provides a detailed overview of the PostgreSQL database schema for the **HIMTI Registration App Backend**.

## Entity Relationship Diagram (ERD) Overview

The database consists of three primary tables:
- **`users`**: Stores applicant and administrator accounts.
- **`divisions`**: Stores configurable HIMTI divisions (e.g., Technology, Education).
- **`himti_applications`**: Links users to a specific division when applying to join HIMTI. Contains review workflow details.

---

## Enumerated Types (Enums)

### `user_role`
Defines the access level of a user.
- `'APPLICANT'`: Standard user applying for membership.
- `'ADMIN'`: System administrator with dashboard access.

### `application_status`
Defines the state of a HIMTI membership application.
- `'PENDING'`: Default state when submitted. Can be edited by the applicant.
- `'ACCEPTED'`: Reviewed and approved by an administrator.
- `'REJECTED'`: Reviewed and denied by an administrator.

---

## Tables

### 1. `users`
Stores all registered accounts. Supports both applicants and admins based on the `role` column.

| Column Name          | Data Type     | Constraints                              | Default                | Description                                       |
| -------------------- | ------------- | ---------------------------------------- | ---------------------- | ------------------------------------------------- |
| `id`                 | UUID          | PRIMARY KEY                              | `gen_random_uuid()`    | Unique identifier.                                |
| `full_name`          | VARCHAR(100)  | NOT NULL                                 |                        | Full name of the user.                            |
| `nim`                | VARCHAR(30)   | UNIQUE, NOT NULL                         |                        | Student ID number (NIM).                          |
| `email`              | VARCHAR(255)  | UNIQUE, NOT NULL                         |                        | Email address used for login.                     |
| `phone`              | VARCHAR(20)   | NOT NULL                                 |                        | Contact phone number.                             |
| `study_program`      | VARCHAR(100)  | NOT NULL                                 |                        | University major/program.                         |
| `intake_year`        | INTEGER       | NOT NULL                                 |                        | Year of university intake (e.g., 2026).           |
| `campus`             | VARCHAR(100)  | NOT NULL                                 |                        | University campus (e.g., Kemanggisan).            |
| `instagram_username` | VARCHAR(100)  | NULL                                     |                        | Optional Instagram handle.                        |
| `password_hash`      | TEXT          | NOT NULL                                 |                        | bcrypt hashed password.                           |
| `role`               | user_role     | NOT NULL                                 | `'APPLICANT'`          | Access level (`APPLICANT` or `ADMIN`).            |
| `is_active`          | BOOLEAN       | NOT NULL                                 | `TRUE`                 | Soft disable toggle for accounts.                 |
| `created_at`         | TIMESTAMPTZ   | NOT NULL                                 | `CURRENT_TIMESTAMP`    | Timestamp of account creation.                    |
| `updated_at`         | TIMESTAMPTZ   | NOT NULL                                 | `CURRENT_TIMESTAMP`    | Timestamp of last account update.                 |

**Indexes:**
- `idx_users_email` ON `users(email)`
- `idx_users_nim` ON `users(nim)`

---

### 2. `divisions`
Stores available HIMTI divisions that applicants can apply to.

| Column Name   | Data Type    | Constraints                              | Default                | Description                                      |
| ------------- | ------------ | ---------------------------------------- | ---------------------- | ------------------------------------------------ |
| `id`          | UUID         | PRIMARY KEY                              | `gen_random_uuid()`    | Unique identifier.                               |
| `name`        | VARCHAR(100) | UNIQUE, NOT NULL                         |                        | Division name (e.g., Technology).                |
| `description` | TEXT         | NULL                                     |                        | Details about what the division does.            |
| `is_active`   | BOOLEAN      | NOT NULL                                 | `TRUE`                 | Indicates if division is accepting applications. |
| `created_at`  | TIMESTAMPTZ  | NOT NULL                                 | `CURRENT_TIMESTAMP`    | Timestamp of creation.                           |

---

### 3. `himti_applications`
Stores membership applications submitted by users. Links a user to a specific division.

| Column Name                 | Data Type          | Constraints                                          | Default             | Description                                          |
| --------------------------- | ------------------ | ---------------------------------------------------- | ------------------- | ---------------------------------------------------- |
| `id`                        | UUID               | PRIMARY KEY                                          | `gen_random_uuid()` | Unique identifier.                                   |
| `user_id`                   | UUID               | UNIQUE, NOT NULL, FK(`users.id`) ON DELETE CASCADE   |                     | The applicant. UNIQUE ensures 1 application per user.|
| `division_id`               | UUID               | NOT NULL, FK(`divisions.id`)                         |                     | The division applied for.                            |
| `motivation`                | TEXT               | NOT NULL                                             |                     | Applicant's motivation.                              |
| `reason_for_joining`        | TEXT               | NOT NULL                                             |                     | Reason for joining.                                  |
| `relevant_skills`           | TEXT               | NOT NULL                                             |                     | Skills relevant to the division.                     |
| `organizational_experience` | TEXT               | NULL                                                 |                     | Past organizational experience.                      |
| `time_commitment_agreed`    | BOOLEAN            | NOT NULL                                             |                     | Checkbox confirming time commitment.                 |
| `portfolio_url`             | TEXT               | NULL                                                 |                     | Link to portfolio.                                   |
| `linkedin_url`              | TEXT               | NULL                                                 |                     | Link to LinkedIn profile.                            |
| `github_url`                | TEXT               | NULL                                                 |                     | Link to GitHub profile.                              |
| `additional_notes`          | TEXT               | NULL                                                 |                     | Any other notes from the applicant.                  |
| `status`                    | application_status | NOT NULL                                             | `'PENDING'`         | Current review status.                               |
| `admin_note`                | TEXT               | NULL                                                 |                     | Internal notes left by reviewing admin.              |
| `reviewed_by`               | UUID               | FK(`users.id`) ON DELETE SET NULL                    |                     | ID of the admin who reviewed it.                     |
| `reviewed_at`               | TIMESTAMPTZ        | NULL                                                 |                     | Timestamp of the review.                             |
| `submitted_at`              | TIMESTAMPTZ        | NOT NULL                                             | `CURRENT_TIMESTAMP` | Timestamp of submission.                             |
| `updated_at`                | TIMESTAMPTZ        | NOT NULL                                             | `CURRENT_TIMESTAMP` | Timestamp of last edit by applicant.                 |

**Indexes:**
- `idx_applications_status` ON `himti_applications(status)`
- `idx_applications_division` ON `himti_applications(division_id)`
- `idx_applications_submitted` ON `himti_applications(submitted_at)`

---

## Data Integrity Rules
- **One Application Per User:** The `himti_applications.user_id` column is strictly marked as `UNIQUE`, enforcing that a single applicant can only ever submit one active application.
- **Cascading Deletes:** Deleting a user (`ON DELETE CASCADE`) will automatically remove their pending application.
- **Nullified Reviews:** If an administrator account is deleted, applications they reviewed won't be deleted, but `reviewed_by` will be set to `NULL` (`ON DELETE SET NULL`).
