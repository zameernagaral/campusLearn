'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { LineChart, DoughnutChart } from '@/components/charts/Charts';
import { adminAPI } from '@/lib/api';
import { Users, BookOpen, Building, TrendingUp, Bell, Settings, Shield, Database } from 'lucide-react';
import { formatDate, formatRelativeTime, getRoleColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalFaculty: number;
  totalHOD: number;
  totalCourses: number;
  totalDepartments: number;
  activeCourses: number;
  recentUsers: { _id: string; name: string; email: string; role: string; avatar?: string; createdAt: string }[];
  recentCourses?: { _id: string; title: string; faculty: { name: string }; isPublished: boolean; createdAt: string }[];
  userGrowth: { date: string; count: number }[];
  roleDistribution: { role: string; count: number; color: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data.data)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const userGrowthData = {
    labels: stats?.userGrowth.map(g => g.date) || [],
    datasets: [{ label: 'New Users', data: stats?.userGrowth.map(g => g.count) || [], color: '#6366f1' }],
  };

  const roleDistributionData = {
    labels: stats?.roleDistribution.map(r => r.role) || [],
    data: stats?.roleDistribution.map(r => r.count) || [],
    colors: stats?.roleDistribution.map(r => r.color) || [],
  };

  return (
    <DashboardLayout requiredRole="admin">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            Platform Overview · {formatDate(new Date().toISOString())}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/settings" className="btn btn-secondary text-sm px-4">
            <Settings size={15} /> Settings
          </Link>
          <Link href="/admin/users" className="btn btn-primary text-sm px-4">
            <Users size={15} /> Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? Array(8).fill(null).map((_, i) => <StatCardSkeleton key={i} />) : (
          <>
            <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={<Users size={20} />} gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" change="+Active" changeType="up" delay={0} />
            <StatCard label="Students" value={stats?.totalStudents || 0} icon={<Users size={20} />} gradient="linear-gradient(135deg, #10b981, #06b6d4)" delay={0.1} />
            <StatCard label="Faculty" value={stats?.totalFaculty || 0} icon={<Users size={20} />} gradient="linear-gradient(135deg, #8b5cf6, #ec4899)" delay={0.2} />
            <StatCard label="Departments" value={stats?.totalDepartments || 0} icon={<Building size={20} />} gradient="linear-gradient(135deg, #06b6d4, #6366f1)" delay={0.3} />
            <StatCard label="Total Courses" value={stats?.totalCourses || 0} icon={<BookOpen size={20} />} gradient="linear-gradient(135deg, #f59e0b, #f97316)" delay={0.4} />
            <StatCard label="Active Courses" value={stats?.activeCourses || 0} icon={<TrendingUp size={20} />} gradient="linear-gradient(135deg, #10b981, #f59e0b)" delay={0.5} />
            <StatCard label="HOD Accounts" value={stats?.totalHOD || 0} icon={<Shield size={20} />} gradient="linear-gradient(135deg, #ef4444, #f97316)" delay={0.6} />
            <StatCard label="Platform Health" value="99.9%" icon={<Database size={20} />} gradient="linear-gradient(135deg, #10b981, #6366f1)" change="Uptime" changeType="up" delay={0.7} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>User Growth (Last 7 Days)</h3>
          <LineChart labels={userGrowthData.labels} datasets={userGrowthData.datasets} height={220} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>User Role Distribution</h3>
          <DoughnutChart
            labels={roleDistributionData.labels}
            data={roleDistributionData.data}
            colors={roleDistributionData.colors}
            height={220}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Recent Courses</h3>
            <Link href="/admin/courses" className="text-xs" style={{ color: 'var(--primary)' }}>View all →</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : (
            <div className="space-y-3">
              {stats?.recentCourses?.map(c => (
                <div key={c._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-colors border border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold">
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{c.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>By {c.faculty?.name || 'Unknown'}</p>
                  </div>
                  <span className={cn('badge text-xs', c.isPublished ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500')}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
              {!stats?.recentCourses?.length && (
                 <p className="text-sm text-zinc-500 py-4 text-center">No courses found.</p>
              )}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Recent Users</h3>
            <Link href="/admin/users" className="text-xs" style={{ color: 'var(--primary)' }}>View all →</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : (
            <div className="space-y-3">
              {stats?.recentUsers.map(u => (
                <div key={u._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface)] transition-colors">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{u.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{formatRelativeTime(u.createdAt)}</p>
                  </div>
                  <span className={cn('badge text-xs capitalize', getRoleColor(u.role))}>{u.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 card p-5">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Manage Users', href: '/admin/users', icon: <Users size={22} />, color: '#6366f1' },
            { label: 'Departments', href: '/admin/departments', icon: <Building size={22} />, color: '#8b5cf6' },
            { label: 'Send Notification', href: '/admin/settings', icon: <Bell size={22} />, color: '#f59e0b' },
            { label: 'System Settings', href: '/admin/settings', icon: <Settings size={22} />, color: '#10b981' },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:scale-105 cursor-pointer"
              style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: a.color }}>
                {a.icon}
              </div>
              <span className="text-xs font-medium text-center" style={{ color: 'var(--foreground)' }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
