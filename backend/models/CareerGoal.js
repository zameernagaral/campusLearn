const mongoose = require('mongoose');

const CareerGoalSchema = new mongoose.Schema(
  { title: {type: String, required: true}, description: String, category: String, skillsRequired: [{type: mongoose.Schema.Types.ObjectId, ref: 'Skill'}] },
  { timestamps: true }
);

module.exports = mongoose.model('CareerGoal', CareerGoalSchema);
