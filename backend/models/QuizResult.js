const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: String,
        isCorrect: Boolean,
        marksObtained: Number,
      },
    ],
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number },
    passed: { type: Boolean },
    timeTaken: { type: Number }, // seconds
    attemptNumber: { type: Number, default: 1 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizResultSchema.index({ quiz: 1, student: 1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema);
