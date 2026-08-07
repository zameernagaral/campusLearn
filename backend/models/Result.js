const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true },
    internalMarks: { type: Number, default: 0 },
    externalMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String },
    gradePoints: { type: Number },
    sgpa: { type: Number },
    cgpa: { type: Number },
    status: { type: String, enum: ['pass', 'fail', 'absent', 'withheld'], default: 'pass' },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
    remarks: { type: String },
  },
  { timestamps: true }
);

ResultSchema.index({ student: 1, semester: 1 });

// Auto-calculate grade based on percentage
ResultSchema.pre('save', function (next) {
  const percentage = (this.totalMarks / this.maxMarks) * 100;
  if (percentage >= 90) { this.grade = 'O'; this.gradePoints = 10; }
  else if (percentage >= 80) { this.grade = 'A+'; this.gradePoints = 9; }
  else if (percentage >= 70) { this.grade = 'A'; this.gradePoints = 8; }
  else if (percentage >= 60) { this.grade = 'B+'; this.gradePoints = 7; }
  else if (percentage >= 50) { this.grade = 'B'; this.gradePoints = 6; }
  else if (percentage >= 40) { this.grade = 'C'; this.gradePoints = 5; }
  else { this.grade = 'F'; this.gradePoints = 0; this.status = 'fail'; }
  next();
});

module.exports = mongoose.model('Result', ResultSchema);
