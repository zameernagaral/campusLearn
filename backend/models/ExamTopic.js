const mongoose = require('mongoose');

const ExamTopicSchema = new mongoose.Schema(
  { portion: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamPortion'}, name: String, importance: {type: String, enum: ['Very Important', 'Important', 'Moderate', 'Low Priority']}, weightage: Number, isCompleted: {type: Boolean, default: false} },
  { timestamps: true }
);

module.exports = mongoose.model('ExamTopic', ExamTopicSchema);
