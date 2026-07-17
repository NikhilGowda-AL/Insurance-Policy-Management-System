# Insurance Policy Management System (IPMS)

A production-ready, full-stack **Insurance Policy Management System (IPMS)** that simulates a real-world insurance onboarding and policy issuance workflow, built using the **Nextjs + MERN + TypeScript** stack.

---

# Deployed Application link

🔗 https://insurance-policy-management-system-two.vercel.app/login

---


# Installation

## Prerequisites

Before you begin, ensure you have:

- Node.js 20+
- MongoDB (Local or MongoDB Atlas)

---

## Clone the Repository

```bash
git clone <your-repo-url> insurance-app
cd insurance-app

cd backend
npm install

cd ../frontend
npm install
```

---

# Running the Application

Open **two terminals**—one for the backend and one for the frontend. Ensure MongoDB is running locally or configure your MongoDB Atlas connection string.

## Terminal 1 — Backend

```bash
cd backend

cp .env.example .env   # Update MONGO_URI and JWT_SECRET if required

npm install

npm run seed           # Creates the default Administrator and Insurance Agent

npm run dev            # Backend runs at http://localhost:5000
```

---

## Terminal 2 — Frontend

```bash
cd frontend

cp .env.example .env

npm install

npm run dev            # Frontend runs at http://localhost:3000
```

---

## Access the Application

Open:

```
http://localhost:3000
```

Select either:

- **Administrator**
- **Insurance Agent**

and log in using the default credentials below.

---

# Default Credentials (After `npm run seed`)

## Administrator

```env
ADMIN_EMAIL=admin@ipms.local
ADMIN_PASSWORD=Admin@12345
```

---

## Insurance Agent

```env
AGENT_EMAIL=agent.demo@ipms.local
AGENT_PASSWORD=Agent@12345
```

> These accounts are automatically created when you run:

```bash
npm run seed
```

---

# Running Tests

Execute the backend unit and integration tests:

```bash
cd backend
npm test
```
