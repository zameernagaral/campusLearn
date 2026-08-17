const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');
const ExamPortion = require('../models/ExamPortion');
const ExamTopic = require('../models/ExamTopic');
const StudyPlan = require('../models/StudyPlan');
const ExamPreparationProgress = require('../models/ExamPreparationProgress');

// ── GET /api/exams/portions ─────────────────────────────────────────────────
exports.getPortions = asyncHandler(async (req, res) => {
  const { subject, semester, section } = req.query;
  const filter = {};
  if (subject) filter.subject = new RegExp(subject, 'i');
  if (semester) filter.semester = parseInt(semester);
  if (section) filter.section = section;

  const portions = await ExamPortion.find(filter)
    .populate('faculty', 'name email')
    .sort({ examDate: 1 })
    .lean();

  // Attach topics for each portion
  const enriched = await Promise.all(portions.map(async (p) => {
    const topics = await ExamTopic.find({ portion: p._id }).sort({ weightage: -1 }).lean();
    return { ...p, topics };
  }));

  successResponse(res, 200, 'Portions fetched', enriched);
});

// ── POST /api/exams/portions ────────────────────────────────────────────────
exports.createPortion = asyncHandler(async (req, res) => {
  const {
    subject, semester, section, examType, examDate,
    units, subtopics, referenceNotes, referenceVideos, previousPapers, topics,
  } = req.body;

  if (!subject || !examDate) {
    return errorResponse(res, 400, 'Subject and examDate are required');
  }

  const portion = await ExamPortion.create({
    subject, semester, section,
    faculty: req.user._id,
    examType: examType || 'Mid-Term',
    examDate: new Date(examDate),
    units: units || [],
    subtopics: subtopics || [],
    referenceNotes: referenceNotes || [],
    referenceVideos: referenceVideos || [],
    previousPapers: previousPapers || [],
  });

  // Create topics if provided
  if (topics && Array.isArray(topics)) {
    const topicDocs = topics.map(t => ({
      portion: portion._id,
      name: t.name,
      unit: t.unit,
      importance: t.importance || 'Moderate',
      weightage: t.weightage || 5,
      estimatedTime: t.estimatedTime || 60,
    }));
    await ExamTopic.insertMany(topicDocs);
  }

  successResponse(res, 201, 'Exam portion created', portion);
});

// ── PUT /api/exams/portions/:id ─────────────────────────────────────────────
exports.updatePortion = asyncHandler(async (req, res) => {
  const portion = await ExamPortion.findById(req.params.id);
  if (!portion) return errorResponse(res, 404, 'Portion not found');

  if (req.user.role === 'faculty' && String(portion.faculty) !== String(req.user._id)) {
    return errorResponse(res, 403, 'Not authorized to update this portion');
  }

  Object.assign(portion, req.body);
  await portion.save();
  successResponse(res, 200, 'Portion updated', portion);
});

// ── GET /api/exams/topics ───────────────────────────────────────────────────
exports.getTopics = asyncHandler(async (req, res) => {
  const { portionId, importance } = req.query;
  const filter = {};
  if (portionId) filter.portion = portionId;
  if (importance) filter.importance = importance;

  const topics = await ExamTopic.find(filter)
    .populate('portion', 'subject examDate examType')
    .sort({ weightage: -1 })
    .lean();

  successResponse(res, 200, 'Topics fetched', topics);
});

// ── POST /api/exams/study-plan ──────────────────────────────────────────────
exports.generateStudyPlan = asyncHandler(async (req, res) => {
  const { portionId, availableHoursPerDay } = req.body;

  const topics = await ExamTopic.find({ portion: portionId }).sort({ weightage: -1 }).lean();
  const portion = await ExamPortion.findById(portionId).lean();

  if (!topics.length) {
    return errorResponse(res, 404, 'No topics found for this portion');
  }

  // Generate study plan: distribute topics across available days
  const daysLeft = Math.max(1, Math.ceil((new Date(portion?.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
  const hoursPerDay = availableHoursPerDay || 4;
  const totalMinutes = daysLeft * hoursPerDay * 60;

  const plan = topics.map((t, i) => ({
    day: Math.floor(i / 2) + 1,
    topic: t.name,
    importance: t.importance,
    estimatedMinutes: t.estimatedTime || 60,
    weightage: t.weightage,
  }));

  const studyPlan = await StudyPlan.findOneAndUpdate(
    { student: req.user._id, portion: portionId },
    {
      student: req.user._id,
      portion: portionId,
      plan,
      daysLeft,
      hoursPerDay,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  successResponse(res, 200, 'Study plan generated', { studyPlan, daysLeft, totalMinutes });
});

// ── GET /api/exams/study-progress ──────────────────────────────────────────
exports.getProgress = asyncHandler(async (req, res) => {
  const progress = await ExamPreparationProgress.find({ student: req.user._id })
    .populate('portion', 'subject examDate examType')
    .lean();

  successResponse(res, 200, 'Progress fetched', progress);
});
