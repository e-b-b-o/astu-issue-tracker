/**
 * Seed Admin Script
 * 
 * Creates the first admin user in the database.
 * Usage: node seedAdmin.js
 * 
 * Requires MONGO_URI in server/.env
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@astu.edu.et';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`⚠️  User with email ${ADMIN_EMAIL} already exists (role: ${existing.role})`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ Promoted existing user to admin');
      } else {
        console.log('ℹ️  User is already an admin. No changes made.');
      }
    } else {
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`✅ Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
