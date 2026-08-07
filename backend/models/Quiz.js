const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'true_false', 'short'], default: 'mcq' },
  options: [{ text: String, isCorrect: Boolean }],
  correctAnswer: { type: String }, // for short answers
  explanation: { type: String },
  marks: { type: Number, default: 1 },
  image: { type: String },
});

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [QuestionSchema],
    duration: { type: Number, required: true }, // minutes
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number, default: 0 },
    startTime: { type: Date },
    endTime: { type: Date },
    maxAttempts: { type: Number, default: 1 },
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    showResults: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    type: { type: String, enum: ['practice', 'exam', 'assignment'], default: 'practice' },
  },
  { timestamps: true }
);

// Auto-calculate totalMarks
QuizSchema.pre('save', function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
