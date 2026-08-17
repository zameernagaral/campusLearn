const asyncHandler = require('../utils/asyncHandler');

exports.getRisk = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: 'Not implemented yet' });
});

exports.getShortage = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: 'Not implemented yet' });
});

exports.getPrediction = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: 'Not implemented yet' });
});

exports.getAlerts = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: 'Not implemented yet' });
});

exports.sendAlert = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: 'Not implemented yet' });
});

