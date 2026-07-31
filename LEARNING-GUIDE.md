# Elshadai Enterprises — Learning Guide

> A full-stack beginner's guide to this project. Read it top to bottom once, then keep it as a reference.
> It explains **what** the code does and **why** it's built that way — so you can explain it in interviews too.

---

## 1. What is this app?

**Elshadai Enterprises** is a home-maintenance booking platform:

- **Customers** visit the website, see the services (Carpentry, Electrical, Painting, Welding, General Repair), fill a booking form, and submit it.
- **The owner (admin)** logs in at `/admin`, sees all bookings in a dashboard, edits them, deletes them, and generates a PDF estimate.

Two different users → two different sides of the app.

---

## 2. The big picture (architecture)

```
Browser (customer)          Browser (admin)
      |                           |
      |   website pages           |   /admin page
      v                           v
   ╔═══════════════════════════════════════════════════╗
   ║  FRONTEND  (React + Vite)  → hosted on Vercel     ║
   ║  "Just HTML/CSS/JS the browser runs"              ║
   ╚═══════════════════════════════════════════════════╝
      |  fetch("https://...onrender.com/api")  (HTTP + JSON)
      v
   ╔═══════════════════════════════════════════════════╗
   ║  BACKEND  (Node + Express)  → hosted on Render     ║
   ║  "A server that talks to the database"             ║
   ╚═══════════════════════════════════════════════════╝
      |  Mongoose (ODM - lets JS talk to MongoDB)
      v
   ╔═══════════════════════════════════════════════════╗
   ║  DATABASE  (MongoDB Atlas - cloud)                 ║
   ║  "Where bookings are stored forever"               ║
   ╚═══════════════════════════════════════════════════╝
```

**Key mental model:** the frontend *never* touches the database. It only asks the backend over HTTP. The backend checks the request, talks to MongoDB, and returns JSON.

---

## 3. Tech stack & why

| Layer | Tech | Why this? |
|---|---|---|
| Frontend | **React** (with Vite) | Component-based → reusable UI; Vite is fast to develop and easy to deploy |
| Styling | Plain **CSS** (`.css` files per component) | Simple, no framework to learn, you understand every line |
| Routing | **react-router-dom** | Lets the app show different "pages" (`/` and `/admin`) without a page reload |
| Backend | **Node.js + Express** | The most common Node web framework; simple, huge job market |
| Database | **MongoDB Atlas** (cloud) | Free, schema-flexible, NoSQL documents feel like JSON |
| ODM | **Mongoose** | Gives structure (schema) + validation to MongoDB |
| Auth | Shared-secret token + **bcrypt** hashing | Simple admin login; bcrypt means the password is never stored in plain text |
| PDF | **jsPDF** + **jspdf-autotable** | Generates the estimate PDF in the browser (no server needed) |
| Security | **helmet**, **express-rate-limit** | HTTP security headers + brute-force protection |
| Hosting | **Vercel** (frontend) + **Render** (backend) | Both have generous free tiers; standard choices |

---

## 4. Folder structure (read this to navigate)

```
service-APP/
├── Frontend/                 ← React app (Vercel deploys this)
│   ├── index.html            ← the single HTML page Vite serves
│   ├── src/
│   │   ├── main.jsx          ← React starts here
│   │   ├── App.jsx           ← defines the routes ("/" and "/admin")
│   │   ├── config.js         ← one place for the backend URL
│   │   ├── components/       ← reusable UI pieces (Navbar, Hero, Booking, ...)
│   │   ├── pages/Admin.jsx   ← the whole admin dashboard
│   │   └── utils/estimatePdf.js  ← the PDF builder
│   ├── .env.example          ← template showing which env vars are needed
│   └── vercel.json           ← tells Vercel how to build + SPA routing
├── Backend/                  ← Express API (Render deploys this)
│   ├── server.js             ← ALL the API routes live here
│   ├── models/
│   │   ├── BookingSchema.js  ← shape + validation of a booking
│   │   └── BookingModel.js   ← ties the schema to MongoDB
│   └── utils/validateBooking.js ← server-side form validation
├── vercel.json               ← root config so Vercel builds the Frontend/ folder
└── .gitignore                ← keeps secrets & node_modules out of GitHub
```

---

## 5. How the frontend works

### 5.1 Routing (`App.jsx`)
React Router maps URLs to components:

- `/` → the marketing site (Navbar, Hero, Services, About, Booking, Footer)
- `/admin` → the Admin dashboard

When you visit `/admin`, the URL changes but the browser does **not** refresh — React just swaps which component is shown.

### 5.2 Components
Each section of the homepage is its own component in `src/components/`. Why split them?

