const express = require('express');
const router = express.Router();
const {
  getAssignments, createAssignment, updateAssignment, deleteAssignment,
  submitAssignment, getSubmissions, gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAny } = require('../middleware/upload');

router.get('/', protect, getAssignments);
router.post('/', protect, authorize('faculty'), uploadAny.array('attachments', 5), createAssignment);
router.put('/:id', protect, authorize('faculty'), updateAssignment);
router.delete('/:id', protect, authorize('faculty'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), uploadAny.array('files', 5), submitAssignment);
router.get('/:id/submissions', protect, authorize('faculty', 'admin'), getSubmissions);
router.put('/submissions/:id/grade', protect, authorize('faculty'), gradeSubmission);

module.exports = router;
