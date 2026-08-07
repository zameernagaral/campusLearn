const express = require('express');
const router = express.Router();
const {
  register, login, refreshToken, verifyEmail,
  forgotPassword, resetPassword, getMe, updatePassword, logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
