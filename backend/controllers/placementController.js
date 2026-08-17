const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/response');
const PlacementProfile = require('../models/PlacementProfile');
const PlacementProgress = require('../models/PlacementProgress');
const PlacementAchievement = require('../models/PlacementAchievement');
const AptitudeQuestion = require('../models/AptitudeQuestion');
const CodingQuestion = require('../models/CodingQuestion');
const TechnicalQuestion = require('../models/TechnicalQuestion');
const HRQuestion = require('../models/HRQuestion');
const InterviewSession = require('../models/InterviewSession');
const InterviewAnswer = require('../models/InterviewAnswer');
const Company = require('../models/Company');
const ResumeProfile = require('../models/ResumeProfile');
const ResumeAnalysis = require('../models/ResumeAnalysis');

// ── GET /api/placement/dashboard ────────────────────────────────────────────
exports.getDashboard = asyncHandler(async (req, res) => {
  let profile = await PlacementProfile.findOne({ student: req.user._id }).lean();
  if (!profile) {
    profile = {
      readinessScore: 0, aptitudeScore: 0, codingScore: 0,
      technicalScore: 0, communicationScore: 0, resumeScore: 0, interviewScore: 0,
    };
  }

  const achievements = await PlacementAchievement.find({ student: req.user._id })
    .sort({ createdAt: -1 }).limit(5).lean();

  const progress = await PlacementProgress.find({ student: req.user._id })
    .sort({ updatedAt: -1 }).lean();

  const companies = await Company.find({}).limit(6).lean();

  const overall = Math.round(
    (profile.aptitudeScore + profile.codingScore + profile.technicalScore +
     profile.communicationScore + profile.resumeScore + profile.interviewScore) / 6
  );

  successResponse(res, 200, 'Dashboard fetched', {
    profile: { ...profile, readinessScore: overall },
    achievements,
    progress,
    companies: companies.slice(0, 6),
    overall,
  });
});

// ── GET /api/placement/aptitude ─────────────────────────────────────────────
exports.getAptitude = asyncHandler(async (req, res) => {
  const { category, difficulty, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await AptitudeQuestion.find(filter)
    .limit(parseInt(limit))
    .lean();

  successResponse(res, 200, 'Aptitude questions fetched', questions);
});

// ── POST /api/placement/aptitude/test ───────────────────────────────────────
exports.submitAptitudeTest = asyncHandler(async (req, res) => {
  const { answers, timeTaken, category } = req.body;
  const questions = await AptitudeQuestion.find({ _id: { $in: Object.keys(answers || {}) } }).lean();

  let correct = 0;
  for (const q of questions) {
    if (String(answers[q._id]) === String(q.correctAnswer)) correct++;
  }

  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  await PlacementProfile.findOneAndUpdate(
    { student: req.user._id },
    { $set: { aptitudeScore: score } },
    { upsert: true }
  );

  await PlacementProgress.findOneAndUpdate(
    { student: req.user._id, module: 'aptitude' },
    { $set: { score, timeTaken, updatedAt: new Date() } },
    { upsert: true }
  );

  successResponse(res, 200, 'Test submitted', { score, correct, total: questions.length });
});

// ── GET /api/placement/coding ────────────────────────────────────────────────
exports.getCodingQuestions = asyncHandler(async (req, res) => {
  const { topic, difficulty, limit = 10 } = req.query;
  const filter = {};
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await CodingQuestion.find(filter).limit(parseInt(limit)).lean();
  successResponse(res, 200, 'Coding questions fetched', questions);
});

// ── POST /api/placement/mock-test ────────────────────────────────────────────
exports.submitMockTest = asyncHandler(async (req, res) => {
  const { type, score, timeTaken, answers } = req.body;

  const updateField = {
    aptitude: 'aptitudeScore',
    coding: 'codingScore',
    technical: 'technicalScore',
    hr: 'communicationScore',
  }[type] || 'aptitudeScore';

  await PlacementProfile.findOneAndUpdate(
    { student: req.user._id },
    { $set: { [updateField]: score } },
    { upsert: true }
  );

  await PlacementProgress.findOneAndUpdate(
    { student: req.user._id, module: type },
    { $set: { score, timeTaken, updatedAt: new Date() } },
    { upsert: true }
  );

  successResponse(res, 200, 'Mock test submitted', { score });
});

// ── POST /api/placement/interview/start ─────────────────────────────────────
exports.startInterview = asyncHandler(async (req, res) => {
  const { jobRole, interviewType, difficulty, questionCount } = req.body;

  // Fetch relevant questions
  let questions = [];
  if (interviewType === 'HR') {
    questions = await HRQuestion.find({ difficulty: difficulty || 'Medium' })
      .limit(parseInt(questionCount) || 5).lean();
  } else {
    questions = await TechnicalQuestion.find({
      difficulty: difficulty || 'Medium',
      ...(jobRole && { tags: { $in: [jobRole] } }),
    }).limit(parseInt(questionCount) || 5).lean();
  }

  const session = await InterviewSession.create({
    student: req.user._id,
    jobRole,
    interviewType,
    difficulty,
    status: 'in-progress',
    questions: questions.map(q => q._id),
    startedAt: new Date(),
  });

  successResponse(res, 201, 'Interview started', {
    sessionId: session._id,
    questions,
  });
});

// ── POST /api/placement/interview/answer ─────────────────────────────────────
exports.submitAnswer = asyncHandler(async (req, res) => {
  const { sessionId, questionId, answer, timeTaken } = req.body;

  const interviewAnswer = await InterviewAnswer.create({
    session: sessionId,
    student: req.user._id,
    question: questionId,
    answer,
    timeTaken,
  });

  successResponse(res, 201, 'Answer submitted', interviewAnswer);
});

// ── POST /api/placement/interview/complete ───────────────────────────────────
exports.completeInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) return errorResponse(res, 404, 'Session not found');

  // Calculate scores (simple AI simulation)
  const answers = await InterviewAnswer.find({ session: sessionId }).lean();
  const completionRate = session.questions.length > 0
    ? Math.round((answers.length / session.questions.length) * 100)
    : 0;

  const overallScore = Math.min(100, 50 + completionRate * 0.4 + Math.random() * 10);
  const technicalScore = Math.round(overallScore * (0.8 + Math.random() * 0.4));
  const communicationScore = Math.round(overallScore * (0.7 + Math.random() * 0.5));

  session.status = 'completed';
  session.completedAt = new Date();
  session.overallScore = Math.round(overallScore);
  session.technicalScore = Math.min(100, technicalScore);
  session.communicationScore = Math.min(100, communicationScore);
  await session.save();

  // Update profile
  await PlacementProfile.findOneAndUpdate(
    { student: req.user._id },
    { $set: { interviewScore: Math.round(overallScore), communicationScore: Math.min(100, communicationScore) } },
    { upsert: true }
  );

  successResponse(res, 200, 'Interview completed', {
    overallScore: Math.round(overallScore),
    technicalScore: Math.min(100, technicalScore),
    communicationScore: Math.min(100, communicationScore),
    feedback: overallScore >= 80
      ? 'Excellent! Well-prepared for placements.'
      : overallScore >= 60
      ? 'Good effort. Focus on weak areas and practice more.'
      : 'Needs improvement. Review core concepts and retry.',
    strengths: ['Problem solving', 'Communication clarity'],
    weaknesses: overallScore < 70 ? ['Core CS fundamentals', 'Algorithm complexity'] : ['Advanced system design'],
  });
});

