import User from '../models/User.js';
import Document from '../models/Document.js';
import Complaint from '../models/Complaint.js';
import fs from 'fs';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

// Splits text into ~1000-char chunks with some overlap
const chunkText = (text, size = 1000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

import { PDFParse } from 'pdf-parse';

// @route   POST /api/admin/ingest
// @access  Private (Admin)
export const ingestDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let textToIngest = '';
  const isPdf = req.file.mimetype === 'application/pdf';

  try {
    if (isPdf) {
      try {
        // pdf-parse v2.4.5 uses a class-based API
        const pdfParser = new PDFParse({ data: req.file.buffer });
        const data = await pdfParser.getText();
        textToIngest = data.text;
        
        // Cleanup resources
        await pdfParser.destroy();
      } catch (pdfError) {
        console.error('[Admin] PDF Parse failure:', pdfError.message);
        return res.status(400).json({ 
          message: 'Failed to parse PDF content. The file might be corrupted or in an unsupported format.',
          error: pdfError.message 
        });
      }
    } else {
      textToIngest = req.file.buffer.toString('utf-8');
    }

    if (!textToIngest || textToIngest.trim().length === 0) {
      return res.status(400).json({ message: 'No readable text found in document' });
    }

    const docRecord = await Document.create({
      originalName: req.file.originalname,
      type: 'file',
      uploadedBy: req.user._id,
      status: 'pending',
      fileData: req.file.buffer.toString('base64'),
      fileSize: req.file.size,
    });

    const chunks = chunkText(textToIngest, 1000);

    // Send each chunk to Flask /ingest
    const ingestPromises = chunks.map((chunk, idx) =>
      fetch(`${RAG_SERVICE_URL}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: chunk,
          source: req.file.originalname,
          chunk_index: idx,
        }),
      })
    );

    const results = await Promise.allSettled(ingestPromises);
    const failed = results.filter((r) => r.status === 'rejected').length;

    docRecord.chunkCount = chunks.length - failed;
    docRecord.status = failed === 0 ? 'ingested' : 'failed';
    await docRecord.save();

    res.json({
      message: `Ingested ${docRecord.chunkCount} of ${chunks.length} chunks`,
      document: docRecord,
    });
  } catch (error) {
    console.error('[Admin] Ingest error:', error.message);
    // Ensure we don't crash and return a clean response
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error during ingestion: ' + error.message });
    }
  }
};



// @route   GET /api/admin/documents
// @access  Private (Admin)
export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({})
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/admin/reset-rag
// @access  Private (Admin)
export const resetRag = async (req, res) => {
  try {
    const response = await fetch(`${RAG_SERVICE_URL}/reset`, { method: 'POST' });
    if (!response.ok) {
      return res.status(500).json({ message: 'Failed to reset RAG vector store' });
    }
    await Document.deleteMany({});
    res.json({ message: 'RAG vector store and document records reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['student', 'staff', 'admin'];

    if (!allowed.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${allowed.join(', ')}` });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    const [total, open, inProgress, resolved, byCategory, userCount] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Open' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.countDocuments(),
    ]);

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const topCategory = byCategory.length > 0 ? byCategory[0]._id : 'N/A';

    res.json({ total, open, inProgress, resolved, byCategory, userCount, resolutionRate, topCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
