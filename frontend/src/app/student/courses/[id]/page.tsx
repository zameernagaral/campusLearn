'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { courseAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, BookOpen, Clock, Users, Award, PlayCircle, FileText, Download, CheckCircle, Video } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CourseDetailsPage() {
 const params = useParams();
 const router = useRouter();
 const courseId = params.id as string;
 
 const [course, setCourse] = useState<any>(null);
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
 const documentNotes = courseModules.flatMap((m: any) => m.lessons?.filter((l: any) => l.type === 'document' || l.type === 'assignment') || []);
 let totalLessons = 0;
 courseModules.forEach((m: any) => totalLessons += (m.lessons?.length || 0));

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
 className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
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
 
 <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 whitespace-pre-wrap">
 {course.description || "Dive deep into the core concepts and advanced techniques required to master this subject. This comprehensive course covers all essential topics tailored for your academic success."}
 </p>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-zinc-200 dark:border-zinc-800">
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-zinc-500">
 <BookOpen size={16} /> <span className="text-sm font-medium">Lessons</span>
 </div>
 <span className="font-semibold text-zinc-900 dark:text-white">{totalLessons} Total</span>
 </div>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-zinc-500">
 <Clock size={16} /> <span className="text-sm font-medium">Modules</span>
 </div>
 <span className="font-semibold text-zinc-900 dark:text-white">{courseModules.length} Modules</span>
 </div>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-zinc-500">
 <Users size={16} /> <span className="text-sm font-medium">Enrolled</span>
 </div>
 <span className="font-semibold text-zinc-900 dark:text-white">{course.enrolledStudents?.length || 0} Students</span>
 </div>
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-zinc-500">
 <Award size={16} /> <span className="text-sm font-medium">Certificate</span>
 </div>
 <span className="font-semibold text-emerald-500">Yes</span>
 </div>
 </div>

 <div className="mt-6 flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center font-bold text-orange-500 shrink-0 border border-orange-200 dark:border-orange-500/20">
 {course.faculty?.name?.charAt(0) || 'F'}
 </div>
 <div>
 <p className="text-xs text-zinc-500 font-medium">Course Instructor</p>
 <p className="font-bold text-zinc-900 dark:text-white">{course.faculty?.name || 'Unknown Faculty'}</p>
 </div>
 </div>
 </motion.div>

 <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
 <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Course Curriculum</h2>
 
 <div className="space-y-4">
 {courseModules.length === 0 ? (
 <div className="text-center p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
 <p className="text-zinc-500">No modules have been added to this course yet.</p>
 </div>
 ) : (
 courseModules.map((module: any, idx: number) => (
 <div key={module._id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50">
 <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
 <div className="flex items-center gap-4">
 <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-zinc-500 text-sm border border-zinc-200 dark:border-zinc-800 shrink-0">
 {idx + 1}
 </div>
 <div>
 <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">{module.title}</h3>
 <p className="text-xs text-zinc-500 mt-1">{module.lessons?.length || 0} lessons</p>
 </div>
 </div>
 </div>
 
 <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/30">
 {module.lessons?.length === 0 ? (
 <div className="p-4 text-center text-xs text-zinc-500">No lessons in this module</div>
 ) : (
 module.lessons?.map((lesson: any, lIdx: number) => (
 <div key={lesson._id} className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
 <div className="flex items-start sm:items-center gap-3">
 <div className="mt-0.5 sm:mt-0 text-zinc-400 group-hover:text-orange-500 transition-colors">
 {lesson.type === 'video' ? <Video size={18} /> : 
 lesson.type === 'document' ? <FileText size={18} /> : 
 <PlayCircle size={18} />}
 </div>
 <div>
 <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
 {lIdx + 1}. {lesson.title}
 </p>
 {lesson.duration && <p className="text-xs text-zinc-500 mt-1">{lesson.duration} mins</p>}
 </div>
 </div>
 <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-500 hover:border-orange-200 dark:hover:border-orange-500/30">
 Start
 </button>
 </div>
 ))
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
 <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
 <FileText size={18} className="text-orange-500" /> Syllabus & Notes
 </h3>
 
 <div className="space-y-3">
 {documentNotes.length === 0 ? (
 <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-zinc-500 text-sm">
 No documents available yet.
 </div>
 ) : (
 documentNotes.map((note: any) => (
 <div key={note._id} className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group hover:border-orange-500/30 transition-colors">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 flex items-center justify-center shrink-0">
 <FileText size={18} />
 </div>
 <div>
 <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{note.title}</p>
 <p className="text-xs text-zinc-500">{note.type}</p>
 </div>
 </div>
 <button 
 onClick={() => {
 if(note.documentUrl) {
 window.open(note.documentUrl, '_blank');
 } else {
 toast("Document not uploaded yet");
 }
 }}
 className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors shadow-sm border border-zinc-200 dark:border-zinc-700"
 >
 <Download size={14} />
 </button>
 </div>
 ))
 )}
 </div>

 <button 
 onClick={() => toast.success('Resuming course material...')}
 className="w-full mt-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-sm"
 >
 Resume Course
 </button>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