- **Reusability** (one `<Navbar>` used once, could be reused)
- **Readability** (each file is small and focused)
- **Maintainability** (change the Hero without touching the Footer)

### 5.3 State (`useState`)
React "re-renders" the screen when state changes.

Example in `Booking.jsx`:
```jsx
const [name, setName] = useState("");
```
The text box's `value` is bound to `name`. When the user types, `onChange` calls `setName(...)`, React updates the screen. This is called a **controlled component**.

`isLoading` is another state — it disables the button and shows "Booking..." while the request is in flight.

### 5.4 Talking to the backend (`fetch`)
In `Booking.jsx`:
```js
const response = await fetch(`${API_URL}/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bookingData),
});
```
- `API_URL` comes from `config.js` → reads `VITE_API_URL` (set in Vercel).
- The browser sends JSON, the backend replies with JSON, and `statusMessage` shows the result.

### 5.5 Why environment variables?
`Frontend/.env` has `VITE_API_URL=http://localhost:5000` locally, but **Vercel** sets it to the live Render URL. The `VITE_` prefix is Vite's rule: only `VITE_*` variables are exposed to the browser. Anything else stays secret on the server. Never put real secrets in a frontend `.env`.

---

## 6. The Admin dashboard (`Admin.jsx`) — the biggest file

### 6.1 Login gate
Before showing data, the component checks for a token in `localStorage`:
- No token → show the login screen.
- Token exists → show the dashboard.
- Backend says "Unauthorized" (401) → clear the token, force re-login.

### 6.2 Login flow
`POST /login` with the password → backend compares it (bcrypt) → returns `{ token }` → we save it in `localStorage` and attach it to every admin request:

```js
headers: { Authorization: `Bearer ${token}` }
```

**This is the "Bearer token" pattern** — the backend checks this header on every protected route.

### 6.3 Dashboard features
- **Stat cards** — computed from the fetched bookings (`filter`/`reduce`/`length`).
- **Search** — filters the list by name/email/phone as you type.
- **Table** — shows each booking with badges for status/service.
- **Edit modal** — a form that pre-fills the selected booking. Editing is just "PUT the whole form back to the API".
- **Delete** — asks for confirmation, then `DELETE /bookings/:id`.
- **Estimate button** — opens `EstimateModal`, a mini line-item builder that calls `estimatePdf.js` (jsPDF) to make the PDF.

### 6.4 Client-side validation
`validateField` / `validateForm` run the rules (required, email regex, phone regex) *before* sending anything:

- **Blur validation** — validate a field when you leave it (`onBlur`).
- **Re-validate on submit** — show errors under every bad field.
- **Save button disabled** until the form is valid.

Why? Instant feedback = better UX. But this is NOT security (see next section).

---

## 7. How the backend works (`Backend/server.js`)

### 7.1 The request lifecycle
```
request → helmet (headers) → CORS (who can call us) → express.json (parse body)
        → rate limiter → route handler → (asyncHandler) → response
        → if anything throws → central error handler
```

### 7.2 Routes

| Method & path | Public? | What it does |
|---|---|---|
| `POST /login` | yes (rate-limited) | password → token |
| `POST /bookings` | **yes** (customers!) | create a booking |
| `GET /bookings` | no (auth) | list all bookings |
| `PUT /bookings/:id` | no (auth) | update a booking |
| `DELETE /bookings/:id` | no (auth) | delete a booking |

### 7.3 Why server-side validation matters
`validateBooking()` (in `utils/validateBooking.js`) repeats the same rules as the frontend. **Why both?**

- Frontend validation = **user experience** (fast feedback).
- Backend validation = **security**. Anyone can bypass the browser (Postman, curl, bots). The backend is the final gatekeeper — never trust the client.

### 7.4 Field whitelist on updates
`PUT /bookings/:id` only copies `name, email, phone, service, location, message` from the request body. This stops a hacker from sending `{ "_id": "..." }` or `{ "__v": 9 }` and corrupting the record.

### 7.5 Central error handler
Instead of `try/catch` inside every route, an `asyncHandler` wrapper catches thrown errors and sends them to **one** error middleware that:
- `ValidationError` (Mongoose) → 400
- malformed/huge JSON → 400
- anything else → 500

One place to handle errors = less repetition, easier debugging.

### 7.6 Mongoose schema (defense in depth)
`BookingSchema.js` declares:
```js
name: { type: String, required: true, trim: true, maxlength: 100 }
```
- `required` → DB rejects a missing field
- `trim` → removes surrounding spaces
- `lowercase` (email) → stores emails consistently
- `maxlength` → caps size

Even if a future route forgets to validate, the **database** still rejects bad data. This layered approach is called **defense in depth**.

