# TaskFlow — Full Stack Todo App

A full-stack Todo application with **JWT authentication**, **Role-Based Access Control (RBAC)**, email OTP password reset, and Quartz job scheduler reminders.

```
taskflow-fullstack/
├── backend/          ← Spring Boot (Java 17, MySQL, JWT, Quartz)
├── frontend/         ← React + Vite (dark UI, RBAC-aware)
└── README.md
```

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Spring Boot 3, Spring Security, JWT, Quartz     |
| Database  | MySQL 8                                         |
| Email     | Spring Mail (Gmail SMTP)                        |
| Frontend  | React 18, Vite, React Router v6, Axios          |
| Auth      | JWT (Bearer token), BCrypt password hashing     |
| RBAC      | Spring `@PreAuthorize`, role-aware React UI     |

---

## Roles & Permissions

| Action                  | USER        | ADMIN       |
|-------------------------|-------------|-------------|
| Register / Login        | ✅          | ✅          |
| Create todo             | ✅ Own only | ✅ Any user |
| Read todos              | ✅ Own only | ✅ All users|
| Update todo             | ✅ Own only | ✅ Any todo |
| Delete todo             | ❌          | ✅ Any todo |
| View all users (panel)  | ❌          | ✅          |
| View Admin Panel tab    | ❌          | ✅          |

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

### Backend Setup

**1. Create the database**
```sql
CREATE DATABASE todo_springboot_react;
```

**2. Configure credentials**
```bash
cd backend/src/main/resources
cp application.properties.example application.properties
# Edit application.properties and fill in your values
```

Required values to fill:
- `DB_USERNAME` / `DB_PASSWORD` — your MySQL credentials
- `MAIL_USERNAME` / `MAIL_PASSWORD` — Gmail + [App Password](https://myaccount.google.com/apppasswords)
- `JWT_SECRET` — any random string, 32+ characters

> The app uses Spring's `${ENV_VAR}` syntax. You can either edit `application.properties` directly or set real environment variables.

**3. Run**
```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8081`  
Swagger UI: `http://localhost:8081/swagger-ui.html`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

> The frontend points to `http://localhost:8081` by default (configured in `src/api/axios.js`). Change the `baseURL` there if your backend runs on a different port.

---

## API Endpoints

### Auth (Public)
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/signup`                   | Register with image  |
| POST   | `/login`                    | Login → JWT token    |
| POST   | `/forgotpassword/{email}`   | Send OTP             |
| POST   | `/verify-otp`               | Verify OTP           |
| POST   | `/reset-password`           | Reset password       |

### Todos (Authenticated)
| Method | Endpoint                          | Role  | Description         |
|--------|-----------------------------------|-------|---------------------|
| POST   | `/addtodo/{userid}`               | Any   | Create todo         |
| GET    | `/gettodo/{userid}`               | Any   | Get user's todos    |
| GET    | `/gettodobyid/{id}`               | Any   | Get todo by ID      |
| PUT    | `/updatetodo/{todoId}/{userId}`   | Any   | Update todo         |
| DELETE | `/deleteTodo/{id}`                | ADMIN | Delete todo         |

### Profile (Authenticated)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/profile/{email}` | Get profile        |
| PUT    | `/profile/{id}`    | Update profile     |

### Admin (ADMIN role only)
| Method | Endpoint        | Description      |
|--------|-----------------|------------------|
| GET    | `/admin/users`  | Get all users    |

---

## Frontend Pages

| Route              | Description                              |
|--------------------|------------------------------------------|
| `/login`           | Login form                               |
| `/register`        | Registration with avatar upload          |
| `/forgot-password` | 3-step OTP password reset                |
| `/dashboard`       | Task grid with stats, search, filter     |
| `/dashboard`       | Admin Panel tab (ADMIN only)             |
| `/profile`         | View and edit profile                    |

---

## Project Structure

```
backend/
├── src/main/java/com/todo/todo_backend/
│   ├── Configuration/       CorsConfig, SecurityConfig, SwaggerConfig
│   ├── Controller/          Controller.java (all endpoints)
│   ├── Entity/              UserEntity, TodoEntity, OtpEntity
│   ├── Exception/           GlobalExceptionHandler
│   ├── JobScheduler/        Quartz reminder jobs
│   ├── Model/               Request DTOs
│   ├── Repository/          JPA repositories
│   ├── Response/            ApiResponse, AuthResponse
│   ├── Security/            JwtUtil, JwtAuthFilter
│   └── Services/            ServiceImplement, SchedulerServiceImplement
└── src/main/resources/
    ├── application.properties          (uses env vars - safe to commit)
    └── application.properties.example  (template with instructions)

frontend/
└── src/
    ├── api/           axios.js (JWT interceptor)
    ├── components/    Navbar, TodoCard, TodoModal, Skeleton
    ├── context/       AuthContext, ToastContext
    └── pages/         Login, Register, ForgotPassword, Dashboard, Profile
```

---

## Security Notes

- Passwords hashed with **BCrypt**
- JWT tokens expire in **24 hours**
- OTP expires in **5 minutes**, single-use
- `application.properties` uses `${ENV_VAR}` — no secrets committed
- CORS configured for `localhost:5173` (update for production)

---

## Assignment RBAC Highlights

This project demonstrates RBAC at **3 layers**:
1. **Route-level** — `SecurityConfig` restricts `/deleteTodo/**` and `/admin/**` to ADMIN role
2. **Method-level** — `@PreAuthorize("hasRole('ADMIN')")` on controller methods
3. **UI-level** — Delete button hidden for USER role; Admin Panel tab only visible to ADMIN
