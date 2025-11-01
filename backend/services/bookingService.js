// src/services/bookingService.js
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';

// --- Ticket Validation Logic ---
export const validateTicket = async (qrCodeKey) => {
    const booking = await Booking.findOne({ qrCodeKey }).populate('event', 'title');

    if (!booking) {
        return { valid: false, message: 'Ticket Not Found.' };
    }
    if (booking.razorpayStatus !== 'success') {
        return { valid: false, message: 'Payment incomplete for this ticket.' };
    }
    if (booking.isScanned) {
        return { valid: false, message: `Ticket already used at: ${booking.scannedAt.toISOString()}. Reuse prevented.` };
    }

    // Success: Mark as used and prevent reuse
    booking.isScanned = true;
    booking.scannedAt = new Date();
    await booking.save();
    
    return { 
        valid: true, 
        message: 'Entry Granted. Ticket Verified.', 
        booking: {
            title: booking.event.title,
            ticketCount: booking.ticketCount,
            userEmail: booking.user.email // Assuming user reference is populated or accessible
        } 
    };
};

// --- Payment & Order Initiation ---
export const initiatePaymentOrder = async (userId, eventId, ticketCount, totalAmount) => {
    const options = {
        amount: totalAmount * 100, // Razorpay uses smallest currency unit (paise)
        currency: 'INR',
        receipt: `receipt_event_${eventId}_user_${userId}`,
        payment_capture: 1 // Auto-capture payment
    };

    console.log("Creating Razorpay order with options:", options);
    const order = await razorpayInstance.orders.create(options);

    console.log("Razorpay order created:", order);
    
    // Store preliminary booking record
    const preliminaryBooking = await Booking.create({
        user: userId,
        event: eventId,
        tickets: ticketCount, 
        totalAmount: totalAmount,
        paymentId: order.id, // Store Razorpay Order ID
        razorpayStatus: 'pending',
        // qrCodeKey is generated later upon payment success confirmation
        qrCodeKey: crypto.randomBytes(16).toString('hex') 
    });

    return { orderId: order.id, preliminaryBookingId: preliminaryBooking._id };
};

// --- Webhook Success Handling (Crucial for atomic commit) ---
export const handlePaymentSuccess = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Signature Verification (Security)
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        throw new Error('Payment Signature Verification Failed');
    }

    // 2. Update Booking and Event (Atomic Update)
    const booking = await Booking.findOne({ paymentId: razorpay_order_id });

    if (!booking) {
        throw new Error('Booking not found for Razorpay Order ID');
    }

    if (booking.razorpayStatus === 'success') {
        return booking; // Already processed
    }
    
    // Perform update operations in a transaction for safety (MongoDB transaction not shown for brevity)
    booking.razorpayStatus = 'success';
    booking.paymentId = razorpay_payment_id; // Store payment ID
    await booking.save();
    
    // Increment tickets sold count on the event
    await Event.findByIdAndUpdate(booking.event, { $inc: { ticketsSold: booking.tickets.length } });

    // In a real app, here you would also trigger an email/notification service 
    // to send the QR code ticket URL to the user.

    return booking;
};