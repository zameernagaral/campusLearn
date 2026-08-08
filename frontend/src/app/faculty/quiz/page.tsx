'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function FacultyQuizPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const quizzes = [
    { id: 1, title: 'Neural Networks Fundamentals', course: 'CS601', date: '20 Oct 2026', time: '10:00 AM', duration: '45 mins', status: 'upcoming', submissions: 0 },
    { id: 2, title: 'Data Structures Midterm', course: 'CS501', date: '5 Oct 2026', time: '02:00 PM', duration: '90 mins', status: 'completed', submissions: 48 },
    { id: 3, title: 'Sorting Algorithms Quiz', course: 'CS501', date: '25 Sep 2026', time: '11:00 AM', duration: '30 mins', status: 'completed', submissions: 50 },
  ];

  const filteredQuizzes = quizzes.filter(q => q.status === activeTab);

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quizzes</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage your course quizzes and assessments</p>
        </div>
        <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
          Create Quiz
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'upcoming' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Upcoming ({quizzes.filter(q => q.status === 'upcoming').length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'completed' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Completed ({quizzes.filter(q => q.status === 'completed').length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredQuizzes.map((quiz, i) => (
          <motion.div 
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-500/30 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                  {quiz.course}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${quiz.status === 'upcoming' ? 'text-orange-500' : 'text-emerald-500'}`}>
                  {quiz.status === 'upcoming' ? 'SCHEDULED' : 'FINISHED'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2">
                {quiz.title}
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                <span>{quiz.date} at {quiz.time}</span>
                <span>•</span>
                <span>{quiz.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-0 md:pl-8">
              <div className="flex flex-col gap-1 min-w-[80px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submissions</span>
                <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">
                  {activeTab === 'upcoming' ? '-' : quiz.submissions}
                </span>
              </div>
              
              <button className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                {activeTab === 'upcoming' ? 'Edit Quiz' : 'View Results'}
              </button>
            </div>
          </motion.div>
        ))}
        
        {filteredQuizzes.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
            <p className="text-zinc-500 font-medium">No {activeTab} quizzes found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
