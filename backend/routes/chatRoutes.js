import express from 'express';
import rateLimit from 'express-rate-limit';
import { askQuestion, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

// Chat-specific rate limiter (20 req / 15 min)
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Chat rate limit exceeded, please wait before asking again.' },
});

const router = express.Router();

router.use(protect);

router.post('/ask', chatLimiter, askQuestion);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
