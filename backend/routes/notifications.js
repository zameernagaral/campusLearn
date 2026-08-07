const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markRead);
router.patch('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
