const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    // ─── Basic Info ───────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'hod', 'admin'],
      default: 'student',
    },

    // ─── Profile ──────────────────────────────────────────────────────────────
    avatar: {
      type: String,
      default: '',
    },
    phone: { type: String, trim: true },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

    // ─── Student-specific ─────────────────────────────────────────────────────
    rollNumber: { type: String, unique: true, sparse: true },
    semester: { type: Number, min: 1, max: 8 },
    year: { type: Number },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],

    // ─── Faculty-specific ─────────────────────────────────────────────────────
    employeeId: { type: String, unique: true, sparse: true },
    designation: { type: String },
    teachingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

    // ─── Auth & Security ──────────────────────────────────────────────────────
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpire: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpire: { type: Date, select: false },
    lastLogin: { type: Date },

    // ─── Gamification ─────────────────────────────────────────────────────────
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    points: { type: Number, default: 0 },
    badges: [{ type: String }],

    // ─── Preferences ─────────────────────────────────────────────────────────
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });

// ─── Hash password before save ────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password ─────────────────────────────────────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Generate password reset token ───────────────────────────────────────────
UserSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// ─── Generate email verification token ───────────────────────────────────────
UserSchema.methods.getEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// ─── Update streak ────────────────────────────────────────────────────────────
UserSchema.methods.updateStreak = function () {
  const today = new Date().toDateString();
  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActive === today) return; // Already updated today
  if (lastActive === yesterday) {
    this.streak += 1;
  } else {
    this.streak = 1; // Reset streak
  }
  this.lastActiveDate = new Date();
};

module.exports = mongoose.model('User', UserSchema);
