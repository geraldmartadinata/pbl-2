# HIMTI Registration App Backend

This is the backend MVP for the HIMTI Registration App.
It provides a RESTful API built with Express, Node.js, and PostgreSQL to handle user authentication, applicant profile management, HIMTI application submission, and administrator review features.

## Architecture & Technology Stack

- **Node.js + Express.js**: Core framework.
- **PostgreSQL**: Relational database for robust data integrity and transactions.
- **pg**: Raw database driver (no ORM used, to keep queries explicit).
- **Zod**: Request validation schema.
- **jsonwebtoken + bcrypt**: Authentication and security.
- **Jest + Supertest**: Unit and integration testing.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) running locally or accessible via network.

## Installation

1. Clone the repository and navigate to the backend directory:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file by copying the example:

   ```bash
   cp .env.example .env
   ```

   Update the `DATABASE_URL` in `.env` with your actual PostgreSQL credentials. The default assumes a local postgres instance with a database named `himti_registration`.

3. Ensure the database exists in PostgreSQL:

   ```sql
   CREATE DATABASE himti_registration;
   ```

## Database Migration and Seeding

Run the raw SQL migrations to build the schema:

```bash
npm run migrate
```

Seed initial divisions and administrator account:

```bash
npm run seed
```

If you need to drop all tables, you can run:

```bash
npm run migrate:down
```

## Running the Application

For development (auto-restart with nodemon):

```bash
npm run dev
```

For production:

```bash
npm start
```

## Testing

Ensure your `DATABASE_URL` in `.env` is set correctly. Note that the integration tests currently wipe out test data on start and completion, so using a separate test database is strongly recommended.

```bash
npm test
```

## Available Scripts

- `npm run dev`: Start dev server.
- `npm start`: Start production server.
- `npm test`: Run integration tests.
- `npm run lint`: Run ESLint.
- `npm run format`: Format code with Prettier.
- `npm run migrate`: Run database migrations.
- `npm run migrate:down`: Drop all database tables.
- `npm run seed`: Seed divisions and default admin account.

## Known MVP Limitations

- Event registration (HISHOT, TechFest, TECHNO) is out of scope for MVP.
- Email verification and file uploads (e.g. CVs) are not implemented.
- Notifications are disabled in this MVP release.

## Security Notes

- Helmet is used for security headers.
- express-rate-limit is implemented for login and registration endpoints to prevent brute force attacks.
- JWT tokens handle stateless authentication.
- Passwords are encrypted using bcrypt.

## Directory and File Structure

Below is a detailed explanation of the `backend/` directory structure and the purpose of each file and folder within this modular monolith architecture.

### Root Level Files

- **`package.json`**: Contains the project metadata, dependencies (like express, pg, bcrypt), and scripts (e.g., `start`, `dev`, `test`, `migrate`).
- **`.env`** & **`.env.example`**: Environment variable configurations. `.env` is used locally (git-ignored) for secrets and database credentials, while `.env.example` provides a template.
- **`.gitignore`**: Specifies which files and directories Git should ignore (e.g., `node_modules/`, `.env`).
- **`postman_collection.json`**: A ready-to-import Postman collection containing all the API endpoints for testing.
- **`jest.config.js`**: Configuration file for the Jest testing framework.
- **`README.md`**: Project documentation (this file).

### `src/` (Source Code)

The `src/` folder contains the core application logic, following a strict layered architecture to separate concerns.

- **`server.js`**: The entry point of the application. It connects to the PostgreSQL database and starts the Express server.
- **`app.js`**: Initializes the Express application, sets up global middleware (CORS, Helmet, Body Parser), mounts the API routes, and applies global error handling.

#### `src/config/` (Configuration)

- **`env.js`**: Validates and parses environment variables using Zod to ensure the application fails fast if required configurations are missing.
- **`database.js`**: Configures and exports the PostgreSQL connection pool (`pg.Pool`).

#### `src/routes/` (Routing Layer)

Maps HTTP endpoints to controller methods. No business logic lives here.

