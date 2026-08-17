'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 ArcElement,
 Title,
 Tooltip,
 Legend,
 Filler
} from 'chart.js';
import { adminAPI } from '@/lib/api';
import { FullPageSkeleton } from '@/components/shared/Skeleton';

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 ArcElement,
 Title,
 Tooltip,
 Legend,
 Filler
);

export default function AdminAnalyticsPage() {
 const [stats, setStats] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchStats();
 }, []);

 const fetchStats = async () => {
 try {
 setIsLoading(true);
 const res = await adminAPI.getStats();
 setStats(res.data.data);
 } catch (error) {
 toast.error('Failed to load analytics');
 } finally {
 setIsLoading(false);
 }
 };

 const chartOptions = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
 legend: { display: false },
 tooltip: {
 backgroundColor: '#18181b',
 titleColor: '#fafafa',
 bodyColor: '#fafafa',
 padding: 12,
 cornerRadius: 8,
 }
 },
 scales: {
 x: {
 grid: { display: false, drawBorder: false },
 ticks: { font: { family: 'Inter' }, color: '#a1a1aa' }
 },
 y: {
 grid: { color: '#27272a', borderDash: [5, 5], drawBorder: false },
 ticks: { font: { family: 'Inter' }, color: '#a1a1aa' },
 beginAtZero: true,
 }
 }
 };

 const doughnutOptions = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
 legend: { position: 'bottom' as const, labels: { color: '#a1a1aa', font: { family: 'Inter' } } },
 tooltip: { backgroundColor: '#18181b', padding: 12, cornerRadius: 8 }
 }
 };

 if (isLoading || !stats) {
 return (
 <DashboardLayout requiredRole="admin">
 <FullPageSkeleton />
 </DashboardLayout>
 );
 }

 const userGrowthData = {
 labels: stats.userGrowth.map((g: any) => g.date),
 datasets: [
 {
 label: 'New Users',
 data: stats.userGrowth.map((g: any) => g.count),
 borderColor: '#f97316',
 backgroundColor: 'rgba(249, 115, 22, 0.1)',
 borderWidth: 3,
 fill: true,
 tension: 0.4,
 }
 ]
 };

 const roleData = {
 labels: stats.roleDistribution.map((r: any) => r.role),
 datasets: [
 {
 data: stats.roleDistribution.map((r: any) => r.count),
 backgroundColor: stats.roleDistribution.map((r: any) => r.color),
 borderWidth: 0,
 hoverOffset: 4
 }
 ]
 };

 const metrics = [
 { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+Active', trend: 'up' },
 { label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: 'Enrolled', trend: 'up' },
 { label: 'Total Faculty', value: stats.totalFaculty.toLocaleString(), change: 'Active', trend: 'up' },
 { label: 'Active Courses', value: stats.activeCourses.toLocaleString(), change: `of ${stats.totalCourses}`, trend: 'neutral' },
 ];

 return (
 <DashboardLayout requiredRole="admin">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Platform Analytics</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Comprehensive overview of university metrics</p>
 </div>
 <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl w-fit">
 <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm transition-colors">
 Overview
 </button>
 </div>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 {metrics.map((metric, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-colors"
 >
 <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
 <span className="text-6xl font-bold text-orange-500">{i + 1}</span>
 </div>
 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 relative z-10">{metric.label}</p>
 <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10">{metric.value}</h3>
 <p className={`text-xs font-bold relative z-10 ${
 metric.trend === 'up' ? 'text-emerald-500' : 'text-zinc-500'
 }`}>
 {metric.change}
 </p>
 </motion.div>
 ))}
 </div>

 <div className="grid lg:grid-cols-1 gap-8 mb-8">
 <div className=" bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">User Growth (Last 7 Days)</h3>
 </div>
 <div className="flex-1 min-h-0">
 <Line data={userGrowthData} options={chartOptions as any} />
 </div>
 </div>

 <div className=" bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Role Distribution</h3>
 </div>
 <div className="flex-1 min-h-0 pb-4">
 <Doughnut data={roleData} options={doughnutOptions as any} />
 </div>
 </div>
 </div>
 
 <div className="grid lg:grid-cols-2 gap-8">
 {/* Recent Users */}
 <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
 <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Users</h3>
 </div>
 <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
 {stats.recentUsers?.map((user: any) => (
 <div key={user._id} className="p-4 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
 {user.name?.charAt(0)}
 </div>
 <div>
 <p className="font-bold text-sm text-zinc-900 dark:text-white">{user.name}</p>
 <p className="text-xs text-zinc-500">{user.email}</p>
 </div>
 </div>
 <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase rounded-md">
 {user.role}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Recent Courses */}
 <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
 <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Courses</h3>
 </div>
 <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
 {stats.recentCourses?.map((course: any) => (
 <div key={course._id} className="p-4 flex items-center justify-between">
 <div>
 <p className="font-bold text-sm text-zinc-900 dark:text-white">{course.title}</p>
 <p className="text-xs text-zinc-500">By {course.faculty?.name || 'Unknown'}</p>
 </div>
 <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${course.isPublished ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
 {course.isPublished ? 'Published' : 'Draft'}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>

 </DashboardLayout>
 );
}
