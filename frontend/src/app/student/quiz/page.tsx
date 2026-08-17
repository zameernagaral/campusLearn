'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { quizAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, XCircle, Brain, Play, ChevronRight,
  ArrowLeft, Loader2, Trophy, RotateCcw, Sparkles
} from 'lucide-react';
import type { Quiz } from '@/types';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { PageHeaderSkeleton } from '@/components/shared/Skeleton';
import { useAuthStore } from '@/store/authStore';

type QuizPhase = 'list' | 'taking' | 'result';

interface QuizResultState {
  score: number;
  total: number;
  passed: boolean;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}

const MOCK_QUIZZES: Quiz[] = [
  {
    _id: 'mock-quiz-1',
    title: 'DBMS Mid-Term Practice',
    description: 'Test your knowledge on normalization, transactions, and indexing.',
    course: { _id: 'c1', title: 'Database Management Systems' } as Quiz['course'],
    questions: [
      {
        _id: 'mq1', type: 'mcq', marks: 2,
        question: 'Which ACID property ensures a transaction is all-or-nothing?',
        options: [
          { _id: 'mq1a', text: 'Atomicity', isCorrect: true },
          { _id: 'mq1b', text: 'Consistency', isCorrect: false },
          { _id: 'mq1c', text: 'Isolation', isCorrect: false },
          { _id: 'mq1d', text: 'Durability', isCorrect: false },
        ],
      },
      {
        _id: 'mq2', type: 'mcq', marks: 2,
        question: 'Which normal form removes transitive dependencies?',
        options: [
          { _id: 'mq2a', text: '1NF', isCorrect: false },
          { _id: 'mq2b', text: '2NF', isCorrect: false },
          { _id: 'mq2c', text: '3NF', isCorrect: true },
          { _id: 'mq2d', text: 'BCNF', isCorrect: false },
        ],
      },
      {
        _id: 'mq3', type: 'mcq', marks: 2,
        question: 'What is the primary advantage of B-Tree indexing?',
        options: [
          { _id: 'mq3a', text: 'Hash-based lookup', isCorrect: false },
          { _id: 'mq3b', text: 'Efficient range queries', isCorrect: true },
          { _id: 'mq3c', text: 'Minimal storage', isCorrect: false },
          { _id: 'mq3d', text: 'No sorting needed', isCorrect: false },
        ],
      },
      {
        _id: 'mq4', type: 'mcq', marks: 2,
        question: 'Two-phase locking protocol prevents which anomaly?',
        options: [
          { _id: 'mq4a', text: 'Dirty reads only', isCorrect: false },
          { _id: 'mq4b', text: 'Lost updates only', isCorrect: false },
          { _id: 'mq4c', text: 'Serializability violations', isCorrect: true },
          { _id: 'mq4d', text: 'Deadlocks', isCorrect: false },
        ],
      },
      {
        _id: 'mq5', type: 'mcq', marks: 2,
        question: 'A foreign key constraint ensures:',
        options: [
          { _id: 'mq5a', text: 'Referential integrity', isCorrect: true },
          { _id: 'mq5b', text: 'Entity integrity', isCorrect: false },
          { _id: 'mq5c', text: 'Domain integrity', isCorrect: false },
          { _id: 'mq5d', text: 'Atomicity', isCorrect: false },
        ],
      },
    ],
    duration: 15,
    totalMarks: 10,
    passingMarks: 60,
    maxAttempts: 3,
    isPublished: true,
    type: 'practice',
  },
  {
    _id: 'mock-quiz-2',
    title: 'DSA Quick Assessment',
    description: 'Arrays, linked lists, stacks, and time complexity basics.',
    course: { _id: 'c2', title: 'Data Structures & Algorithms' } as Quiz['course'],
    questions: [
      {
        _id: 'dq1', type: 'mcq', marks: 2,
        question: 'Time complexity of binary search on a sorted array?',
        options: [
          { _id: 'dq1a', text: 'O(n)', isCorrect: false },
          { _id: 'dq1b', text: 'O(log n)', isCorrect: true },
          { _id: 'dq1c', text: 'O(n log n)', isCorrect: false },
          { _id: 'dq1d', text: 'O(1)', isCorrect: false },
        ],
      },
      {
        _id: 'dq2', type: 'mcq', marks: 2,
        question: 'Which structure uses LIFO?',
        options: [
          { _id: 'dq2a', text: 'Queue', isCorrect: false },
          { _id: 'dq2b', text: 'Stack', isCorrect: true },
          { _id: 'dq2c', text: 'Deque', isCorrect: false },
          { _id: 'dq2d', text: 'Graph', isCorrect: false },
        ],
      },
      {
        _id: 'dq3', type: 'mcq', marks: 2,
        question: 'Best-case time complexity of Quick Sort?',
        options: [
          { _id: 'dq3a', text: 'O(n²)', isCorrect: false },
          { _id: 'dq3b', text: 'O(n log n)', isCorrect: true },
          { _id: 'dq3c', text: 'O(n)', isCorrect: false },
          { _id: 'dq3d', text: 'O(log n)', isCorrect: false },
        ],
      },
    ],
    duration: 10,
    totalMarks: 6,
    passingMarks: 50,
    maxAttempts: 5,
    isPublished: true,
    type: 'exam',
  },
];

