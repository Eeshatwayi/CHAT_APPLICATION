const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and common file types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images and documents allowed.`));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;