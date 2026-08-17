const mongoose = require('mongoose');

const ExamPreparationProgressSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, completedTopics: [{type: mongoose.Schema.Types.ObjectId, ref: 'ExamTopic'}], overallProgress: {type: Number, default: 0} },
  { timestamps: true }
);

module.exports = mongoose.model('ExamPreparationProgress', ExamPreparationProgressSchema);
