const mongoose = require('mongoose');

const TimetableEventSchema = new mongoose.Schema(
  { timetable: {type: mongoose.Schema.Types.ObjectId, ref: 'Timetable'}, subject: String, faculty: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, classroom: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'}, startTime: Date, endTime: Date, classType: String, meetingLink: String, status: {type: String, enum: ['Upcoming', 'Live Now', 'Completed', 'Cancelled', 'Rescheduled'], default: 'Upcoming'}, notes: String },
  { timestamps: true }
);

module.exports = mongoose.model('TimetableEvent', TimetableEventSchema);
