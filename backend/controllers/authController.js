import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Generate 30-day JWT with role
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }

    // Force 'student' role for new registrations
    const user = await User.create({ username, email, password, role: 'student' });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('[Auth] Register error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  });
};

// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const safeMsg = 'If this email exists, you will receive your password.';
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return same message — don't leak existence
    if (!user) return res.json({ message: safeMsg });

    // Create transporter from env vars
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ASTU Tracker" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'ASTU Tracker — Your Password',
      text: `Hello ${user.username},\n\nYour password for the ASTU Issue Tracker is:\n\n${req.body.email}\n\nNote: For your security, please change your password after logging in.\n\nBest regards,\nASTU Tracker Team`,
      html: `<p>Hello <strong>${user.username}</strong>,</p>
             <p>You requested your password for the ASTU Issue Tracker.</p>
             <p>Please log in and change your password for security.</p>
             <p>Best regards,<br/>ASTU Tracker Team</p>`,
    });

    res.json({ message: safeMsg });
  } catch (error) {
    console.error('[Auth] Forgot password error:', error.message);
    // Still return safe message on failure to not reveal internal issues
    res.json({ message: safeMsg });
  }
};

