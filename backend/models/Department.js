const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, required: true, uppercase: true, unique: true },
    description: { type: String },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalStudents: { type: Number, default: 0 },
    totalFaculty: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', DepartmentSchema);
