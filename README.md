# HIMTI Registration App

Portal registrasi acara digital untuk HIMTI BINUS University. Sistem tervalidasi, interaktif, dan modern — menggantikan Google Forms sebagai platform pendaftaran acara resmi himpunan.

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 19, Vite 8, Tailwind CSS 4  |
| Routing     | React Router DOM v7               |
| HTTP        | Axios / Fetch                     |
| Backend     | Express.js, JWT                   |
| Database    | PostgreSQL                        |

## Project Structure

```
pbl-2/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Button, Input, Modal, Card, etc.)
│   │   ├── contexts/       # React context providers (Auth, Toast)
│   │   ├── mocks/          # Mock JSON data for development
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API communication layer
│   │   └── utils/          # Helper functions (formatting, validation)
│   └── ...
├── backend/                # Express.js server (TBD)
├── database/               # PostgreSQL schema & migrations (TBD)
└── README.md
```

## Pages

| Route             | Page               | Access         |
|-------------------|--------------------|----------------|
| `/`               | Landing            | Public         |
| `/login`          | Login              | Public         |
| `/register/:id`   | Registration Form  | Authenticated  |
| `/dashboard`      | User Dashboard     | Authenticated  |
| `/admin`          | Admin Dashboard    | Admin only     |
| `/profile`        | Profile            | Authenticated  |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Development server proxies `/api` requests to `http://localhost:5000`.

### Demo Accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@himti.id       | admin123  |
| User  | mahasiswa@binus.ac.id | user123  |

### Switching from Mock to Live API

Mock data is enabled by default. When the backend API is ready:

1. Open `src/services/authService.js` and `src/services/eventService.js`
2. Change `const USE_MOCK = true` to `false`
3. Restart the dev server

The service layer is designed so no other code changes are required.

## Team

- **Person 1 – Frontend** — UI/UX, React components, form validation, API integration
- **Person 2 – Backend** — REST API, JWT auth, business logic, middleware
- **Person 3 – Database & DevOps** — Schema design, migrations, deployment

## License

Internal project — HIMTI BINUS University.
