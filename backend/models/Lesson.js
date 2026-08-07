const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['video', 'document', 'quiz', 'text', 'live'], default: 'video' },

    // Video lesson
    videoUrl: { type: String },
    videoPublicId: { type: String },
    duration: { type: Number, default: 0 }, // seconds
    thumbnail: { type: String },

    // Document lesson
    documentUrl: { type: String },
    documentPublicId: { type: String },
    documentName: { type: String },

    // Text lesson
    content: { type: String },

    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: false },

    // Tracking
    views: { type: Number, default: 0 },
    completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', LessonSchema);
