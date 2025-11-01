// src/routes/bookingRoutes.js
import express from 'express';
import { bookTicket,  getMyBookings, getQrCode } from '../controllers/bookingControllers.js';
import { protect, validateTicketCount } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware Dependencies:
// 'protect': Ensures the user is logged in (req.user is available).
// 'validateTicketCount': Checks if ticketCount <= 5 (Fraud Prevention).

// 1. Initiate Order (Protected & Validated)
router.post('/create-order/:id', protect,validateTicketCount, bookTicket);

// 2. Razorpay Webhook (Public, relies on signature verification inside the controller)
// Note: This endpoint must match the URL configured in your Razorpay dashboard.
// router.post('/razorpay-webhook', handleWebhook);

// 3. User Booking History
router.get('/my-tickets', protect, getMyBookings);

// 4. Get QR Code URL for a specific booking
router.get('/qr/:bookingId', protect, getQrCode); 

export default router;

// Note on /verification/bookId/:qrCodeKey:
// This route is defined in server.js as a public entry point outside /api 
// for simplicity in scanning at the event entrance.
