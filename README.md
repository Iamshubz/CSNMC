# CSNMC

This project has two runnable parts:

- `backend/` - Express + SQLite API
- `frontend/` - Vite + React UI

## Prerequisites

- Node.js 18 or newer
- npm

## Run Locally

Start the backend first:

```bash
npm --prefix backend run dev
```

Then start the frontend in a second terminal:

```bash
npm --prefix frontend run dev
```

Open the app in your browser at:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:3001/api/health`

## Notes

- The frontend proxies `/api` requests to the backend on port `3001`.
- If you want to reset local data, delete `waste_management.db` in the repo root and restart the backend.
- If you set `GEMINI_API_KEY`, the complaint categorization endpoint will use it. Otherwise it falls back to a default category.

## Suggested Branch Name

`docs/local-run-instructions`