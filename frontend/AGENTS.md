# HIMTI Event Portal — OpenCode Context Handoff

## Project Overview

Event registration portal for HIMTI BINUS University. Dark mode, glassmorphism UI built with React 19 + Vite 8 + Tailwind CSS 4.

**Repo:** `github.com/geraldmartadinata/pbl-2`  
**Frontend dir:** `/frontend`  
**Backend dir:** `/backend` (TBD — Person 2)  
**DB dir:** `/database` (TBD — Person 3)

## Team Structure

| Person | Role | Scope |
|--------|------|-------|
| **You** | Frontend Dev | `/frontend` ONLY — React, Tailwind, UI |
| Person 2 | Backend Dev | `/backend` — Express.js, JWT, REST API |
| Person 3 | DB & DevOps | `/database` — PostgreSQL, ERD, deployment |

**Rules:**
- Never create/modify backend or database files
- Use mock data (`/frontend/src/mocks/`) until Person 2's API is ready
- API service layer (`/frontend/src/services/api.js`) designed for 5-min swap to real API

## Tech Stack

| Layer | Tech | Version |
|---|---|---|
| Framework | React | 19.2.x |
| Bundler | Vite | 8.1.x |
| Styling | Tailwind CSS | 4.3.x |
| Routing | React Router DOM | 7.18.x |
| Icons | lucide-react | ^1.25.0 |
| Utils | clsx + tailwind-merge | latest |
| HTTP | Axios (installed, not yet used) | ^1.18.x |

## Theme System

