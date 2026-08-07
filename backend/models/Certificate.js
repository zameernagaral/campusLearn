const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, default: () => `CERT-${uuidv4().toUpperCase().slice(0, 8)}`, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issuedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['completion', 'merit', 'participation', 'achievement'], default: 'completion' },
    grade: { type: String },
    imageUrl: { type: String },
    verificationUrl: { type: String },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', CertificateSchema);
