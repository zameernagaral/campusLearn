const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// GET profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('department', 'name code')
    .populate('enrolledCourses', 'title thumbnail faculty');
  successResponse(res, 200, 'Profile fetched.', user);
});

// UPDATE profile
router.put('/profile', protect, uploadImage.single('avatar'), async (req, res, next) => {
  try {
    const { name, phone, bio, preferences } = req.body;
    const updates = { name, phone, bio, preferences };
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    }).select('-password');

    successResponse(res, 200, 'Profile updated.', user);
  } catch (error) { next(error); }
});

// GET leaderboard (by points)
router.get('/leaderboard', protect, async (req, res, next) => {
  try {
    const { department, limit = 10 } = req.query;
    const query = { role: 'student', isActive: true };
    if (department) query.department = department;

    const users = await User.find(query)
      .select('name avatar points streak badges rollNumber department')
      .populate('department', 'name')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    successResponse(res, 200, 'Leaderboard fetched.', users);
  } catch (error) { next(error); }
});

// GET search users
router.get('/search', protect, async (req, res, next) => {
  try {
    const { q, role } = req.query;
    const query = {};
    if (role) query.role = role;
    if (q) query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];

    const users = await User.find(query).select('name email avatar role rollNumber').limit(20);
    successResponse(res, 200, 'Search results.', users);
  } catch (error) { next(error); }
});

module.exports = router;
