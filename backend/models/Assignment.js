const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    attachments: [{ name: String, url: String, publicId: String }],
    isPublished: { type: Boolean, default: false },
    allowLateSubmission: { type: Boolean, default: false },
    latePenalty: { type: Number, default: 0 }, // percentage deduction per day
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
