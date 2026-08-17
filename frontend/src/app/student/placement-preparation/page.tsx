'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Briefcase, Code, Users, FileText, Cpu, Star, ArrowRight, ArrowLeft,
  CheckCircle, X, Clock, Trophy, TrendingUp, ChevronRight, Loader2,
  Mic, Upload, Sparkles
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

type ModuleKey = 'Aptitude' | 'Coding' | 'AI Mock Interview' | 'Resume Analyzer';
type Phase = 'dashboard' | 'module-intro' | 'assessing' | 'results';

interface Question {
  q: string;
  options: string[];
  ans: number;
}

interface Company {
  name: string;
  role: string;
  match: number;
  initial: string;
}

interface ModuleScores {
  aptitude: number;
  coding: number;
  interview: number;
  resume: number;
}

const MODULE_QUESTIONS: Record<'Aptitude' | 'Coding', Question[]> = {
  Aptitude: [
    { q: 'A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?', options: ['120 meters', '150 meters', '180 meters', '324 meters'], ans: 1 },
    { q: 'If 20% of a number is 40, what is 50% of that number?', options: ['80', '100', '120', '160'], ans: 1 },
    { q: 'A can do a work in 10 days and B in 15 days. In how many days will they finish together?', options: ['5 days', '6 days', '7 days', '8 days'], ans: 1 },
    { q: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', options: ['38', '40', '42', '44'], ans: 2 },
    { q: 'The ratio of boys to girls in a class is 3:2. If there are 30 students, how many are girls?', options: ['10', '12', '15', '18'], ans: 1 },
  ],
  Coding: [
    { q: 'What is the time complexity of binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], ans: 2 },
    { q: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1 },
    { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'Standard Query Link', 'System Query Layer'], ans: 0 },
    { q: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], ans: 2 },
    { q: 'In OOP, what is encapsulation?', options: ['Inheriting properties', 'Hiding internal details', 'Creating multiple objects', 'Overloading methods'], ans: 1 },
  ],
};

