const express = require('express');
const router = express.Router();
const {
  register, login, refreshToken, verifyEmail,
  forgotPassword, resetPassword, getMe, updatePassword, logout,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter, loginLimiter } = require('../middleware/rateLimiter');

// Only allow admins to register new users (students/faculty)
router.post('/register', protect, authorize('admin', 'hod'), register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
