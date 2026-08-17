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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    toast('AI is assembling your video summary...', { icon: '🤖' });
    setTimeout(() => {
      setIsGenerating(false);
      setVideoGenerated(true);
      toast.success('AI Video Generated!');
    }, 2000);
  };

  const topics = [
    { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: '🔴 Very Important', status: 'Completed' },
    { name: 'Transaction Management (ACID properties)', importance: '🔴 Very Important', status: 'Learning' },
    { name: 'Concurrency Control', importance: '🟠 Important', status: 'Not Started' },
    { name: 'Indexing (B-Trees, Hash Indexes)', importance: '🟡 Moderate', status: 'Not Started' }
  ];

  if (isStudying) {
    return (
      <DashboardLayout requiredRole="student">
        <button onClick={() => setIsStudying(null)} className="btn btn-ghost mb-4 flex items-center gap-2">
          <ArrowLeft size={16} /> End Study Session
        </button>
        <div className="card p-8 min-h-[60vh] flex flex-col items-center">
          <div className="w-full max-w-4xl flex justify-between items-center mb-8 pb-4 border-b border-border">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Brain className="text-indigo-500" /> AI Focus Mode</h1>
            <div className="flex items-center gap-2 text-indigo-500 font-mono font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Focus Tracking Active
            </div>
          </div>
          
          <div className="w-full max-w-4xl grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-surface-2 p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold mb-4">{isStudying}</h2>
                <div className="prose prose-sm dark:prose-invert">
                  <p><strong>1. Introduction</strong><br/>This topic covers the fundamental principles of data organization within a relational database...</p>
                  <div className="my-4 p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r">
                    <p className="font-bold text-amber-700 dark:text-amber-500 mb-1 flex items-center gap-2"><Lightbulb size={16} /> AI Summary Note</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Historically, this topic accounts for 15% of the final exam questions. Focus heavily on ACID properties.</p>
                  </div>
                  <p><strong>2. Core Principles</strong><br/>Ensure you memorize the 4 main properties as they are frequently tested as short notes.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                {videoGenerated ? (
                  <div className="w-full bg-black rounded-xl aspect-video flex flex-col items-center justify-center text-white border-2 border-indigo-500 overflow-hidden relative">
                    <PlayCircle size={48} className="text-white/80 hover:text-white hover:scale-110 cursor-pointer transition-all z-10" onClick={() => toast.success('Playing AI Generated Summary Video...')} />
                    <p className="mt-4 font-bold z-10">AI Summary: {isStudying}</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50"></div>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateVideo} 
                    disabled={isGenerating}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><PlayCircle size={18} /> Generate AI Video Summary</>}
                  </button>
                )}
                {!videoGenerated && <button onClick={() => toast.success('Opening interactive topic quiz...')} className="btn btn-outline flex-1">Take Topic Quiz</button>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="card p-4 bg-indigo-600 text-white border-0">
                <h3 className="font-bold mb-2">Pomodoro Timer</h3>
                <div className={`text-4xl font-black text-center mb-4 ${!timerActive && 'opacity-50'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="flex justify-center gap-2">
                  <button onClick={() => setTimerActive(!timerActive)} className="btn bg-white text-indigo-600 hover:bg-gray-100 px-4 py-1 rounded flex items-center gap-1">
                    {timerActive ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
                  </button>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-bold text-sm mb-3">Predicted Exam Questions</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 items-start"><AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" /> Explain the difference between 3NF and BCNF with examples.</li>
                  <li className="flex gap-2 items-start"><AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" /> Describe the ACID properties of a transaction.</li>
                </ul>
              </div>
            </div>
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
      <div className="card p-6 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Clock size={150} />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">UPCOMING EXAM</div>
            <h2 className="text-3xl font-black mb-1">Database Management Systems</h2>
            <p className="text-white/80">Mid-Term Examination · Sem 4</p>
          </div>
          <div className="text-center bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-4xl font-black">5</p>
            <p className="text-sm font-medium uppercase tracking-wider">Days Left</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col - Progress & Plan */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-5 border-t-4 border-indigo-500">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18} className="text-indigo-500" /> Syllabus Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black">72%</span>
              <span className="text-sm text-muted pb-1">Completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="card p-5 border border-indigo-200 dark:border-indigo-900 shadow-lg shadow-indigo-500/5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Brain size={18} className="text-indigo-500 animate-pulse" /> AI Recommended Plan</h3>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl mb-3 border border-indigo-100 dark:border-indigo-800">
              <p className="font-bold text-sm">1. Transaction Management</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">Predicted weightage: 15 Marks</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setIsStudying('Transaction Management'); setTimeLeft(25 * 60); setTimerActive(true); setVideoGenerated(false); setIsGenerating(false); }} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-xs w-full py-2">Enter Focus Mode</button>
              </div>
            </div>
            <div className="p-3 bg-surface-2 rounded-xl border border-border">
              <p className="font-bold text-sm">2. Concurrency Control</p>
              <p className="text-xs text-muted mt-1">Est. time: 60 mins · 🟠 Important</p>
            </div>
          </div>
        </div>

        {/* Right Col - Topic List */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Topic Breakdown</h3>
            <div className="flex gap-2">
              <button className="btn btn-outline text-xs"><FileText size={14} /> AI Mock Paper</button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Importance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t, i) => (
                  <tr key={i}>
                    <td className="font-medium text-sm max-w-xs">{t.name}</td>
                    <td className="text-xs font-semibold">{t.importance}</td>
                    <td>
                      {t.status === 'Completed' ? <span className="badge bg-green-100 text-green-700"><CheckCircle size={12} className="mr-1"/> Completed</span> :
                       t.status === 'Learning' ? <span className="badge bg-blue-100 text-blue-700">In Progress</span> :
                       <span className="badge bg-gray-100 text-gray-600">Not Started</span>}
                    </td>
                    <td>
                      <button onClick={() => { setIsStudying(t.name); setTimeLeft(25 * 60); setTimerActive(true); setVideoGenerated(false); setIsGenerating(false); }} className="text-xs text-indigo-600 font-bold hover:underline bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded">Study →</button>
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
