import express from "express";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getUserupcomingevents,
  geteventhostedbyuser,
  getEventDetailsById,
  getUserEvents,
} from "../controllers/eventControllers.js";
import { protect, adminCheck } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get('/', getAllEvents);
router.post('/create', protect, adminCheck, createEvent);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);
router.get('/user', protect, getUserEvents);
router.get('/organizer',protect, geteventhostedbyuser);

router.get('/:id', getEventDetailsById);
router.get('/upcoming/user/:userId', getUserupcomingevents);

export default router;
