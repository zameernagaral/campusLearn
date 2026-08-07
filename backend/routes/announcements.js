const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');
const { successResponse, paginatedResponse } = require('../utils/response');

router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    // Filter by role
    if (req.user.role === 'student') {
      query.targetAudience = { $in: ['all', 'students'] };
    } else if (req.user.role === 'faculty') {
      query.targetAudience = { $in: ['all', 'faculty'] };
    }

    const skip = (page - 1) * limit;
    const [announcements, total] = await Promise.all([
      Announcement.find(query)
        .populate('author', 'name avatar role')
        .populate('course', 'title')
        .populate('department', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Announcement.countDocuments(query),
    ]);

    paginatedResponse(res, announcements, page, limit, total);
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('faculty', 'hod', 'admin'), async (req, res, next) => {
  try {
    const announcement = await Announcement.create({ ...req.body, author: req.user._id });
    successResponse(res, 201, 'Announcement posted.', announcement);
  } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('faculty', 'hod', 'admin'), async (req, res, next) => {
  try {
    await Announcement.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    successResponse(res, 200, 'Announcement deleted.');
  } catch (error) { next(error); }
});

module.exports = router;
