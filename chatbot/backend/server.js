// server.js (Final Code)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import llmRoutes from "./routes/llm_routes.js"; // <-- NEW: Import the LLM route
import "./config/passport.js";
import "./llm_config.js"; // Renamed from './config/llm_config.js' for clarity as it acts as a service

dotenv.config();
const app = express();

connectDB();

// -----------------------------
// ⚙️ CORS Configuration (Express 5 Safe)
// -----------------------------
const allowedOrigins = [
  
  "http://localhost:8080",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle all preflight requests explicitly
app.options(/.*/, cors(corsOptions)); // regex ✅

// -----------------------------
// ✅ Express + Passport setup
// -----------------------------
app.use(express.json()); // Essential for reading the JSON body of the LLM request
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🧩 Routes
// -----------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/llm", llmRoutes); // <-- NEW: Mount the LLM route here

// -----------------------------
// ⚡ Health check
// -----------------------------
app.get("/", (req, res) => {
  res.status(200).send("Backend is live ✅");
});

// -----------------------------
// 🚀 Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));