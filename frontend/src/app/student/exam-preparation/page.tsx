'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Book, Clock, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExamPreparationPage() {
  const topics = [
    { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: '🔴 Very Important', status: 'Completed' },
    { name: 'Transaction Management (ACID properties)', importance: '🔴 Very Important', status: 'Learning' },
    { name: 'Concurrency Control', importance: '🟠 Important', status: 'Not Started' },
    { name: 'Indexing (B-Trees, Hash Indexes)', importance: '🟡 Moderate', status: 'Not Started' }
  ];

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

          <div className="card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Book size={18} className="text-green-500" /> Today's Smart Plan</h3>
            <div className="p-3 bg-surface-2 rounded-xl mb-3 border border-border">
              <p className="font-bold text-sm">1. Transaction Management</p>
              <p className="text-xs text-muted mt-1">Est. time: 45 mins · 🔴 Very Important</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-primary text-xs w-full py-1.5">Start Studying</button>
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
              <button className="btn btn-outline text-xs"><FileText size={14} /> Previous Papers</button>
              <button className="btn btn-outline text-xs"><Book size={14} /> Mock Test</button>
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
                      <button className="text-xs text-primary font-bold hover:underline">Study →</button>
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
