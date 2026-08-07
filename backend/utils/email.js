const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {object} options - { to, subject, html, text }
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'CampusLearn <noreply@campuslearn.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const emailBase = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
    .body { padding: 32px; color: #374151; line-height: 1.6; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; color: #9ca3af; font-size: 12px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 CampusLearn</h1>
      <p>One Platform for Smarter College Learning</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2024 CampusLearn. All rights reserved.</p>
      <p>This email was sent to you as a registered user of CampusLearn.</p>
    </div>
  </div>
</body>
</html>
`;

const sendVerificationEmail = async (user, verificationUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Verify your CampusLearn account',
    html: emailBase(`
      <h2>Welcome to CampusLearn, ${user.name}! 👋</h2>
      <p>Thank you for registering. Please verify your email address to get started.</p>
      <p>Click the button below to verify your account:</p>
      <a href="${verificationUrl}" class="btn">Verify Email Address</a>
      <hr class="divider">
      <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    `),
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Reset your CampusLearn password',
    html: emailBase(`
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <a href="${resetUrl}" class="btn">Reset Password</a>
      <hr class="divider">
      <p style="color: #6b7280; font-size: 14px;">This link expires in 10 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    `),
  });
};

const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to CampusLearn! 🎉',
    html: emailBase(`
      <h2>Your account is verified! 🎉</h2>
      <p>Hi ${user.name},</p>
      <p>Your CampusLearn account is now active. You can now access all features of the platform.</p>
      <p>As a <strong>${user.role}</strong>, you have access to:</p>
      <ul>
        <li>📚 Course materials and video lessons</li>
        <li>📝 Assignments and quizzes</li>
        <li>📊 Analytics and performance reports</li>
        <li>🤖 AI Study Assistant</li>
        <li>💬 Discussion forums</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard</a>
    `),
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail };
