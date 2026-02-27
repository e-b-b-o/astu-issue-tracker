import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './utils/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB Atlas
connectDB();

const app = express();

// —— Security Middlewares ——
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // If no origin (like mobile apps/curl), or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
      callback(null, false); // Block but don't crash
    }
  },
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", ...allowedOrigins],
    },
  },
}));

// —— Body parsing ——
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// —— Global rate limiter (100 req / 15 min) ——
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// —— Static uploads ——
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// —— Health check ——
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ASTU Backend', timestamp: new Date().toISOString() });
});

// —— Routes ——
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// —— 404 Handler ——
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// —— Global error handler ——
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ ASTU Backend running on port ${PORT}`);
});
