const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema(
  { plan: {type: mongoose.Schema.Types.ObjectId, ref: 'StudyPlan'}, topic: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamTopic'}, date: Date, durationMinutes: Number, status: {type: String, enum: ['Planned', 'Completed', 'Missed'], default: 'Planned'} },
  { timestamps: true }
);

module.exports = mongoose.model('StudySession', StudySessionSchema);