function gradeLocally(quiz: Quiz, answers: Record<number, string>): QuizResultState {
  let score = 0;
  let correctCount = 0;
  quiz.questions.forEach((q, i) => {
    const selected = answers[i];
    if (!selected) return;
    const correct = q.options.find(o => o.isCorrect);
    if (correct && correct._id === selected) {
      score += q.marks;
      correctCount++;
    }
  });
  const total = quiz.totalMarks;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  return {
    score, total, percentage, correctCount,
    totalQuestions: quiz.questions.length,
    passed: percentage >= quiz.passingMarks,
  };
}

function completedKey(userId: string) {
  return `quizCompleted_${userId}`;
}

function loadCompleted(userId: string): Record<string, QuizResultState> {
  try {
    const raw = localStorage.getItem(completedKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCompleted(userId: string, quizId: string, result: QuizResultState) {
  const all = loadCompleted(userId);
  all[quizId] = result;
  localStorage.setItem(completedKey(userId), JSON.stringify(all));
}

export default function StudentQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [completed, setCompleted] = useState<Record<string, QuizResultState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<QuizPhase>('list');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<QuizResultState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const res = await quizAPI.getAll();
        const data: Quiz[] = res.data?.data || [];
        setQuizzes(data.length > 0 ? data : MOCK_QUIZZES);
      } catch {
        setQuizzes(MOCK_QUIZZES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
    if (user?._id) setCompleted(loadCompleted(user._id));
  }, [user?._id]);

  const finishQuiz = useCallback((quizResult: QuizResultState, quizId: string) => {
    setResult(quizResult);
    setPhase('result');
    setCompleted(prev => ({ ...prev, [quizId]: quizResult }));
    saveCompleted(user?._id || 'guest', quizId, quizResult);
    if (quizResult.passed) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
    toast.success(quizResult.passed ? 'Quiz passed!' : 'Quiz submitted.');
  }, [user?._id]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!activeQuiz || isSubmitting) return;
    setIsSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const answerPayload = activeQuiz.questions.map((q, i) => ({
        questionId: q._id,
        selectedOption: answers[i] || null,
      }));
      const { data } = await quizAPI.submit(activeQuiz._id, { answers: answerPayload, timeTaken });
      const backendResult = data.data.result;
      finishQuiz({
        score: backendResult.score,
        total: backendResult.totalMarks,
        percentage: backendResult.percentage ?? Math.round((backendResult.score / backendResult.totalMarks) * 100),
        passed: backendResult.passed,
        correctCount: backendResult.answers?.filter((a: { isCorrect: boolean }) => a.isCorrect).length ?? 0,
        totalQuestions: activeQuiz.questions.length,
      }, activeQuiz._id);
    } catch {
      const local = gradeLocally(activeQuiz, answers);
      finishQuiz(local, activeQuiz._id);
    } finally {
      setIsSubmitting(false);
    }
  }, [activeQuiz, isSubmitting, answers, finishQuiz]);

  useEffect(() => {
    if (phase !== 'taking' || !activeQuiz) return;
    setTimeLeft(activeQuiz.duration * 60);
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); handleSubmitQuiz(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, activeQuiz, handleSubmitQuiz]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setPhase('taking');
  };

  const handleAnswer = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: optionId }));
  };

  const goNext = () => {
    if (!answers[currentQuestion]) {
      toast.error('Please select an answer before continuing.');
      return;
    }
    if (currentQuestion < (activeQuiz?.questions.length ?? 1) - 1) {
      setCurrentQuestion(p => p + 1);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const getCourseTitle = (course: Quiz['course']) =>
    typeof course === 'object' && course !== null ? (course as { title?: string }).title ?? 'Course' : 'Course';

  const TYPE_COLORS: Record<string, string> = {
    practice: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    exam: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    assignment: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  };

  return (
    <DashboardLayout requiredRole="student">
      <AnimatePresence mode="wait">
        {/* ── Quiz List ── */}
        {phase === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLoading ? (
              <>
                <PageHeaderSkeleton />
                <div className="grid md:grid-cols-2 gap-4">
                  {Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-44 rounded-3xl" />)}
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quizzes & Exams</h1>
                  <p className="text-sm mt-0.5 text-zinc-500">Test your knowledge and track your progress</p>
                </div>

                {quizzes.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900/40 flex flex-col items-center py-20 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                    <Brain size={56} className="text-zinc-300 dark:text-zinc-600 mb-4" />
                    <p className="font-bold text-zinc-900 dark:text-white">No quizzes available</p>
                    <p className="text-sm text-zinc-500 mt-1">Check back when your faculty publishes one</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {quizzes.map((quiz, i) => {
                      const done = completed[quiz._id];
                      return (
                        <motion.div
                          key={quiz._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/30 transition-all group backdrop-blur-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Brain size={22} className="text-orange-500" />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${TYPE_COLORS[quiz.type] ?? TYPE_COLORS.practice}`}>
                                {quiz.type}
                              </span>
                              {done && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${done.passed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'}`}>
                                  {done.percentage}%
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{quiz.title}</h3>
                          <p className="text-xs text-zinc-500 mb-1">{getCourseTitle(quiz.course)}</p>
                          {quiz.description && <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{quiz.description}</p>}
                          <div className="flex items-center gap-3 mb-4 text-xs text-zinc-400 font-medium">
                            <span className="flex items-center gap-1"><Clock size={11} /> {quiz.duration} min</span>
                            <span>·</span>
                            <span>{quiz.questions.length} questions</span>
                            <span>·</span>
                            <span>Pass {quiz.passingMarks}%</span>
                          </div>
                          <button
                            onClick={() => startQuiz(quiz)}
                            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                          >
                            {done ? <><RotateCcw size={14} /> Retake Quiz</> : <><Play size={14} /> Start Quiz</>}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ── Taking Quiz ── */}
        {phase === 'taking' && activeQuiz && (
          <motion.div key="taking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            <button
              onClick={() => { if (confirm('Leave quiz? Your progress will be lost.')) setPhase('list'); }}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold flex items-center gap-2 mb-6 text-sm transition-colors"
            >
              <ArrowLeft size={16} /> Exit Quiz
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{activeQuiz.title}</h2>
                <p className="text-xs text-zinc-500 font-medium">Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                timeLeft < 60 ? 'text-red-500 bg-red-50 dark:bg-red-500/10 animate-pulse' : 'text-orange-600 bg-orange-50 dark:bg-orange-500/10'
              }`}>
                <Clock size={16} /> {formatTime(timeLeft)}
              </div>
            </div>

            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mb-6">
              <motion.div
                className="bg-orange-500 h-1.5 rounded-full"
                animate={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              {activeQuiz.questions[currentQuestion] && (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                      {currentQuestion + 1}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">
                      {activeQuiz.questions[currentQuestion].marks} mark{activeQuiz.questions[currentQuestion].marks > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="font-bold mb-5 text-base leading-relaxed text-zinc-900 dark:text-white">
                    {activeQuiz.questions[currentQuestion].question}
                  </p>

                  <div className="space-y-3">
                    {activeQuiz.questions[currentQuestion].options.map((option, oi) => {
                      const isSelected = answers[currentQuestion] === option._id;
                      return (
                        <button
                          key={option._id}
                          onClick={() => handleAnswer(option._id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-bold mr-2">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {option.text}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    {currentQuestion > 0 && (
                      <button onClick={() => setCurrentQuestion(p => p - 1)} className="flex-1 py-3 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors">
                        ← Previous
                      </button>
                    )}
                    {currentQuestion < activeQuiz.questions.length - 1 ? (
                      <button onClick={goNext} className="flex-1 py-3 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center justify-center gap-1 shadow-lg shadow-orange-500/20">
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="flex-1 py-3 text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                      >
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Sparkles size={16} /> Submit Quiz</>}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question nav */}
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
              {activeQuiz.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    answers[i]
                      ? 'bg-orange-500 text-white'
                      : i === currentQuestion
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white ring-2 ring-orange-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {phase === 'result' && result && activeQuiz && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center ${
                  result.passed ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'
                }`}
              >
                {result.passed ? <Trophy size={40} className="text-emerald-500" /> : <XCircle size={40} className="text-red-500" />}
              </motion.div>

              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-sm text-zinc-500 mb-6">{activeQuiz.title}</p>

              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={`${result.percentage * 2.64} 264`}
                    strokeLinecap="round"
                    className={result.passed ? 'text-emerald-500' : 'text-red-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>{result.percentage}%</span>
                  <span className="text-xs text-zinc-400">{result.score}/{result.total}</span>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                You got <span className="font-bold text-zinc-900 dark:text-white">{result.correctCount}</span> out of{' '}
                <span className="font-bold text-zinc-900 dark:text-white">{result.totalQuestions}</span> questions correct.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-xl font-bold text-orange-500">{result.percentage}%</p>
                  <p className="text-xs text-zinc-400 font-medium">Score</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">{activeQuiz.passingMarks}%</p>
                  <p className="text-xs text-zinc-400 font-medium">Passing</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className={`text-xl font-bold ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                    {result.passed ? 'PASS' : 'FAIL'}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">Result</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setPhase('list'); setActiveQuiz(null); }} className="flex-1 py-3 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors">
                  Back to Quizzes
                </button>
                {!result.passed && (
                  <button onClick={() => startQuiz(activeQuiz)} className="flex-1 py-3 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                    Retry
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
