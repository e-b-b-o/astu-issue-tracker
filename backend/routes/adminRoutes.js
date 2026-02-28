import express from 'express';
import {
  ingestDocument,
  getDocuments,
  resetRag,
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import uploadPDF from '../middlewares/pdfUploadMiddleware.js';

const router = express.Router();

// All admin routes require protect + admin
router.use(protect, admin);

router.post('/ingest', (req, res, next) => {
  uploadPDF.single('document')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, ingestDocument);
router.get('/documents', getDocuments);
router.post('/reset-rag', resetRag);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.patch('/update-role/:userId', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

export default router;
