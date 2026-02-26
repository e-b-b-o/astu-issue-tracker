import Complaint from '../models/Complaint.js';

// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    let attachments = [];
    if (req.file) {
      attachments.push({
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      createdBy: req.user._id,
      attachments,
    });

    const populated = await Complaint.findById(complaint._id).populate('createdBy', 'username email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('[Complaint] Create error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      complaints = await Complaint.find({})
        .populate('createdBy', 'username email')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ createdBy: req.user._id })
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    console.error('[Complaint] Get list error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .populate('remarks.addedBy', 'username role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Students can only view their own complaints
    if (
      req.user.role === 'student' &&
      complaint.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('[Complaint] Get by id error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/complaints/:id/status
// @access  Private (Admin/Staff)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Open', 'In Progress', 'Resolved'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    console.error('[Complaint] Update status error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
export const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = assignedTo;
    const updated = await complaint.save();
    res.json(updated);
  } catch (error) {
    console.error('[Complaint] Assign error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/complaints/:id/remarks
// @access  Private
export const addRemark = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Remark text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (
      req.user.role === 'student' &&
      complaint.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to add remarks to this complaint' });
    }

    complaint.remarks.push({ text, addedBy: req.user._id });
    await complaint.save();

    const populated = await Complaint.findById(complaint._id).populate(
      'remarks.addedBy',
      'username role'
    );
    res.status(201).json(populated.remarks);
  } catch (error) {
    console.error('[Complaint] Add remark error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
