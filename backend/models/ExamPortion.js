const mongoose = require('mongoose');

const ExamPortionSchema = new mongoose.Schema(
  { subject: String, semester: Number, section: String, faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, examType: String, examDate: Date, referenceNotes: [String], referenceVideos: [String], previousPapers: [String], units: [String], subtopics: [String] },
  { timestamps: true }
);

module.exports = mongoose.model('ExamPortion', ExamPortionSchema);
