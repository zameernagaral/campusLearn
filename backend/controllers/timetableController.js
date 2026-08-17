const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');
const TimetableEvent = require('../models/TimetableEvent');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper: get day range
function dayRange(date) {
  const d = new Date(date);
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ── GET /api/timetable ──────────────────────────────────────────────────────
exports.getTimetable = asyncHandler(async (req, res) => {
  const { date, week, status } = req.query;
  const role = req.user.role;
  const filter = {};

  if (status) filter.status = status;

  if (date) {
    const { start, end } = dayRange(date);
    filter.startTime = { $gte: start, $lte: end };
  } else if (week) {
    const weekStart = new Date(week);
    const weekEnd = new Date(week);
    weekEnd.setDate(weekEnd.getDate() + 7);
    filter.startTime = { $gte: weekStart, $lte: weekEnd };
  }

  if (role === 'faculty') {
    filter.faculty = req.user._id;
  } else if (role === 'student') {
    // Students see all events (in real app: filter by section/batch)
  }

  const events = await TimetableEvent.find(filter)
    .populate('faculty', 'name email')
    .populate('classroom', 'name building floor capacity')
    .sort({ startTime: 1 })
    .lean();

  // Mark currently live events
  const now = new Date();
  const enriched = events.map(e => ({
    ...e,
    isLive: new Date(e.startTime) <= now && new Date(e.endTime) >= now && e.status !== 'Cancelled',
  }));

  successResponse(res, 200, 'Timetable fetched', enriched);
});

// ── POST /api/timetable ─────────────────────────────────────────────────────
exports.createTimetable = asyncHandler(async (req, res) => {
  const { subject, faculty, classroom, startTime, endTime, classType, meetingLink, notes } = req.body;
  if (!subject || !startTime || !endTime) {
    return errorResponse(res, 400, 'Subject, startTime and endTime are required');
  }

  // Conflict check
  const conflict = await TimetableEvent.findOne({
    status: { $nin: ['Cancelled'] },
    $or: [
      { faculty, startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
      { classroom, startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
    ],
  });

  if (conflict) {
    return errorResponse(res, 409, `Conflict detected: ${conflict.subject} is already scheduled at this time`);
  }

  const event = await TimetableEvent.create({
    subject, faculty: faculty || req.user._id, classroom,
    startTime: new Date(startTime), endTime: new Date(endTime),
    classType: classType || 'Lecture', meetingLink, notes, status: 'Upcoming',
  });

  successResponse(res, 201, 'Class created', event);
});

// ── PUT /api/timetable/:id ──────────────────────────────────────────────────
exports.updateTimetable = asyncHandler(async (req, res) => {
  const event = await TimetableEvent.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).populate('faculty', 'name email');

  if (!event) return errorResponse(res, 404, 'Timetable event not found');
  successResponse(res, 200, 'Event updated', event);
});

// ── DELETE /api/timetable/:id ───────────────────────────────────────────────
exports.deleteTimetable = asyncHandler(async (req, res) => {
  const event = await TimetableEvent.findByIdAndDelete(req.params.id);
  if (!event) return errorResponse(res, 404, 'Event not found');
  successResponse(res, 200, 'Event deleted');
});

// ── POST /api/timetable/check-conflict ─────────────────────────────────────
exports.checkConflict = asyncHandler(async (req, res) => {
  const { faculty, classroom, startTime, endTime, excludeId } = req.body;
  const filter = {
    status: { $nin: ['Cancelled'] },
    startTime: { $lt: new Date(endTime) },
    endTime: { $gt: new Date(startTime) },
  };
  if (excludeId) filter._id = { $ne: excludeId };

  const conflicts = [];
  if (faculty) {
    const fc = await TimetableEvent.findOne({ ...filter, faculty });
    if (fc) conflicts.push({ type: 'faculty', event: fc });
  }
  if (classroom) {
    const cc = await TimetableEvent.findOne({ ...filter, classroom });
    if (cc) conflicts.push({ type: 'classroom', event: cc });
  }

  successResponse(res, 200, 'Conflict check done', { hasConflict: conflicts.length > 0, conflicts });
});

// ── POST /api/timetable/reschedule ─────────────────────────────────────────
exports.rescheduleClass = asyncHandler(async (req, res) => {
  const { eventId, newStartTime, newEndTime, reason } = req.body;
  if (!eventId || !newStartTime || !newEndTime) {
    return errorResponse(res, 400, 'eventId, newStartTime, newEndTime required');
  }

  const event = await TimetableEvent.findById(eventId).populate('faculty', 'name');
  if (!event) return errorResponse(res, 404, 'Event not found');

  const oldTime = event.startTime;
  event.startTime = new Date(newStartTime);
  event.endTime = new Date(newEndTime);
  event.status = 'Rescheduled';
  event.notes = reason || event.notes;
  await event.save();

  // Send notifications to all students
  try {
    const students = await User.find({ role: 'student' }, '_id').lean();
    const notifications = students.map(s => ({
      recipient: s._id,
      title: 'Class Rescheduled',
      message: `Your ${event.subject} class has been rescheduled from ${oldTime.toLocaleTimeString()} to ${event.startTime.toLocaleTimeString()}.`,
      type: 'timetable',
      isRead: false,
    }));
    await Notification.insertMany(notifications, { ordered: false }).catch(() => {});
  } catch (_) {}

  successResponse(res, 200, 'Class rescheduled', event);
});

// ── POST /api/timetable/cancel ──────────────────────────────────────────────
exports.cancelClass = asyncHandler(async (req, res) => {
  const { eventId, reason } = req.body;
  if (!eventId) return errorResponse(res, 400, 'eventId required');

  const event = await TimetableEvent.findById(eventId);
  if (!event) return errorResponse(res, 404, 'Event not found');

  event.status = 'Cancelled';
  event.notes = reason || 'Class cancelled';
  await event.save();

  // Notify students
  try {
    const students = await User.find({ role: 'student' }, '_id').lean();
    const notifications = students.map(s => ({
      recipient: s._id,
      title: 'Class Cancelled',
      message: `${event.subject} class on ${new Date(event.startTime).toLocaleDateString()} has been cancelled. ${reason ? 'Reason: ' + reason : ''}`,
      type: 'timetable',
      isRead: false,
    }));
    await Notification.insertMany(notifications, { ordered: false }).catch(() => {});
  } catch (_) {}

  successResponse(res, 200, 'Class cancelled', event);
});
