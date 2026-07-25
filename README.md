# HIMTI Event Portal

Digital event registration portal for HIMTI BINUS University. Premium dark mode UI built with React 19, Vite 8, and Tailwind CSS 4.

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | React 19, Vite 8, Tailwind CSS 4 |
| Routing     | React Router DOM v7              |
| Icons       | lucide-react                     |
| Backend     | Express.js, JWT (TBD)            |
| Database    | PostgreSQL (TBD)                 |

## Project Structure

```
pbl-2/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Button, Input, Card, Badge, Navbar, Sidebar, Spinner
│   │   ├── contexts/       # AuthContext (dummy auth with localStorage)
│   │   ├── mocks/          # events.json, participants.json
│   │   ├── pages/          # Landing, Login, Registration, AdminDashboard
│   │   ├── services/       # api.js (mock-backed, swap to real API later)
│   │   └── utils/          # cn.js (clsx+twMerge), format.js
│   └── ...
├── backend/                # Express.js server (TBD)
├── database/               # PostgreSQL schema (TBD)
└── README.md
```

## Routes

| Route             | Page               | Access         |
|-------------------|--------------------|----------------|
| `/`               | Landing            | Public         |
| `/login`          | Login              | Public         |
| `/register/:id`   | Registration Form  | Public         |
| `/admin`          | Admin Dashboard    | Admin only     |

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Proxies `/api` to `http://localhost:5000`.

### Demo Accounts

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@himti.id       | admin123  |
| User  | user@binus.ac.id     | user123   |

### Mock to Live API

Edit `src/services/api.js` — replace function bodies with Axios/fetch. No component changes needed.

## Theme

- `zinc-950` dark background, glassmorphism cards (`backdrop-blur-xl`)
- White accent buttons, subtle `border-white/[7%]`
- Animations: slide-in, fade-in, fade-in-up
- Custom scrollbar for dark mode

## Auth

Dummy auth via `AuthContext` — detects role by email (`admin@himti.id` → admin, anything else → user). Navbar shows login button when guest, user dropdown when authenticated.

## Team

- **Person 1 – Frontend** — React, UI/UX, components, form validation
- **Person 2 – Backend** — REST API, JWT, business logic (TBD)
- **Person 3 – Database & DevOps** — PostgreSQL, schema, deployment (TBD)

## License

Internal — HIMTI BINUS University.