const mongoose = require('mongoose');

const PlacementProfileSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, readinessScore: {type: Number, default: 0}, aptitudeScore: {type: Number, default: 0}, codingScore: {type: Number, default: 0}, technicalScore: {type: Number, default: 0}, communicationScore: {type: Number, default: 0}, resumeScore: {type: Number, default: 0}, interviewScore: {type: Number, default: 0} },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementProfile', PlacementProfileSchema);
