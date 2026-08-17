const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, dailyTargetMinutes: Number, startDate: Date, endDate: Date },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
