'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, UserCheck, Trophy, Flame, Bell, Star } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { CourseCard, CourseCardSkeleton } from '@/components/shared/CourseCard';
import { BarChart, DoughnutChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { attendanceAPI, assignmentAPI, courseAPI, announcementAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Course, Announcement } from '@/types';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceData, setAttendanceData] = useState<{ title: string; present: number; absent: number; late: number; percentage: number }[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        setAttendanceData(attendanceRes.value.data.data || []);
      }
      if (assignmentsRes.status === 'fulfilled') {
        const data = assignmentsRes.value.data.data || [];
        setPendingAssignments(data.filter((a: { status?: string }) => !a.status || a.status === 'pending').length);
      }
      if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value.data.data || []);
    } catch (_) {}
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPresent = attendanceData.reduce((sum, a) => sum + a.present, 0);
  const totalAbsent = attendanceData.reduce((sum, a) => sum + a.absent, 0);
  const totalLate = attendanceData.reduce((sum, a) => sum + a.late, 0);

  const doughnutData = {
    labels: ['Present', 'Absent', 'Late'],
    data: attendanceData.length > 0 ? [totalPresent, totalAbsent, totalLate] : [1, 0, 0], // Fallback if no data
    colors: ['#10b981', '#ef4444', '#f59e0b'],
  };

  const barChartData = {
    labels: attendanceData.length > 0 ? attendanceData.map(a => a.title.substring(0, 15) + (a.title.length > 15 ? '...' : '')) : ['No Data'],
    datasets: [{ label: 'Attendance %', data: attendanceData.length > 0 ? attendanceData.map(a => a.percentage) : [0], color: '#6366f1' }],
  };

  const avgAttendance = attendanceData.length > 0
    ? Math.round(attendanceData.reduce((sum, a) => sum + a.percentage, 0) / attendanceData.length)
    : 0;

  return (
    <DashboardLayout requiredRole="student">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 mb-6 gradient-primary">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
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
              gradient="linear-gradient(135deg, #f97316, #ea580c)"
              change="Active"
              changeType="up"
              delay={0}
            />
            <StatCard
              label="Avg Attendance"
              value={`${avgAttendance}%`}
              icon={<UserCheck size={20} />}
              gradient="linear-gradient(135deg, #52525b, #3f3f46)"
              change={avgAttendance >= 75 ? 'Above minimum' : 'Below threshold'}
              changeType={avgAttendance >= 75 ? 'up' : 'down'}
              delay={0.1}
            />
            <StatCard
              label="Pending Assignments"
              value={pendingAssignments}
              icon={<ClipboardList size={20} />}
              gradient="linear-gradient(135deg, #f97316, #f59e0b)"
              change="To do"
              changeType="neutral"
              delay={0.2}
            />
            <StatCard
              label="Points Earned"
              value={user?.points || 0}
              icon={<Trophy size={20} />}
              gradient="linear-gradient(135deg, #3f3f46, #27272a)"
              change={`${user?.streak || 0} day streak`}
              changeType="up"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Subject Attendance</h3>
            <BarChart labels={barChartData.labels} datasets={barChartData.datasets} height={200} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>My Courses</h3>
              <Link href="/student/courses" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>View all →</Link>
            </div>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {Array(4).fill(null).map((_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course, i) => (
                  <CourseCard key={course._id} course={course} showProgress progress={course.title ? (course.title.length * 10) % 100 : 50} delay={i * 0.1} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Attendance Doughnut */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Overall Attendance</h3>
            <DoughnutChart
              labels={doughnutData.labels}
              data={doughnutData.data}
              colors={doughnutData.colors}
              height={180}
            />
          </div>

          {/* Announcements */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: 'var(--primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Announcements</h3>
              </div>
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
                      <span className="text-base mt-0.5">{a.priority === 'urgent' ? '!' : a.priority === 'high' ? '*' : '-'}</span>
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
                    <span className="text-xs capitalize">{badge.replace(/_/g, ' ')}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
