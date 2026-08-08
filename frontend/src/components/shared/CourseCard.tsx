'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Users, Star, Clock, Award } from 'lucide-react';
import { cn, truncate } from '@/lib/utils';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  progress?: number;
  showEnroll?: boolean;
  onEnroll?: (id: string) => void;
  delay?: number;
}

const LEVEL_COLORS = {
  beginner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  intermediate: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
  advanced: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
};

const THUMBNAIL_GRADIENTS = [
  'linear-gradient(135deg, #f97316, #ea580c)',
  'linear-gradient(135deg, #f97316, #f59e0b)',
  'linear-gradient(135deg, #ea580c, #c2410c)',
  'linear-gradient(135deg, #3f3f46, #27272a)',
  'linear-gradient(135deg, #52525b, #3f3f46)',
  'linear-gradient(135deg, #71717a, #52525b)',
];

export function CourseCard({ course, showProgress, progress = 0, showEnroll, onEnroll, delay = 0 }: CourseCardProps) {
  const gradientIndex = course.title.charCodeAt(0) % THUMBNAIL_GRADIENTS.length;
  const faculty = typeof course.faculty === 'object' ? course.faculty : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card group overflow-hidden cursor-pointer"
    >
      <Link href={`/student/courses/${course._id}`}>
        {/* Thumbnail */}
        <div
          className="relative h-40 overflow-hidden"
          style={{ background: course.thumbnail ? undefined : THUMBNAIL_GRADIENTS[gradientIndex] }}
        >
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={48} className="text-white opacity-60" />
            </div>
          )}

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <span className={cn('badge capitalize text-xs', LEVEL_COLORS[course.level])}>
              {course.level}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-semibold">{course.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              {course.subjectCode}
            </span>
          </div>

          <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: 'var(--foreground)' }}>
            {truncate(course.title, 55)}
          </h3>

          {faculty && (
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
              by {typeof faculty === 'object' ? faculty.name : faculty}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--subtle)' }}>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {course.enrolledStudents?.length || 0} students
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Award size={12} />
              {course.credits} credits
            </span>
          </div>

          {/* Progress bar */}
          {showProgress && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Progress</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{progress}%</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </Link>

      {showEnroll && onEnroll && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onEnroll(course._id)}
            className="btn btn-primary w-full text-sm"
          >
            Enroll Now
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Skeleton version
export function CourseCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-6 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}
