# AI Incident Command Center

A real-time AI-powered incident management platform built using React, Express, PostgreSQL, Prisma, Socket.IO, and Groq AI.

This application enables teams to create incidents, collaborate through live updates, track status changes, and generate AI-powered summaries with suggested next actions.

---

## Features

### Incident Dashboard
- View all active incidents
- Priority and status indicators
- Latest update preview
- Created timestamps
- Resolved incidents automatically disappear

### Incident Management
- Create incidents
- Track incident details
- Add live updates
- Change incident status

### Real-Time Updates
- Socket.IO-based realtime communication
- Dashboard updates automatically
- Incident updates appear without refresh

### AI Features
- Generate AI incident summaries
- Suggested next actions
- Powered by Groq + Llama 3.1

### Status Workflow
- Open
- Investigating
- Resolved

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
- Neon
- pgAdmin

## Deployment
- Vercel
- Render

---
# Live Links

- Frontend: https://ai-incident-command-center.vercel.app/
- Backend API: https://ai-incident-command-center.onrender.com

# Architecture

```text
Frontend (React)
↓

Backend (Express + Socket.IO)
↓

Prisma ORM
↓

PostgreSQL (Neon)
↓

AI Summary (Groq API)
```

---

# Project Structure

```bash
ai-incident-room/

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
│
└── README.md
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into project:

```bash
cd ai-incident-room
```

---

## 2. Frontend Setup

Open terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```bash
https://ai-incident-command-center.vercel.app/
```

---

## 3. Backend Setup

Open another terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## 4. PostgreSQL Setup

Create database:

```bash
ai_incident_room
```

Open:

```text
pgAdmin
→ Create Database
```

---

## 5. Configure Environment Variables

Create:

```bash
server/.env
```

Add:

```env
DATABASE_URL="postgresql://neondb_owner:npg_KvV3GsPMH1tw@ep-twilight-brook-aqe75goq-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

PORT=5000

GROQ_API_KEY=your_groq_api_key
```

---

## 6. Prisma Setup

Apply migrations:

```bash
npx prisma migrate dev --name init
```

Generate client:

```bash
npx prisma generate
```

---

## 7. Start Backend

```bash
npm run dev
```

Backend runs at:

```bash
https://ai-incident-command-center.onrender.com
```

---

# AI Integration

This project uses:

- Groq API
- Llama 3.1 8B Instant Model

AI capabilities:

- Incident summarization
- Suggested next actions

---

# Realtime Flow

```text
User creates update
↓

Backend stores in PostgreSQL
↓

Socket.IO emits event
↓

Clients receive update
↓

Dashboard refreshes automatically
```

---

# Database Schema

## Incident

```text
id
title
description
priority
status
reporter_name
latest_update
created_at
updated_at
```

## IncidentUpdate

```text
id
incident_id
message
author_name
created_at
```

## AIResult

```text
id
incident_id
type
result_text
created_at
```

---

# Deployment

## Backend

Deploy using:

- Render

Environment Variables:

```env
DATABASE_URL=
PORT=
GROQ_API_KEY=
```

---

## Frontend

Deploy using:

- Vercel

Update API URL before deployment.

---

# Future Improvements

- Authentication
- Role-based access
- Search and filters
- Notifications
- File uploads
- Analytics dashboard
- Dark mode

---

# Author

Komal Mathamsetti

---

# License

Developed for internship evaluation and learning purposes.