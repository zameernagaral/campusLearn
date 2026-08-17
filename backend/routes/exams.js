const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/examsController');

router.get('/portions', protect, controller.getPortions);
router.post('/portions', protect, controller.createPortion);
router.put('/portions/:id', protect, controller.updatePortion);
router.get('/topics', protect, controller.getTopics);
router.post('/study-plan', protect, controller.createStudyPlan);
router.get('/study-progress', protect, controller.getStudyProgress);

module.exports = router;
