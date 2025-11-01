import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import * as bookingService from '../services/bookingService.js'; // Import service layer logic
import { generateQrCodeUrl } from '../services/qrService.js'; 

// --- 1. Initiate Order ---
// @desc    Initiate Razorpay order creation
// @route   POST /api/v1/bookings/create-order
// @access  Protected
export const createOrder = asyncHandler(async (req, res) => {
    // These calls rely on the detailed logic implemented in the bookingService.js file
    const userId = req.user._id; 
    const { eventId, ticketCount, totalAmount } = req.body;
    
    if (!eventId || !ticketCount || !totalAmount) {
        res.status(400);
        throw new Error('Missing required booking details.');
    }

    const result = await bookingService.initiatePaymentOrder(
        userId, eventId, ticketCount, totalAmount
    );

    res.status(200).json({
        message: 'Razorpay order created successfully.',
        orderId: result.orderId,
        preliminaryBookingId: result.preliminaryBookingId,
        amount: totalAmount 
    });
});

// --- 2. Handle Webhook ---
// @desc    Handle Razorpay Webhook notification (Payment Success/Failure)
// @route   POST /api/v1/bookings/razorpay-webhook
// @access  Public
export const handleWebhook = asyncHandler(async (req, res) => {
    // Logic handles signature verification and DB updates
    const { payload } = req.body;
    const orderId = payload.payment.entity.order_id;
    const paymentId = payload.payment.entity.id;
    const signature = req.headers['x-razorpay-signature'];

    try {
        await bookingService.handlePaymentSuccess(orderId, paymentId, signature);
        // Must return 200 OK for Razorpay
        res.status(200).send('Webhook processed successfully.'); 
    } catch (error) {
        console.error('Razorpay Webhook Error:', error.message);
        res.status(200).send(`Error processing webhook: ${error.message}`); 
    }
});

// --- 3. Get User Bookings ---
// @desc    Get booking history for the logged-in user
// @route   GET /api/v1/bookings/my-tickets
// @access  Protected
export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.fetchUserBookings(req.user._id);
    res.status(200).json(bookings);
});


// --- 4. Ticket Verification (Used by server.js route) ---
// @desc    Ticket verification endpoint
// @route   GET /verification/bookId/:qrCodeKey
// @access  Public
export const verifyTicket = asyncHandler(async (req, res) => {
    const { qrCodeKey } = req.params;
    const result = await bookingService.validateTicket(qrCodeKey);

    if (result.valid) {
        res.status(200).json({ status: 'success', message: result.message, event: result.booking.title });
    } else {
        res.status(401).json({ status: 'failure', message: result.message });
    }
});


// --- 5. Get QR Code URL (The function you provided) ---
// @desc    Get the QR Code URL for a specific booking
// @route   GET /api/v1/bookings/qr/:bookingId
// @access  Protected (User can only see their own QR code)
export const getQrCode = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    // req.user._id is populated by the 'protect' middleware applied to this route
    const userId = req.user._id; 

    const booking = await Booking.findById(bookingId).select('user razorpayStatus qrCodeKey');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found.');
    }

    // Security check: Ensure the user owns this booking
    if (booking.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this ticket.');
    }
    
    if (booking.razorpayStatus !== 'success') {
        res.status(400);
        throw new Error('Payment not finalized for this booking.');
    }

    // Use the service to generate the external image URL
    const qrCodeImageURL = generateQrCodeUrl(booking.qrCodeKey);

    res.status(200).json({
        message: 'QR Code URL generated successfully.',
        qrCodeUrl: qrCodeImageURL,
        qrCodeKey: booking.qrCodeKey 
    });
});