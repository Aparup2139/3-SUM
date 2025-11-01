import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;
