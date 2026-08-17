const mongoose = require('mongoose');

const HRQuestionSchema = new mongoose.Schema(
  { question: String, guidance: String },
  { timestamps: true }
);

module.exports = mongoose.model('HRQuestion', HRQuestionSchema);
