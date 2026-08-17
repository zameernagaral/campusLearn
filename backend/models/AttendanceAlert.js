const mongoose = require('mongoose');

const AttendanceAlertSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, subject: String, currentPercentage: Number, requiredPercentage: Number, riskLevel: {type: String, enum: ['SAFE', 'WARNING', 'SHORTAGE RISK', 'CRITICAL']}, message: String, isRead: {type: Boolean, default: false} },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceAlert', AttendanceAlertSchema);
