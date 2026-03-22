# Fullstack Time Capsule ⏳

A secure, automated platform for creating digital "time capsules." Users can upload files and messages to be delivered to recipients at a specific future date.

## 🏗️ Architecture

The project uses a microservices-inspired architecture managed by **Docker Compose**:

-   **Frontend:** React (Vite + TypeScript) application.
-   **Backend:** Node.js (Express) API handling business logic and auth.
-   **Worker:** A background service (BullMQ) that monitors capsule release dates and sends notifications/emails.
-   **Nginx:** Acts as an API Gateway, routing `/api` traffic to the backend.
-   **Database:** PostgreSQL with Prisma ORM.
-   **Cache/Queue:** Redis for background job management.
-   **Storage:** S3-compatible storage (configured for LocalStack in development).

---

## 🚀 Getting Started

### Prerequisites

-   [Docker](https://www.docker.com/get-started) & Docker Compose installed.
-   Node.js (for local development, optional).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd fullstack-time-capsule
    ```

2.  **Configure Environment Variables:**
    Copy the `.env.example` files in each service directory to `.env` and fill in the required values.
    -   `backend/.env`
    -   `frontend/.env`
    -   `worker/.env`

3.  **Start the Application:**
    ```bash
    docker-compose up --build
    ```

---

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React 19 (Vite)
-   **Styling:** Tailwind CSS + Radix UI
-   **State Management:** Zustand
-   **Data Fetching:** React Query (TanStack Query)
-   **Form Handling:** React Hook Form + Zod

### Backend & Worker
-   **Runtime:** Node.js
-   **Framework:** Express (Backend)
-   **ORM:** Prisma
-   **Queue System:** BullMQ (Redis-backed)
-   **Authentication:** JWT (JSON Web Tokens)
-   **Mailing:** Nodemailer / Resend

### Infrastructure
-   **Proxy:** Nginx
-   **Database:** PostgreSQL 15
-   **Cache:** Redis (Alpine)
-   **Storage:** AWS S3 (via LocalStack for local dev)

---

## 🔌 API Endpoints (via Gateway)

The Nginx gateway is exposed on port **3000**. All API requests should be prefixed with `/api`.

-   `POST /api/auth/signup` - User Registration
-   `POST /api/auth/login` - User Login
-   `GET /api/capsule` - Retrieve user capsules
-   `POST /api/capsule` - Create a new time capsule
-   `GET /health_check` - Verify system health

---

## 📦 Docker Details

The system is designed to be fully autonomous:
-   **Database Migrations:** The backend container automatically runs `prisma migrate deploy` on startup.
-   **Healthchecks:** Services wait for the Database and Redis to be fully "Healthy" before starting.
-   **Frontend:** Exposed on `http://localhost:5173`.
-   **API Gateway:** Exposed on `http://localhost:3000`.

---

## 📝 License

This project is licensed under the ISC License.
