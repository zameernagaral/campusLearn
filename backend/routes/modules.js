const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const { uploadVideo, uploadDocument } = require('../middleware/upload');
const { successResponse, errorResponse } = require('../utils/response');

// GET modules for a course
router.get('/', protect, async (req, res, next) => {
  try {
    const modules = await Module.find({ course: req.query.course })
      .populate('lessons')
      .sort({ order: 1 });
    successResponse(res, 200, 'Modules fetched.', modules);
  } catch (error) { next(error); }
});

// POST create module
router.post('/', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    const module = await Module.create(req.body);
    await Course.findByIdAndUpdate(req.body.course, { $push: { modules: module._id } });
    successResponse(res, 201, 'Module created.', module);
  } catch (error) { next(error); }
});

// PUT update module
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) return errorResponse(res, 404, 'Module not found.');
    successResponse(res, 200, 'Module updated.', module);
  } catch (error) { next(error); }
});

// POST create lesson (video)
router.post('/lessons/video', protect, authorize('faculty'), uploadVideo.single('video'), async (req, res, next) => {
  try {
    const lesson = await Lesson.create({
      ...req.body,
      type: 'video',
      videoUrl: req.file?.path,
      videoPublicId: req.file?.filename,
      duration: parseInt(req.body.duration) || 0,
    });
    await Module.findByIdAndUpdate(req.body.module, { $push: { lessons: lesson._id } });
    successResponse(res, 201, 'Video lesson created.', lesson);
  } catch (error) { next(error); }
});

// POST create lesson (document)
router.post('/lessons/document', protect, authorize('faculty'), uploadDocument.single('document'), async (req, res, next) => {
  try {
    const lesson = await Lesson.create({
      ...req.body,
      type: 'document',
      documentUrl: req.file?.path,
      documentPublicId: req.file?.filename,
      documentName: req.file?.originalname,
    });
    await Module.findByIdAndUpdate(req.body.module, { $push: { lessons: lesson._id } });
    successResponse(res, 201, 'Document lesson created.', lesson);
  } catch (error) { next(error); }
});

// PATCH mark lesson complete (student)
router.patch('/lessons/:id/complete', protect, authorize('student'), async (req, res, next) => {
  try {
    await Lesson.findByIdAndUpdate(req.params.id, {
      $addToSet: { completedBy: req.user._id },
      $inc: { views: 1 },
    });
    successResponse(res, 200, 'Lesson marked as complete.');
  } catch (error) { next(error); }
});

module.exports = router;
