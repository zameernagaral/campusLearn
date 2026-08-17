const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/placementController');

router.get('/dashboard', protect, c.getDashboard);
router.get('/aptitude', protect, c.getAptitude);
router.post('/aptitude/test', protect, c.submitAptitudeTest);
router.get('/coding', protect, c.getCodingQuestions);
router.post('/mock-test', protect, c.submitMockTest);
router.post('/interview/start', protect, c.startInterview);
router.post('/interview/answer', protect, c.submitAnswer);
router.post('/interview/complete', protect, c.completeInterview);
router.post('/resume/analyze', protect, c.analyzeResume);
router.get('/companies', protect, c.getCompanies);
router.get('/companies/:id', protect, c.getCompany);
router.get('/progress', protect, c.getProgress);

module.exports = router;