### 7.7 Security middleware
- **helmet** → sets safe HTTP headers (stops clickjacking, MIME sniffing, etc.)
- **express-rate-limit** → max 10 login attempts / 15 min, max 20 bookings / 15 min per IP
- **express.json({ limit: "10kb" })** → rejects giant request bodies
- **`app.set("trust proxy", 1)`** → on Render the real user IP comes through a proxy; this lets rate limiting see the *actual* IP (without it, everyone shares one IP and gets rate-limited together!)

### 7.8 bcrypt (not plain-text passwords)
The `.env` stores `ADMIN_PASSWORD_HASH` (a bcrypt hash), never the password itself:
- Login runs `bcrypt.compare(password, hash)`.
- Even if the `.env` leaks, the original password can't be read back.
- bcrypt also *slows down* the comparison on purpose, making brute-force attacks impractical.

---

## 8. Deployment — how the internet reaches your code

### 8.1 GitHub
All code lives in `github.com/Hiesenberg/elshadai-enterprises`. `.gitignore` makes sure `node_modules`, `.env`, and `dist` are **never** committed. **Never commit real secrets.**

### 8.2 Render (backend)
- Imported the GitHub repo, root directory = `Backend`.
- Build: `npm install`, Start: `node server.js`.
- Env vars set in the dashboard: `MONGODB_URI`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOKEN`, `CLIENT_URL`.
- `process.env.PORT || 5000` → Render injects its own `PORT`.

### 8.3 Vercel (frontend)
- Imported the repo, root directory = `Frontend`, framework auto-detected as Vite.
- `vercel.json` adds an SPA rewrite so `/admin` works on direct visits (all routes → `index.html`).
- Env var: `VITE_API_URL` = the Render URL. **Env vars are baked in at build time** — change one → redeploy.

### 8.4 MongoDB Atlas
- The database is in the cloud. "Network Access" was set to allow from anywhere (`0.0.0.0/0`) because Render's servers have changing IPs. It's protected by the credentials in `MONGODB_URI`.

### 8.5 CORS explained
The browser *blocks* a website (Vercel) from calling a different server (Render) unless the server explicitly allows it. That's what `CLIENT_URL` does:
```js
app.use(cors({ origin: process.env.CLIENT_URL }));
```
If the frontend URL ever changes, update `CLIENT_URL` on Render and redeploy.

---

## 9. The two main flows (walk through these with a friend)

### Customer flow
1. Open website → scroll → fill **Book Our Service** form.
2. Browser validates instantly; on submit → `POST /bookings`.
3. Backend validates again → saves to MongoDB → returns "Booking created successfully".
4. Status message shows ✅.

### Admin flow
1. Visit `/admin` → login screen → password `admin123`.
2. `POST /login` → token saved in `localStorage`.
3. `GET /bookings` (with `Authorization: Bearer <token>`) → table renders.
4. Edit → modal opens → `PUT /bookings/:id`.
5. Estimate → modal → **Download PDF** → jsPDF generates the file.
6. Logout → token removed from `localStorage`.

---

## 10. Known tradeoffs (be honest about these in interviews)

- **Shared-secret auth** (one static token) is simple but not real auth. No expiry, no per-user accounts. Real apps use JWT with expiry or sessions.
- **Password compared with bcrypt** but stored as a hash in `.env` — fine for a demo; a real system uses a proper secrets manager (like Vercel/Render env vars already, or AWS Secrets Manager).
- **Render free tier sleeps** after ~15 min idle → first request takes ~50s.
- **4 npm audit warnings** exist in dependencies (old `react-router`, `postcss`). Fixing them needs breaking upgrades, so they were left.
- Data lives in Atlas' default **`test` database** (works, just a name).
- Admin edit replaces the whole record (no "last modified" tracking).

---

## 11. Interview questions — make sure you can answer these

1. What is the difference between a client and a server?
2. What happens when you submit the booking form? (walk the whole stack)
3. Why validate on both frontend AND backend?
4. How does admin authentication work here? What would you improve?
5. What is CORS and why did your deployment break without it?
6. What does `useState` do? What is a controlled component?
7. Why did we use environment variables? Why does the frontend only see `VITE_*` ones?
8. What is Mongoose, and what does "schema validation" mean?
9. What is the central error handler and why is it useful?
10. Why does changing an env var require a redeploy?

---

## 12. Roadmap / what's next

- **Phase 4 (portfolio):** move the duplicated Service/Location lists into one shared constants file; write a proper root `README.md`; add `engines` to the backend; polish the git history.
- **Nice upgrades:** JWT auth with expiry, toast notifications instead of `alert()`, pagination, a "status" field (pending/done), npm audit fixes.
- **Learn next:** TypeScript, a CSS framework (Tailwind), testing (Vitest/RTL), and Docker — these are what recruiters ask for next.
