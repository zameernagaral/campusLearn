'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Book, Clock, AlertCircle, FileText, CheckCircle, Brain, ArrowLeft, Lightbulb, PlayCircle, Pause, Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ExamPreparationPage() {
 const [isStudying, setIsStudying] = useState<string | null>(null);
 const [timerActive, setTimerActive] = useState(true);
 const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
 const [videoGenerated, setVideoGenerated] = useState(false);
 const [isGenerating, setIsGenerating] = useState(false);
 const [isTakingQuiz, setIsTakingQuiz] = useState(false);
 const [quizStep, setQuizStep] = useState(0);
 const [quizScore, setQuizScore] = useState(0);
 const [quizFinished, setQuizFinished] = useState(false);
 const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
 const [isPlayingVideo, setIsPlayingVideo] = useState(false);
 const [videoProgress, setVideoProgress] = useState(0);

 const quizQuestions = [
  {
  q: "Which of the following ensures that a transaction is completely executed or not executed at all?",
  options: ["Atomicity", "Consistency", "Isolation", "Durability"],
  ans: 0
  },
  {
  q: "Which normal form removes transitive dependencies?",
  options: ["1NF", "2NF", "3NF", "BCNF"],
  ans: 2
  },
  {
  q: "What is a major advantage of B-Tree indexing?",
  options: ["Random access speed", "Range queries", "Space efficiency", "Simple to code"],
  ans: 1
  }
  ];

 useEffect(() => {
 let interval: NodeJS.Timeout;
 if (timerActive && isStudying) {
 interval = setInterval(() => {
 setTimeLeft((prev) => {
 if (prev <= 1) {
 clearInterval(interval);
 return 0;
 }
 return prev - 1;
 });
 }, 1000);
 }
 return () => clearInterval(interval);
 }, [timerActive, isStudying]);

 useEffect(() => {
 let interval: NodeJS.Timeout;
 if (isPlayingVideo) {
 interval = setInterval(() => {
 setVideoProgress(prev => {
 if (prev >= 100) {
 setIsPlayingVideo(false);
 return 100;
 }
 return prev + 2;
 });
 }, 1000);
 }
 return () => clearInterval(interval);
 }, [isPlayingVideo]);

 const formatTime = (seconds: number) => {
 const m = Math.floor(seconds / 60);
 const s = seconds % 60;
 return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
 };

 const handleGenerateVideo = () => {
 setIsGenerating(true);
 toast('AI is assembling your video summary...');
 setTimeout(() => {
 setIsGenerating(false);
 setVideoGenerated(true);
 toast.success('AI Video Generated!');
 }, 2000);
 };

 const topics = [
 { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: ' Very Important', status: 'Completed' },
 { name: 'Transaction Management (ACID properties)', importance: ' Very Important', status: 'Learning' },
 { name: 'Concurrency Control', importance: ' Important', status: 'Not Started' },
 { name: 'Indexing (B-Trees, Hash Indexes)', importance: ' Moderate', status: 'Not Started' }
 ];

 if (isStudying) {
 return (
 <DashboardLayout requiredRole="student">
  <button onClick={() => setIsStudying(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold mb-6 flex items-center gap-2 transition-colors text-sm">
  <ArrowLeft size={16} /> End Study Session
  </button>
  <div className="w-full flex flex-col items-center">
  <div className="w-full max-w-5xl flex justify-between items-center mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
  <h1 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-white"><Brain className="text-orange-500" size={32} /> AI Focus Mode</h1>
  <div className="flex items-center gap-3 text-orange-600 dark:text-orange-500 font-bold bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-500/20 text-sm">
  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
  Focus Tracking Active
  </div>
  </div>
  
  <div className="w-full max-w-5xl grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-6">
 {!isTakingQuiz ? (
 <>
  <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
  <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">{isStudying}</h2>
  <div className="prose prose-sm dark:prose-invert">
  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed"><strong>1. Introduction</strong><br/>This topic covers the fundamental principles of data organization within a relational database...</p>
  <div className="my-6 p-5 bg-orange-50/50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-2xl">
  <p className="font-bold text-orange-600 dark:text-orange-500 mb-2 flex items-center gap-2"><Lightbulb size={18} /> AI Summary Note</p>
  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">Historically, this topic accounts for 15% of the final exam questions. Focus heavily on ACID properties.</p>
  </div>
  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed"><strong>2. Core Principles</strong><br/>Ensure you memorize the 4 main properties as they are frequently tested as short notes.</p>
  </div>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-4">
  {videoGenerated ? (
  <div className="w-full bg-zinc-950 rounded-2xl aspect-video flex flex-col items-center justify-center overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
  <iframe 
  width="100%" 
  height="100%" 
  src="https://www.youtube.com/embed/HXV3zeQKqGY" 
  title="AI Video Summary" 
  frameBorder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowFullScreen>
  </iframe>
  </div>
  ) : (
  <button 
  onClick={handleGenerateVideo} 
  disabled={isGenerating}
  className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex-1 py-4 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 transition-all text-sm"
  >
  {isGenerating ? <><Loader2 size={20} className="animate-spin" /> Generating Video...</> : <><PlayCircle size={20} /> Generate AI Video Summary</>}
  </button>
  )}
  {!videoGenerated && <button onClick={() => { setIsTakingQuiz(true); setQuizStep(0); setQuizScore(0); setQuizFinished(false); }} className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/5 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl flex-1 py-4 transition-all text-sm">Take Topic Quiz</button>}
  </div></>
 ) : quizFinished ? (
  <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm text-center">
  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
  <CheckCircle size={40} />
  </div>
  <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Quiz Completed!</h2>
  <p className="text-4xl font-bold text-orange-500 mb-2">{quizScore} <span className="text-xl text-zinc-500">/ {quizQuestions.length}</span></p>
  <p className="text-zinc-500 font-medium mb-8">You earned +{quizScore * 10} Points</p>
  <button onClick={() => setIsTakingQuiz(false)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-3 px-8 shadow-lg shadow-orange-500/20 transition-all text-sm">Return to Focus Mode</button>
  </div>
  ) : (
  <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
  <div className="flex justify-between items-center mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Quick Quiz: {isStudying}</h2>
  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Question {quizStep + 1} of {quizQuestions.length}</span>
  </div>
  <h3 className="font-bold text-lg mb-6 text-zinc-900 dark:text-white">{quizQuestions[quizStep].q}</h3>
  <div className="space-y-3 mb-8">
  {quizQuestions[quizStep].options.map((opt, i) => (
  <button 
  key={i}
  onClick={() => setQuizSelectedOption(i)}
  className={`w-full text-left p-5 rounded-2xl border transition-all font-bold ${quizSelectedOption === i ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 ring-2 ring-orange-500/20' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-500/5'}`}
  >
  {opt}
  </button>
  ))}
  </div>
  <div className="flex justify-between items-center">
  <button onClick={() => { setIsTakingQuiz(false); setQuizSelectedOption(null); }} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold text-sm px-4 py-2 transition-colors">Cancel</button>
  <button 
  onClick={() => {
  if (quizSelectedOption === null) return toast.error('Select an option!');
  
  if (quizSelectedOption === quizQuestions[quizStep].ans) {
  toast.success('+10 Points! Correct answer.');
  setQuizScore(s => s + 1);
  } else {
  toast.error('Incorrect answer!');
  }
  
  if (quizStep < quizQuestions.length - 1) {
  setQuizStep(s => s + 1);
  setQuizSelectedOption(null);
  } else {
  setQuizFinished(true);
  setQuizSelectedOption(null);
  }
  }} 
  className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-3 px-6 shadow-lg shadow-orange-500/20 transition-all text-sm"
  >
  {quizStep < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
  </button>
  </div>
  </div>
  )}
  </div>

  <div className="space-y-6">
  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20">
  <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} /> Pomodoro Timer</h3>
  <div className={`text-6xl font-bold text-center mb-6 tracking-tight ${!timerActive && 'opacity-50'}`}>
  {formatTime(timeLeft)}
  </div>
  <div className="flex justify-center gap-2">
  <button onClick={() => setTimerActive(!timerActive)} className="bg-white text-orange-600 hover:bg-zinc-50 px-6 py-2 rounded-xl flex items-center gap-2 font-bold shadow-sm transition-colors text-sm">
  {timerActive ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
  </button>
  </div>
  </div>

  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Predicted Exam Questions</h3>
  <ul className="space-y-4">
  <li className="flex gap-3 items-start bg-red-50 dark:bg-red-500/5 p-4 rounded-2xl border border-red-100 dark:border-red-500/10">
  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> 
  <span className="text-sm font-medium text-red-900 dark:text-red-400">Explain the difference between 3NF and BCNF with examples.</span>
  </li>
  <li className="flex gap-3 items-start bg-orange-50 dark:bg-orange-500/5 p-4 rounded-2xl border border-orange-100 dark:border-orange-500/10">
  <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" /> 
  <span className="text-sm font-medium text-orange-900 dark:text-orange-400">Describe the ACID properties of a transaction.</span>
  </li>
  </ul>
  </div></div>
 </div>
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout requiredRole="student">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Smart Exam Preparation</h1>
 <p className="text-muted mt-1">AI-guided study plans for upcoming exams</p>
 </div>
 </div>

  {/* Hero Exam Countdown */}
  <div className="p-8 mb-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl relative overflow-hidden shadow-lg shadow-orange-500/20">
  <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none">
  <Clock size={150} />
  </div>
  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
  <div>
  <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4 uppercase tracking-widest shadow-sm">UPCOMING EXAM</div>
  <h2 className="text-3xl font-bold mb-2">Database Management Systems</h2>
  <p className="text-white/80 font-medium">Mid-Term Examination · Sem 4</p>
  </div>
  <div className="text-center bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl min-w-[120px]">
  <p className="text-5xl font-bold mb-1">5</p>
  <p className="text-xs font-bold uppercase tracking-wider text-white/80">Days Left</p>
  </div>
  </div>
  </div>
  <div className="grid lg:grid-cols-3 gap-6">
  {/* Left Col - Progress & Plan */}
  <div className="lg:col-span-1 space-y-6">
  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
  <h3 className="font-bold mb-5 flex items-center gap-2 text-zinc-900 dark:text-white"><Target size={20} className="text-orange-500" /> Syllabus Progress</h3>
  <div className="flex items-end justify-between mb-3">
  <span className="text-4xl font-bold text-zinc-900 dark:text-white leading-none">72%</span>
  <span className="text-sm font-bold text-zinc-500 pb-0.5">Completed</span>
  </div>
  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5">
  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
  </div>
  </div>

  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
  <h3 className="font-bold mb-5 flex items-center gap-2 text-zinc-900 dark:text-white"><Brain size={20} className="text-orange-500 animate-pulse" /> AI Recommended Plan</h3>
  <div className="p-4 bg-orange-50/50 dark:bg-orange-500/5 rounded-2xl mb-4 border border-orange-200 dark:border-orange-500/20">
  <p className="font-bold text-zinc-900 dark:text-white">1. Transaction Management</p>
  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-bold">Predicted weightage: 15 Marks</p>
  <div className="mt-4 flex gap-2">
  <button onClick={() => { setIsStudying('Transaction Management'); setTimeLeft(25 * 60); setTimerActive(true); setVideoGenerated(false); setIsGenerating(false); setIsTakingQuiz(false); setQuizStep(0); setQuizScore(0); setQuizFinished(false); setQuizSelectedOption(null); }} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl w-full py-2.5 shadow-lg shadow-orange-500/20 transition-colors text-sm">Enter Focus Mode</button>
  </div>
  </div>
  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
  <p className="font-bold text-zinc-900 dark:text-white">2. Concurrency Control</p>
  <p className="text-xs text-zinc-500 mt-1 font-medium">Est. time: 60 mins · Important</p>
  </div>
  </div>
  </div>

  {/* Right Col - Topic List */}
  <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
  <div className="flex justify-between items-center mb-8">
  <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Topic Breakdown</h3>
  <div className="flex gap-2">
  <button className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 hover:text-orange-500 font-bold rounded-xl py-2 px-4 text-xs transition-all flex items-center gap-2"><FileText size={16} /> AI Mock Paper</button>
  </div>
  </div>

  <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
  <thead>
  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
  <th className="py-4 font-bold">Topic</th>
  <th className="py-4 font-bold">Importance</th>
  <th className="py-4 font-bold">Status</th>
  <th className="py-4 font-bold">Action</th>
  </tr>
  </thead>
  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
  {topics.map((t, i) => (
  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
  <td className="py-4 font-bold text-sm text-zinc-900 dark:text-white max-w-xs">{t.name}</td>
  <td className="py-4 text-xs font-bold text-zinc-500">{t.importance}</td>
  <td className="py-4">
  {t.status === 'Completed' ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle size={12} className="mr-1.5"/> Completed</span> :
  t.status === 'Learning' ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">In Progress</span> :
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">Not Started</span>}
  </td>
  <td className="py-4">
  <button onClick={() => { setIsStudying(t.name); setTimeLeft(25 * 60); setTimerActive(true); setVideoGenerated(false); setIsGenerating(false); setIsTakingQuiz(false); setQuizStep(0); setQuizScore(0); setQuizFinished(false); setQuizSelectedOption(null); }} className="text-xs text-orange-600 dark:text-orange-500 font-bold hover:bg-orange-100 dark:hover:bg-orange-500/20 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-lg transition-colors">Study →</button>
  </td>
  </tr>
  ))}
  </tbody>
  </table>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
