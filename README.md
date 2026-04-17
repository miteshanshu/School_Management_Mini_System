# 🏫 School Management Mini System

A full-stack web application for managing students and tasks, built as a hiring assignment.

**Stack:** React · Node.js/Express · PostgreSQL (Neon) · Prisma · JWT

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Single admin login with JWT (24h expiry) |
| 👨‍🎓 Student Management | Add, edit, delete students (cascade deletes tasks) |
| 📋 Task Management | Assign tasks, set due dates, mark complete/pending |
| 🛡️ Protected Routes | All API routes require valid JWT |
| 🎨 Premium UI | Dark mode, animated stats, responsive layout |

---

## 📁 Project Structure

```
School_Management_Mini_System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB models (Admin, Student, Task)
│   │   └── seed.js             # Creates admin account
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # JWT auth guard
│   │   ├── routes/             # Express routers
│   │   └── index.js            # App entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/api.js          # Axios client with JWT interceptor
    │   ├── components/         # StudentForm, StudentList, TaskForm, TaskList
    │   ├── pages/              # Login, Dashboard
    │   ├── App.jsx             # Router with protected routes
    │   └── index.css           # Design system (dark mode)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

---

### 1. Clone & navigate

```bash
cd School_Management_Mini_System
```

---

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DATABASE_URL="postgresql://..."   # From Neon dashboard → Connection string
JWT_SECRET="any-long-random-string"
PORT=5000
ADMIN_EMAIL="admin@school.com"
ADMIN_PASSWORD="admin123"
```

---

### 3. Install backend dependencies & set up DB

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
```

This will:
- Create all tables in Neon
- Create the admin account from your `.env` values

---

### 4. Install & run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

### 5. Start the backend (in a separate terminal)

```bash
cd backend
npm run dev
```

---

### 6. Open the app

Visit [http://localhost:5173](http://localhost:5173) and log in with:
- **Email:** value from `ADMIN_EMAIL`
- **Password:** value from `ADMIN_PASSWORD`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ✗ | Login, returns JWT |

### Students
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/students` | ✓ | List all students |
| POST | `/api/students` | ✓ | Create a student |
| PUT | `/api/students/:id` | ✓ | Update a student |
| DELETE | `/api/students/:id` | ✓ | Delete student + tasks |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | ✓ | List all tasks |
| POST | `/api/tasks` | ✓ | Assign a task |
| PUT | `/api/tasks/:id` | ✓ | Update a task |
| DELETE | `/api/tasks/:id` | ✓ | Delete a task |

---

## 🗄️ Database Schema

```
Admin      → email (unique), password (bcrypt)
Student    → name, class
Task       → title, description?, status (PENDING|COMPLETED), dueDate?, studentId (FK cascade)
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `PORT` | ✗ | Server port (default: 5000) |
| `ADMIN_EMAIL` | ✅ (seed) | Admin email |
| `ADMIN_PASSWORD` | ✅ (seed) | Admin password |