// ── POST /api/placement/resume/analyze ──────────────────────────────────────
exports.analyzeResume = asyncHandler(async (req, res) => {
  const { resumeText, skills, education, projects, experience, certifications } = req.body;

  // Simulate AI analysis
  const score = Math.floor(Math.random() * 20) + 75;
  const keywordsFound = (skills || []).length;
  const missingKeywords = ['Docker', 'Kubernetes', 'System Design', 'Leadership'].filter(k =>
    !resumeText?.toLowerCase().includes(k.toLowerCase())
  );

  const analysis = await ResumeAnalysis.create({
    student: req.user._id,
    score,
    atsScore: Math.round(score * 0.9),
    keywordsFound,
    missingKeywords,
    suggestions: [
      'Add quantifiable achievements (e.g., "Improved performance by 30%")',
      'Include relevant keywords from job descriptions',
      'Add a concise professional summary',
      missingKeywords.length > 0 ? `Add skills: ${missingKeywords.slice(0, 2).join(', ')}` : 'Great keyword coverage!',
    ],
    strengths: ['Clear education section', 'Good project descriptions', 'Relevant skills listed'],
    analyzedAt: new Date(),
  });

  await PlacementProfile.findOneAndUpdate(
    { student: req.user._id },
    { $set: { resumeScore: score } },
    { upsert: true }
  );

  successResponse(res, 200, 'Resume analyzed', analysis);
});

// ── GET /api/placement/companies ─────────────────────────────────────────────
exports.getCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search ? { name: new RegExp(search, 'i') } : {};
  const companies = await Company.find(filter).lean();
  successResponse(res, 200, 'Companies fetched', companies);
});

// ── GET /api/placement/companies/:id ────────────────────────────────────────
exports.getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).lean();
  if (!company) return errorResponse(res, 404, 'Company not found');
  successResponse(res, 200, 'Company fetched', company);
});

// ── GET /api/placement/progress ──────────────────────────────────────────────
exports.getProgress = asyncHandler(async (req, res) => {
  const profile = await PlacementProfile.findOne({ student: req.user._id }).lean();
  const progress = await PlacementProgress.find({ student: req.user._id }).lean();
  const sessions = await InterviewSession.find({ student: req.user._id })
    .sort({ createdAt: -1 }).limit(5).lean();

  successResponse(res, 200, 'Progress fetched', { profile, progress, sessions });
});
