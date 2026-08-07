'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, UserCheck, Trophy, Flame, Brain, Calendar, Bell, Star } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { CourseCard, CourseCardSkeleton } from '@/components/shared/CourseCard';
import { LineChart, BarChart, DoughnutChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { attendanceAPI, assignmentAPI, courseAPI, announcementAPI } from '@/lib/api';
import { formatDate, getAttendanceColor, BADGE_ICONS } from '@/lib/utils';
import type { Course, Announcement } from '@/types';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<{ title: string; percentage: number }[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, attendanceRes, assignmentsRes, announcementsRes] = await Promise.allSettled([
        courseAPI.getAll({ limit: 4 }),
        attendanceAPI.getMine(),
        assignmentAPI.getAll({ limit: 5 }),
        announcementAPI.getAll({ limit: 5 }),
      ]);

      if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value.data.data || []);
      if (attendanceRes.status === 'fulfilled') {
        const data = attendanceRes.value.data.data || [];
        setAttendance(data.map((a: { title: string; percentage: number }) => ({ title: a.title, percentage: a.percentage })));
      }
      if (assignmentsRes.status === 'fulfilled') {
        const data = assignmentsRes.value.data.data || [];
        setPendingAssignments(data.filter((a: { status?: string }) => !a.status || a.status === 'pending').length);
      }
      if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value.data.data || []);
    } catch (_) {}
    finally { setIsLoading(false); }
  };

  // Sample chart data
  const weeklyProgress = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Study Hours', data: [2, 3, 1.5, 4, 3, 2.5, 1], color: '#6366f1' }],
  };

  const gradeData = {
    labels: ['DSA', 'ML', 'DBMS', 'Networks', 'OS'],
    datasets: [{ label: 'Score %', data: [88, 92, 75, 84, 79], color: '#8b5cf6' }],
  };

  const attendanceDoughnut = {
    labels: ['Present', 'Absent', 'Late'],
    data: [78, 15, 7],
    colors: ['#10b981', '#ef4444', '#f59e0b'],
  };

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
    : 0;

  return (
    <DashboardLayout requiredRole="student">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 mb-6 gradient-primary">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.p className="text-white/80 text-sm mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
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

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4).fill(null).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Enrolled Courses"
              value={courses.length || user?.enrolledCourses?.length || 0}
              icon={<BookOpen size={20} />}
              gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
              change="+2 this semester"
              changeType="up"
              delay={0}
            />
            <StatCard
              label="Attendance"
              value={`${avgAttendance}%`}
              icon={<UserCheck size={20} />}
              gradient="linear-gradient(135deg, #10b981, #06b6d4)"
              change={avgAttendance >= 75 ? 'Above minimum' : 'Below threshold'}
              changeType={avgAttendance >= 75 ? 'up' : 'down'}
              delay={0.1}
            />
            <StatCard
              label="Pending Assignments"
              value={pendingAssignments}
              icon={<ClipboardList size={20} />}
              gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
              change="Due this week"
              changeType="neutral"
              delay={0.2}
            />
            <StatCard
              label="Points Earned"
              value={user?.points || 0}
              icon={<Trophy size={20} />}
              gradient="linear-gradient(135deg, #8b5cf6, #ec4899)"
              change={`🔥 ${user?.streak || 0} day streak`}
              changeType="up"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Study Hours */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Weekly Study Hours</h3>
            <span className="badge text-xs" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>This week</span>
          </div>
          <LineChart labels={weeklyProgress.labels} datasets={weeklyProgress.datasets} height={200} />
        </div>

        {/* Attendance Doughnut */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Attendance Overview</h3>
          <DoughnutChart
            labels={attendanceDoughnut.labels}
            data={attendanceDoughnut.data}
            colors={attendanceDoughnut.colors}
            height={180}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>My Courses</h3>
            <a href="/student/courses" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>View all →</a>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {Array(4).fill(null).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.slice(0, 4).map((course, i) => (
                <CourseCard key={course._id} course={course} showProgress progress={Math.floor(Math.random() * 60) + 20} delay={i * 0.1} />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Announcements */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} style={{ color: 'var(--primary)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Announcements</h3>
            </div>
            {isLoading ? (
              <div className="space-y-3">{Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>No announcements</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 4).map(a => (
                  <div key={a._id} className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">{a.priority === 'urgent' ? '🚨' : a.priority === 'high' ? '📢' : '📌'}</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{formatDate(a.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          {user?.badges && user.badges.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>My Badges</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map(badge => (
                  <span key={badge} className="px-3 py-1.5 rounded-xl text-sm" style={{ background: 'var(--surface-2)' }} title={badge}>
                    {BADGE_ICONS[badge] || '🏅'} <span className="text-xs capitalize">{badge.replace(/_/g, ' ')}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grade chart */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Subject Scores</h3>
            <BarChart labels={gradeData.labels} datasets={gradeData.datasets} height={160} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
