const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { successResponse, errorResponse } = require('../utils/response');

// ─── @desc    Get quizzes for a course
// ─── @route   GET /api/quizzes?course=id
// ─── @access  Private
exports.getQuizzes = async (req, res, next) => {
  try {
    const query = { isPublished: true };
    if (req.query.course) query.course = req.query.course;
    if (req.user.role === 'faculty') {
      delete query.isPublished;
      query.faculty = req.user._id;
    }

    const quizzes = await Quiz.find(query)
      .populate('course', 'title')
      .select('-questions.options.isCorrect')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Quizzes fetched.', quizzes);
  } catch (error) { next(error); }
};

// ─── @desc    Get single quiz
// ─── @route   GET /api/quizzes/:id
// ─── @access  Private
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title');
    if (!quiz) return errorResponse(res, 404, 'Quiz not found.');

    // Hide correct answers from students
    if (req.user.role === 'student') {
      const sanitized = quiz.toObject();
      sanitized.questions = sanitized.questions.map(q => ({
        ...q,
        options: q.options.map(o => ({ _id: o._id, text: o.text })),
      }));
      return successResponse(res, 200, 'Quiz fetched.', sanitized);
    }

    successResponse(res, 200, 'Quiz fetched.', quiz);
  } catch (error) { next(error); }
};

// ─── @desc    Create quiz
// ─── @route   POST /api/quizzes
// ─── @access  Private (Faculty)
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create({ ...req.body, faculty: req.user._id });
    successResponse(res, 201, 'Quiz created.', quiz);
  } catch (error) { next(error); }
};

// ─── @desc    Update quiz
// ─── @route   PUT /api/quizzes/:id
// ─── @access  Private (Faculty)
exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, faculty: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!quiz) return errorResponse(res, 404, 'Quiz not found.');
    successResponse(res, 200, 'Quiz updated.', quiz);
  } catch (error) { next(error); }
};

// ─── @desc    Submit quiz answers
// ─── @route   POST /api/quizzes/:id/submit
// ─── @access  Private (Student)
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return errorResponse(res, 404, 'Quiz not found.');

    // Check attempts (temporarily disabled for testing)
    // const attemptCount = await QuizResult.countDocuments({ quiz: quiz._id, student: req.user._id });
    // if (attemptCount >= quiz.maxAttempts) {
    //   return errorResponse(res, 400, `Maximum ${quiz.maxAttempts} attempt(s) allowed.`);
    // }
    const attemptCount = await QuizResult.countDocuments({ quiz: quiz._id, student: req.user._id });

    // Grade answers
    const { answers, timeTaken } = req.body;
    let score = 0;
    const gradedAnswers = answers.map(ans => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) return { ...ans, isCorrect: false, marksObtained: 0 };

      let isCorrect = false;
      let marksObtained = 0;

      if (question.type === 'mcq' || question.type === 'true_false') {
        const correctOption = question.options.find(o => o.isCorrect);
        isCorrect = correctOption?._id.toString() === ans.selectedOption;
      } else if (question.type === 'short') {
        isCorrect = question.correctAnswer?.toLowerCase().trim() === ans.selectedOption?.toLowerCase().trim();
      }

      if (isCorrect) { marksObtained = question.marks; score += question.marks; }
      return { questionId: ans.questionId, selectedOption: ans.selectedOption, isCorrect, marksObtained };
    });

    const percentage = (score / quiz.totalMarks) * 100;
    const result = await QuizResult.create({
      quiz: quiz._id,
      student: req.user._id,
      course: quiz.course,
      answers: gradedAnswers,
      score,
      totalMarks: quiz.totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      passed: percentage >= quiz.passingMarks,
      timeTaken,
      attemptNumber: attemptCount + 1,
    });

    let safeCorrectAnswers;
    if (quiz.showResults) {
      safeCorrectAnswers = quiz.questions.map(q => {
        const correctOpt = q.type !== 'short' ? q.options.find(o => o.isCorrect) : null;
        return {
          questionId: q._id,
          correctAnswer: q.type === 'short' ? q.correctAnswer : undefined,
          correctOptionId: correctOpt ? correctOpt._id : undefined,
        };
      });
    }

    successResponse(res, 201, 'Quiz submitted.', {
      result,
      correctAnswers: safeCorrectAnswers,
    });
  } catch (error) { next(error); }
};

// ─── @desc    Get quiz results for a student
// ─── @route   GET /api/quizzes/:id/results
// ─── @access  Private
exports.getQuizResults = async (req, res, next) => {
  try {
    const query = { quiz: req.params.id };
    if (req.user.role === 'student') query.student = req.user._id;

    const results = await QuizResult.find(query)
      .populate('student', 'name rollNumber avatar')
      .sort({ score: -1 });
    successResponse(res, 200, 'Results fetched.', results);
  } catch (error) { next(error); }
};
