const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ─── @desc    Get all courses (with search, filter, pagination)
// ─── @route   GET /api/courses
// ─── @access  Public/Private
exports.getCourses = async (req, res, next) => {
  try {
    const { search, department, semester, faculty, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (faculty) query.faculty = faculty;

    // Students/public only see published+approved courses
    if (!req.user || req.user.role === 'student') {
      query.isPublished = true;
      query.isApproved = true;
    }

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('faculty', 'name avatar designation')
        .populate('department', 'name code')
        .select('-modules')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(query),
    ]);

    paginatedResponse(res, courses, page, limit, total, 'Courses fetched successfully.');
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single course with all modules and lessons
// ─── @route   GET /api/courses/:id
// ─── @access  Public/Private
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty', 'name email avatar designation bio')
      .populate('department', 'name code')
      .populate('enrolledStudents', 'name email avatar role')
      .populate({
        path: 'modules',
        populate: { path: 'lessons', select: 'title type duration isFree isPublished order documentUrl documentName videoUrl' },
      });

    if (!course) return errorResponse(res, 404, 'Course not found.');

    // Increment view count
    await Course.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    successResponse(res, 200, 'Course fetched.', course);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Create course
// ─── @route   POST /api/courses
// ─── @access  Private (Faculty)
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title, description, shortDescription, department, semester, credits,
      year, subjectCode, tags, level, learningOutcomes, prerequisites, language, isPublished
    } = req.body;

    const course = await Course.create({
      title, description, shortDescription, department: department || req.user.department, semester, credits,
      year, subjectCode, tags, level, learningOutcomes, prerequisites, language, isPublished,
      faculty: req.user._id,
      thumbnail: req.file?.path || '',
    });
    successResponse(res, 201, 'Course created successfully.', course);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update course
// ─── @route   PUT /api/courses/:id
// ─── @access  Private (Faculty / Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 404, 'Course not found.');

    if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this course.');
    }

    if (req.file) req.body.thumbnail = req.file.path;
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    successResponse(res, 200, 'Course updated.', course);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete course
// ─── @route   DELETE /api/courses/:id
// ─── @access  Private (Faculty / Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 404, 'Course not found.');

    if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized.');
    }

    await Course.findByIdAndDelete(req.params.id);
    successResponse(res, 200, 'Course deleted.');
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Enroll in a course
// ─── @route   POST /api/courses/:id/enroll
// ─── @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 404, 'Course not found.');

    const alreadyEnrolled = course.enrolledStudents.includes(req.user._id);
    if (alreadyEnrolled) return errorResponse(res, 400, 'Already enrolled in this course.');

    await Promise.all([
      Course.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledStudents: req.user._id } }),
      User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: req.params.id } }),
    ]);

    // Notify faculty
    await Notification.create({
      recipient: course.faculty,
      sender: req.user._id,
      type: 'course',
      title: 'New Student Enrolled',
      message: `${req.user.name} enrolled in ${course.title}`,
      link: `/faculty/courses/${course._id}`,
    });

    successResponse(res, 200, 'Enrolled successfully!');
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Approve course (HOD/Admin)
// ─── @route   PATCH /api/courses/:id/approve
// ─── @access  Private (HOD / Admin)
exports.approveCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user._id },
      { new: true }
    );
    if (!course) return errorResponse(res, 404, 'Course not found.');

    // Notify faculty
    await Notification.create({
      recipient: course.faculty,
      type: 'course',
      title: 'Course Approved',
      message: `Your course "${course.title}" has been approved.`,
      link: `/faculty/courses/${course._id}`,
    });

    successResponse(res, 200, 'Course approved.', course);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get enrolled students of a course
// ─── @route   GET /api/courses/:id/students
// ─── @access  Private (Faculty)
exports.getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'name email avatar rollNumber semester');
    if (!course) return errorResponse(res, 404, 'Course not found.');
    successResponse(res, 200, 'Students fetched.', course.enrolledStudents);
  } catch (error) {
    next(error);
  }
};
