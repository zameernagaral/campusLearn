const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/attendanceIntelligenceController');

router.get('/risk', protect, c.getRisk);
router.get('/shortage', protect, authorize('faculty', 'hod', 'admin'), c.getShortage);
router.get('/prediction', protect, c.getPrediction);
router.get('/alerts', protect, c.getAlerts);
router.post('/alerts/send', protect, authorize('admin', 'hod'), c.sendAlerts);

module.exports = router;
