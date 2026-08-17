const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/careerController');

router.get('/roadmap', protect, controller.getRoadmap);
router.post('/roadmap', protect, controller.createRoadmap);
router.put('/roadmap', protect, controller.updateRoadmap);
router.post('/goals', protect, controller.createGoal);
router.get('/recommendations', protect, controller.getRecommendations);
router.post('/skills', protect, controller.addSkill);
router.put('/skills/:id', protect, controller.updateSkill);

module.exports = router;
