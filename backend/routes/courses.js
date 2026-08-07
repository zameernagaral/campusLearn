const express = require('express');
const router = express.Router();
const {
  getCourses, getCourse, createCourse, updateCourse,
  deleteCourse, enrollCourse, approveCourse, getCourseStudents,
} = require('../controllers/courseController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', optionalAuth, getCourses);
router.get('/:id', optionalAuth, getCourse);
router.post('/', protect, authorize('faculty', 'admin'), uploadImage.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('faculty', 'admin'), uploadImage.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.patch('/:id/approve', protect, authorize('hod', 'admin'), approveCourse);
router.get('/:id/students', protect, authorize('faculty', 'admin', 'hod'), getCourseStudents);

module.exports = router;
