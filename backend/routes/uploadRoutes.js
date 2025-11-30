const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Upload file (protected route)
router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  uploadController.uploadFile
);

module.exports = router;