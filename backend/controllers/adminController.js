const User = require('../models/User');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ─── @desc    Get admin dashboard stats
// ─── @route   GET /api/admin/stats
// ─── @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalStudents, totalFaculty, totalHOD,
      totalCourses, totalDepartments, activeCourses,
      recentUsers, recentCourses,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      User.countDocuments({ role: 'hod' }),
      Course.countDocuments(),
      Department.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role avatar createdAt'),
      Course.find().sort({ createdAt: -1 }).limit(5)
        .populate('faculty', 'name')
        .select('title faculty isPublished createdAt'),
    ]);

    // User growth data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const userGrowth = await Promise.all(
      last7Days.map(async (date) => {
        const start = new Date(date.setHours(0, 0, 0, 0));
        const end = new Date(date.setHours(23, 59, 59, 999));
        const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
        return { date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count };
      })
    );

    // Role distribution
    const roleDistribution = [
      { role: 'Students', count: totalStudents, color: '#6366f1' },
      { role: 'Faculty', count: totalFaculty, color: '#8b5cf6' },
      { role: 'HOD', count: totalHOD, color: '#a78bfa' },
      { role: 'Admin', count: totalUsers - totalStudents - totalFaculty - totalHOD, color: '#c4b5fd' },
    ];

    successResponse(res, 200, 'Dashboard stats fetched.', {
      totalUsers, totalStudents, totalFaculty, totalHOD,
      totalCourses, totalDepartments, activeCourses,
      recentUsers, recentCourses,
      userGrowth, roleDistribution,
    });
  } catch (error) { next(error); }
};

// ─── @desc    Get all users (with search + filter)
// ─── @route   GET /api/admin/users
// ─── @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, department, search, page = 1, limit = 20, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query)
        .populate('department', 'name code')
        .select('-password -refreshToken -passwordResetToken -emailVerificationToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    paginatedResponse(res, users, page, limit, total, 'Users fetched.');
  } catch (error) { next(error); }
};

// ─── @desc    Update user
// ─── @route   PUT /api/admin/users/:id
// ─── @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive, department, semester } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, department, semester },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return errorResponse(res, 404, 'User not found.');
    successResponse(res, 200, 'User updated.', user);
  } catch (error) { next(error); }
};

// ─── @desc    Delete user
// ─── @route   DELETE /api/admin/users/:id
// ─── @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return errorResponse(res, 400, 'Cannot delete your own account.');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found.');
    successResponse(res, 200, 'User deleted.');
  } catch (error) { next(error); }
};

// ─── @desc    Bulk create users
// ─── @route   POST /api/admin/users/bulk
// ─── @access  Private (Admin)
exports.bulkCreateUsers = async (req, res, next) => {
  try {
    const users = req.body;
    if (!users || !Array.isArray(users)) {
      return errorResponse(res, 400, 'Invalid users data.');
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    const defaultPasswordHash = await bcrypt.hash('CampusLearn@123', salt);

    const processedUsers = users.map(user => ({
      ...user,
      password: defaultPasswordHash,
      role: user.role ? user.role.toLowerCase() : 'student',
      isEmailVerified: true,
      isActive: true,
    }));

    const result = await User.insertMany(processedUsers, { ordered: false });
    successResponse(res, 201, `Successfully created ${result.length} users.`);
  } catch (error) {
    if (error.code === 11000) {
      const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
      return successResponse(res, 207, `Created ${insertedCount} users. Skipped duplicates.`);
    }
    next(error);
  }
};

// ─── @desc    Manage departments
// ─── @route   POST /api/admin/departments
// ─── @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    successResponse(res, 201, 'Department created.', dept);
  } catch (error) { next(error); }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email avatar');
    successResponse(res, 200, 'Departments fetched.', departments);
  } catch (error) { next(error); }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hod', 'name email avatar');
    if (!department) return errorResponse(res, 404, 'Department not found.');
    successResponse(res, 200, 'Department fetched.', department);
  } catch (error) { next(error); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return errorResponse(res, 404, 'Department not found.');
    successResponse(res, 200, 'Department updated.', dept);
  } catch (error) { next(error); }
};

// ─── @desc    Send bulk notification
// ─── @route   POST /api/admin/notify
// ─── @access  Private (Admin)
exports.sendBulkNotification = async (req, res, next) => {
  try {
    const { title, message, targetRole, link } = req.body;
    const query = targetRole ? { role: targetRole } : {};
    const users = await User.find(query).select('_id');

    const notifications = users.map(u => ({
      recipient: u._id,
      type: 'system',
      title,
      message,
      link,
    }));

    await Notification.insertMany(notifications);
    successResponse(res, 200, `Notification sent to ${notifications.length} users.`);
  } catch (error) { next(error); }
};
