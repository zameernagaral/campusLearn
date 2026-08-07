const express = require('express');
const router = express.Router();
const { chat, generateQuiz, summarize } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chat);
router.post('/generate-quiz', protect, generateQuiz);
router.post('/summarize', protect, summarize);

module.exports = router;
