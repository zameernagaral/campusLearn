const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    content: { type: String }, // text submission
    files: [{ name: String, url: String, publicId: String }],
    submittedAt: { type: Date, default: Date.now },
    isLate: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned', 'resubmit'],
      default: 'submitted',
    },
    marks: { type: Number },
    feedback: { type: String },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
  },
  { timestamps: true }
);

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
