'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { use } from 'react';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);

  // Mock data for the specific course
  const course = {
    id: unwrappedParams.id,
    title: 'Machine Learning Fundamentals',
    subjectCode: 'CS601',
    credits: 4,
    enrolled: 45,
    status: 'PUBLISHED',
    description: 'Learn Machine Learning from scratch with hands-on projects. We cover regression, classification, neural networks, and more.',
  };

  const sections = [
    { title: 'Week 1: Introduction to ML', modules: 3 },
    { title: 'Week 2: Linear Regression', modules: 4 },
    { title: 'Week 3: Neural Networks', modules: 5 },
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ← Back to Courses
        </button>

        <div className="bg-white dark:bg-zinc-950 p-6 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                  {course.subjectCode}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  {course.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                {course.title}
              </h1>
            </div>
            
            <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
              Edit Course
            </button>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-10">
            {course.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enrolled Students</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.enrolled}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Course Credits</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.credits}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Assignments</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">4</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Modules</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">12</span>
            </div>
          </div>
        </div>

        {/* Course Content Management */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Course Content</h2>
          <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-widest">
            + Add Section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-orange-500/30 transition-colors"
            >
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1">
                  {section.title}
                </h3>
                <p className="text-xs font-medium text-zinc-500">{section.modules} Modules</p>
              </div>
              <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                Manage
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
