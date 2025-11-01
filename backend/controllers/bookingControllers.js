// src/controllers/bookingController.js (Add this to existing file)
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import { generateQrCodeUrl } from '../services/qrService.js'; // New import

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

    res.status(200).json({
        message: 'QR Code URL generated successfully.',
        qrCodeUrl: qrCodeImageURL,
        qrCodeKey: booking.qrCodeKey // Optional: for debugging/verification
    });
});