const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, jobRole: String, interviewType: {type: String, enum: ['Technical', 'HR', 'Coding', 'Mixed']}, difficulty: String, overallScore: Number, feedback: String, strengths: [String], weaknesses: [String], recommendations: [String] },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
