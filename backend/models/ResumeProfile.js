const mongoose = require('mongoose');

const ResumeProfileSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, personalInfo: mongoose.Schema.Types.Mixed, careerObjective: String, education: [mongoose.Schema.Types.Mixed], projects: [mongoose.Schema.Types.Mixed], experience: [mongoose.Schema.Types.Mixed], skills: [String], achievements: [String] },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeProfile', ResumeProfileSchema);
