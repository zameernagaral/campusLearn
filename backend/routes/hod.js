const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');
const { successResponse } = require('../utils/response');

const hodOrAdmin = [protect, authorize('hod', 'admin')];

// GET HOD dashboard
router.get('/stats', ...hodOrAdmin, async (req, res, next) => {
  try {
    const deptId = req.user.department;
    const [faculty, students, courses] = await Promise.all([
      User.countDocuments({ role: 'faculty', department: deptId }),
      User.countDocuments({ role: 'student', department: deptId }),
      Course.countDocuments({ department: deptId }),
    ]);

    // Attendance last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const attendanceRecords = await Attendance.find({ createdAt: { $gte: thirtyDaysAgo } })
      .populate('course', 'department');
    const deptAttendance = attendanceRecords.filter(
      a => a.course?.department?.toString() === deptId?.toString()
    );
    const avgAttendance = deptAttendance.length > 0
      ? Math.round((deptAttendance.reduce((s, a) => s + (a.totalPresent / (a.records.length || 1)), 0) / deptAttendance.length) * 100)
      : 0;

    successResponse(res, 200, 'HOD stats fetched.', {
      faculty, students, courses, avgAttendance,
    });
  } catch (error) { next(error); }
});

// GET faculty list for HOD's dept
router.get('/faculty', ...hodOrAdmin, async (req, res, next) => {
  try {
    const faculty = await User.find({ role: 'faculty', department: req.user.department })
      .select('name email avatar employeeId designation isActive')
      .populate('teachingCourses', 'title');
    successResponse(res, 200, 'Faculty fetched.', faculty);
  } catch (error) { next(error); }
});

// GET student list for HOD's dept
router.get('/students', ...hodOrAdmin, async (req, res, next) => {
  try {
    const { semester } = req.query;
    const query = { role: 'student', department: req.user.department };
    if (semester) query.semester = parseInt(semester);

    const students = await User.find(query)
      .select('name email avatar rollNumber semester isActive points streak')
      .sort({ rollNumber: 1 });
    successResponse(res, 200, 'Students fetched.', students);
  } catch (error) { next(error); }
});

module.exports = router;
