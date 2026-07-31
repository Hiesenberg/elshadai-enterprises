const Booking = require("./models/BookingModel");
const { validateBooking } = require("./utils/validateBooking");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");

const app = express();

// Trust the first proxy hop (Render/Heroku) so rate limiting sees real client IPs
app.set("trust proxy", 1);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("Connection State:", mongoose.connection.readyState); // 1 = Connected
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error:", error);
  });

// Middleware
app.use(helmet());
// CORS: allow the configured frontend + this project's Vercel preview/edge URLs
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server (curl/Postman)

      const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
      if (origin === allowedOrigin) return callback(null, true);

      const projectName = allowedOrigin.split(".")[0].split("://").pop();
      if (
        origin.startsWith(`https://${projectName}-`) &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true); // Vercel preview deployments
      }

      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: "10kb" }));

// Rate limiting: slow down repeated requests from the same IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per 15 minutes
  message: { message: "Too many login attempts. Try again later." },
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 booking requests per 15 minutes
  message: { message: "Too many booking requests. Try again later." },
});

// Wrap async route handlers so thrown errors reach the central error handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Protect admin routes: client must send "Authorization: Bearer <token>"
function requireAuth(req, res, next) {
  if (req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}`) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
}

// Admin login: correct bcrypt-hashed password -> return the secret token
app.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const passwordMatches = await bcrypt.compare(req.body.password, hash);
    if (passwordMatches) {
      return res.json({ token: process.env.ADMIN_TOKEN });
    }

    return res.status(401).json({ message: "Invalid password" });
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Home Route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Booking Route (public - customers can create bookings)
app.post(
  "/bookings",
  bookingLimiter,
  asyncHandler(async (req, res) => {
    const errors = validateBooking(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: Object.values(errors)[0] });
    }

    console.log("Booking Received:", req.body);

    const booking = new Booking(req.body);
    await booking.save();

    return res.status(201).json({ message: "Booking created successfully" });
  })
);

// Admin routes (protected)
app.get(
  "/bookings",
  requireAuth,
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find();
    return res.status(200).json(bookings);
  })
);

app.put(
  "/bookings/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const errors = validateBooking(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: Object.values(errors)[0] });
    }

    // Whitelist: only these fields are allowed to be updated
    const allowedFields = [
      "name",
      "email",
      "phone",
      "service",
      "location",
      "message",
    ];
    const update = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  })
);

app.delete(
  "/bookings/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking deleted successfully" });
  })
);

// Central error handler: every thrown/next(err) lands here
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ message: "Invalid request body" });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
