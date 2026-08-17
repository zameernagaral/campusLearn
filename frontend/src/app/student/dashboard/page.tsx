'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, UserCheck, Trophy, Flame, Bell, Star, Clock, Map, Target, Briefcase, AlertTriangle, Bot, CheckCircle, ChevronRight, PieChart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { CourseCard, CourseCardSkeleton } from '@/components/shared/CourseCard';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { StudentDashboardSkeleton } from '@/components/shared/Skeleton';

export default function StudentDashboard() {
 const { user } = useAuthStore();
 const [isLoading, setIsLoading] = useState(true);

 // In a real application, these would be fetched from our new APIs
 // For now, we simulate the data to show the Smart Home Dashboard layout
 const [smartData, setSmartData] = useState<any>(null);
 
 const [isAskingAI, setIsAskingAI] = useState(false);
 const [aiQuery, setAiQuery] = useState('');
 const [isAILoading, setIsAILoading] = useState(false);

 const handleAskAI = (e: React.FormEvent) => {
 e.preventDefault();
 if (!aiQuery.trim()) return;
 setIsAILoading(true);
 setTimeout(() => {
 setIsAILoading(false);
 toast.success('Campus AI: To prepare for DBMS, focus on Normalization and ACID properties. Would you like to enter Focus Mode?', { duration: 5000, icon: '' });
 setAiQuery('');
 setIsAskingAI(false);
 }, 1500);
 };

 useEffect(() => {
 // Simulate fetching all smart data
 setTimeout(() => {
 setSmartData({
 today: {
 nextClass: { subject: 'Database Management Systems', time: '10:00 AM', room: 'Room 204' },
 currentAttendance: 72,
 pendingAssignments: 2
 },
 academic: {
 courseProgress: 65,
 quizAvg: 85,
 examPrep: 40
 },
 career: {
 goal: 'Full Stack Developer',
 roadmapProgress: 35,
 skillsCompleted: 12,
 skillsTotal: 30
 },
 placement: {
 readiness: 72,
 aptitude: 80,
 coding: 75,
 interview: 60,
 resume: 85
 },
 alerts: [
 { type: 'warning', title: 'Attendance Risk', message: 'Your DBMS attendance is 72%. Attend 2 more classes to reach 75%.' },
 { type: 'info', title: 'Upcoming Exam', message: 'DBMS Mid-Term in 5 days.' },
 { type: 'success', title: 'Placement Recommendation', message: 'TCS is hiring. Your profile matches 85% of requirements.' }
 ]
 });
 setIsLoading(false);
 
 // Smart AI Low Shortage Notification
 setTimeout(() => {
 toast('️ AI ATTENDANCE ALERT: Your DBMS attendance has fallen below the 75% threshold (currently 72%). Attend the next 2 classes to avoid debarment!', {
 duration: 10000,
 style: {
 background: 'var(--toast-bg)',
 color: '#ef4444',
 border: '1px solid #ef4444',
 fontWeight: 'bold',
 padding: '16px'
 },
 });
 }, 500);

 }, 1000);
 }, []);

 return (
 <DashboardLayout requiredRole="student">
 {/* Welcome Banner */}
 <div className="relative overflow-hidden rounded-3xl p-6 mb-6 gradient-primary">
 <div className="relative z-10 flex items-center justify-between">
 <div>
 <motion.p className="text-white/80 text-sm mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
 </motion.p>
 <motion.h1 className="text-2xl font-bold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
 {user?.name?.split(' ')[0]}, ready to learn?
 </motion.h1>
 <p className="text-white/60 text-sm mt-1">{formatDate(new Date().toISOString())} · Semester {user?.semester}</p>
 </div>
 <div className="hidden sm:flex items-center gap-3">
 {user?.streak && user.streak > 0 && (
 <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2">
 <Flame size={18} className="text-orange-300" />
 <div>
 <p className="text-white text-xs font-bold">{user.streak} days</p>
 <p className="text-white/60 text-xs">streak</p>
 </div>
 </div>
 )}
 <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2">
 <Star size={18} className="text-yellow-300" />
 <div>
 <p className="text-white text-xs font-bold">{user?.points || 0} pts</p>
 <p className="text-white/60 text-xs">earned</p>
 </div>
 </div>
 </div>
 </div>
 </div>

  {isLoading || !smartData ? (
  <StudentDashboardSkeleton />
  ) : (
  <div className="grid lg:grid-cols-3 gap-6">
  {/* Main Column */}
  <div className="lg:col-span-2 space-y-6">
  
  {/* TODAY SECTION */}
  <section>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
    <Clock size={20} className="text-orange-500" /> Today's Overview
    </h2>
    <Link href="/student/timetable" className="text-sm text-orange-500 font-bold hover:underline">View Timetable</Link>
  </div>
  <div className="grid sm:grid-cols-3 gap-4">
  <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Next Class</p>
  <p className="font-bold text-base line-clamp-1 text-zinc-900 dark:text-white">{smartData.today.nextClass.subject}</p>
  <p className="text-sm mt-2 text-zinc-500 font-medium flex items-center gap-1.5"><Map size={14} className="text-orange-500"/> {smartData.today.nextClass.time} · {smartData.today.nextClass.room}</p>
  </div>
  <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Attendance</p>
  <p className="font-bold text-2xl text-zinc-900 dark:text-white">{smartData.today.currentAttendance}%</p>
  <p className="text-xs mt-2 text-orange-500 font-bold bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md w-fit">Risk: Shortage Approaching</p>
  </div>
  <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Pending Assignments</p>
  <p className="font-bold text-2xl text-zinc-900 dark:text-white">{smartData.today.pendingAssignments}</p>
  <p className="text-xs mt-2 text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md w-fit">Due in 2 days</p>
  </div>
  </div>
  </section>

 {/* ACADEMIC PROGRESS */}
 <section>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
 Academic Progress
 </h2>
 <Link href="/student/exam-preparation" className="text-sm text-orange-500 font-bold hover:underline">Exam Prep</Link>
 </div>
 <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
 <div className="space-y-6">
 <div>
 <div className="flex justify-between mb-2">
 <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Course Progress</span>
 <span className="text-sm font-bold text-zinc-900 dark:text-white">{smartData.academic.courseProgress}%</span>
 </div>
 <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
 <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${smartData.academic.courseProgress}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between mb-2">
 <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Quiz Performance</span>
 <span className="text-sm font-bold text-zinc-900 dark:text-white">{smartData.academic.quizAvg}%</span>
 </div>
 <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
 <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${smartData.academic.quizAvg}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between mb-2">
 <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Exam Preparation</span>
 <span className="text-sm font-bold text-zinc-900 dark:text-white">{smartData.academic.examPrep}%</span>
 </div>
 <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
 <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${smartData.academic.examPrep}%` }}></div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* CAREER */}
 <section>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
 Career Roadmap
 </h2>
 <Link href="/student/career-roadmap" className="text-sm text-orange-500 font-bold hover:underline">View Full Roadmap</Link>
 </div>
 <div className="grid sm:grid-cols-2 gap-4">
 <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center text-center backdrop-blur-sm">
 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Current Goal</p>
 <p className="font-bold text-lg mt-2 text-zinc-900 dark:text-white">{smartData.career.goal}</p>
 </div>
 <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Skills Progress</p>
 <div className="flex items-end gap-2 mb-2">
 <span className="text-3xl font-bold text-zinc-900 dark:text-white">{smartData.career.skillsCompleted}</span>
 <span className="text-sm font-medium pb-1 text-zinc-500">/ {smartData.career.skillsTotal} completed</span>
 </div>
 <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
 <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(smartData.career.skillsCompleted / smartData.career.skillsTotal) * 100}%` }}></div>
 </div>
 </div>
 </div>
 </section>
 </div>

 {/* Right Column */}
 <div className="space-y-6">
  
  {/* AI ASSISTANT */}
  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] rounded-3xl shadow-lg shadow-orange-500/20">
  <div className="bg-white dark:bg-zinc-900 rounded-[22px] p-5 flex flex-col gap-4">
  <div className="flex items-start gap-4">
  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-inner">
  <Bot size={20} className="text-white" />
  </div>
  <div className="flex-1">
  <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Campus AI</h3>
  <p className="text-sm font-medium text-zinc-500 mb-4">"How can I help you prepare for your exams today?"</p>
  
  {!isAskingAI ? (
  <button onClick={() => setIsAskingAI(true)} className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl font-bold transition-colors">
  Ask a question →
  </button>
  ) : (
  <form onSubmit={handleAskAI} className="flex gap-2 w-full mt-2">
  <input 
  type="text" 
  value={aiQuery}
  onChange={(e) => setAiQuery(e.target.value)}
  placeholder="Type your question..." 
  className="flex-1 py-2.5 px-4 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-zinc-900 dark:text-white font-medium"
  autoFocus
  disabled={isAILoading}
  />
  <button disabled={isAILoading} type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2.5 px-4 text-xs shadow-lg shadow-orange-500/20 transition-colors">
  {isAILoading ? '...' : 'Ask'}
  </button>
  </form>
  )}
  </div>
  </div>
  </div>
  </div>

  {/* SMART ALERTS */}
  <section>
  <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
  <Bell size={20} className="text-orange-500" /> Smart Alerts
  </h2>
  <div className="space-y-4">
  {smartData.alerts.map((alert: any, i: number) => (
  <div key={i} className={`p-5 rounded-2xl border ${
  alert.type === 'warning' ? 'bg-orange-50/50 border-orange-200 dark:bg-orange-500/5 dark:border-orange-500/20' : 
  'bg-zinc-50/50 border-zinc-200 dark:bg-zinc-800/30 dark:border-zinc-700/50'
  } backdrop-blur-sm transition-all hover:-translate-y-1`}>
  <div className="flex items-start gap-4">
  {alert.type === 'warning' ? <AlertTriangle size={20} className="text-orange-500 shrink-0" /> : 
  alert.type === 'info' ? <Target size={20} className="text-orange-500 shrink-0" /> : 
  <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
  <div>
  <p className="text-sm font-bold text-zinc-900 dark:text-white">{alert.title}</p>
  <p className="text-xs mt-1 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{alert.message}</p>
  </div>
  </div>
  </div>
  ))}
  </div>
  </section>

  {/* PLACEMENT READINESS */}
  <section>
  <div className="flex items-center justify-between mb-4">
  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
  Placement
  </h2>
  <Link href="/student/placement-preparation" className="text-sm text-orange-500 font-bold hover:underline">Go to Prep</Link>
  </div>
  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm group hover:border-orange-500/30 transition-all">
  <div className="flex items-center justify-between mb-8">
  <div>
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Overall Readiness</p>
  <p className="text-4xl font-bold text-orange-500">{smartData.placement.readiness}%</p>
  </div>
  <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
  <Briefcase size={28} className="text-orange-500" />
  </div>
  </div>
  
  <div className="space-y-4">
  <div className="flex items-center justify-between text-sm">
  <span className="font-bold text-zinc-600 dark:text-zinc-400">Aptitude</span>
  <span className="font-bold text-zinc-900 dark:text-white">{smartData.placement.aptitude}%</span>
  </div>
  <div className="flex items-center justify-between text-sm">
  <span className="font-bold text-zinc-600 dark:text-zinc-400">Coding</span>
  <span className="font-bold text-zinc-900 dark:text-white">{smartData.placement.coding}%</span>
  </div>
  <div className="flex items-center justify-between text-sm">
  <span className="font-bold text-zinc-600 dark:text-zinc-400">Mock Interview</span>
  <span className="font-bold text-zinc-900 dark:text-white">{smartData.placement.interview}%</span>
  </div>
  <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-100 dark:border-zinc-800">
  <span className="font-bold text-zinc-600 dark:text-zinc-400">Resume Score</span>
  <span className="font-bold text-emerald-500">{smartData.placement.resume}%</span>
  </div>
  </div>
  </div>
  </section>

 </div>
 </div>
 )}
 </DashboardLayout>
 );
}
