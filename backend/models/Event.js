import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'default-event.png' // Default image path/URL
    },
    eventImageUrl: {
        type: String,
        required: true,
        default: 'default-event.png' // Default image path/URL
    },
    description: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    venue: {
        type: String
    },
    city: {
        type: String,
        // Added index for efficient filtering by city
        index: true
    },
    category: {
        type: String, // e.g., 'Tech', 'Music', 'Arts'
        // Added index for efficient filtering by category
        index: true
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
        required: true
    },
    // CRUCIAL: Only show published events publicly
    isPublished: {
        type: Boolean,
        default: true,
        index: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Event', EventSchema);