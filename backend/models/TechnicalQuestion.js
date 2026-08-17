const mongoose = require('mongoose');

const TechnicalQuestionSchema = new mongoose.Schema(
  { category: String, question: String, answer: String, explanation: String },
  { timestamps: true }
);

module.exports = mongoose.model('TechnicalQuestion', TechnicalQuestionSchema);
