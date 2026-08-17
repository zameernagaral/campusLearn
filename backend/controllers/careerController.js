const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');
const CareerRoadmap = require('../models/CareerRoadmap');
const CareerGoal = require('../models/CareerGoal');
const StudentSkill = require('../models/StudentSkill');
const CareerRecommendation = require('../models/CareerRecommendation');

// ── GET /api/career/roadmap ─────────────────────────────────────────────────
exports.getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await CareerRoadmap.findOne({ student: req.user._id })
    .populate('goal')
    .lean();

  const skills = await StudentSkill.find({ student: req.user._id })
    .populate('skill')
    .lean();

  successResponse(res, 200, 'Roadmap fetched', { roadmap, skills });
});

// ── POST /api/career/roadmap ────────────────────────────────────────────────
exports.createRoadmap = asyncHandler(async (req, res) => {
  const { targetRole, currentLevel, preferredDomain, targetIndustry, graduationYear, currentSemester } = req.body;

  let roadmap = await CareerRoadmap.findOne({ student: req.user._id });
  if (roadmap) {
    Object.assign(roadmap, { targetRole, currentLevel, preferredDomain, targetIndustry, graduationYear, currentSemester });
    await roadmap.save();
  } else {
    roadmap = await CareerRoadmap.create({
      student: req.user._id,
      targetRole, currentLevel, preferredDomain, targetIndustry, graduationYear, currentSemester,
    });
  }

  successResponse(res, 201, 'Roadmap created', roadmap);
});

// ── PUT /api/career/roadmap ─────────────────────────────────────────────────
exports.updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await CareerRoadmap.findOneAndUpdate(
    { student: req.user._id },
    { $set: req.body },
    { new: true, upsert: true }
  );
  successResponse(res, 200, 'Roadmap updated', roadmap);
});

// ── POST /api/career/goals ──────────────────────────────────────────────────
exports.createGoal = asyncHandler(async (req, res) => {
  const { title, description, targetDate, priority } = req.body;
  if (!title) return errorResponse(res, 400, 'Goal title is required');

  const goal = await CareerGoal.create({
    student: req.user._id,
    title, description, targetDate, priority: priority || 'medium',
  });

  // Link goal to roadmap
  await CareerRoadmap.findOneAndUpdate(
    { student: req.user._id },
    { goal: goal._id },
    { upsert: true }
  );

  successResponse(res, 201, 'Goal created', goal);
});

// ── GET /api/career/recommendations ────────────────────────────────────────
exports.getRecommendations = asyncHandler(async (req, res) => {
  const roadmap = await CareerRoadmap.findOne({ student: req.user._id }).lean();
  const skills = await StudentSkill.find({ student: req.user._id }).populate('skill').lean();

  // Build recommendations based on career domain
  const domain = roadmap?.preferredDomain || roadmap?.targetRole || 'Software Engineering';
  const recommendations = await CareerRecommendation.find({ domains: { $in: [domain] } }).limit(10).lean();

  successResponse(res, 200, 'Recommendations fetched', { recommendations, domain });
});

// ── POST /api/career/skills ─────────────────────────────────────────────────
exports.addSkill = asyncHandler(async (req, res) => {
  const { skill, status, progress } = req.body;
  if (!skill) return errorResponse(res, 400, 'Skill is required');

  const studentSkill = await StudentSkill.create({
    student: req.user._id,
    skill,
    status: status || 'Not Started',
    progress: progress || 0,
  });

  successResponse(res, 201, 'Skill added', studentSkill);
});

// ── PUT /api/career/skills/:id ──────────────────────────────────────────────
exports.updateSkill = asyncHandler(async (req, res) => {
  const { status, progress } = req.body;

  const studentSkill = await StudentSkill.findOneAndUpdate(
    { _id: req.params.id, student: req.user._id },
    { $set: { status, progress } },
    { new: true }
  );

  if (!studentSkill) return errorResponse(res, 404, 'Skill not found');
  successResponse(res, 200, 'Skill updated', studentSkill);
});
