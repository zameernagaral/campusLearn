'use client';
import toast from 'react-hot-toast';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function FacultyAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'graded'>('active');

  const assignments = [
    { id: 1, title: 'Build a Neural Network from Scratch', course: 'Machine Learning', due: '15 Oct 2026', submissions: 32, total: 45, status: 'active' },
    { id: 2, title: 'Implement Dijkstra Algorithm', course: 'Data Structures', due: '10 Oct 2026', submissions: 42, total: 45, status: 'active' },
    { id: 3, title: 'React Performance Optimization', course: 'Web Development', due: '1 Oct 2026', submissions: 45, total: 45, status: 'graded' },
  ];

  const filteredAssignments = assignments.filter(a => a.status === activeTab);

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Assignments Overview</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage assignments and grade student submissions</p>
        </div>
        <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
          Create Assignment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'active' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Active ({assignments.filter(a => a.status === 'active').length})
        </button>
        <button 
          onClick={() => setActiveTab('graded')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'graded' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Graded ({assignments.filter(a => a.status === 'graded').length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment, i) => (
          <motion.div 
            key={assignment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-500/30 transition-colors group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                  {assignment.course}
                </span>
                <span className="text-xs font-semibold text-orange-500">Due {assignment.due}</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                {assignment.title}
              </h3>
            </div>

            <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-0 md:pl-8">
              <div className="flex flex-col gap-1 min-w[100px]">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submissions</span>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">{assignment.submissions}</span>
                  <span className="text-sm font-semibold text-zinc-500 leading-none mb-0.5">/ {assignment.total}</span>
                </div>
              </div>
              
              <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                {activeTab === 'active' ? 'Grade Now' : 'View Grades'}
              </button>
            </div>
          </motion.div>
        ))}
        
        {filteredAssignments.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
            <p className="text-zinc-500 font-medium">No {activeTab} assignments found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
