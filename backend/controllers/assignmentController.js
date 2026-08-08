const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ─── @desc    Get assignments (for course or user)
// ─── @route   GET /api/assignments
// ─── @access  Private
exports.getAssignments = async (req, res, next) => {
  try {
    const { course, page = 1, limit = 10 } = req.query;
    const query = {};
    if (course) query.course = course;
    if (req.user.role === 'faculty') query.faculty = req.user._id;

    const skip = (page - 1) * limit;
    const [assignments, total] = await Promise.all([
      Assignment.find(query)
        .populate('course', 'title')
        .populate('faculty', 'name')
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Assignment.countDocuments(query),
    ]);

    paginatedResponse(res, assignments, page, limit, total);
  } catch (error) { next(error); }
};

// ─── @desc    Create assignment
// ─── @route   POST /api/assignments
// ─── @access  Private (Faculty)
exports.createAssignment = async (req, res, next) => {
  try {
    const attachments = req.files?.map(f => ({ name: f.originalname, url: f.path, publicId: f.filename })) || [];
    const assignment = await Assignment.create({ ...req.body, faculty: req.user._id, attachments });

    // Notify enrolled students
    const Course = require('../models/Course');
    const course = await Course.findById(req.body.course).select('enrolledStudents title');
    if (course) {
      const notifications = course.enrolledStudents.map(studentId => ({
        recipient: studentId,
        sender: req.user._id,
        type: 'assignment',
        title: 'New Assignment Posted',
        message: `New assignment "${assignment.title}" in ${course.title}`,
        link: `/student/assignments`,
      }));
      await Notification.insertMany(notifications);
    }

    successResponse(res, 201, 'Assignment created.', assignment);
  } catch (error) { next(error); }
};

// ─── @desc    Update assignment
// ─── @route   PUT /api/assignments/:id
// ─── @access  Private (Faculty)
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) return errorResponse(res, 404, 'Assignment not found.');
    successResponse(res, 200, 'Assignment updated.', assignment);
  } catch (error) { next(error); }
};

// ─── @desc    Delete assignment
// ─── @route   DELETE /api/assignments/:id
// ─── @access  Private (Faculty)
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, faculty: req.user._id });
    if (!assignment) return errorResponse(res, 404, 'Assignment not found.');
    successResponse(res, 200, 'Assignment deleted.');
  } catch (error) { next(error); }
};

// ─── @desc    Submit assignment
// ─── @route   POST /api/assignments/:id/submit
// ─── @access  Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return errorResponse(res, 404, 'Assignment not found.');

    const Course = require('../models/Course');
    const course = await Course.findOne({ _id: assignment.course, enrolledStudents: req.user._id });
    if (!course) {
      return errorResponse(res, 403, 'You are not enrolled in this course.');
    }

    const isLate = new Date() > new Date(assignment.dueDate);
    if (isLate && !assignment.allowLateSubmission) {
      return errorResponse(res, 400, 'Submission deadline has passed.');
    }

    const files = req.files?.map(f => ({ name: f.originalname, url: f.path, publicId: f.filename })) || [];
    const existing = await Submission.findOne({ assignment: req.params.id, student: req.user._id });

    let submission;
    if (existing) {
      submission = await Submission.findByIdAndUpdate(
        existing._id,
        { content: req.body.content, files, submittedAt: new Date(), isLate },
        { new: true }
      );
    } else {
      submission = await Submission.create({
        assignment: req.params.id,
        student: req.user._id,
        course: assignment.course,
        content: req.body.content,
        files,
        isLate,
      });
    }

    // Notify faculty
    await Notification.create({
      recipient: assignment.faculty,
      sender: req.user._id,
      type: 'assignment',
      title: 'Assignment Submitted',
      message: `${req.user.name} submitted "${assignment.title}"`,
      link: `/faculty/assignments/${assignment._id}`,
    });

    successResponse(res, 201, 'Assignment submitted!', submission);
  } catch (error) { next(error); }
};

// ─── @desc    Get submissions for an assignment (Faculty)
// ─── @route   GET /api/assignments/:id/submissions
// ─── @access  Private (Faculty)
exports.getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, faculty: req.user._id });
    if (!assignment && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to view these submissions.');
    }

    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name email rollNumber avatar')
      .sort({ submittedAt: -1 });
    successResponse(res, 200, 'Submissions fetched.', submissions);
  } catch (error) { next(error); }
};

// ─── @desc    Grade a submission
// ─── @route   PUT /api/assignments/submissions/:id/grade
// ─── @access  Private (Faculty)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback, status: 'graded', gradedBy: req.user._id, gradedAt: new Date() },
      { new: true }
    ).populate('student', 'name');

    if (!submission) return errorResponse(res, 404, 'Submission not found.');

    // Notify student
    await Notification.create({
      recipient: submission.student._id,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your submission has been graded. Marks: ${marks}`,
      link: `/student/assignments`,
    });

    successResponse(res, 200, 'Graded successfully.', submission);
  } catch (error) { next(error); }
};
