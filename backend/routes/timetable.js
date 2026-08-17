const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/timetableController');

router.get('/', protect, controller.getTimetable);
router.post('/', protect, controller.createTimetable);
router.put('/:id', protect, controller.updateTimetable);
router.delete('/:id', protect, controller.deleteTimetable);
router.post('/check-conflict', protect, controller.checkConflict);
router.post('/reschedule', protect, controller.rescheduleClass);
router.post('/cancel', protect, controller.cancelClass);

module.exports = router;
