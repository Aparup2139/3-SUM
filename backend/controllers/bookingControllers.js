import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import * as bookingService from '../services/bookingService.js'; // Import service layer logic
import { generateQrCodeUrl } from '../services/qrService.js';

// --- 1. Book Ticket (New Simplified Flow) ---
// @desc    Create a booking record, save to DB, and generate QR code immediately
// @route   POST /api/v1/bookings/book-ticket/:id
// @access  Protected
export const bookTicket = asyncHandler(async (req, res) => {
    const user = req.user._id || req.user.id;
    // We expect the event ID in the URL parameter
    const event = req.params.id; 
    
    if(!event){
        res.status(400);
        throw new Error('Event ID is required in the URL parameters.');
    }
    if(!user){
        res.status(400);
        throw new Error('User authentication required.');
    }
    
    // Destructure required fields: tickets array and total amount
    const { tickets, totalAmount } = req.body; 

    // Validate incoming data
    
    if (!Array.isArray(tickets) || tickets.length === 0 || !totalAmount || tickets.length > 5) {
        res.status(400);
        throw new Error('Missing required booking details (tickets array or total amount).');
    }
    

    console.log("will initiate payment order for booking")
    // Call the service function to handle DB save and QR code generation
    const bookingResult = await bookingService.initiatePaymentOrder(
        user, event, tickets, totalAmount
    );


    console.log("lavrandi")
    // Respond with the final booking details, including the generated QR Code URL
    res.status(201).json({
        message: 'Ticket booked and QR code generated successfully.',
        bookingId: bookingResult._id,
        qrCodeUrl: bookingResult.qrCodeUrl, // This URL comes back from the service
        qrCodeKey: bookingResult.qrCodeKey,
        totalAmount: bookingResult.totalAmount
    });
});

// --- 2. (REMOVED: handleWebhook is removed as Razorpay is no longer used) ---

// --- 3. Get User Bookings ---
// @desc    Get booking history for the logged-in user
// @route   GET /api/v1/bookings/my-tickets
// @access  Protected
export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.fetchUserBookings(req.user._id);
    res.status(200).json(bookings);
});


// --- 4. Ticket Verification (Used by server.js route) ---
// @desc    Ticket verification endpoint
// @route   GET /verification/bookId/:qrCodeKey
// @access  Public
export const verifyTicket = asyncHandler(async (req, res) => {
    const { qrCodeKey } = req.params;
    const result = await bookingService.validateTicket(qrCodeKey);

    if (result.valid) {
        // Assuming title is available on the booking document or populated event
        res.status(200).json({ status: 'success', message: result.message, event: result.booking.event?.title || 'Event Verified' }); 
    } else {
        res.status(401).json({ status: 'failure', message: result.message });
    }
});


// --- 5. Get QR Code URL ---
// @desc    Get the QR Code URL for a specific booking
// @route   GET /api/v1/bookings/qr/:bookingId
// @access  Protected (User can only see their own QR code)
export const getQrCode = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    // req.user._id is populated by the 'protect' middleware applied to this route
    const userId = req.user._id;

    // We only need user and qrCodeKey fields now, as payment status is implied
    const booking = await Booking.findById(bookingId).select('user qrCodeKey totalAmount');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found.');
    }

    // Security check: Ensure the user owns this booking
    if (booking.user.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this ticket.');
    }

    // Check if QR code key exists (implies success)
    if (!booking.qrCodeKey) {
        res.status(400);
        throw new Error('QR Code has not been generated for this booking.');
    }

    // Use the service to generate the external image URL
    const qrCodeImageURL = generateQrCodeUrl(booking.qrCodeKey);

    res.status(200).json({
        message: 'QR Code URL generated successfully.',
        qrCodeUrl: qrCodeImageURL,
        qrCodeKey: booking.qrCodeKey,
        totalAmount: booking.totalAmount
    });
});
