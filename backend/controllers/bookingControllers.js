// src/controllers/bookingController.js
import asyncHandler from 'express-async-handler';
import * as bookingService from '../services/bookingService.js';

// @desc    Initiate Razorpay order creation
// @route   POST /api/v1/bookings/create-order
// @access  Protected
export const createOrder = asyncHandler(async (req, res) => {
    // req.user is populated by 'protect' middleware
    const userId = req.user._id; 
    const { eventId, ticketCount, totalAmount } = req.body;

    // Note: Validation (max 5 tickets) is handled by middleware, but a final check here is good practice.
    if (!eventId || !ticketCount || !totalAmount) {
        res.status(400);
        throw new Error('Missing required booking details (eventId, ticketCount, totalAmount).');
    }

    // Service handles communication with Razorpay and preliminary booking storage
    const result = await bookingService.initiatePaymentOrder(
        userId, 
        eventId, 
        ticketCount, 
        totalAmount
    );

    res.status(200).json({
        message: 'Razorpay order created successfully.',
        orderId: result.orderId,
        preliminaryBookingId: result.preliminaryBookingId,
        amount: totalAmount // Send back the amount expected
    });
});

// @desc    Handle Razorpay Webhook notification (Payment Success/Failure)
// @route   POST /api/v1/bookings/razorpay-webhook
// @access  Public (Signature validated internally)
export const handleWebhook = asyncHandler(async (req, res) => {
    // Razorpay sends data in the request body
    const { payload } = req.body;
    
    // Extract data required for verification and processing
    const orderId = payload.payment.entity.order_id;
    const paymentId = payload.payment.entity.id;
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
        // This should not happen if Razorpay is configured correctly
        return res.status(400).send('Webhook signature missing.'); 
    }

    try {
        // Service handles signature verification and atomic DB updates
        const updatedBooking = await bookingService.handlePaymentSuccess(
            orderId, 
            paymentId, 
            signature
        );

        // Success response must be 200 OK for Razorpay to stop resending
        res.status(200).send('Webhook processed successfully.'); 

    } catch (error) {
        console.error('Razorpay Webhook Error:', error.message);
        // Log the error but still return 200 to Razorpay, 
        // preventing infinite resends and allowing manual investigation.
        res.status(200).send(`Error processing webhook: ${error.message}`); 
    }
});

// @desc    Ticket verification endpoint (for scanners/event staff)
// @route   GET /verification/bookId/:qrCodeKey
// @access  Public (Note: In production, this should have a dedicated auth layer for staff)
export const verifyTicket = asyncHandler(async (req, res) => {
    const { qrCodeKey } = req.params;

    if (!qrCodeKey) {
        res.status(400);
        throw new Error('QR code key is missing from the verification request.');
    }

    // Service performs existence, payment, and double-scan checks
    const result = await bookingService.validateTicket(qrCodeKey);

    if (result.valid) {
        // Send a successful, visually distinct response for the scanner app
        res.status(200).json({
            status: 'success',
            message: result.message,
            event: result.booking.title,
            count: result.booking.ticketCount
        });
    } else {
        // Send a failure response for the scanner app
        res.status(401).json({
            status: 'failure',
            message: result.message
        });
    }
});

// @desc    Get booking history for the logged-in user
// @route   GET /api/v1/bookings/my-tickets
// @access  Protected
export const getMyBookings = asyncHandler(async (req, res) => {
    // Placeholder logic for fetching user-specific bookings
    const bookings = await bookingService.fetchUserBookings(req.user._id);

    res.status(200).json(bookings);
});
