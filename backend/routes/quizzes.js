const express = require('express');
const router = express.Router();
const {
  getQuizzes, getQuiz, createQuiz, updateQuiz, submitQuiz, getQuizResults,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuiz);
router.post('/', protect, authorize('faculty'), createQuiz);
router.put('/:id', protect, authorize('faculty'), updateQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id/results', protect, getQuizResults);

module.exports = router;
