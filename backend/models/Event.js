import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Reference to the User who created the event
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String
    },
    category: {
        type: String, // e.g., 'Tech', 'Music', 'Arts'
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 1
    },
    ticketsSold: {
        type: Number,
        default: 0
    },
    // Dynamic Pricing Fields
    basePrice: {
        type: Number,
        required: true
    },
    priceMin: {
        type: Number,
        required: true
    },
    priceMax: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true // Should be updated by a separate service/cron job
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Event', EventSchema);