const mongoose = require('mongoose');

const ResumeTemplateSchema = new mongoose.Schema(
  { name: String, layoutCode: String },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeTemplate', ResumeTemplateSchema);
