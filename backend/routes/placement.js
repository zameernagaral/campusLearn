const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/placementController');

router.get('/dashboard', protect, controller.getDashboard);
router.get('/aptitude', protect, controller.getAptitude);
router.post('/aptitude/test', protect, controller.submitAptitudeTest);
router.get('/coding', protect, controller.getCoding);
router.post('/mock-test', protect, controller.startMockTest);
router.post('/interview/start', protect, controller.startInterview);
router.post('/interview/answer', protect, controller.answerInterview);
router.post('/interview/complete', protect, controller.completeInterview);
router.post('/resume/analyze', protect, controller.analyzeResume);
router.get('/companies', protect, controller.getCompanies);
router.get('/companies/:id', protect, controller.getCompanyById);
router.get('/progress', protect, controller.getProgress);

module.exports = router;
