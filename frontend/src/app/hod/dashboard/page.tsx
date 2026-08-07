'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { LineChart, BarChart, DoughnutChart, PieChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { hodAPI } from '@/lib/api';
import { Users, BookOpen, UserCheck, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HODDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ faculty: 0, students: 0, courses: 0, avgAttendance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hodAPI.getStats().then(res => {
      setStats(res.data.data);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const semesterEnrollment = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
    datasets: [{ label: 'Students', data: [45, 42, 48, 40, 38, 35, 30, 28], color: '#6366f1' }],
  };

  const attendanceTrend = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Avg Attendance %', data: [82, 78, 85, 80], color: '#10b981' },
    ],
  };

  const gradeDistribution = {
    labels: ['O (90+)', 'A+ (80-90)', 'A (70-80)', 'B+ (60-70)', 'B (50-60)', 'C (40-50)', 'F'],
    data: [15, 22, 30, 18, 10, 3, 2],
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
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Grade Distribution (Dept)</h3>
          <PieChart labels={gradeDistribution.labels} data={gradeDistribution.data} colors={gradeDistribution.colors} height={260} />
        </div>

        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Quick Actions</h3>
            {[
              { label: 'View Faculty List', href: '/hod/faculty', icon: <Users size={16} />, color: '#6366f1' },
              { label: 'Student Reports', href: '/hod/students', icon: <TrendingUp size={16} />, color: '#10b981' },
              { label: 'Approve Courses', href: '/hod/courses', icon: <CheckCircle size={16} />, color: '#f59e0b' },
              { label: 'Download Reports', href: '/hod/reports', icon: <Award size={16} />, color: '#8b5cf6' },
            ].map(action => (
              <a key={action.label} href={action.href}
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-[var(--surface)] mb-1"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: action.color }}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.label}</span>
              </a>
            ))}
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Alerts</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-xs font-medium" style={{ color: '#ef4444' }}>⚠️ 3 students below 75% attendance</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs font-medium" style={{ color: '#f59e0b' }}>📋 2 courses pending approval</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="text-xs font-medium" style={{ color: '#10b981' }}>✅ Semester results ready for review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
