const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // null = global
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'faculty', 'department', 'course'],
      default: 'all',
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    attachments: [{ name: String, url: String }],
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
