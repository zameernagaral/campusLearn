const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isPublished: { type: Boolean, default: false },
    duration: { type: Number, default: 0 }, // minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Module', ModuleSchema);
