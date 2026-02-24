# ⛪ Smart Campus Operations Hub

**IT3030 – Programming Applications & Frameworks (PAF) | 2026**

A production-inspired **Smart Campus Management System** that enables universities to manage **facility bookings, maintenance incidents, and notifications** through a secure REST API and a modern React web application.

---

## 📌 Project Overview

The **Smart Campus Operations Hub** provides a unified platform to:

- Manage bookable campus resources (rooms, labs, equipment)
- Handle booking workflows with conflict prevention
- Report and resolve maintenance incidents
- Notify users of important system events
- Secure access using OAuth 2.0 and role-based authorization

---

## 🧱 System Architecture

- **Backend:** Spring Boot REST API (Layered Architecture)
- **Frontend:** React Web Application

---

## 📂 Backend Project Structure (Spring Boot)
```
src/main/java/com/smartcampus/
 ├── config/       # OAuth 2.0 & Spring Security configuration
 ├── controller/   # REST API endpoints (GET, POST, PUT, DELETE)
 ├── dto/          # Data Transfer Objects & request validation
 ├── model/        # JPA entities mapped to database tables
 ├── repository/   # Data persistence layer (JPA repositories)
 ├── service/      # Business logic & workflow handling
 └── exception/    # Global exception handling & error responses
```

## 📂 Frontend Project Structure (React)
```
src/
 ├── components/   # Reusable UI components
 ├── pages/        # Page-level components (Dashboard, Bookings, Tickets)
 ├── services/     # API communication layer
 ├── context/      # Global state management
 ├── routes/       # Role-protected routes
 └── utils/        # Helper functions
```
