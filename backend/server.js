import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js"; // Updated path to src/config
import authRoutes from "./routes/authRoutes.js"; // Updated path to src/routes
//import eventRoutes from "./routes/eventRoutes.js"; // Include core platform routes
//import bookingRoutes from "./routes/bookingRoutes.js"; // Include core platform routes
import llmRoutes from "./routes/llm_routes.js"; // Updated path to src/routes

// Dependencies for Passport strategy initialization and LLM config
import "./config/passport.js"; 
import { initializeLLaMAClient } from "./config/llama.js"; 

dotenv.config();
const app = express();

// Initialize the RAG/LLM client before starting the server
initializeLLaMAClient();

// Connect to MongoDB
connectDB();

// -----------------------------
// ⚙️ CORS Configuration
// -----------------------------
// Note: In a production environment, only list known domains.
const allowedOrigins = [
    "http://localhost:3000", // Example frontend port
    "http://localhost:8080",
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., Postman, mobile apps)
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
app.options("*", cors(corsOptions)); // Handle all preflight requests

// -----------------------------
// ✅ Express + Passport setup
// -----------------------------
app.use(express.json()); // Essential for reading the JSON body of the LLM request
app.use(express.urlencoded({ extended: true })); // Handle form data
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'a-very-secret-key', // Use fallback for demonstration
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
    })
);
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------
// 🧩 Routes
// -----------------------------
app.use("/api/v1/auth", authRoutes);
//app.use("/api/v1/events", eventRoutes); // Core event management routes
app.use("/api/v1/bookings", bookingRoutes); // Core booking/payment routes
app.use("/api/llm", llmRoutes); // LLM/Chatbot specific route




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
