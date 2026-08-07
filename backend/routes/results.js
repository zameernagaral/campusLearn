const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { successResponse } = require('../utils/response');
const Result = require('../models/Result');

// GET student results
router.get('/', protect, async (req, res, next) => {
  try {
    const { student, semester } = req.query;
    const query = {};
    if (req.user.role === 'student') query.student = req.user._id;
    else if (student) query.student = student;
    if (semester) query.semester = parseInt(semester);
    query.isPublished = true;

    const results = await Result.find(query)
      .populate('course', 'title subjectCode credits')
      .sort({ semester: 1 });
    successResponse(res, 200, 'Results fetched.', results);
  } catch (error) { next(error); }
});

// POST publish result (Faculty/Admin)
router.post('/', protect, async (req, res, next) => {
  try {
    const result = await Result.create({ ...req.body, publishedBy: req.user._id });
    successResponse(res, 201, 'Result added.', result);
  } catch (error) { next(error); }
});

// PATCH publish
router.patch('/:id/publish', protect, async (req, res, next) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { isPublished: true, publishedAt: new Date(), publishedBy: req.user._id },
      { new: true }
    );
    successResponse(res, 200, 'Result published.', result);
  } catch (error) { next(error); }
});

module.exports = router;
