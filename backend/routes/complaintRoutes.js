import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addRemark,
} from '../controllers/complaintController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getComplaints).post(upload.single('attachment'), createComplaint);
router.route('/:id').get(getComplaintById);
router.route('/:id/status').put(updateComplaintStatus);
router.route('/:id/assign').put(assignComplaint);
router.route('/:id/remarks').post(addRemark);

export default router;
