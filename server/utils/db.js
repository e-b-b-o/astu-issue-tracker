import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error(`💡 Tip: Check if your current IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/`);
    process.exit(1);
  }
};

export default connectDB;
