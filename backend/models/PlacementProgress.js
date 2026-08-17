const mongoose = require('mongoose');

const PlacementProgressSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, completedStages: [String], currentStage: String },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementProgress', PlacementProgressSchema);
