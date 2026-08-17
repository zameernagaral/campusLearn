'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { assignmentAPI } from '@/lib/api';

export default function FacultyAssignmentsPage() {
 const [activeTab, setActiveTab] = useState<'active' | 'graded'>('active');
 const [assignments, setAssignments] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const fetchAssignments = async () => {
 try {
 const res = await assignmentAPI.getAll();
 const data = res.data?.data || res.data || [];
 
 // Format them for the UI
 const formatted = data.map((a: any) => ({
 id: a._id,
 title: a.title,
 course: a.course?.title || 'Unknown Course',
 due: new Date(a.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
 submissions: a.submissionsCount || 0,
 total: a.maxMarks || 100,
 status: new Date(a.dueDate) < new Date() ? 'graded' : 'active'
 }));
 
 setAssignments(formatted);
 } catch (error) {
 toast.error('Failed to load assignments');
 } finally {
 setIsLoading(false);
 }
 };
 fetchAssignments();
 }, []);

 const filteredAssignments = assignments.filter(a => a.status === activeTab);

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Assignments Overview</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Manage assignments and grade student submissions</p>
 </div>
 <Link href="/faculty/assignments/create" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
 Create Assignment
 </Link>
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
 {isLoading ? (
 <div className="flex justify-center py-12">
 <span className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
 </div>
 ) : filteredAssignments.map((assignment, i) => (
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
 <span className="text-xl font-bold text-zinc-900 dark:text-white leading-none">{assignment.submissions}</span>
 <span className="text-sm font-semibold text-zinc-500 leading-none mb-0.5">/ {assignment.total}</span>
 </div>
 </div>
 
 <button disabled className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white/50 font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800 whitespace-nowrap opacity-50 cursor-not-allowed">
 {activeTab === 'active' ? 'Pending Review' : 'View Grades'}
 </button>
 </div>
 </motion.div>
 ))}
 
 {!isLoading && filteredAssignments.length === 0 && (
 <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
 <p className="text-zinc-500 font-medium">No {activeTab} assignments found.</p>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
