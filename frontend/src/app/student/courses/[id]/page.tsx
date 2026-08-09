'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { courseAPI } from '@/lib/api';
import type { Course } from '@/types';
import toast from 'react-hot-toast';
import { ArrowLeft, BookOpen, Clock, Users, Award, PlayCircle, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const { data } = await courseAPI.getOne(courseId);
        setCourse(data.data);
      } catch (error) {
        toast.error('Failed to load course details');
        router.push('/student/courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, router]);

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="student">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) return null;

  const courseModules = course.modules || [];
  const documentNotes = courseModules.flatMap(m => m.lessons?.filter(l => l.type === 'document') || []);

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-6">
        <Link href="/student/courses" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 uppercase tracking-wide">
                {course.level || 'Intermediate'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {course.credits} Credits
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              {course.description || "Dive deep into the core concepts and advanced techniques required to master this subject. This comprehensive course covers all essential topics tailored for your academic success."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <BookOpen size={16} /> <span className="text-sm font-medium">Lessons</span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">{course.totalLessons || 12} Total</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={16} /> <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">8 Weeks</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users size={16} /> <span className="text-sm font-medium">Enrolled</span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">{course.enrolledStudents?.length || 45} Students</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Award size={16} /> <span className="text-sm font-medium">Certificate</span>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white">Included</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {courseModules.length > 0 ? (
                courseModules.map((module, index) => (
                  <div key={module._id || index} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between group cursor-pointer hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                        <PlayCircle size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-white">{module.title || `Module ${index + 1}`}</h4>
                        <p className="text-sm text-zinc-500">{module.lessons?.length || 0} Lessons • {module.duration || 0} mins</p>
                      </div>
                    </div>
                    <button className="text-sm font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Curriculum not available yet.</p>
              )}
            </div>
          </motion.div>

          {/* Course Materials & Notes Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="text-orange-500" size={24} /> 
              Course Materials & Notes
            </h2>
            <div className="space-y-3">
              {documentNotes.length > 0 ? (
                documentNotes.map((note, index) => (
                  <div key={note._id || index} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between group hover:border-orange-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {note.documentName || note.title}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500 mt-0.5">Document</p>
                      </div>
                    </div>
                    {note.documentUrl ? (
                      <a href={note.documentUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-orange-500 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Download size={16} /> Download
                      </a>
                    ) : (
                      <button disabled className="flex items-center gap-2 text-sm font-semibold text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-lg opacity-50 cursor-not-allowed transition-all">
                        <Download size={16} /> Unavailable
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No materials available for this course.</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 mb-6 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <PlayCircle size={48} className="text-white opacity-80" />
            </div>
            
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Ready to start learning?</h3>
            <p className="text-sm text-zinc-500 mb-6">Continue where you left off and master the concepts.</p>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-zinc-700 dark:text-zinc-300">Course Progress</span>
                <span className="text-orange-500">35%</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98]">
              Resume Course
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
