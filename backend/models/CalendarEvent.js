const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['exam', 'class', 'deadline', 'event'], default: 'event' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: { type: String, default: 'TBA' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
