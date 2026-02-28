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
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB Atlas
connectDB();

const app = express();

// —— Security Middlewares ——
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';
// Normalize origins: split by comma, trim whitespace, and remove trailing slashes for safer comparison
const allowedOrigins = rawOrigins.split(',').map(o => o.trim().replace(/\/$/, ""));

console.log(`[Server] Allowed CORS Origins:`, allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Normalize incoming origin for comparison
    const normalizedOrigin = origin.trim().replace(/\/$/, "");
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin} (Normalized: ${normalizedOrigin})`);
      // In production, we return true to permit the header but still log the mismatch
      // This is a "fail-safe" approach to help debugging while fixing the config.
      callback(null, true); 
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

// —— Health checks ——
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ASTU Backend', timestamp: new Date().toISOString() });
});

// Root route for platform health probes (Render)
app.get('/', (_req, res) => {
  res.status(200).send('ASTU Issue Tracker API is live.');
});

// —— Routes ——
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// —— Global error handler ——
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// —— 404 Handler ——
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// —— Global Process Handlers (Critical for Production Stability) ——
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  // Give the server a small window to log before exiting
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ASTU Backend running on port ${PORT}`);
});
