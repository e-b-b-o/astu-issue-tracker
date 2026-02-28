import multer from 'multer';

// Use memory storage to avoid files on disk, as requested
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    // Return a structured error that won't cause a 500 crash
    const error = new Error('Only PDF files are allowed');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

const uploadPDF = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

export default uploadPDF;
