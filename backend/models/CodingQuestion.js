const mongoose = require('mongoose');

const CodingQuestionSchema = new mongoose.Schema(
  { title: String, category: String, difficulty: {type: String, enum: ['Easy', 'Medium', 'Hard']}, problemStatement: String, constraints: String, testCases: [{input: String, output: String}], hints: [String], solution: String },
  { timestamps: true }
);

module.exports = mongoose.model('CodingQuestion', CodingQuestionSchema);