- **Background:** `zinc-950` (#09090b)
- **Cards:** `bg-zinc-900/60 backdrop-blur-xl border border-white/[7%]`
- **Text:** `text-white` (headings), `text-zinc-300` (body), `text-zinc-500` (muted)
- **Accent:** White buttons (`bg-white text-zinc-900`), subtle borders
- **Animations:** `animate-slide-in`, `animate-fade-in`, `animate-fade-in-up`, `stagger-1/2/3/4`

**Key CSS** in `/frontend/src/index.css`:
- Custom keyframes for slide, fade, fade-in-up, pulse-glow
- `scrollbar-width: thin` styled for dark theme

## Routes

| Route | Component | Layout | Auth |
|---|---|---|---|
| `/` | `Landing` | Navbar | Public |
| `/register/:id` | `Registration` | Navbar | Public |
| `/login` | `Login` | Standalone (no Navbar) | Public |
| `/admin` | `AdminDashboard` | Sidebar (no Navbar) | Dummy auth check |
| `/admin/*` | `AdminDashboard` | Sidebar | Dummy auth check |
| `*` | → redirect `/` | — | — |

## Auth System

**File:** `/frontend/src/contexts/AuthContext.jsx`

- Dummy auth: `login(email, password)` detects role by email
  - `admin@himti.id` or `admin` → `role: 'admin'`
  - anything else → `role: 'user'`
- Persists to `localStorage('user')`
- `useAuth()` hook exposes: `{ user, login, logout, isAuth }`

**Smart Navbar** (`/frontend/src/components/Navbar.jsx`):
- Guest: shows "Login" button
- Authenticated: shows user name with dropdown
  - Admin sees: "Admin Panel" + "Profile" + "Logout"
  - User sees: "Profile" + "Logout"

## Component Tree

```
App (BrowserRouter > AuthProvider > Routes)
├── / → <>
│   ├── Navbar (auth-aware)
│   └── Landing
│       ├── Hero section
│       ├── Bento Grid (What is HIMTI / Quote / Stats / Vision)
│       ├── Closing Soon (urgent event cards)
│       └── Footer
├── /register/:id → <>
│   ├── Navbar
│   └── Registration
│       ├── Event summary card
│       └── Form (full_name, nim, email, line_id) → loading → success
├── /login → Login (standalone)
│   └── Frosted glass card + demo account buttons
├── /admin → AdminDashboard (full page)
│   └── Sidebar + Stats + Searchable participants table + check-in
└── /admin/* → AdminDashboard (same)
```

## Current Pages (3)

### Landing (`/frontend/src/pages/Landing.jsx`)
- **Hero:** Typography-driven headline "Where Technology Meets Opportunity" with gradient
- **Bento Grid:** 4-box layout showing What is HIMTI, Quote, Stats (10+ events, 5K+ members, 15+ years), Vision
- **Closing Soon:** Top 3 urgent events sorted by `closing_date`, shows days-left badge (red for ≤3 days), capacity bar, category tags
- **Footer:** Contact info, quick links, social icons
- **States:** loading (spinner), loaded (grid), empty (fallback text)

### Registration (`/frontend/src/pages/Registration.jsx`)
- Event summary card at top
- Form fields: Full Name, NIM (10 digits), Email, Line ID
- Validation: required fields, NIM pattern `^\d{10}$`, email regex
- States: **idle** (form), **loading** (spinner on button + disabled), **success** (green checkmark card with redirect buttons), **full** event (blocked message)
- On success: shows "Registration Successful!" message

### Login (`/frontend/src/pages/Login.jsx`)
- Centered frosted glass card over abstract dark background
- Email + Password fields
- Demo account quick-fill buttons (Admin / User)
- Simulated 600ms delay on submit
- On success: redirects admin → `/admin`, user → `/`

### Admin Dashboard (`/frontend/src/pages/AdminDashboard.jsx`)
- Sidebar nav (Dashboard / Participants / Events) + Logout
- 4 stat cards: Total, Confirmed, Attended, Pending
- Searchable table with columns: Name, NIM, Event, Status, Check-in
- Check-in button toggles status between confirmed ↔ attended
- States: loading (full-page spinner), loaded (table), empty ("No participants found")

## Components (6 reusable atoms)

| Component | File | Props |
|---|---|---|
| `Button` | `components/Button.jsx` | variant, size, loading, disabled, className |
| `Input` | `components/Input.jsx` | label, name, error, className |
| `Card` | `components/Card.jsx` | className (always glass) |
| `Badge` | `components/Badge.jsx` | variant (default/primary/success/warning/danger/info/zinc) |
| `Navbar` | `components/Navbar.jsx` | Uses AuthContext internally |
| `Sidebar` | `components/Sidebar.jsx` | Links + logout via AuthContext |
| `Spinner` | `components/Spinner.jsx` | className; "PageSpinner" named export |

## Mock Data

**`/frontend/src/mocks/events.json`** — 6 events with fields:
- `id, title, description, date, closing_date, location, category, capacity, registered, price`

**`/frontend/src/mocks/participants.json`** — 8 participants with fields:
- `id, full_name, nim, email, line_id, event_id, event_title, registered_at, status`

## Service Layer

**`/frontend/src/services/api.js`** — 5 async functions, all mock-backed with 500ms delay:
- `getEvents()` → returns all events
- `getEventById(id)` → single event
- `registerParticipant(data)` → pushes to in-memory array, returns new entry
- `getAllParticipants()` → returns participants (mutable copy)
- `toggleCheckIn(id)` → toggles status confirmed↔attended

**Swap to real API:** replace each function body with Axios/Fetch call. No component changes needed.

## Key Design Decisions

1. **zinc-950 base** — not slate, not blue. Keeps UI neutral and premium
2. **Glassmorphism** — `backdrop-blur-xl` + `border-white/[7%]` on cards
3. **No hardcoded admin links in public views** — navbar conditionally shows admin link only when logged in as admin
4. **Closing Soon** — data-driven from `closing_date` field; events with closest deadlines float to top
5. **Days-left badge** — red urgency when ≤3 days remaining
6. **Standalone login page** — not a modal; full frosted-glass experience
7. **Portal proxy** — Vite proxies `/api` → `http://localhost:5000` for backend dev

## Build & Run

```bash
cd frontend
npm install    # already done
npm run dev    # → http://localhost:5173
npm run build  # production build (currently 0 errors)
```

## Known lucide-react Constraints

This version (`^1.25.0`) does NOT export brand icons (`Instagram`, `Linkedin`, `Twitter`). Social icons use generic alternatives: `Link` (link icon), `Globe`, `ExternalLink`. Upgrade to `lucide-react@latest` to get brand icons.

## OpenCode-Specific Files

- `./opencode.json` — project config (auto-detected by OpenCode CLI)
- `./AGENTS.md` — this file, serves as system context for AI agent

## Next Features to Build (Roadmap)

1. Protected routes — guard `/admin` and `/register/:id` with AuthContext redirect
2. User Dashboard page — `/dashboard` showing user's registration history with status badges
3. Profile page — read/write user info with edit form
4. Real API integration — replace `USE_MOCK` pattern in `services/api.js`
5. Toast/notification system for success/error feedback
6. Form persistence — save draft registration on input change
7. Event detail page — full event view with poster, description, speaker info
8. Pagination on admin table
9. QR code generation for check-in tickets
10. Responsive sidebar — collapse to top bar on mobile