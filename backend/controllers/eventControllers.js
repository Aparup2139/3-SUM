import Event from "../models/Event.js";

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const createEvent = async (req, res) => {
    try {
        console.log("user",req.user);
const organizer = req.user._id || req.user.id;
       console.log(req.body);
        const { title, description, date, venue,city, category, totalTickets, basePrice, priceMin, priceMax } = req.body;
        if(!organizer){
            console.log("Organizer missing",organizer);
            return res.status(400).json({message:"Organizer information is missing"});
        }
        if(!title || !description || !organizer || !date || !totalTickets || !basePrice || !priceMin || !priceMax){
            return res.status(400).json({message:"Please provide all required fieldsmjbjkhjhjbjhvhjb"});
        }
        const newEvent = new Event({
            title,
            description,    
            organizer,
            date,
            venue,
            city,
            category,
            totalTickets,
            basePrice,
            priceMin,
            priceMax,
            currentPrice: basePrice
        });
        await newEvent.save();
        res.status(201).json({newEvent,msg:"Event created successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }   
};

const updateEvent = async (req, res) => {
   const eventId= req.params.id;
   const updates = req.body;
   try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {new:true});
    if(!updatedEvent){
        return res.status(404).json({message:"Event not found"});
    }
    res.status(200).json({updatedEvent,msg:"Event updated successfully"});
   } catch (error) {
    res.status(500).json({ message: "Server Error", error });
   }
};

const deleteEvent = async (req, res) => {
   const eventId= req.params.id;
   try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if(!deletedEvent){
        return res.status(404).json({message:"Event not found"});
    }
    res.status(200).json({msg:"Event deleted successfully"});
   } catch (error) {
    res.status(500).json({ message: "Server Error", error });
   }
};
const getEventDetailsById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }   
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const getUserpastevents = async (req, res) => {
   const userId = req.params.userId;
   if(!userId){
    return res.status(400).json({message:"User ID is required"});
   }
    try {
        const currentDate = new Date();
        const pastEvents = await Event.find({
            organizer: userId,
            date: { $lt: currentDate }
        });
        res.status(200).json({pastEvents,msg:"Past events fetched successfully"});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
const getUserupcomingevents = async (req, res) => {
    const userId = req.params.userId;
    if(!userId){
     return res.status(400).json({message:"User ID is required"});
    }
        try {
            const currentDate = new Date();
            const upcomingEvents = await Event.find({
                organizer: userId,
                date: { $gte: currentDate }
            });
            res.status(200).json({upcomingEvents,msg:"Upcoming events fetched successfully"});
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }   
};

const geteventhostedbyuser = async (req, res) => {
    const userId = req.params.userId;   
    if(!userId){
     return res.status(400).json({message:"User ID is required"});
    }
        try {
            const hostedEvents = await Event.find({
                organizer: userId
            });
            res.status(200).json({hostedEvents,msg:"Events hosted by user fetched successfully"});
        } catch (error) {
            res.status(500).json({ message: "Server Error", error });
        }   
};




export { getAllEvents, createEvent, updateEvent, deleteEvent, getEventDetailsById, getUserpastevents, getUserupcomingevents, geteventhostedbyuser }; 