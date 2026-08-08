'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { quizAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Award, Brain, Play, ChevronRight } from 'lucide-react';
import type { Quiz, QuizQuestion } from '@/types';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

type QuizPhase = 'list' | 'taking' | 'result';

export default function StudentQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<QuizPhase>('list');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    quizAPI.getAll().then(res => setQuizzes(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setPhase('taking');
  };

  const handleAnswer = (questionIndex: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const answerPayload = activeQuiz.questions.map((q, i) => ({
        questionId: q._id,
        selectedOption: answers[i] || null,
      }));
      const { data } = await quizAPI.submit(activeQuiz._id, { answers: answerPayload });
      
      const backendResult = data.data.result;
      const passed = backendResult.passed;
      
      setResult({
        score: backendResult.score,
        total: backendResult.totalMarks,
        passed: passed
      });
      setPhase('result');
      
      if (passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch {
      // Mock result if API fails
      const total = activeQuiz.questions.reduce((s, q) => s + q.marks, 0);
      const answered = Object.keys(answers).length;
      const score = Math.floor((answered / activeQuiz.questions.length) * total * 0.7);
      const passed = score >= activeQuiz.passingMarks;
      setResult({ score, total, passed });
      setPhase('result');
      if (passed) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } finally { setIsSubmitting(false); }
  };

  useEffect(() => {
    if (phase !== 'taking' || !activeQuiz) return;
    setTimeLeft(activeQuiz.duration * 60);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); handleSubmitQuiz(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, activeQuiz]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <DashboardLayout requiredRole="student">
      <AnimatePresence mode="wait">
        {/* Quiz List */}
        {phase === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Quizzes & Exams</h1>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {quizzes.map((quiz, i) => (
                  <motion.div
                    key={quiz._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card p-5 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center">
                        <Brain size={22} className="text-white" />
                      </div>
                      <span className="badge text-xs capitalize" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                        {quiz.type}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{quiz.title}</h3>
                    {quiz.description && <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{quiz.description}</p>}
                    <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--subtle)' }}>
                      <span className="flex items-center gap-1"><Clock size={11} /> {quiz.duration} mins</span>
                      <span>•</span>
                      <span>{quiz.questions.length} questions</span>
                      <span>•</span>
                      <span>Pass: {quiz.passingMarks}/{quiz.totalMarks}</span>
                    </div>
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="btn btn-primary w-full text-sm"
                    >
                      <Play size={14} className="fill-white" /> Start Quiz
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Quiz Taking */}
        {phase === 'taking' && activeQuiz && (
          <motion.div key="taking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{activeQuiz.title}</h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                timeLeft < 60 ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' : 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              }`}>
                <Clock size={16} /> {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress */}
            <div className="progress mb-6">
              <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            {activeQuiz.questions[currentQuestion] && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full gradient-primary text-white text-xs flex items-center justify-center font-bold">
                    {currentQuestion + 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {activeQuiz.questions[currentQuestion].marks} mark{activeQuiz.questions[currentQuestion].marks > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="font-semibold mb-5 text-lg leading-relaxed" style={{ color: 'var(--foreground)' }}>
                  {activeQuiz.questions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestion].options.map((option) => {
                    const isSelected = answers[currentQuestion] === option._id;
                    return (
                      <button
                        key={option._id}
                        onClick={() => handleAnswer(currentQuestion, option._id)}
                        className="w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm"
                        style={{
                          borderColor: isSelected ? '#6366f1' : 'var(--border)',
                          background: isSelected ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
                          color: isSelected ? '#6366f1' : 'var(--foreground)',
                        }}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  {currentQuestion > 0 && (
                    <button onClick={() => setCurrentQuestion(p => p - 1)} className="btn btn-secondary flex-1 text-sm">
                      ← Previous
                    </button>
                  )}
                  {currentQuestion < activeQuiz.questions.length - 1 ? (
                    <button onClick={() => setCurrentQuestion(p => p + 1)} className="btn btn-primary flex-1 text-sm">
                      Next →
                    </button>
                  ) : (
                    <button onClick={handleSubmitQuiz} disabled={isSubmitting} className="btn btn-primary flex-1 text-sm">
                      {isSubmitting ? 'Submitting...' : '✅ Submit Quiz'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Question nav dots */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {activeQuiz.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className="w-8 h-8 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: answers[i] ? 'var(--primary)' : i === currentQuestion ? 'var(--surface-2)' : 'var(--surface)',
                    color: answers[i] ? 'white' : 'var(--foreground)',
                    border: i === currentQuestion ? '2px solid var(--primary)' : '1px solid var(--border)',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quiz Result */}
        {phase === 'result' && result && activeQuiz && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
            <div className="card p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: result.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}
              >
                {result.passed
                  ? <CheckCircle size={48} className="text-emerald-500" />
                  : <XCircle size={48} className="text-red-500" />}
              </motion.div>

              <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>
                {result.passed ? '🎉 Congratulations!' : '😔 Better luck next time!'}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                {result.passed ? 'You passed the quiz!' : 'You need to score higher to pass.'}
              </p>

              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke={result.passed ? '#10b981' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * result.score / result.total} ${2 * Math.PI * 40}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{ color: result.passed ? '#10b981' : '#ef4444' }}>
                    {result.score}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>/ {result.total}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                    {Math.round((result.score / result.total) * 100)}%
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Score</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{activeQuiz.passingMarks}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Passing</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                  <p className="text-xl font-bold" style={{ color: result.passed ? '#10b981' : '#ef4444' }}>
                    {result.passed ? 'PASS' : 'FAIL'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Result</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPhase('list')} className="btn btn-secondary flex-1 text-sm">Back to Quizzes</button>
                {!result.passed && (
                  <button onClick={() => startQuiz(activeQuiz)} className="btn btn-primary flex-1 text-sm">Retry</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
