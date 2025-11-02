import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import asyncHandler from 'express-async-handler'; // Recommended for handling async errors

// --- 1. GET Events with Filters ---
const getAllEvents = asyncHandler(async (req, res) => {
    const { city, category, userQuery: titleQuery } = req.query;
    let filter = {};
    if (city) {
        filter.city = { $regex: city, $options: 'i' };
    }
    if (category) {
        filter.category = { $regex: category, $options: 'i' };
    }
    if (titleQuery) {
        filter.title = { $regex: titleQuery, $options: 'i' };
    }

    const events = await Event.find(filter)

    if (events.length === 0) {
        return res.status(404).json({ message: "No events found matching your criteria." });
    }

    res.status(200).json({
        count: events.length,
        events,
        message: "Events fetched successfully with applied filters."
    });
});

// --- 2. POST Create Event (Logic restored from previous prompt) ---
const createEvent = asyncHandler(async (req, res) => {
    // Note: You must ensure req.user is available via 'protect' middleware
    const organizer = req.user._id || req.user.id;
    const { title, description, bannerImg, startDate, endDate, venue, city, category, totalTickets, basePrice, priceMin, priceMax } = req.body;


    console.log("req.body:", req.body);
    // Basic validation
    if (!title || !description || !bannerImg || !organizer || !startDate || !endDate || !totalTickets || !basePrice || !priceMin || !priceMax) {
        res.status(400);
        throw new Error("Please provide all required fields.");
    }

    const newEvent = new Event({
        title,
        description,
        eventImageUrl: banneri,
        organizer,
        start_date: startDate,
        end_date: endDate,
        venue,
        city,
        category,
        totalTickets,
        basePrice,
        priceMin,
        priceMax,
        currentPrice: basePrice, // Initialize current price to base price
        isPublished: false // Default to false until organizer manually publishes
    });

    await newEvent.save();
    res.status(201).json({ newEvent, msg: "Event created successfully" });
});

// --- 3. PUT Update Event (Logic restored from previous prompt) ---
const updateEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true, runValidators: true });

    if (!updatedEvent) {
        res.status(404);
        throw new Error("Event not found");
    }
    res.status(200).json({ updatedEvent, msg: "Event updated successfully" });
});

// --- 4. DELETE Event (Logic restored from previous prompt) ---
const deleteEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
        res.status(404);
        throw new Error("Event not found");
    }
    res.status(200).json({ msg: "Event deleted successfully" });
});

// --- 5. GET Event Details by ID (Logic restored from previous prompt) ---
const getEventDetailsById = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    console.log("eventId:", eventId);
    const event = await Event.findById(eventId);

    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }
    res.status(200).json(event);
});

// --- 6. GET Past Events by User ID (Logic restored from previous prompt) ---
const getUserEvents = asyncHandler(async (req, res) => {
    const userId = req.user._id || req.user.id;
    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    console.log("userId:", userId);

    const userEvents = await Booking.find({
        user: userId,
    }).populate("event");
    res.status(200).json({ userEvents, msg: "all events fetched successfully" });
});

// --- 7. GET Upcoming Events by User ID (Logic restored from previous prompt) ---
const getUserupcomingevents = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    const currentDate = new Date();
    const upcomingEvents = await Event.find({
        organizer: userId,
        date: { $gte: currentDate }
    }).sort({ date: 1 }); // Sort by nearest upcoming event

    res.status(200).json({ upcomingEvents, msg: "Upcoming events fetched successfully" });
});

// --- 8. GET All Events Hosted by User (Logic restored from previous prompt) ---
const geteventhostedbyuser = asyncHandler(async (req, res) => {
    const userId = req.user._id || req.user.id;
    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }
    console.log("userId:", userId);
    const hostedEvents = await Event.find({ organizer: userId })

    res.status(200).json({ hostedEvents, msg: "Events hosted by user fetched successfully" });
});


// --- Final Export ---
export {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventDetailsById,
    getUserEvents,
    getUserupcomingevents,
    geteventhostedbyuser
};