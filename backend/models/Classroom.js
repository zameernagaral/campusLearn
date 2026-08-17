const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema(
  { name: {type: String, required: true}, capacity: Number, location: String, department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'} },
  { timestamps: true }
);

module.exports = mongoose.model('Classroom', ClassroomSchema);
