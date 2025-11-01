import express from 'express';
import { getAllEvents, createEvent } from '../controllers/eventControllers.js';

const router = express.Router();
router.get('/', getAllEvents);
router.post('/create', createEvent);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);
router.get('/:id', getEventDetailsById);
router.get('/user/:userId', getUserpastevents);
router.get('/upcoming/user/:userId', getUserupcomingevents);
router.get('/organizer/:userId', geteventhostedbyuser);

export default router;