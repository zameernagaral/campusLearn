const mongoose = require('mongoose');

const PlacementAchievementSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}, role: String, dateSecured: Date, package: String },
  { timestamps: true }
);

module.exports = mongoose.model('PlacementAchievement', PlacementAchievementSchema);
