# 🔧 Fix It Now Backend

> **REST API for the Fix It Now Home Service Platform**

A secure and scalable backend API built with **Node.js, Express, TypeScript, Prisma, PostgreSQL, and JWT Authentication** that powers the Fix It Now home service marketplace.

---

## 🌐 Live Demo

### 🚀 Frontend

https://fixitnow-frontend-nine.vercel.app

### 🔗 Backend API

https://fix-it-now-rho.vercel.app

---

## 📖 Project Overview

Fix It Now is a complete home service marketplace where:

- Customers can browse and book services.
- Technicians can manage their services and bookings.
- Admins can manage users, categories, and platform activities.

This repository contains the **Backend REST API**.

The frontend is built separately using **Next.js App Router** and consumes this API.

---

# 🏗 Project Architecture

```text
Next.js Frontend
        │
        │ REST API
        ▼
Express.js Backend
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Login
- User Registration
- Password Hashing (bcrypt)
- Role-Based Authorization

---

## 👤 Customer

- Book Services
- View Bookings
- Payment Integration
- Leave Reviews

---

## 👨‍🔧 Technician

- Manage Services
- Update Profile
- Manage Availability
- Accept / Reject Bookings
- Update Booking Status

---

## 🛡 Admin

- Manage Users
- Ban / Activate Users
- Manage Categories
- View All Bookings

---

## 💳 Stripe Integration

- Create Payment Intent
- Verify Payments
- Secure Checkout

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Stripe

---

## 📁 Folder Structure

```text
src
│
├── app
│   ├── modules
│   ├── routes
│   ├── middlewares
│   └── validations
│
├── config
├── lib
├── utils
├── server.ts
└── app.ts
```

---

# 🚀 Installation

Clone repository

```bash
git clone https://github.com/FardinCSE25/Fix-It-Now-Server.git
```

Move into project

```bash
cd Fix-It-Now-Server
```

Install dependencies

```bash
bun install
```

Create environment file

```env
DATABASE_URL=your_database_url

JWT_ACCESS_SECRET=your_access_secret

PORT=7000

STRIPE_SECRET_KEY=your_stripe_secret

CLIENT_URL=http://localhost:3000
```

Run development server

```bash
bun dev
```

---

# 🔐 Roles

### Customer

- Book Services
- Payment
- Reviews

### Technician

- Manage Services
- Booking Management
- Availability Management

### Admin

- Manage Users
- Manage Categories
- Platform Monitoring

---

# 🔄 Booking Workflow

```text
Browse Services
      │
      ▼
Book Service
      │
      ▼
Technician Accepts
      │
      ▼
Stripe Payment
      │
      ▼
Job In Progress
      │
      ▼
Completed
      │
      ▼
Leave Review
```

---

# 🌐 Frontend

The frontend application is built with **Next.js App Router**.

### Live Frontend

https://fixitnow-frontend-nine.vercel.app

### Frontend Repository

https://github.com/FardinCSE25/Fix-It-Now-Frontend

---

# 📡 Backend API

### Live API

https://fix-it-now-rho.vercel.app

---

# 👨‍💻 Developer

**Fardin Ahmed**

### LinkedIn

https://www.linkedin.com/in/fardin-ahmed-cse/