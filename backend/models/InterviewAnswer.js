const mongoose = require('mongoose');

const InterviewAnswerSchema = new mongoose.Schema(
  { session: {type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession'}, question: String, answer: String, score: Number, aiFeedback: String },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewAnswer', InterviewAnswerSchema);
