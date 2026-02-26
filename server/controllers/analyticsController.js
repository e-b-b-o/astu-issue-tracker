import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

// @route   GET /api/analytics
// @access  Private (Admin/Staff)
export const getAnalytics = async (req, res) => {
  try {
    const [total, open, inProgress, resolved, byCategory, recentComplaints] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Open' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Complaint.find({})
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status category createdAt'),
    ]);

    const userCount = await User.countDocuments();

    res.json({
      total,
      open,
      inProgress,
      resolved,
      byCategory,
      recentComplaints,
      userCount,
    });
  } catch (error) {
    console.error('[Analytics] Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
