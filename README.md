# SafaiSetu

SafaiSetu is a full-stack civic complaint management platform for urban cleanliness workflows. It enables residents to raise waste-related issues, municipal admins to triage and assign work, and field workers to update on-ground progress.

## Overview

- Role-based web app for Citizens, Workers, and Admins
- Complaint lifecycle: create, assign, track, resolve
- JWT-authenticated API with protected routes
- SQLite-backed persistence with zero external DB setup
- Optional AI-powered complaint categorization via Gemini API
- PWA-ready frontend with manifest and service worker

## Tech Stack

- Frontend: React 19, TypeScript, React Router, Tailwind CSS, Recharts, Motion
- Backend: Express, TypeScript (tsx runtime), JWT auth, bcrypt
- Database: better-sqlite3 (local file database)
- Build/Tooling: Vite, TypeScript

## Architecture

SafaiSetu runs as a single Node process:

- Express serves API routes from `backend/`
- In development, Vite runs in middleware mode and serves the React app from `frontend/`
- In production mode, Express serves static assets from `frontend/dist`

## Repository Structure

```text
.
|- backend/
|  |- db/database.ts            # SQLite schema and DB initialization
|  |- middleware/               # Auth and role guards
|  |- routes/                   # auth, complaints, admin endpoints
|  `- server.ts                 # API + frontend hosting entrypoint
|- frontend/
|  |- src/
|  |  |- pages/                 # Landing, auth, and role dashboards
|  |  |- context/AuthContext.tsx
|  |  `- components/
|  |- manifest.webmanifest
|  `- sw.js
|- package.json
`- tsconfig.json
```

## User Roles

- Citizen
	- Registers/logs in
	- Creates complaints
	- Tracks own complaint status
- Worker
	- Views assigned complaints
	- Updates status and uploads proof image URL
- Admin
	- Views all complaints
	- Assigns complaints to workers
	- Monitors analytics and category trends

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Optional environment variables

Create `.env` in project root:

```bash
JWT_SECRET=replace_with_a_strong_secret
GEMINI_API_KEY=optional_for_ai_categorization
```

Notes:
- If `JWT_SECRET` is not set, backend uses its internal default.
- If `GEMINI_API_KEY` is not set, complaint category defaults to `General`.

### 3. Run in development

```bash
npm run dev
```

App URL: http://localhost:3000

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts Express with Vite middleware (full-stack dev) |
| `npm run build` | Builds frontend assets into `frontend/dist` |
| `npm run preview` | Previews frontend build using Vite preview |
| `npm run lint` | Runs TypeScript type-check (`tsc --noEmit`) |
| `npm run clean` | Removes `frontend/dist` |

## API Summary

Base URL: `/api`

### Auth Routes

- `POST /api/auth/register`
	- Body: `email`, `password`, `name`, optional `role`
- `POST /api/auth/login`
	- Body: `email`, `password`
	- Returns: JWT token + user payload

### Complaint Routes (Authenticated)

- `GET /api/complaints`
	- Admin: all complaints
	- Worker: assigned complaints
	- Citizen: own complaints
- `POST /api/complaints`
	- Create new complaint with `title`, `description`, `location`, optional `image_url`
- `PUT /api/complaints/:id`
	- Admin: assign/update status
	- Worker: update status + `proof_image_url` on assigned tasks

### Admin Routes (Admin only)

- `GET /api/workers` - list workers
- `GET /api/analytics` - totals, resolved/pending, category distribution

## Database

SQLite database file: `waste_management.db` (auto-created at runtime).

Core tables:
- `users` (email, hashed password, role, name)
- `complaints` (details, category, status, citizen/worker mapping, media URLs, timestamps)

## Production Notes

1. Build frontend assets:

```bash
npm run build
```

2. Start server with production mode so static build is served:

```bash
NODE_ENV=production npx tsx backend/server.ts
```

## Security and Access Control

- JWT-based authentication for protected routes
- Role authorization via middleware
- Password hashing with bcrypt
- Worker updates constrained to assigned complaints

## Roadmap Ideas

- Add file upload support for complaint/proof images
- Add automated tests (API + UI)
- Add audit logs for assignment and status transitions
- Add Dockerfile and CI pipeline
