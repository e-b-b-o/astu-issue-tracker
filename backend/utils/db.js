import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for slow connections
      connectTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // In production, we don't necessarily want to kill the process immediately
    // unless the DB is absolutely required for the health check.
    // However, for ASTU, we'll keep the exit but with more info.
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('error', err => {
  console.error('🔥 MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

export default connectDB;
