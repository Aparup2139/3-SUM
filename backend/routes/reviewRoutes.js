import express from 'express';

import { getReviewsByEventId } from '../controllers/reviewControllers.js';
const router = express.Router();

router.get('/event/:eventId', getReviewsByEventId);
export default router;