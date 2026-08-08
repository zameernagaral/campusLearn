'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard, CourseCardSkeleton } from '@/components/shared/CourseCard';
import { courseAPI } from '@/lib/api';
import { Search, Filter, BookOpen } from 'lucide-react';
import type { Course } from '@/types';
import toast from 'react-hot-toast';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [tab, setTab] = useState<'enrolled' | 'browse'>('enrolled');

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { search, level: levelFilter || undefined };
      if (tab === 'enrolled') params.enrolled = true;
      const { data } = await courseAPI.getAll(params);
      setCourses(data.data || []);
    } catch { toast.error('Failed to load courses'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, levelFilter, tab]);

  const handleEnroll = async (id: string) => {
    try {
      await courseAPI.enroll(id);
      toast.success('Enrolled successfully!');
      fetchCourses();
    } catch { toast.error('Enrollment failed'); }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Courses</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Manage your academic learning journey</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-2)' }}>
        {(['enrolled', 'browse'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: tab === t ? 'var(--card)' : 'transparent',
              color: tab === t ? 'var(--primary)' : 'var(--muted)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {t === 'enrolled' ? `📚 My Courses` : `🌐 Browse All`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--subtle)' }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Course grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(null).map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={56} className="mb-4 opacity-20" style={{ color: 'var(--muted)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            {tab === 'enrolled' ? 'No enrolled courses' : 'No courses found'}
          </h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {tab === 'enrolled' ? 'Browse available courses and enroll to get started.' : 'Try adjusting your search filters.'}
          </p>
          {tab === 'enrolled' && (
            <button onClick={() => setTab('browse')} className="btn btn-primary mt-4 text-sm">Browse Courses</button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course, i) => (
            <CourseCard
              key={course._id}
              course={course}
              showProgress={tab === 'enrolled'}
              progress={tab === 'enrolled' ? Math.floor(Math.random() * 80) + 10 : 0}
              showEnroll={tab === 'browse'}
              onEnroll={handleEnroll}
              delay={i * 0.06}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
