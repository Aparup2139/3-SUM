// src/middlewares/authMiddleware.js
// Assumes token-based authentication (JWT or Session)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    console.log("cookies:", req.cookies.token)
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token provided" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decoded);
        req.user = decoded;
        console.log("req.user set to:", req.user);
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

export const adminCheck = async (req, res, next) => {
    try {
        console.log("req.user in adminCheck:", req.user);
        const user = await User.findById(req.user.id);
        console.log("user role:", user.role);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403);
            throw new Error('Not authorized as an admin');
        }
    } catch (error) {
        res.status(401).json({ msg: "Not authorized" });
    }
}

// Middleware to check for maximum ticket count (used in booking route)
export const validateTicketCount = (req, res, next) => {
    const { ticketCount } = req.body;
    if (ticketCount > 5) {
        return res.status(400).json({ message: 'Fraud Prevention: Maximum 5 tickets per user per event.' });
    }
    next();
};