const MODULE_META: Record<ModuleKey, { icon: typeof Cpu; color: string; bg: string; description: string }> = {
  Aptitude: { icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', description: 'Sharpen your quantitative, logical, and verbal reasoning skills with adaptive AI questions.' },
  Coding: { icon: Code, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', description: 'Practice DSA, time complexity, and core programming concepts for technical rounds.' },
  'AI Mock Interview': { icon: Users, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10', description: 'Simulate real HR and technical interviews with AI feedback on your responses.' },
  'Resume Analyzer': { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', description: 'Upload your resume and get AI-powered suggestions to improve your placement profile.' },
};

const INTERVIEW_QUESTIONS = [
  'Tell me about a time you had to overcome a difficult technical challenge.',
  'Describe a project you are most proud of and your role in it.',
  'How do you handle disagreements within a team?',
  'Where do you see yourself in five years?',
];

export default function PlacementPreparationPage() {
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastScore, setLastScore] = useState<{ score: number; total: number; module: ModuleKey } | null>(null);

  const [scores, setScores] = useState<ModuleScores>({ aptitude: 80, coding: 75, interview: 60, resume: 85 });
  const [companies, setCompanies] = useState<Company[]>([
    { name: 'Google', role: 'Software Engineer', match: 85, initial: 'G' },
    { name: 'Microsoft', role: 'SDE', match: 70, initial: 'M' },
  ]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const [interviewStep, setInterviewStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState<boolean[]>([]);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const overallReadiness = Math.round((scores.aptitude + scores.coding + scores.interview + scores.resume) / 4);

  const getQuestions = (): Question[] => {
    if (activeModule === 'Aptitude' || activeModule === 'Coding') {
      return MODULE_QUESTIONS[activeModule];
    }
    return [];
  };

  const questions = getQuestions();
  const isQuizModule = activeModule === 'Aptitude' || activeModule === 'Coding';
  const isLastQuestion = isQuizModule
    ? currentQuestion === questions.length - 1
    : activeModule === 'AI Mock Interview'
      ? interviewStep === INTERVIEW_QUESTIONS.length - 1
      : true;

  const handleFinishAssessment = useCallback((score: number, total: number) => {
    if (!activeModule) return;
    setLastScore({ score, total, module: activeModule });

    const pct = Math.round((score / total) * 100);
    if (activeModule === 'Aptitude') setScores(s => ({ ...s, aptitude: pct }));
    else if (activeModule === 'Coding') setScores(s => ({ ...s, coding: pct }));
    else if (activeModule === 'AI Mock Interview') setScores(s => ({ ...s, interview: pct }));
    else if (activeModule === 'Resume Analyzer') setScores(s => ({ ...s, resume: pct }));

    setPhase('results');
    setIsSubmitting(false);

    if (pct >= 70) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    toast.success(`Assessment complete! Score: ${pct}%`);
  }, [activeModule]);

  const handleSubmitQuiz = useCallback(() => {
    if (!activeModule || isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const finalAnswers = { ...answers };
      if (selectedOption !== null) finalAnswers[currentQuestion] = selectedOption;

      let correct = 0;
      questions.forEach((q, i) => {
        if (finalAnswers[i] === q.ans) correct++;
      });
      handleFinishAssessment(correct, questions.length);
    }, 800);
  }, [activeModule, isSubmitting, answers, selectedOption, currentQuestion, questions, handleFinishAssessment]);

  useEffect(() => {
    if (phase !== 'assessing' || !isQuizModule) return;
    setTimeLeft(600);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isQuizModule, handleSubmitQuiz]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const openModule = (mod: ModuleKey) => {
    setActiveModule(mod);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setInterviewStep(0);
    setIsSpeaking(false);
    setInterviewAnswers([]);
    setResumeUploaded(false);
    setLastScore(null);
    setPhase('module-intro');
  };

  const startAssessment = () => {
    setPhase('assessing');
    setCurrentQuestion(0);
    setSelectedOption(null);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      toast.error('Please select an answer before continuing.');
      return;
    }
    setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(answers[currentQuestion + 1] ?? null);
    }
  };

  const handlePrevQuestion = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
    }
    setCurrentQuestion(prev => prev - 1);
    setSelectedOption(answers[currentQuestion - 1] ?? null);
  };

  const handleInterviewNext = () => {
    if (!isSpeaking) {
      toast.error('Click "Start Answering" to record your response first.');
      return;
    }
    const updated = [...interviewAnswers, true];
    setInterviewAnswers(updated);
    setIsSpeaking(false);
    if (interviewStep < INTERVIEW_QUESTIONS.length - 1) {
      setInterviewStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        const score = Math.min(100, 50 + updated.length * 12);
        handleFinishAssessment(score, 100);
      }, 800);
    }
  };

  const handleResumeSubmit = () => {
    if (!resumeUploaded) {
      toast.error('Please upload your resume first.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 78;
      handleFinishAssessment(score, 100);
    }, 1200);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName.trim()) {
      setCompanies(prev => [...prev, {
        name: newCompanyName.trim(),
        role: 'Software Engineer',
        match: Math.floor(Math.random() * 40) + 50,
        initial: newCompanyName.charAt(0).toUpperCase(),
      }]);
      setNewCompanyName('');
      setIsAddingCompany(false);
      toast.success(`${newCompanyName} added to target companies!`);
    }
  };

  const resetToDashboard = () => {
    setPhase('dashboard');
    setActiveModule(null);
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setLastScore(null);
    setIsSubmitting(false);
  };

  const scoreKey = (mod: ModuleKey): keyof ModuleScores => {
    if (mod === 'Aptitude') return 'aptitude';
    if (mod === 'Coding') return 'coding';
    if (mod === 'AI Mock Interview') return 'interview';
    return 'resume';
  };

  /* ─── Results Screen ─── */
  if (phase === 'results' && lastScore && activeModule) {
    const pct = Math.round((lastScore.score / lastScore.total) * 100);
    const Meta = MODULE_META[activeModule];
    const Icon = Meta.icon;

    return (
      <DashboardLayout requiredRole="student">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto mt-8"
        >
          <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm text-center">
            <div className={`w-20 h-20 ${Meta.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              {pct >= 70 ? <Trophy size={36} className="text-orange-500" /> : <Icon size={36} className={Meta.color} />}
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Assessment Complete!</h2>
            <p className="text-zinc-500 text-sm mb-6">{activeModule}</p>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${pct * 2.64} 264`}
                  strokeLinecap="round"
                  className={pct >= 70 ? 'text-emerald-500' : pct >= 50 ? 'text-orange-500' : 'text-red-500'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{pct}%</span>
                <span className="text-xs text-zinc-500 font-medium">Score</span>
              </div>
            </div>

            {isQuizModule && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                You answered <span className="font-bold text-zinc-900 dark:text-white">{lastScore.score}</span> out of{' '}
                <span className="font-bold text-zinc-900 dark:text-white">{lastScore.total}</span> questions correctly.
              </p>
            )}

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl mb-6 text-left">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">AI Feedback</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {pct >= 80 ? 'Excellent performance! You are well-prepared for this round. Keep maintaining this level.' :
                 pct >= 60 ? 'Good effort! Focus on the areas you missed and retake the assessment to improve your score.' :
                 'Needs improvement. Review core concepts and practice more before your placement drives.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={resetToDashboard} className="flex-1 py-3 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm">
                Back to Dashboard
              </button>
              <button
                onClick={() => { setPhase('module-intro'); setCurrentQuestion(0); setAnswers({}); setSelectedOption(null); setLastScore(null); }}
                className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20"
              >
                Retake
              </button>
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
    );
  }

  /* ─── Assessment Screen ─── */
  if (phase === 'assessing' && activeModule) {
    const Meta = MODULE_META[activeModule];
    const Icon = Meta.icon;

    return (
      <DashboardLayout requiredRole="student">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={resetToDashboard} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold flex items-center gap-2 transition-colors text-sm">
              <ArrowLeft size={16} /> Exit Assessment
            </button>
            {isQuizModule && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-4 py-2 rounded-xl text-sm">
                <Clock size={16} /> {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 ${Meta.bg} rounded-xl`}><Icon size={20} className={Meta.color} /></div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{activeModule} Assessment</h1>
              {isQuizModule && (
                <p className="text-xs text-zinc-500 font-medium">Question {currentQuestion + 1} of {questions.length}</p>
              )}
            </div>
          </div>

          {isQuizModule && (
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 mb-6">
              <motion.div
                className="bg-orange-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isQuizModule && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
              >
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 leading-relaxed">
                  {questions[currentQuestion].q}
                </h2>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${
                        selectedOption === i
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500/50 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold mr-3">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeModule === 'AI Mock Interview' && (
              <motion.div
                key={interviewStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                  <div className="bg-pink-500 h-1.5 rounded-full transition-all" style={{ width: `${((interviewStep + 1) / INTERVIEW_QUESTIONS.length) * 100}%` }} />
                </div>
                <div className="bg-zinc-950 aspect-video rounded-3xl border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <Users size={64} className="text-white/10 absolute" />
                  <div className="z-20 text-center pb-8 mt-auto w-full px-8">
                    <p className="text-white/50 font-mono text-xs mb-3">
                      ● REC {String(Math.floor(interviewStep * 45 / 60)).padStart(2, '0')}:{String((interviewStep * 45) % 60).padStart(2, '0')} &nbsp;·&nbsp; Q{interviewStep + 1}/{INTERVIEW_QUESTIONS.length}
                    </p>
                    <p className="text-white text-lg font-medium leading-relaxed">&ldquo;{INTERVIEW_QUESTIONS[interviewStep]}&rdquo;</p>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                      isSpeaking
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                    }`}
                  >
                    <Mic size={18} />
                    {isSpeaking ? 'Recording...' : 'Start Answering'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeModule === 'Resume Analyzer' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900/40 p-8 sm:p-12 rounded-3xl border-2 border-dashed border-orange-300 dark:border-orange-500/30 text-center backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {resumeUploaded ? <CheckCircle size={36} className="text-emerald-500" /> : <Upload size={36} className="text-orange-500" />}
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {resumeUploaded ? 'Resume Uploaded Successfully!' : 'Upload Your Latest Resume'}
                </h2>
                <p className="text-zinc-500 text-sm mb-8">PDF, DOCX — up to 5 MB</p>
                {!resumeUploaded ? (
                  <button
                    onClick={() => { setResumeUploaded(true); toast.success('Resume uploaded!'); }}
                    className="py-3 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                  >
                    Select File
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold">
                    <FileText size={16} /> resume.pdf — 245 KB
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-6">
            {isQuizModule ? (
              <>
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="py-2.5 px-5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={isSubmitting}
                  className="py-3 px-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                  ) : isLastQuestion ? (
                    <><Sparkles size={16} /> Submit & Analyze</>
                  ) : (
                    <>Next <ChevronRight size={16} /></>
                  )}
                </button>
              </>
            ) : activeModule === 'AI Mock Interview' ? (
              <div className="w-full flex justify-end">
                <button
                  onClick={handleInterviewNext}
                  disabled={isSubmitting}
                  className="py-3 px-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                  ) : isLastQuestion ? (
                    <><Sparkles size={16} /> Complete Interview</>
                  ) : (
                    <>Next Question <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-end">
                <button
                  onClick={handleResumeSubmit}
                  disabled={isSubmitting}
                  className="py-3 px-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing Resume...</>
                  ) : (
                    <><Sparkles size={16} /> Analyze Resume</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ─── Module Intro Screen ─── */
  if (phase === 'module-intro' && activeModule) {
    const Meta = MODULE_META[activeModule];
    const Icon = Meta.icon;
    const currentScore = scores[scoreKey(activeModule)];

    return (
      <DashboardLayout requiredRole="student">
        <button onClick={resetToDashboard} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold mb-6 flex items-center gap-2 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white dark:bg-zinc-900/40 p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm text-center"
        >
          <div className={`w-20 h-20 ${Meta.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <Icon size={40} className={Meta.color} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{activeModule}</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">{Meta.description}</p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{currentScore}%</p>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Current Score</p>
            </div>
            {(activeModule === 'Aptitude' || activeModule === 'Coding') && (
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{MODULE_QUESTIONS[activeModule].length}</p>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Questions</p>
              </div>
            )}
            {(activeModule === 'Aptitude' || activeModule === 'Coding') && (
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">10</p>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Minutes</p>
              </div>
            )}
          </div>

          <button
            onClick={startAssessment}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
          >
            Start Assessment <ArrowRight size={18} />
          </button>
        </motion.div>
      </DashboardLayout>
    );
  }

  /* ─── Main Dashboard ─── */
  return (
    <DashboardLayout requiredRole="student">
      {isUpdatingProfile && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
          >
            <button onClick={() => setIsUpdatingProfile(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Update Placement Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">LinkedIn URL</label>
                <input type="text" defaultValue="https://linkedin.com/in/student" className="w-full py-2.5 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-sm text-zinc-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">GitHub URL</label>
                <input type="text" defaultValue="https://github.com/student" className="w-full py-2.5 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-sm text-zinc-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Primary Skill</label>
                <select className="w-full py-2.5 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-sm text-zinc-900 dark:text-white">
                  <option>Full Stack Development</option>
                  <option>Data Science</option>
                  <option>Cybersecurity</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsUpdatingProfile(false)} className="py-2.5 px-4 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
              <button
                onClick={() => { setIsUpdatingProfile(false); toast.success('Profile updated successfully!'); }}
                className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/20"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Placement Preparation</h1>
          <p className="text-zinc-500 mt-1 text-sm font-medium">Get ready for your dream job with AI-powered practice</p>
        </div>
        <button
          onClick={() => setIsUpdatingProfile(true)}
          className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-orange-500/20"
        >
          Update Profile
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        {/* Readiness Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-orange-500/30 transition-all hover:-translate-y-1"
        >
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-100 dark:text-zinc-800" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${overallReadiness * 2.64} 264`}
                strokeLinecap="round"
                className="text-orange-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-orange-500">{overallReadiness}%</span>
            </div>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white">Placement Ready</h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Target: 90% readiness</p>
          <div className="mt-3 flex items-center gap-1 text-emerald-500 text-xs font-bold">
            <TrendingUp size={14} /> +5% this week
          </div>
        </motion.div>

        {/* Module Cards */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          {(Object.keys(MODULE_META) as ModuleKey[]).map((mod, i) => {
            const Meta = MODULE_META[mod];
            const Icon = Meta.icon;
            const score = scores[scoreKey(mod)];
            return (
              <motion.div
                key={mod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => openModule(mod)}
                className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm flex items-center gap-4 cursor-pointer group hover:border-orange-500/30 transition-all hover:-translate-y-1"
              >
                <div className={`p-3 ${Meta.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={Meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{mod}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                      <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{score}%</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-400 group-hover:text-orange-500 transition-colors shrink-0" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Target Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
          <Briefcase size={20} className="text-orange-500" /> Target Companies
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company, i) => (
            <div
              key={i}
              onClick={() => toast(`Opening AI insights for ${company.name}...`, { icon: '🎯' })}
              className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between hover:border-orange-500/50 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 transition-colors">
                  {company.initial}
                </div>
                <div>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">{company.name}</p>
                  <p className="text-xs text-zinc-500">{company.role}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                company.match >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                company.match >= 60 ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {company.match}% Match
              </span>
            </div>
          ))}

          {!isAddingCompany ? (
            <div
              onClick={() => setIsAddingCompany(true)}
              className="p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-center gap-2 hover:border-orange-500/50 transition-all cursor-pointer text-zinc-400 hover:text-orange-500"
            >
              <Star size={20} />
              <p className="font-bold text-sm">Add Company</p>
            </div>
          ) : (
            <form onSubmit={handleSaveCompany} className="p-4 border-2 border-orange-500/50 rounded-2xl flex flex-col gap-2">
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company name..."
                className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-sm text-zinc-900 dark:text-white"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors">Save</button>
                <button type="button" onClick={() => setIsAddingCompany(false)} className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-xl text-xs transition-colors">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
