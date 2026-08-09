'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { courseAPI } from '@/lib/api';
import type { Course } from '@/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function FacultyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseAPI.getAll();
        setCourses(data.data || []);
      } catch {
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Courses</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage and update the courses you are teaching</p>
        </div>
        <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
          Create New Course
        </button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-900/50 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Courses Found</h3>
          <p className="text-zinc-500 mb-6">You are not teaching any active courses this semester.</p>
          <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm">
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full group hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                  {course.subjectCode || 'CS601'}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${
                  course.isPublished 
                    ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
                    : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                }`}>
                  {course.isPublished ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 leading-tight flex-1 group-hover:text-orange-500 transition-colors">
                {course.title}
              </h3>
              
              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-8">
                {course.shortDescription || course.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enrolled</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-300">
                    {course.enrolledStudents?.length || 45} Students
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Credits</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-300">
                    {course.credits} Credits
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <Link href={`/faculty/courses/${course._id}`} className="w-full py-3 text-center bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800">
                  Manage Course
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
