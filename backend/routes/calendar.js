const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/calendarController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('faculty', 'admin', 'hod'), createEvent);

router.route('/:id')
  .delete(protect, authorize('faculty', 'admin', 'hod'), deleteEvent);

module.exports = router;
