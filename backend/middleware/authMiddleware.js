// src/middlewares/authMiddleware.js
// Assumes token-based authentication (JWT or Session)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                console.error('User not found for the provided token');
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
               
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('No token provided in request headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
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