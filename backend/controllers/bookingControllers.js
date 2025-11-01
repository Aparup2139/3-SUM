// src/controllers/bookingController.js (Add this to existing file)
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import { generateQrCodeUrl } from '../services/qrService.js'; // New import

<<<<<<< HEAD
// ... (previous controller exports: createOrder, handleWebhook, verifyTicket, getMyBookings)

// @desc    Get the QR Code URL for a specific booking
// @route   GET /api/v1/bookings/qr/:bookingId
// @access  Protected (User can only see their own QR code)
export const getQrCode = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

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
=======
// @desc    Initiate Razorpay order creation
// @route   POST /api/v1/bookings/create-order
// @access  Protected
export const createOrder = asyncHandler(async (req, res) => {
    // req.user is populated by 'protect' middleware
    const user= req.user._id||req.user.id; 
    const { event, ticketCount, totalAmount} = req.body;

    // Note: Validation (max 5 tickets) is handled by middleware, but a final check here is good practice.
    if (!event || !ticketCount || !totalAmount) {
        res.status(400);
        throw new Error('Missing required booking details (eventId, ticketCount, totalAmount).');
    }

    // Service handles communication with Razorpay and preliminary booking storage
    const result = await bookingService.initiatePaymentOrder(
        user, 
        event, 
        ticketCount, 
        totalAmount
    );
>>>>>>> 8d62ba24a2072fe9392eb8ba22b7838187eaa290

    res.status(200).json({
        message: 'QR Code URL generated successfully.',
        qrCodeUrl: qrCodeImageURL,
        qrCodeKey: booking.qrCodeKey // Optional: for debugging/verification
    });
});