const mongoose = require('mongoose');

const StudentSkillSchema = new mongoose.Schema(
  { student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, skill: {type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}, status: {type: String, enum: ['Not Started', 'Learning', 'Practicing', 'Completed'], default: 'Not Started'}, progress: {type: Number, default: 0} },
  { timestamps: true }
);

module.exports = mongoose.model('StudentSkill', StudentSkillSchema);