- **`index.js`**: The main router that aggregates all other route files and prefixes them with `/api/v1`.
- **`auth.routes.js`**: Endpoints for registration, login, and fetching the current user.
- **`application.routes.js`**: Endpoints for applicants to submit, view, and update their HIMTI applications.
- **`profile.routes.js`**: Endpoints for updating user profiles.
- **`admin.routes.js`**: Endpoints for administrators to view statistics and manage applications.
- **`division.routes.js`**: Endpoints to list active divisions.

#### `src/controllers/` (Presentation Layer)

Extracts data from incoming HTTP requests (`req.body`, `req.params`) and passes it to the Service layer. Sends the HTTP response (`res.status().json()`).

- **`auth.controller.js`**, **`application.controller.js`**, **`profile.controller.js`**, **`admin.controller.js`**, **`division.controller.js`**: Each corresponds to their respective routes.

#### `src/services/` (Business Logic Layer)

Contains the core business rules of the application. Services receive data from controllers, enforce logic (e.g., checking if an email is already used), and call repositories to interact with the database.

- **`auth.service.js`**: Handles registration validation, password hashing, login verification, and token generation.
- **`application.service.js`**: Logic for submitting and updating applications, ensuring users only have one pending application.
- **`profile.service.js`**: Logic for profile updates.
- **`admin.service.js`**: Logic for generating dashboard statistics and updating application statuses.
- **`division.service.js`**: Logic for fetching active divisions.

#### `src/repositories/` (Data Access Layer)

Executes raw SQL queries using `pg`. This is the _only_ layer that interacts directly with the database.

- **`user.repository.js`**: Queries for finding, creating, and updating users/admins.
- **`application.repository.js`**: Queries for creating applications, fetching lists with joins, updating status, and aggregating statistics.
- **`division.repository.js`**: Queries for retrieving active divisions.

#### `src/validators/` (Validation Layer)

Defines Zod schemas to validate incoming request bodies, query parameters, and URL parameters before they reach the controllers.

- **`auth.validator.js`**, **`application.validator.js`**, **`profile.validator.js`**, **`admin.validator.js`**.

#### `src/middleware/` (Express Middleware)

Reusable functions that intercept requests to perform checks or formatting.

- **`authenticate.js`**: Verifies JWT tokens and attaches the user object to the request.
- **`authorize.js`**: Role-based access control (e.g., ensuring only `ADMIN` can access admin routes).
- **`validate.js`**: Higher-order function that takes a Zod schema and validates the request.
- **`errorHandler.js`**: Centralized global error handler that formats errors (e.g., `ApiError`, Postgres constraints) into standard JSON responses.
- **`notFound.js`**: Catches requests to undefined routes and returns a 404 error.
- **`rateLimiter.js`**: Prevents brute-force attacks on auth routes using `express-rate-limit`.

#### `src/utils/` (Utilities)

Shared helper functions and classes.

- **`ApiError.js`**: Custom error class to standardize HTTP status codes and error messages.
- **`asyncHandler.js`**: Wraps async controller functions to pass errors automatically to the global error handler, eliminating `try/catch` boilerplate.
- **`jwt.js`**: Helper functions for signing and verifying JSON Web Tokens.
- **`password.js`**: Helper functions for hashing and comparing passwords with bcrypt.

### `migrations/` & `scripts/` (Database Management)

- **`migrations/001_initial_schema.sql`**: The raw SQL file that defines the tables (users, divisions, applications), indexes, and constraints.
- **`scripts/migrate.js`**: Node.js script that connects to the database and executes the SQL migrations.
- **`scripts/migrate-down.js`**: Node.js script that drops all tables (useful for resetting the database).
- **`scripts/seed.js`**: Node.js script that executes seed files.

### `seeds/` (Initial Data)

- **`seeds/001_initial_data.js`**: Seed script that populates the database with initial divisions (e.g., Technology, Education) and creates the default administrator account.

### `tests/` (Automated Testing)

- **`tests/integration/api.test.js`**: Contains integration tests using Supertest and Jest. It tests full API flows (registration, login, application submission, admin review) against a real database.
- **`tests/integration/setup.js`**: Jest setup file that runs before all tests to manage the database connection and handle warnings.
