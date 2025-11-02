// src/middlewares/authMiddleware.js
// Assumes token-based authentication (JWT or Session)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
   const token=req.cookies.token;
 if(!token) return res.status(401).json({ msg: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY);
      req.user = decoded; 
   
      next();
    } 
    catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
};

export const adminCheck = (req, res, next) => {
    // Uses the custom method added to the User model
    if (req.user && req.user.isAdmin()) {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// Middleware to check for maximum ticket count (used in booking route)
export const validateTicketCount = (req, res, next) => {
    const { ticketCount } = req.body;
    if (ticketCount > 5) {
        return res.status(400).json({ message: 'Fraud Prevention: Maximum 5 tickets per user per event.' });
    }
    next();
};