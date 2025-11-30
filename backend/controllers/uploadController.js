const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Helper function to upload buffer to Cloudinary
// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'auto', originalFilename = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: resourceType
    };

    // For raw files, preserve the original filename WITH extension
    if (resourceType === 'raw' && originalFilename) {
      // Keep the full filename including extension
      uploadOptions.public_id = originalFilename;
      uploadOptions.use_filename = true;
      uploadOptions.unique_filename = false; // Changed to false to keep exact filename
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload successful');
          console.log('File URL:', result.secure_url);
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};
// Upload file
// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    console.log('📎 Uploading file:', file.originalname, 'Type:', file.mimetype, 'Size:', file.size);
    
    // Determine file type
    const isImage = file.mimetype.startsWith('image/');
    const fileType = isImage ? 'image' : 'file';
    
    // Determine resource type for Cloudinary
    let resourceType = 'auto';
    if (!isImage) {
      // For non-images, use 'raw' resource type
      resourceType = 'raw';
    }

    console.log('☁️ Uploading to Cloudinary with resource type:', resourceType);
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      file.buffer,
      'chat-uploads',
      resourceType,
      file.originalname
    );

    console.log('✅ Upload successful, URL:', result.secure_url);

    // For raw files, modify URL to force proper download
    let downloadUrl = result.secure_url;
    if (resourceType === 'raw') {
      // Add fl_attachment to force download with original filename
      const urlParts = downloadUrl.split('/upload/');
      if (urlParts.length === 2) {
        downloadUrl = `${urlParts[0]}/upload/fl_attachment:${encodeURIComponent(file.originalname)}/${urlParts[1]}`;
        console.log('📥 Download URL:', downloadUrl);
      }
    }

    res.json({
      message: 'File uploaded successfully',
      fileUrl: downloadUrl,
      fileType: fileType,
      fileName: file.originalname,
      fileSize: file.size
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message 
    });
  }
};
// Test Cloudinary connection
exports.testCloudinary = async (req, res) => {
  try {
    // Test with a simple text buffer
    const testBuffer = Buffer.from('Test file content');
    
    const result = await uploadToCloudinary(
      testBuffer,
      'chat-uploads',
      'raw'
    );

    res.json({
      message: 'Cloudinary test successful',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Cloudinary test failed:', error);
    res.status(500).json({
      message: 'Cloudinary test failed',
      error: error.message
    });
  }
};