'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, ClipboardList, UserCheck, TrendingUp, PlusCircle, Bell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { LineChart, BarChart, DoughnutChart } from '@/components/charts/Charts';
import { useAuthStore } from '@/store/authStore';
import { courseAPI, assignmentAPI, announcementAPI } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { Course } from '@/types';
import Link from 'next/link';

export default function FacultyDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, pendingGrading: 0, totalCourses: 0, pendingAssignments: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [coursesRes, assignmentsRes] = await Promise.allSettled([
        courseAPI.getAll({ faculty: user?._id, limit: 6 }),
        assignmentAPI.getAll({ limit: 10 }),
      ]);

      if (coursesRes.status === 'fulfilled') {
        const data = coursesRes.value.data.data || [];
        setCourses(data);
        const totalStudents = data.reduce((sum: number, c: Course) => sum + (c.enrolledStudents?.length || 0), 0);
        setStats(prev => ({ ...prev, totalCourses: data.length, totalStudents }));
      }
      if (assignmentsRes.status === 'fulfilled') {
        const data = assignmentsRes.value.data.data || [];
        const pending = data.filter((a: { status?: string }) => a.status === 'submitted').length;
        setStats(prev => ({ ...prev, pendingGrading: pending, pendingAssignments: data.length }));
      }
    } catch (_) {}
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'Present', data: [28, 25, 30, 27, 29], color: '#10b981' },
      { label: 'Absent', data: [2, 5, 0, 3, 1], color: '#ef4444' },
    ],
  };

  const performanceData = {
    labels: ['0-40', '40-60', '60-75', '75-90', '90-100'],
    datasets: [{ label: 'Students', data: [2, 5, 12, 18, 8], color: '#6366f1' }],
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

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card p-5">
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
                        {course.isPublished ? '✓ Published' : '⏳ Draft'}
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
