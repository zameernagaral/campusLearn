const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema(
  { department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'}, semester: Number, section: String, createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, isApproved: {type: Boolean, default: false} },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', TimetableSchema);
