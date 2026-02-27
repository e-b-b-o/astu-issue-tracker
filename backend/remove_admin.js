/**
 * Remove Admin Script
 * Usage: node remove_admin.js user@email.com
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address: node remove_admin.js user@email.com');
  process.exit(1);
}

async function removeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
    } else {
      user.role = 'student'; // Demote to student by default
      await user.save();
      console.log(`✅ User ${email} role reset to STUDENT.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

removeAdmin();
