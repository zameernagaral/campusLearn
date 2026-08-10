const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Get live classes
// @route   GET /api/live-classes
// @access  Private
exports.getLiveClasses = async (req, res, next) => {
  try {
    const { course, status } = req.query;
    const query = {};
    if (course) query.course = course;
    if (status) query.status = status;
    if (req.user.role === 'faculty') query.faculty = req.user._id;

    const classes = await LiveClass.find(query)
      .populate('course', 'title subjectCode')
      .populate('faculty', 'name')
      .sort({ scheduledAt: 1 });

    successResponse(res, 200, 'Live classes fetched.', classes);
  } catch (error) { next(error); }
};

// @desc    Create live class
// @route   POST /api/live-classes
// @access  Private (Faculty)
exports.createLiveClass = async (req, res, next) => {
  try {
    const { title, course, scheduledAt, duration, meetingLink, platform } = req.body;
    if (!title || !course || !scheduledAt || !meetingLink) {
      return errorResponse(res, 400, 'Please provide all required fields (title, course, scheduledAt, meetingLink).');
    }

    const liveClass = await LiveClass.create({
      title,
      course,
      scheduledAt,
      duration: duration || 60,
      meetingLink,
      platform: platform || 'meet',
      faculty: req.user._id,
      status: 'scheduled'
    });

    successResponse(res, 201, 'Live class scheduled.', liveClass);
  } catch (error) { next(error); }
};
