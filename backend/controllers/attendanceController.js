const Attendance = require('../models/Attendance');
const { successResponse, errorResponse } = require('../utils/response');

// ─── @desc    Mark attendance
// ─── @route   POST /api/attendance
// ─── @access  Private (Faculty)
exports.markAttendance = async (req, res, next) => {
  try {
    const { course, date, topic, records } = req.body;
    const existing = await Attendance.findOne({ course, date: new Date(date) });
    if (existing) {
      return errorResponse(res, 400, 'Attendance already marked for this date.');
    }

    const attendance = await Attendance.create({
      course,
      faculty: req.user._id,
      date: new Date(date),
      topic,
      records,
    });

    successResponse(res, 201, 'Attendance marked.', attendance);
  } catch (error) { next(error); }
};

// ─── @desc    Get attendance for a course
// ─── @route   GET /api/attendance?course=id
// ─── @access  Private
exports.getAttendance = async (req, res, next) => {
  try {
    const { course, startDate, endDate } = req.query;
    const query = {};
    if (course) query.course = course;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query)
      .populate('course', 'title')
      .populate('records.student', 'name rollNumber avatar')
      .sort({ date: -1 });

    successResponse(res, 200, 'Attendance fetched.', records);
  } catch (error) { next(error); }
};

// ─── @desc    Get student's own attendance summary
// ─── @route   GET /api/attendance/my-attendance
// ─── @access  Private (Student)
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { course } = req.query;
    const query = course ? { course } : {};

    const records = await Attendance.find({
      ...query,
      'records.student': req.user._id,
    }).populate('course', 'title');

    // Calculate summary per course
    const summary = {};
    records.forEach(att => {
      const courseId = att.course._id.toString();
      const courseTitle = att.course.title;
      if (!summary[courseId]) {
        summary[courseId] = { course: courseId, title: courseTitle, total: 0, present: 0, absent: 0, late: 0 };
      }
      summary[courseId].total++;
      const myRecord = att.records.find(r => r.student.toString() === req.user._id.toString());
      if (myRecord) {
        if (myRecord.status === 'present') summary[courseId].present++;
        else if (myRecord.status === 'late') { summary[courseId].late++; summary[courseId].present++; }
        else summary[courseId].absent++;
      }
    });

    const summaryArray = Object.values(summary).map(s => ({
      ...s,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    successResponse(res, 200, 'Attendance summary fetched.', summaryArray);
  } catch (error) { next(error); }
};

// ─── @desc    Update attendance record
// ─── @route   PUT /api/attendance/:id
// ─── @access  Private (Faculty)
exports.updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true }
    );
    if (!attendance) return errorResponse(res, 404, 'Attendance record not found.');
    successResponse(res, 200, 'Attendance updated.', attendance);
  } catch (error) { next(error); }
};
