# AI Incident Command Center

A real-time AI-powered incident management platform built using React, Express, PostgreSQL, Prisma, Socket.IO, and Groq AI.

This application helps teams report, track, and manage live incidents collaboratively while receiving AI-generated incident summaries and suggested next actions.

---

# Features

## Real-Time Incident Management
- Create incidents
- Track live updates
- Real-time synchronization using Socket.IO
- Status workflow management

## AI-Powered Assistance
- Generate AI incident summaries
- Get suggested next actions
- AI responses powered by Groq API

## Incident Dashboard
- View all active incidents
- Priority badges
- Status badges
- Latest update tracking
- Created timestamps

## Incident Workflow
- Open
- Investigating
- Resolved

Resolved incidents automatically disappear from the dashboard.

## Database Integration
- PostgreSQL database
- Prisma ORM
- Structured relational schema

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Socket.IO
- Prisma ORM
- OpenAI SDK

## Database
- PostgreSQL
- pgAdmin

## AI Integration
- Groq API
- Llama 3.1 Model

---

# Architecture

## Realtime Flow

User adds update
→ Backend stores update in PostgreSQL
→ Socket.IO emits realtime event
→ All connected clients receive updates instantly
→ Dashboard and incident pages refresh automatically

---

# Database Schema

## Incident
- id
- title
- description
- priority
- status
- reporter_name
- latest_update
- created_at
- updated_at

## IncidentUpdate
- id
- incident_id
- message
- author_name
- created_at

## AIResult
- id
- incident_id
- type
- result_text
- created_at

---

# Project Structure

```bash
ai-incident-room/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── server/
│   ├── prisma/
│   ├── server.js
│   └── .env
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd ai-incident-room
```

---

# Frontend Setup

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## 3. Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Backend Setup

## 4. Install Backend Dependencies

```bash
cd server
npm install
```

## 5. Configure Environment Variables

Create `.env` file inside server folder:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_incident_room"

PORT=5000

GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

# PostgreSQL Setup

## 6. Create Database

Using pgAdmin:

Create database:

```bash
ai_incident_room
```

---

# Prisma Setup

## 7. Run Prisma Migration

```bash
npx prisma migrate dev --name init
```

## 8. Generate Prisma Client

```bash
npx prisma generate
```

---

# Run Backend

## 9. Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# AI Integration

This project uses:
- Groq API
- Llama 3.1 8B Instant Model

AI Features:
- Incident summarization
- Suggested next actions

---

# Realtime Features

Implemented using Socket.IO:

- Realtime incident updates
- Realtime dashboard synchronization
- Realtime status updates
- Realtime latest update tracking

---

# Key Functionalities

## Create Incident
Users can create incidents with:
- Title
- Description
- Priority
- Reporter name

## Add Updates
Users can:
- Post updates
- Track investigation progress
- Collaborate in realtime

## AI Summary
Users can:
- Generate incident summaries
- Receive suggested next actions

## Status Workflow
Supported statuses:
- Open
- Investigating
- Resolved

Resolved incidents are automatically hidden from dashboard.

---

# Future Improvements

- User authentication
- Role-based access
- Incident filtering
- Search functionality
- Email notifications
- Analytics dashboard
- File attachments
- Dark mode

---

# Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- Render

## Database Hosting
- Neon PostgreSQL

---

# Screenshots

Add screenshots of:
- Dashboard
- Incident Details Page
- AI Summary Feature
- Realtime Updates

---

# Author

Komal Mathamsetti

---

# License

This project is developed for internship evaluation and learning purposes.

