const mongoose = require('mongoose');

const CompanyPreparationSchema = new mongoose.Schema(
  { company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}, requiredSkills: [String], preparationTopics: [String], aptitudeTags: [String], codingTags: [String], interviewStages: [String] },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyPreparation', CompanyPreparationSchema);
