const mongoose = require('mongoose');

const AptitudeQuestionSchema = new mongoose.Schema(
  { category: String, subCategory: String, difficulty: {type: String, enum: ['Easy', 'Medium', 'Hard']}, questionText: String, options: [String], correctAnswer: String, explanation: String },
  { timestamps: true }
);

module.exports = mongoose.model('AptitudeQuestion', AptitudeQuestionSchema);
