const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { successResponse } = require('../utils/response');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');

router.get('/', protect, async (req, res, next) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const certs = await Certificate.find(query)
      .populate('course', 'title thumbnail')
      .populate('issuedBy', 'name')
      .sort({ issuedAt: -1 });
    successResponse(res, 200, 'Certificates fetched.', certs);
  } catch (error) { next(error); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const cert = await Certificate.create({ ...req.body, issuedBy: req.user._id });
    successResponse(res, 201, 'Certificate issued.', cert);
  } catch (error) { next(error); }
});

router.get('/verify/:id', async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id, isValid: true })
      .populate('student', 'name')
      .populate('course', 'title');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found or invalid.' });
    successResponse(res, 200, 'Certificate is valid.', cert);
  } catch (error) { next(error); }
});

module.exports = router;
