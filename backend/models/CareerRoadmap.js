const mongoose = require('mongoose');

const CareerRoadmapSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, goal: {type: mongoose.Schema.Types.ObjectId, ref: 'CareerGoal'}, targetRole: String, currentLevel: String, preferredDomain: String, targetIndustry: String, graduationYear: Number, currentSemester: Number },
  { timestamps: true }
);

module.exports = mongoose.model('CareerRoadmap', CareerRoadmapSchema);
