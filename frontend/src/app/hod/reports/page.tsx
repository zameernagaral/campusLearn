'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { hodAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HODReportsPage() {
 const [stats, setStats] = useState({
 faculty: 0,
 students: 0,
 courses: 0,
 avgAttendance: 0
 });
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchStats();
 }, []);

 const fetchStats = async () => {
 try {
 const { data } = await hodAPI.getStats();
 if (data.data) {
 setStats(data.data);
 }
 } catch {
 toast.error('Failed to load reports');
 } finally {
 setIsLoading(false);
 }
 };

 const statCards = [
 { label: 'Total Faculty', value: stats.faculty, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
 { label: 'Total Students', value: stats.students, icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
 { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
 { label: 'Avg. Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
 ];

 return (
 <DashboardLayout requiredRole="hod">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Reports</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Analytics and insights for your department</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 {statCards.map((stat, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4"
 >
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
 <stat.icon size={24} />
 </div>
 <div>
 <p className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</p>
 {isLoading ? (
 <div className="h-8 w-16 skeleton rounded-lg" />
 ) : (
 <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</h3>
 )}
 </div>
 </motion.div>
 ))}
 </div>

 <div className="card p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-900/20">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">More Reports Coming Soon</h3>
 <p className="text-zinc-500">We are working on detailed analytics for performance, assignments, and quizzes.</p>
 </div>
 </DashboardLayout>
 );
}
