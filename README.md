# SafaiSetu

SafaiSetu is a smart waste management platform built for citizens, municipal administrators, and field workers. It helps users report waste-related issues, route complaints to the right team, and track resolution status from a single dashboard.

## SafaiSetu

- Citizen complaint reporting with title, description, location, and optional image URL
- Role-based access for citizens, workers, and administrators
- Admin dashboard with complaint overview, worker assignment, and analytics
- Worker dashboard for assigned tasks and status updates
- JWT-based authentication with protected routes
- SQLite storage for users and complaints
- Optional Gemini-powered complaint categorization when `GEMINI_API_KEY` is available

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- SQLite with better-sqlite3
- Tailwind CSS
- React Router
- Recharts
- Motion

## Project Structure

- `frontend/` - Vite app, HTML entry, and React source code
- `backend/` - Express server entry, routes, middleware, and database setup
- `backend/server.ts` - Main server entry that serves the API and Vite app in development

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root if you want to use AI-based complaint categorization or a custom JWT secret:

```bash
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

If `GEMINI_API_KEY` is not set, complaint categorization falls back to a default category.

### Run the App

```bash
npm run dev
```

The application runs on `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

The production frontend build is output to `frontend/dist`.

### Preview the Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the Express server with Vite middleware
- `npm run build` - Build the frontend for production from `frontend/`
- `npm run preview` - Preview the production build locally from `frontend/dist`
- `npm run lint` - Type-check the project
- `npm run clean` - Remove the `frontend/dist/` folder

## Roles

- Citizen: Report issues and view personal complaints
- Worker: View assigned complaints and update progress
- Admin: Review all complaints, assign workers, and view analytics

## Data Storage

The app stores data in a local SQLite database file named `waste_management.db`. The database is created automatically on first run.

## Notes

- Complaint requests are protected with JWT authentication.
- Admin endpoints are restricted to admin users.
- Worker updates are limited to tasks assigned to that worker.
