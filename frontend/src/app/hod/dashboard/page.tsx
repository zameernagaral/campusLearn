'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { LineChart, BarChart, DoughnutChart, PieChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { hodAPI } from '@/lib/api';
import { Users, BookOpen, UserCheck, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function HODDashboard() {
 const { user } = useAuthStore();
 const [stats, setStats] = useState({ 
 faculty: 0, students: 0, courses: 0, avgAttendance: 0,
 semesterEnrollmentData: [0,0,0,0,0,0,0,0],
 gradeDistributionData: [0,0,0,0,0,0,0]
 });
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 hodAPI.getStats().then(res => {
 setStats(res.data.data);
 }).catch(() => {}).finally(() => setIsLoading(false));
 }, []);

 const semesterEnrollment = {
 labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
 datasets: [{ label: 'Students', data: stats.semesterEnrollmentData || [0,0,0,0,0,0,0,0], color: '#6366f1' }],
 };

 const attendanceTrend = {
 labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
 datasets: [
 { label: 'Avg Attendance %', data: [
 (stats.avgAttendance || 0) - 4, 
 (stats.avgAttendance || 0) - 2, 
 (stats.avgAttendance || 0) + 1, 
 (stats.avgAttendance || 0)
 ], color: '#10b981' },
 ],
 };

 const gradeDistribution = {
 labels: ['O (90+)', 'A+ (80-90)', 'A (70-80)', 'B+ (60-70)', 'B (50-60)', 'C (40-50)', 'F'],
 data: stats.gradeDistributionData || [0,0,0,0,0,0,0],
 colors: ['#10b981', '#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#f97316', '#ef4444'],
 };

 return (
 <DashboardLayout requiredRole="hod">
 {/* Header */}
 <div className="mb-6">
 <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>HOD Dashboard</h1>
 <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
 Department Overview · {formatDate(new Date().toISOString())}
 </p>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
 {isLoading ? Array(4).fill(null).map((_, i) => <StatCardSkeleton key={i} />) : (
 <>
 <StatCard label="Total Faculty" value={stats.faculty} icon={<Users size={20} />} gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" delay={0} />
 <StatCard label="Total Students" value={stats.students} icon={<Users size={20} />} gradient="linear-gradient(135deg, #06b6d4, #6366f1)" delay={0.1} />
 <StatCard label="Active Courses" value={stats.courses} icon={<BookOpen size={20} />} gradient="linear-gradient(135deg, #10b981, #06b6d4)" delay={0.2} />
 <StatCard label="Avg Attendance" value={`${stats.avgAttendance}%`} icon={<UserCheck size={20} />} gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
 change={stats.avgAttendance >= 75 ? 'Above threshold' : 'Needs attention'}
 changeType={stats.avgAttendance >= 75 ? 'up' : 'down'} delay={0.3} />
 </>
 )}
 </div>

 {/* Charts Row 1 */}
 <div className="grid lg:grid-cols-2 gap-6 mb-6">
 <div className="card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Semester-wise Enrollment</h3>
 <BarChart labels={semesterEnrollment.labels} datasets={semesterEnrollment.datasets} height={220} />
 </div>
 <div className="card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Monthly Attendance Trend</h3>
 <LineChart labels={attendanceTrend.labels} datasets={attendanceTrend.datasets} height={220} />
 </div>
 </div>

 {/* Charts Row 2 + Actions */}
 <div className="grid lg:grid-cols-2 gap-6">
  <div className=" card p-5">
  <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Grade Distribution (Dept)</h3>
  <PieChart labels={gradeDistribution.labels} data={gradeDistribution.data} colors={gradeDistribution.colors} height={260} />
  </div>

  <div className="space-y-4">
  {/* Department Modules */}
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-4 rounded-2xl flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Timetable</p>
        <p className="font-black text-xl text-orange-900 dark:text-orange-300">2 Conflicts</p>
      </div>
      <Link href="/hod/timetable" className="text-xs font-bold text-orange-500 mt-3 hover:underline">Resolve Now →</Link>
    </div>
    
    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Placement</p>
        <p className="font-black text-xl text-emerald-900 dark:text-emerald-300">82% Placed</p>
      </div>
      <Link href="/hod/placement-analytics" className="text-xs font-bold text-emerald-500 mt-3 hover:underline">View Analytics →</Link>
    </div>

    <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between col-span-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Career Roadmap</p>
          <p className="font-black text-xl text-indigo-900 dark:text-indigo-300">65% Readiness</p>
        </div>
        <div className="w-10 h-10 bg-indigo-200/50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
          <Award size={20} />
        </div>
      </div>
      <Link href="/hod/career-analytics" className="text-xs font-bold text-indigo-500 mt-3 hover:underline">View Dept Career Insights →</Link>
    </div>
  </div>

  {/* Quick actions */}
  <div className="card p-5">
  <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Quick Actions</h3>
  {[
  { label: 'View Faculty List', href: '/hod/faculty', icon: <Users size={16} />, color: '#6366f1' },
  { label: 'Student Reports', href: '/hod/students', icon: <TrendingUp size={16} />, color: '#10b981' },
  { label: 'Approve Courses', href: '/hod/courses', icon: <CheckCircle size={16} />, color: '#f59e0b' },
  { label: 'Award Certificates', href: '/hod/certificates', icon: <Award size={16} />, color: '#ec4899' },
  ].map((action, i) => (
  <Link key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-2)] transition-colors mb-2">
  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${action.color}15`, color: action.color }}>
  {action.icon}
  </div>
  <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{action.label}</span>
  </Link>
  ))}
  </div>
  </div>
  </div>
 </DashboardLayout>
 );
}
