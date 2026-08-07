const jwt = require('jsonwebtoken');

/**
 * Generate access token (short-lived)
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate refresh token (long-lived)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Send tokens in response (both access + refresh)
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Sanitize user object
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    department: user.department,
    rollNumber: user.rollNumber,
    employeeId: user.employeeId,
    semester: user.semester,
    streak: user.streak,
    points: user.points,
    badges: user.badges,
    preferences: user.preferences,
  };

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: userData,
      accessToken,
      refreshToken,
    },
  });
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken, sendTokenResponse };
