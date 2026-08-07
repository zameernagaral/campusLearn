const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    thumbnail: { type: String, default: '' },
    previewVideo: { type: String, default: '' },

    // Instructors & Dept
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },

    // Academic info
    semester: { type: Number, min: 1, max: 8 },
    credits: { type: Number, default: 3 },
    year: { type: Number },
    subjectCode: { type: String },

    // Content
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalLessons: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 }, // minutes

    // Status
    isPublished: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Stats
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    // Tags
    tags: [{ type: String }],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },

    // Outcomes
    learningOutcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    language: { type: String, default: 'English' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CourseSchema.index({ faculty: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', CourseSchema);
