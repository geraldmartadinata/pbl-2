# HIMTI Registration App

Portal registrasi acara digital untuk HIMTI BINUS University. Menggantikan Google Forms dengan sistem tervalidasi, interaktif, dan modern.

## Team Structure

```
Person 1 – Frontend Developer   (React.js + Tailwind CSS)  ← You are here
Person 2 – Backend Developer    (Express.js + JWT + REST)
Person 3 – DB & DevOps          (PostgreSQL + ERD + Deployment)
```

### Person 1 — Frontend (React.js + Tailwind CSS)
- UI/UX responsif, mobile-first
- 6 pages: Landing, Registration, Login, User Dashboard, Admin Dashboard, Profile
- Client-side form validation (NIM, email, phone, required fields)
- Reusable atomic components (Button, Input, Modal, Card, Badge, Toast, Spinner)
- API service layer — mock data ready, swap to real API by flipping `USE_MOCK = false`
- Loading states (spinner, skeleton), error handling via Toast container
- Role-based routing (admin vs user)

### Person 2 — Backend (Express.js)
- REST API design (waiting — `/backend` TBD)
- JWT authentication, registration endpoints, admin management
- Input validation, error handling, security (hashing, authorization)
- Optional: email verification, QR code generation

### Person 3 — DB & DevOps (PostgreSQL)
- Database schema & ERD (waiting)
- Migrations, seed data, query optimization
- Deployment & environment config

## Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Frontend      | React 19, Vite 8, Tailwind CSS 4 |
| Routing       | React Router DOM v7         |
| HTTP          | Axios (Fetch fallback)      |
| Backend       | Express.js (TBD)            |
| Database      | PostgreSQL (TBD)            |
| Auth          | JWT (TBD)                   |

## Project Structure

```
pbl-2/
├── frontend/                          # Person 1 — Frontend App
│   ├── public/
│   └── src/
│       ├── components/                # Atomic reusable components
│       │   ├── Badge.jsx              # Status badge
│       │   ├── Button.jsx             # Primary/secondary/danger + loading
│       │   ├── Card.jsx               # White card wrapper
│       │   ├── Input.jsx              # Input + password toggle + error
│       │   ├── Modal.jsx              # Overlay modal with esc close
│       │   ├── Navbar.jsx             # Sticky nav + mobile hamburger
│       │   ├── Spinner.jsx            # Spinner + page spinner + skeleton
│       │   └── ToastContainer.jsx     # Toast notification stack
│       ├── contexts/
│       │   ├── AuthContext.jsx         # Auth state provider
│       │   └── ToastContext.jsx        # Toast state provider
│       ├── mocks/                      # Mock JSON (swap to real API later)
│       │   ├── events.json
│       │   ├── registrations.json
│       │   └── users.json
│       ├── pages/                      # 6 main pages
│       │   ├── Landing.jsx             # Event catalog with filter
│       │   ├── Login.jsx               # Auth with demo accounts
│       │   ├── RegistrationForm.jsx    # Registration + validation
│       │   ├── UserDashboard.jsx       # User history + stats
│       │   ├── AdminDashboard.jsx      # Admin table + search/filter/check-in
│       │   └── Profile.jsx             # User info display
│       ├── services/                   # API communication layer
│       │   ├── authService.js          # Auth + registration APIs
│       │   └── eventService.js         # Event APIs
│       └── utils/
│           ├── format.js               # Date/time formatting, status colors
│           └── validation.js           # NIM, email, phone, required validators
├── backend/                            # Person 2 — Express.js (TBD)
├── database/                           # Person 3 — PostgreSQL (TBD)
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Frontend (Person 1)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` — proxies `/api` to `http://localhost:5000`.

### Demo Accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@himti.id       | admin123  |
| User  | mahasiswa@binus.ac.id | user123  |

### Mock → Real API

Mock is on by default. When Person 2's API is ready:

1. Open `src/services/authService.js` and `src/services/eventService.js`
2. Set `const USE_MOCK = false`
3. Restart dev server

That's it — no other code changes needed.

## Integration Boundaries

- **Person 1** operates ONLY inside `/frontend`
- **Person 2** operates ONLY inside `/backend`
- **Person 3** operates ONLY inside `/database`
- No cross-directory edits
- API contract lives in `/frontend/src/services/` — mock data matches expected real API shape

## Pages

| Route             | Page               | Access         |
|-------------------|--------------------|----------------|
| `/`               | Landing            | Public         |
| `/login`          | Login              | Public         |
| `/register/:id`   | Registration Form  | Authenticated  |
| `/dashboard`      | User Dashboard     | Authenticated  |
| `/admin`          | Admin Dashboard    | Admin only     |
| `/profile`        | Profile            | Authenticated  |
