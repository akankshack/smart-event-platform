const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Determine if we should use Cloudinary storage or fallback to local memory storage (useful if credentials are unset)
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

const uploadStorage = isCloudinaryConfigured 
  ? storage 
  : multer.memoryStorage();

const upload = multer({ 
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
