'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, ClipboardList, UserCheck, TrendingUp, PlusCircle, Bell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { LineChart, BarChart, DoughnutChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { courseAPI, assignmentAPI, attendanceAPI } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { Course } from '@/types';
import Link from 'next/link';

export default function FacultyDashboard() {
 const { user } = useAuthStore();
 const [courses, setCourses] = useState<Course[]>([]);
 const [stats, setStats] = useState({ totalStudents: 0, pendingGrading: 0, totalCourses: 0, pendingAssignments: 0 });
 const [attendanceData, setAttendanceData] = useState({
 labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
 datasets: [
 { label: 'Present', data: [0, 0, 0, 0, 0], color: '#10b981' },
 { label: 'Absent', data: [0, 0, 0, 0, 0], color: '#ef4444' },
 ],
 });
 const [isLoading, setIsLoading] = useState(true);

 const fetchData = async () => {
 try {
 const [coursesRes, assignmentsRes, attendanceRes] = await Promise.allSettled([
 courseAPI.getAll({ faculty: user?._id, limit: 6 }),
 assignmentAPI.getAll({ limit: 10 }),
 attendanceAPI.getAll()
 ]);

 if (coursesRes.status === 'fulfilled') {
 const data = coursesRes.value.data.data || [];
 setCourses(data);
 const uniqueStudents = new Set();
 data.forEach((c: any) => {
 c.enrolledStudents?.forEach((s: any) => uniqueStudents.add(s._id || s));
 });
 setStats(prev => ({ ...prev, totalCourses: data.length, totalStudents: uniqueStudents.size }));
 }
 if (assignmentsRes.status === 'fulfilled') {
 const data = assignmentsRes.value.data.data || [];
 const pending = data.filter((a: { status?: string }) => a.status === 'submitted').length;
 setStats(prev => ({ ...prev, pendingGrading: pending, pendingAssignments: data.length }));
 }
 if (attendanceRes.status === 'fulfilled') {
 const logs = attendanceRes.value.data.data || [];
 const daysPresent = [0, 0, 0, 0, 0];
 const daysAbsent = [0, 0, 0, 0, 0];
 
 logs.forEach((log: any) => {
 const date = new Date(log.date);
 const day = date.getDay(); // 0 is Sunday, 1 is Monday...
 if (day >= 1 && day <= 5) {
 log.records.forEach((r: any) => {
 if (r.status === 'present' || r.status === 'late') {
 daysPresent[day - 1]++;
 } else {
 daysAbsent[day - 1]++;
 }
 });
 }
 });

 setAttendanceData({
 labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
 datasets: [
 { label: 'Present', data: daysPresent, color: '#10b981' },
 { label: 'Absent', data: daysAbsent, color: '#ef4444' },
 ],
 });
 }
 } catch (_) {}
 finally { setIsLoading(false); }
 };

 useEffect(() => {
 fetchData();
 }, []);

 const performanceData = {
 labels: ['0-40', '40-60', '60-75', '75-90', '90-100'],
 datasets: [{ label: 'Students', data: [0, 0, 1, 3, 2], color: '#6366f1' }],
 };

 return (
 <DashboardLayout requiredRole="faculty">
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
 Welcome, {user?.name?.split(' ')[0]}!
 </h1>
 <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
 {user?.designation} · {formatDate(new Date().toISOString())}
 </p>
 </div>
 <Link href="/faculty/courses/create" className="btn btn-primary text-sm">
 <PlusCircle size={16} /> New Course
 </Link>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
 {isLoading ? Array(4).fill(null).map((_, i) => <StatCardSkeleton key={i} />) : (
 <>
 <StatCard label="My Courses" value={stats.totalCourses} icon={<BookOpen size={20} />} gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" delay={0} />
 <StatCard label="Total Students" value={stats.totalStudents} icon={<Users size={20} />} gradient="linear-gradient(135deg, #06b6d4, #6366f1)" change="+5 this week" changeType="up" delay={0.1} />
 <StatCard label="Pending Grading" value={stats.pendingGrading} icon={<ClipboardList size={20} />} gradient="linear-gradient(135deg, #f59e0b, #ef4444)" delay={0.2} />
 <StatCard label="Assignments" value={stats.pendingAssignments} icon={<UserCheck size={20} />} gradient="linear-gradient(135deg, #10b981, #06b6d4)" delay={0.3} />
 </>
 )}
 </div>

 {/* Quick Access Modules */}
 <div className="grid md:grid-cols-2 gap-4 mb-6">
 <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 flex flex-col justify-between">
 <div>
 <h3 className="font-black text-xl mb-1">Today's Timetable</h3>
 <p className="text-orange-100 text-sm mb-4">You have 2 classes scheduled today.</p>
 <div className="bg-white/10 rounded-xl p-3 mb-2 flex justify-between items-center backdrop-blur-sm">
 <div>
 <p className="font-bold text-sm">DBMS Lecture</p>
 <p className="text-xs text-orange-200">10:00 AM • Room 204</p>
 </div>
 <span className="text-[10px] font-bold bg-white text-orange-600 px-2 py-1 rounded-lg">Upcoming</span>
 </div>
 </div>
 <Link href="/faculty/timetable" className="mt-4 px-4 py-2 bg-white text-orange-600 font-bold text-sm rounded-xl text-center hover:bg-orange-50 transition-colors">Manage Timetable</Link>
 </div>

 <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 flex flex-col justify-between">
 <div>
 <h3 className="font-black text-xl mb-1">Exam Portions</h3>
 <p className="text-indigo-100 text-sm mb-4">Mid-Term exams are approaching.</p>
 <div className="bg-white/10 rounded-xl p-3 mb-2 backdrop-blur-sm">
 <div className="flex justify-between items-center mb-1">
 <p className="font-bold text-sm">DBMS</p>
 <p className="text-xs font-bold text-indigo-200">4 Topics Added</p>
 </div>
 <div className="w-full bg-white/20 rounded-full h-1.5"><div className="bg-white h-1.5 rounded-full w-3/4" /></div>
 </div>
 </div>
 <Link href="/faculty/exam-preparation" className="mt-4 px-4 py-2 bg-white text-indigo-600 font-bold text-sm rounded-xl text-center hover:bg-indigo-50 transition-colors">Manage Exam Portions</Link>
 </div>
 </div>

 {/* Charts */}
 <div className="grid lg:grid-cols-1 gap-6 mb-6">
 <div className=" card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Weekly Attendance Overview</h3>
 <BarChart labels={attendanceData.labels} datasets={attendanceData.datasets} height={200} />
 </div>
 <div className="card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Grade Distribution</h3>
 <BarChart labels={performanceData.labels} datasets={performanceData.datasets} height={200} horizontal />
 </div>
 </div>

 {/* Course List */}
 <div className="card p-5">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>My Courses</h3>
 <Link href="/faculty/courses" className="text-sm" style={{ color: 'var(--primary)' }}>View all →</Link>
 </div>

 {isLoading ? (
 <div className="space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
 ) : (
 <div className="table-container">
 <table>
 <thead>
 <tr>
 <th>Course</th>
 <th>Code</th>
 <th>Students</th>
 <th>Status</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {courses.map(course => (
 <tr key={course._id}>
 <td>
 <div>
 <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{course.title}</p>
 <p className="text-xs" style={{ color: 'var(--muted)' }}>Sem {course.semester} · {course.credits} credits</p>
 </div>
 </td>
 <td><span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>{course.subjectCode}</span></td>
 <td><span className="text-sm" style={{ color: 'var(--foreground)' }}>{course.enrolledStudents?.length || 0}</span></td>
 <td>
 <span className="badge text-xs" style={{
 background: course.isPublished ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
 color: course.isPublished ? '#10b981' : '#f59e0b',
 }}>
 {course.isPublished ? ' Published' : '⏳ Draft'}
 </span>
 </td>
 <td>
 <Link href={`/faculty/courses/${course._id}`} className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
 Manage →
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
