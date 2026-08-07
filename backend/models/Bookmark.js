const mongoose = require('mongoose');

// Bookmark individual lessons/resources
const BookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionPost' },
    type: { type: String, enum: ['lesson', 'course', 'post'], default: 'lesson' },
    note: { type: String },
  },
  { timestamps: true }
);

BookmarkSchema.index({ user: 1 });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
