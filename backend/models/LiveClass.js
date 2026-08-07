const mongoose = require('mongoose');

const LiveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // minutes
    meetingLink: { type: String, required: true },
    platform: { type: String, enum: ['zoom', 'meet', 'teams', 'custom'], default: 'meet' },
    status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
    recordingUrl: { type: String },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveClass', LiveClassSchema);
