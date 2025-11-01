import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    // AI-driven Sentiment Analysis result (Gemini Flash)
    sentiment: {
        type: String,
        enum: ['Positive', 'Negative', 'Neutral', 'Unanalyzed'],
        default: 'Unanalyzed' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Review', ReviewSchema);