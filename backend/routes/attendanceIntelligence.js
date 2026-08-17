const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/attendanceIntelligenceController');

router.get('/risk', protect, controller.getRisk);
router.get('/shortage', protect, controller.getShortage);
router.get('/prediction', protect, controller.getPrediction);
router.get('/alerts', protect, controller.getAlerts);
router.post('/alerts/send', protect, controller.sendAlert);

module.exports = router;
