const mongoose = require('mongoose');

const CareerRecommendationSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, type: {type: String, enum: ['Course', 'Video', 'Note', 'Project', 'Certification', 'Internship', 'Preparation']}, itemRefId: mongoose.Schema.Types.ObjectId, itemModel: String, reason: String },
  { timestamps: true }
);

module.exports = mongoose.model('CareerRecommendation', CareerRecommendationSchema);
