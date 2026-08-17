'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { quizAPI } from '@/lib/api';

export default function FacultyQuizPage() {
 const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
 const [quizzes, setQuizzes] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const fetchQuizzes = async () => {
 try {
 const res = await quizAPI.getAll();
 const data = res.data?.data || res.data || [];
 
 const formatted = data.map((q: any) => {
 let startTime = new Date(q.startTime);
 if (isNaN(startTime.getTime())) {
 startTime = new Date(Date.now() + 86400000 * 2); // default to 2 days from now
 }
 let endTime = new Date(q.endTime);
 if (isNaN(endTime.getTime())) {
 endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later
 }
 const now = new Date();
 
 let status = 'upcoming';
 if (now > endTime) status = 'completed';
 
 return {
 id: q._id || Math.random().toString(),
 title: q.title || 'Untitled Assessment',
 course: q.course?.subjectCode || q.course?.title || 'General Category',
 date: startTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
 time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
 duration: `${q.duration} mins`,
 status,
 submissions: q.submissionsCount || 0, // Mock for now if not populated
 };
 });
 
 setQuizzes(formatted);
 } catch (error) {
 toast.error('Failed to load quizzes');
 } finally {
 setIsLoading(false);
 }
 };
 
 fetchQuizzes();
 }, []);

 const filteredQuizzes = quizzes.filter(q => q.status === activeTab);

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Quizzes</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Manage your course quizzes and assessments</p>
 </div>
 <Link 
 href="/faculty/quiz/create"
 className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap"
 >
 Create Quiz
 </Link>
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

 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
 {isLoading ? (
 Array(6).fill(null).map((_, i) => (
 <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-900/50 animate-pulse rounded-3xl" />
 ))
 ) : filteredQuizzes.map((quiz, i) => (
 <motion.div 
 key={quiz.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-6 hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm shadow-sm"
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

 <div className="flex items-center justify-between gap-8 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-auto">
 <div className="flex flex-col gap-1">
 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submissions</span>
 <span className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
 {activeTab === 'upcoming' ? '-' : quiz.submissions}
 </span>
 </div>
 
 <button 
 onClick={() => {
 if (activeTab === 'upcoming') {
 toast.success('Opening Quiz Editor...');
 } else {
 toast.success('Opening Results Viewer...');
 }
 }}
 className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800 whitespace-nowrap"
 >
 {activeTab === 'upcoming' ? 'Edit Quiz' : 'View Results'}
 </button>
 </div>
 </motion.div>
 ))}
 
 {!isLoading && filteredQuizzes.length === 0 && (
 <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
 <p className="text-zinc-500 font-medium">No {activeTab} quizzes found.</p>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
