const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema(
  { resume: {type: mongoose.Schema.Types.ObjectId, ref: 'ResumeProfile'}, score: Number, atsCompatibility: Number, missingSkills: [String], improvements: [String] },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
