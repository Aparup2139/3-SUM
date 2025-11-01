import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    // Reference to the user who booked
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference to the event booked
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticketCount: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Fraud Prevention: Max 5 tickets/user/event
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true // Razorpay transaction ID
    },
    razorpayStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    // Unique key for the QR code verification URL
    qrCodeKey: {
        type: String,
        required: true,
        unique: true
    },
    // Fraud Prevention: Prevents reuse after entry scan
    isScanned: {
        type: Boolean,
        default: false 
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Booking', BookingSchema);