const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ─── Cloudinary Storage Configs ───────────────────────────────────────────────

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campuslearn/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  },
});

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campuslearn/documents',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xlsx', 'zip'],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campuslearn/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

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

module.exports = { uploadVideo, uploadDocument, uploadImage, uploadAny };
