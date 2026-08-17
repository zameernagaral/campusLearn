'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement,
} from 'chart.js';
import { courseAPI, attendanceAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
);

export default function FacultyAnalyticsPage() {
 const [stats, setStats] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchStats();
 }, []);

 const fetchStats = async () => {
 try {
 setIsLoading(true);
 const [coursesRes, attendanceRes] = await Promise.all([
 courseAPI.getAll(),
 attendanceAPI.getAll()
 ]);

 const courses = coursesRes.data.data;
 const attendanceLogs = attendanceRes.data.data;

 // Compute Total Students (unique students enrolled in their courses)
 const uniqueStudents = new Set();
 courses.forEach((c: any) => {
 c.enrolledStudents?.forEach((s: any) => uniqueStudents.add(s._id || s));
 });
 const totalStudents = uniqueStudents.size;

 // Compute Average Attendance
 let totalRecords = 0;
 let totalPresent = 0;
 attendanceLogs.forEach((log: any) => {
 log.records.forEach((r: any) => {
 totalRecords++;
 if (r.status === 'present' || r.status === 'late') {
 totalPresent++;
 }
 });
 });
 const avgAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

 // Department Data (Mocked from courses)
 const courseTitles = courses.map((c: any) => c.title).slice(0, 5);
 const courseEnrollments = courses.map((c: any) => c.enrolledStudents?.length || 0).slice(0, 5);

 setStats({
 totalCourses: courses.length,
 totalStudents,
 avgAttendance,
 courses,
 courseTitles,
 courseEnrollments
 });
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
 legend: { position: 'right' as const, labels: { color: '#a1a1aa', font: { family: 'Inter', size: 12 }, padding: 20 } },
 tooltip: { backgroundColor: '#18181b', titleColor: '#fafafa', bodyColor: '#fafafa', padding: 12, cornerRadius: 8 }
 },
 cutout: '75%',
 };

 if (isLoading || !stats) {
 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex items-center justify-center min-h-[50vh]">
 <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
 </div>
 </DashboardLayout>
 );
 }

 const performanceData = {
 labels: stats.courseTitles.length > 0 ? stats.courseTitles : ['No Courses'],
 datasets: [
 {
 label: 'Enrolled Students',
 data: stats.courseEnrollments.length > 0 ? stats.courseEnrollments : [0],
 backgroundColor: '#10b981',
 borderRadius: 4,
 }
 ]
 };

 const attendanceData = {
 labels: ['Present', 'Absent'],
 datasets: [
 {
 data: [stats.avgAttendance, 100 - stats.avgAttendance],
 backgroundColor: ['#10b981', '#3f3f46'],
 borderWidth: 0,
 }
 ]
 };

 const metrics = [
 { label: 'Total Courses', value: stats.totalCourses.toString(), change: 'Active', trend: 'up' },
 { label: 'Total Students', value: stats.totalStudents.toString(), change: 'Enrolled', trend: 'up' },
 { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, change: 'Overall', trend: 'up' },
 { label: 'Avg Assignment Score', value: 'N/A', change: 'Awaiting grading', trend: 'neutral' },
 ];

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Track student performance and course engagement</p>
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
 className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
 >
 <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
 <span className="text-6xl font-bold text-emerald-500">{i + 1}</span>
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

 <div className="grid lg:grid-cols-1 gap-8">
 {/* Main Chart */}
 <div className=" bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
 <div className="flex justify-between items-center mb-6">
 <div>
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Enrollments by Course</h3>
 <p className="text-xs text-zinc-500 mt-1">Number of students enrolled in your active courses</p>
 </div>
 </div>
 <div className="flex-1 min-h-0">
 <Bar data={performanceData} options={chartOptions as any} />
 </div>
 </div>

 {/* Side Stats */}
 <div className=" space-y-8">
 <div className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Attendance Rate</h3>
 <div className="h-[200px] relative">
 <Doughnut data={attendanceData} options={doughnutOptions as any} />
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -ml-24">
 <span className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.avgAttendance}%</span>
 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Present</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
