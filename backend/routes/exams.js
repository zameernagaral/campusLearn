const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/examsController');

router.get('/portions', protect, c.getPortions);
router.post('/portions', protect, authorize('faculty', 'admin'), c.createPortion);
router.put('/portions/:id', protect, authorize('faculty', 'admin'), c.updatePortion);
router.get('/topics', protect, c.getTopics);
router.post('/study-plan', protect, c.generateStudyPlan);
router.get('/study-progress', protect, c.getProgress);

module.exports = router;
