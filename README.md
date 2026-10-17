# Elshadai Enterprises – Home Maintenance Services Website

A full-stack website for a Bangalore home maintenance business.

**Live site:** https://elshadai-enterprises-hfor.vercel.app/

---

## Features

- **Service cards with picture galleries** for each offering
- **Booking form** that stores customer requests in MongoDB
- **Admin panel** with full CRUD (create, read, update, delete) over bookings
- **Responsive design** that works on mobile and desktop

**Services offered:** Carpentry, Electrical, Painting, Welding, General Repair, Decorative Finishes, Plumbing.

---

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend       | React (Vite)            |
| Backend        | Node.js / Express       |
| Database       | MongoDB                 |
| Frontend Host  | Vercel                  |
| Backend Host   | Render                  |

---

## How It Works

1. A customer fills out the **booking form** on the website.
2. The form sends the data to the backend **REST API** (`POST /bookings`).
3. The booking is validated and saved to **MongoDB**.
4. The admin logs in and manages bookings from the **admin panel**, which reads and updates the same data through the protected API.

```
Booking form  ->  REST API (/bookings)  ->  MongoDB  ->  Admin panel
```

---

## API Endpoints

| Method | Endpoint         | Access            | Description                        |
| ------ | ---------------- | ----------------- | ---------------------------------- |
| POST   | `/bookings`      | Public            | Create a new booking               |
| POST   | `/login`         | Public            | Admin login, returns a bearer token|
| GET    | `/bookings`      | Admin (Bearer)    | List all bookings                  |
| PUT    | `/bookings/:id`  | Admin (Bearer)    | Update a booking                   |
| DELETE | `/bookings/:id`  | Admin (Bearer)    | Delete a booking                   |

Admin requests must include the header `Authorization: Bearer <ADMIN_TOKEN>`.

---

## Security

- **bcrypt-hashed admin password** – the plaintext password is never stored
- **Rate limiting** on the login and booking endpoints
- **Input validation** on all incoming booking data
- **Field whitelist** on updates (only approved fields can be changed)
- **Helmet** for secure HTTP headers
- **Restricted CORS** to the configured frontend origin and Vercel preview URLs
- **10kb body limit** to reject oversized requests

---

## Getting Started

### Prerequisites

- Node.js
- A MongoDB connection string (Atlas or local)

### Clone

```bash
git clone https://github.com/Hiesenberg/elshadai-enterprises.git
cd elshadai-enterprises
```

### Backend

```bash
cd Backend
npm install
npm start
```

Runs the Express server on `http://localhost:5000`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Runs the Vite dev server on `http://localhost:5173`.

Other frontend commands: `npm run build`, `npm run preview`, `npm run lint`.

---

## Environment Variables

Create a `.env` file in each folder. Names and purposes only — never commit real values.

### Backend (`Backend/.env`)

| Variable              | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `MONGODB_URI`         | MongoDB connection string                            |
| `CLIENT_URL`          | Frontend origin allowed by CORS                      |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password                    |
| `ADMIN_TOKEN`         | Secret bearer token returned after admin login       |
| `PORT`                | Port the Express server listens on (default `5000`)  |

### Frontend (`Frontend/.env`)

| Variable        | Purpose                     |
| --------------- | --------------------------- |
| `VITE_API_URL`  | Base URL of the backend API |

---

## Screenshots

### Home page

![Home page](Frontend/public/screenshots/home.png)

### Admin panel

![Admin panel](Frontend/public/screenshots/admin.png)

---
---

## What I Built

- Backend REST API (Express + MongoDB)
- Booking form and data flow
- Admin panel with full CRUD
- Deployment (Vercel frontend, Render backend)

ChatGPT helped with the UI design.

---

## Author

**Rahul R**
BCA graduate, St. Joseph's University, Bangalore
