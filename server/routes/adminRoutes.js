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

const router = express.Router();

// All admin routes require protect + admin
router.use(protect, admin);

router.post('/ingest', upload.single('document'), ingestDocument);
router.get('/documents', getDocuments);
router.post('/reset-rag', resetRag);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

export default router;
