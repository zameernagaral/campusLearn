const mongoose = require('mongoose');

const AttendanceRuleSchema = new mongoose.Schema(
  { department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'}, requiredPercentage: {type: Number, default: 75}, warningThreshold: {type: Number, default: 85}, shortageThreshold: {type: Number, default: 75}, criticalThreshold: {type: Number, default: 70} },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceRule', AttendanceRuleSchema);
