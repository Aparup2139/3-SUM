
import mongoose from "mongoose";
import Review from "../models/Review.js";
import User from "../models/User.js";
// Get all reviews
export const getReviewsByEventId = async (req, res) => {
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(404).json({ message: "Invalid event ID" });
    }

    try {
        console.log("eventId:", eventId);

        // Fetch all reviews for this event, with user details
        const reviews = await Review.find({ event: eventId })
            .populate("user", "fullName profileImage") // only fetch needed fields
            .sort({ createdAt: -1 }); // optional: newest first

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this event" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: error.message });
    }
};


// Populate dummy reviews
export const populateReviews = async (req, res) => {
    try {
        const sampleReviews = [
            {
                user: "6906e2fdca8aa2a570e6d138",
                event: "6906af95a34a1f58b49d5a4b",
                rating: 5,
                comment: "Absolutely amazing event! The organization and vibe were top-notch.",
                sentiment: "Positive",
                createdAt: new Date("2025-11-02T08:30:00.000Z"),
            },
            {
                user: "6906e2fdca8aa2a570e6d138",
                event: "6906af95a34a1f58b49d5a4b",
                rating: 2,
                comment: "The event started late and was poorly managed. Could be better next time.",
                sentiment: "Negative",
                createdAt: new Date("2025-11-02T09:00:00.000Z"),
            },
        ];

        // Insert into DB
        await Review.insertMany(sampleReviews);

        res.status(201).json({ message: "Dummy reviews added successfully" });
    } catch (error) {
        console.error("Error populating reviews:", error);
        res.status(500).json({ message: error.message });
    }
};
