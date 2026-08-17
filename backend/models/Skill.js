const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema(
  { name: {type: String, required: true}, category: String, difficulty: String, relatedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}] },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', SkillSchema);
