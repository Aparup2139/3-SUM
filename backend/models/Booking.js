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
    // --- UPDATED: 'ticketCount' replaced by 'tickets' array ---
    tickets: [{
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 120 // Set a reasonable upper limit
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'] // Enforce specific values
        }
    }],
    // The previous 'ticketCount' is now implied by tickets.length
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
     //  required: true // Razorpay transaction ID
    },
    razorpayStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    // Unique key for the QR code verification URL
    qrCodeKey: {
        type: String,
     //  required: true,
        unique: true
    },
    qrCodeUrl: {
        type: String,
     //  required: true,
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

// Custom validation to ensure the ticket array size is within the allowed limits (1 to 5)
BookingSchema.path('tickets').validate(function(value) {
    // This enforces a minimum of 1 ticket and a maximum of 5 tickets
    return Array.isArray(value) && value.length > 0 && value.length <= 5; 
}, 'A booking must include between 1 and 5 tickets.');


export default mongoose.model('Booking', BookingSchema);
