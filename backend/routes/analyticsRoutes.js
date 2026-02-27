import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnalytics);

export default router;
