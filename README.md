# 🚮 Smart Waste Management & Complaint Tracking System (SafaiSetu)

> An AI-powered Smart City web application that enables citizens to report waste-related issues, helps municipal authorities manage complaints efficiently, and ensures transparency through real-time tracking, live camera verification, GPS validation, and AI-assisted categorization.

![React](https://img.shields.io/badge/Frontend-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Groq](https://img.shields.io/badge/AI-Groq-purple)

---

# 📖 Project Overview

Rapid urbanization has increased waste generation, making traditional complaint management inefficient and time-consuming.

This project provides a **web-based complaint management platform** where citizens can report waste-related issues using **live camera capture**, while municipal authorities can assign workers, monitor complaint status, and analyze city-wide complaint data.

The latest version integrates **AI-powered complaint categorization**, **risk scoring**, and **fraud prevention mechanisms** to improve complaint authenticity.

---

# ✨ Features

## 👤 Citizen Portal

- User Registration & Login
- Secure JWT Authentication
- Camera-only Complaint Submission
- Live GPS Location Capture
- Complaint Description
- Complaint Status Tracking
- Complaint History
- Real-time Updates

---

## 👨‍💼 Admin Portal

- Dashboard Overview
- View All Complaints
- Assign Complaints to Workers
- Complaint Analytics
- Monitor Workers
- Review Suspicious Complaints
- Track Resolution Time

---

## 👷 Worker Portal

- View Assigned Complaints
- Update Complaint Status
- Upload Work Completion Proof
- Mark Complaint as Resolved

---

# 🤖 AI Features

The application uses **Groq API** to automatically classify complaints into predefined categories.

### Supported Categories

- Garbage Overflow
- Illegal Dumping
- Missed Pickup
- Hazardous Waste
- Other

Instead of asking the citizen to select a category, the AI predicts it automatically based on the complaint title and description.

---

# 🛡 Fraud Prevention

Unlike traditional complaint portals, SafaiSetu includes multiple validation layers.

### 📷 Live Camera Capture

- Gallery uploads are disabled.
- Citizens must capture a live image before submitting a complaint.

---

### 📍 GPS Verification

Each complaint stores

- Latitude
- Longitude

to verify the reported location.

---

### ⏰ Timestamp Verification

The system stores

- Capture Time
- Submission Time

to detect outdated images.

---

### ⚠ Risk Scoring

The backend automatically evaluates each complaint using heuristic checks.

Risk Levels

- Low
- Medium
- High

Suspicious complaints are marked as

```
REVIEW_REQUIRED
```

for manual verification by administrators.

---

# 🔄 Complaint Workflow

```text
Citizen
   │
   ▼
Register / Login
   │
   ▼
Capture Live Photo
   │
   ▼
GPS Location
   │
   ▼
Timestamp Added
   │
   ▼
Submit Complaint
   │
   ▼
Groq AI Categorization
   │
   ▼
Risk Scoring
   │
   ▼
Store in SQLite Database
   │
   ▼
Admin Dashboard
   │
   ▼
Assign Worker
   │
   ▼
Worker Updates Status
   │
   ▼
Upload Completion Proof
   │
   ▼
Citizen Receives Status Update
```

---

# 🏗 System Architecture

```text
                 React + Vite
                       │
                       │ REST API
                       ▼
                Express.js Backend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      JWT Auth      SQLite DB      Groq AI
        │              │              │
        └──────────────┼──────────────┘
                       │
               Admin Dashboard
```

---

# 💻 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts

---

## Backend

- Node.js
- Express.js
- TypeScript
- SQLite
- JWT
- bcrypt
- dotenv

---

## AI

- Groq API
- Llama Model

---

## Database

- SQLite

---

## Authentication

- JWT (JSON Web Token)

---

## Location Services

- Browser Geolocation API

---

# 📂 Folder Structure

```text
CSNMC
│
├── backend
│   ├── db
│   ├── middleware
│   ├── routes
│   ├── server.ts
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── components
│   ├── pages
│   ├── context
│   ├── lib
│   ├── App.tsx
│   └── package.json
│
├── package.json
├── README.md
└── .gitignore
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/your-username/CSNMC.git
```

Move into the project

```bash
cd CSNMC
```

Install dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create

```
backend/.env
```

Add

```env
PORT=3001

JWT_SECRET=your_jwt_secret_here

GROQ_API_KEY=your_groq_api_key_here
```

---

# ▶ Running the Project

Run the complete project

```bash
npm run dev
```

Run only frontend

```bash
cd frontend

npm run dev
```

Run only backend

```bash
cd backend

npm run dev
```

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| Citizen | Register complaints, capture live images, track status |
| Worker | View assigned complaints, upload proof, resolve complaints |
| Admin | Manage users, assign complaints, analytics, moderation |

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes
- Role-Based Authorization
- Camera-only Complaint Submission
- GPS Validation
- Timestamp Validation
- AI-based Complaint Categorization
- Risk Scoring
- Admin Moderation Queue

---

# 🚀 Future Enhancements

- Android Application
- iOS Application
- Progressive Web App (PWA)
- Push Notifications
- Duplicate Image Detection
- AI-generated Image Detection
- OCR-based Waste Detection
- IoT Smart Dustbins
- Route Optimization
- Heatmap Analytics
- Email & SMS Notifications
- Real-time WebSocket Updates

---

# 📄 License

This project is developed for educational and research purposes under the Department of Computer Science & Engineering, Maharashtra Institute of Technology, Chhatrapati Sambhajinagar.

