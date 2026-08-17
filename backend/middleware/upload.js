const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/videos', 'uploads/documents', 'uploads/images'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Check if Cloudinary is configured
const hasCloudinary = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key';

let videoStorage, documentStorage, imageStorage;

if (hasCloudinary) {
  videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'campuslearn/videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    },
  });

  documentStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'campuslearn/documents',
      resource_type: 'raw',
      allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'zip'],
    },
  });

  imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'campuslearn/images',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    },
  });
} else {
  // Local disk storage fallback
  const createLocalConfig = (subfolder) => multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${subfolder}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  videoStorage = createLocalConfig('videos');
  documentStorage = createLocalConfig('documents');
  imageStorage = createLocalConfig('images');
}

// ─── File Size Limits ─────────────────────────────────────────────────────────
const FILE_LIMITS = {
  video: 500 * 1024 * 1024,      // 500 MB
  document: 50 * 1024 * 1024,    // 50 MB
  image: 10 * 1024 * 1024,       // 10 MB
};

// ─── Multer Instances ─────────────────────────────────────────────────────────
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: FILE_LIMITS.video },
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: FILE_LIMITS.document },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: FILE_LIMITS.image },
});

const uploadAny = multer({
  storage: documentStorage,
  limits: { fileSize: FILE_LIMITS.document },
});

// Middleware wrapper to format local paths to be accessible via URL
const formatLocalPath = (req, res, next) => {
  if (!hasCloudinary) {
    const formatPath = (filePath) => `${process.env.API_URL || 'http://localhost:5001'}/${filePath.replace(/\\/g, '/')}`;

    if (req.file) {
      req.file.path = formatPath(req.file.path);
    }
    
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach(file => { file.path = formatPath(file.path); });
      } else {
        Object.keys(req.files).forEach(key => {
          req.files[key].forEach(file => { file.path = formatPath(file.path); });
        });
      }
    }
  }
  next();
};

const addFormatMiddleware = (uploadInstance) => {
  return {
    single: (name) => [uploadInstance.single(name), formatLocalPath],
    array: (name, maxCount) => [uploadInstance.array(name, maxCount), formatLocalPath],
    fields: (fields) => [uploadInstance.fields(fields), formatLocalPath],
    any: () => [uploadInstance.any(), formatLocalPath]
  };
};

module.exports = { 
  uploadVideo: addFormatMiddleware(uploadVideo),
  uploadDocument: addFormatMiddleware(uploadDocument),
  uploadImage: addFormatMiddleware(uploadImage),
  uploadAny: addFormatMiddleware(uploadAny),
};
