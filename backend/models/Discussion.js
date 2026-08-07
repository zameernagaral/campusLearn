const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionPost', required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DiscussionPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    tags: [{ type: String }],
    attachments: [{ name: String, url: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    type: { type: String, enum: ['question', 'discussion', 'announcement', 'doubt'], default: 'discussion' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

DiscussionPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Comment = mongoose.model('Comment', CommentSchema);
const DiscussionPost = mongoose.model('DiscussionPost', DiscussionPostSchema);

module.exports = { DiscussionPost, Comment };
