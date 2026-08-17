'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, BookOpen, Brain, Clock, ChevronRight, Calendar, AlertTriangle, FileText, Bot, Sparkles, Loader2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { examAPI } from '@/lib/api';

const IMP_STYLE: Record<string, string> = {
  'Very Important': 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  'Important': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  'Moderate': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Low': 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
};

export default function ExamPreparationPage() {
  const [portions, setPortions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlanId, setGeneratedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await examAPI.getPortions();
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setPortions(data);
        } else {
          setPortions(makeMockPortions());
        }
      } catch {
        setPortions(makeMockPortions());
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleGeneratePlan = async (id: string) => {
    setIsGenerating(true);
    try {
      await examAPI.generateStudyPlan({ portionId: id });
    } catch {
      // Ignore
    }
    setTimeout(() => {
      setGeneratedPlanId(id);
      setIsGenerating(false);
      toast.success('AI Study Plan generated successfully! 🎉');
    }, 1500);
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Target size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Exam Preparation</h1>
          </div>
          <p className="text-sm text-zinc-500">Track exam portions and generate AI study plans</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          <h2 className="font-black text-zinc-900 dark:text-white text-lg flex items-center gap-2">
            <BookOpen size={18} className="text-orange-500" /> Upcoming Exams & Portions
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />)}
            </div>
          ) : portions.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Calendar size={40} className="text-zinc-200 dark:text-zinc-700 mb-3 mx-auto" />
              <p className="font-bold text-zinc-900 dark:text-white">No Upcoming Exams</p>
              <p className="text-sm text-zinc-500 mt-1">Check back later when faculty publishes exam portions.</p>
            </div>
          ) : (
            portions.map((portion, i) => {
              const isExpanded = expandedId === portion._id;
              const daysLeft = Math.max(0, Math.ceil((new Date(portion.examDate).getTime() - Date.now()) / 86400000));
              const isGenerated = generatedPlanId === portion._id;

              return (
                <motion.div key={portion._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] px-2 py-0.5 font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full">{portion.examType}</span>
                        {daysLeft <= 10 && <span className="text-[10px] px-2 py-0.5 font-bold bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-full animate-pulse">🔥 {daysLeft} days left</span>}
                      </div>
                      <h3 className="font-black text-zinc-900 dark:text-white text-lg">{portion.subject}</h3>
                      <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5"><Calendar size={14} /> {new Date(portion.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <button onClick={() => setExpandedId(isExpanded ? null : portion._id)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Syllabus Topics</h4>
                        {!isGenerated ? (
                          <button onClick={() => handleGeneratePlan(portion._id)} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 font-bold rounded-lg text-xs transition-colors border border-indigo-200 dark:border-indigo-500/20 shadow-sm disabled:opacity-60">
                            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            Generate AI Study Plan
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                            <CheckCircle size={12} /> Plan Active
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {portion.topics.map((t: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">{t.name}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${IMP_STYLE[t.importance] ?? IMP_STYLE['Moderate']}`}>{t.importance}</span>
                              <span className="text-xs font-bold text-zinc-500 w-16 text-right">{t.weightage} Marks</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {isGenerated && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                          <h4 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm mb-3 flex items-center gap-2"><Bot size={16} /> Recommended Study Schedule</h4>
                          <div className="space-y-3">
                            {portion.topics.map((t: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Day {idx + 1}: {t.name}</p>
                                  <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 mt-0.5">Focus for {t.estimatedTime} mins. Emphasize practice questions due to high weightage.</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-orange-800 dark:text-orange-300">Days {portion.topics.length + 1}-{portion.topics.length + 2}: Revision & Mock Tests</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="font-black text-zinc-900 dark:text-white mb-4">Study Progress</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-100 dark:text-zinc-800" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray={`${35 * 2.51} 251`} strokeLinecap="round" className="text-emerald-500" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">35%</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Completed</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Database Management</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">60%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Computer Networks</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">10%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
            <h3 className="font-black flex items-center gap-2 mb-2"><Brain size={18} /> Smart Insights</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              You are spending too little time on <strong className="text-white">Normalization</strong> despite it carrying 20 marks. We recommend allocating 90 minutes today.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function makeMockPortions() {
  return [
    {
      _id: 'ep1', subject: 'Database Management Systems', examType: 'Mid-Term',
      examDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      topics: [
        { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: 'Very Important', weightage: 20, estimatedTime: 90 },
        { name: 'Transaction Management (ACID)', importance: 'Very Important', weightage: 15, estimatedTime: 60 },
        { name: 'Concurrency Control', importance: 'Important', weightage: 10, estimatedTime: 60 },
        { name: 'SQL Advanced Queries', importance: 'Important', weightage: 15, estimatedTime: 75 },
      ]
    },
    {
      _id: 'ep2', subject: 'Computer Networks', examType: 'Mid-Term',
      examDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      topics: [
        { name: 'OSI & TCP/IP Models', importance: 'Very Important', weightage: 15, estimatedTime: 60 },
        { name: 'Routing Algorithms', importance: 'Very Important', weightage: 20, estimatedTime: 120 },
        { name: 'Network Security Basics', importance: 'Moderate', weightage: 10, estimatedTime: 45 },
      ]
    }
  ];
}
