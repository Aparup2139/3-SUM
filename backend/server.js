import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js"; // Updated path to src/config
import authRoutes from "./routes/authRoutes.js"; // Updated path to src/routes
import eventRoutes from "./routes/eventRoutes.js"; // Include core platform routes
import bookingRoutes from "./routes/bookingRoutes.js"; // Include core platform routes
import llmRoutes from "./routes/llmRoutes.js"; // Updated path to src/routes

// Dependencies for Passport strategy initialization and LLM config
import "./config/passport.js"; 
import { initializeLLaMAClient } from "./config/llama.js"; 

dotenv.config();
const app = express();
console.log("hello");
// Initialize LLaMA client
//initializeLLaMAClient();

// Connect to MongoDB
const dbConnection = await connectDB();

// -----------------------------
// ⚙️ CORS Configuration
// -----------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
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

// ✅ Apply CORS safely for Express 5
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ Use RegExp instead of "*"

// -----------------------------
// ✅ Express + Passport setup
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "a-very-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🧩 Routes
// -----------------------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes); // Core event management routes
app.use("/api/v1/bookings", bookingRoutes); // Core booking/payment routes
app.use("/api/llm", llmRoutes); // LLM/Chatbot specific route

// Verification endpoint for QR code scanner (accessible publicly/separately)
// import { verifyTicket } from "./controllers/bookingController.js";
// app.get("/verification/bookId/:qrCodeKey", verifyTicket); 


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
