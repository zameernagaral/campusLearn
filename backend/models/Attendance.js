const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'absent' },
  remarks: { type: String },
});

const AttendanceSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    topic: { type: String },
    records: [AttendanceRecordSchema],
    totalPresent: { type: Number, default: 0 },
    totalAbsent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AttendanceSchema.index({ course: 1, date: 1 });

// Auto-calculate totals
AttendanceSchema.pre('save', function (next) {
  this.totalPresent = this.records.filter((r) => r.status === 'present').length;
  this.totalAbsent = this.records.filter((r) => r.status === 'absent').length;
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
