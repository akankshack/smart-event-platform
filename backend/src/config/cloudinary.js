const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'placeholder_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder_secret'
});

// Setup Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smart-event-platform',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = {
  cloudinary,
  storage
};
