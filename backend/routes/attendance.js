const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getMyAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('faculty'), markAttendance);
router.get('/', protect, authorize('faculty', 'hod', 'admin'), getAttendance);
router.get('/my-attendance', protect, authorize('student'), getMyAttendance);
router.put('/:id', protect, authorize('faculty'), updateAttendance);

module.exports = router;
