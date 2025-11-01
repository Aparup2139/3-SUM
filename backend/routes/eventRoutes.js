import express from 'express';
import { getAllEvents, createEvent,updateEvent,deleteEvent,getUserpastevents,getUserupcomingevents,geteventhostedbyuser,getEventDetailsById } from '../controllers/eventControllers.js';
import {protect,adminCheck} from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', getAllEvents);
router.post('/create',protect,adminCheck, createEvent);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);
router.get('/:id', getEventDetailsById);
router.get('/user/:userId', getUserpastevents);
router.get('/upcoming/user/:userId', getUserupcomingevents);
router.get('/organizer/:userId', geteventhostedbyuser);

export default router;