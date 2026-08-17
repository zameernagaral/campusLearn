'use client';
import { useState, useEffect, use } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { courseAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Users as UsersIcon, UserCircle, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CourseDetailSkeleton } from '@/components/shared/Skeleton';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
 const unwrappedParams = use(params);
 const [course, setCourse] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchCourse();
 }, [unwrappedParams.id]);

 const fetchCourse = async () => {
 try {
 setIsLoading(true);
 const res = await courseAPI.getOne(unwrappedParams.id);
 setCourse(res.data.data);
 } catch (error) {
 toast.error('Failed to load course details');
 } finally {
 setIsLoading(false);
 }
 };

 if (isLoading) {
 return (
 <DashboardLayout requiredRole="admin">
 <CourseDetailSkeleton />
 </DashboardLayout>
 );
 }

 if (!course) {
 return (
 <DashboardLayout requiredRole="admin">
 <div className="text-center py-12">Course not found</div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout requiredRole="admin">
 <div className="max-w-6xl mx-auto space-y-8">
 
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
 <ArrowLeft size={16} /> Back to Courses
 </Link>
 <div className="flex items-center gap-3">
 <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest rounded-lg">
 {course.department?.code || 'N/A'}
 </span>
 <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
 course.isPublished 
 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' 
 : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500'
 }`}>
 {course.isPublished ? 'Published' : 'Draft'}
 </span>
 </div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-3">{course.title}</h1>
 <p className="text-zinc-500 mt-2 text-sm max-w-2xl">{course.description}</p>
 </div>
 </div>

 <div className="grid lg:grid-cols-1 gap-8">
 
 {/* Main Content (Enrolled Students) */}
 <div className=" space-y-6">
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
 Enrolled Students ({course.enrolledStudents?.length || 0})
 </h3>
 
 <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-widest">
 <tr>
 <th className="px-6 py-4 font-bold">Name</th>
 <th className="px-6 py-4 font-bold">Email</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
 {course.enrolledStudents?.map((user: any) => (
 <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
 <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
 {user?.name?.charAt(0) || 'U'}
 </div>
 {user?.name || 'Unknown User'}
 </div>
 </td>
 <td className="px-6 py-4 text-zinc-500">{user.email}</td>
 </tr>
 ))}
 {(!course.enrolledStudents || course.enrolledStudents.length === 0) && (
 <tr>
 <td colSpan={2} className="px-6 py-12 text-center text-zinc-500">
 No students enrolled in this course yet.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 
 {/* Faculty Assiged */}
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
 >
 <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
 <UserCircle size={18} className="text-orange-500" />
 Handling Faculty
 </h3>
 
 <div className="space-y-4">
 {course.faculty ? (
 <div className="flex flex-col items-center p-6 rounded-2xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 text-center">
 <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg shadow-orange-500/30">
 {course.faculty.name.replace('Dr. ', '').charAt(0)}
 </div>
 <p className="font-bold text-lg text-zinc-900 dark:text-white">{course.faculty.name}</p>
 <p className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-widest mt-1">
 {course.faculty.designation || 'Professor'}
 </p>
 <p className="text-sm text-zinc-500 mt-3">
 {course.faculty.email}
 </p>
 </div>
 ) : (
 <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-center text-zinc-500 text-sm">
 No Faculty Assigned
 </div>
 )}
 </div>
 </motion.div>

 {/* Course Stats */}
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.1 }}
 className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 border-dashed"
 >
 <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Course Stats</h3>
 <div className="space-y-3">
 <div className="flex justify-between items-center text-sm">
 <span className="text-zinc-500">Semester</span>
 <span className="font-bold text-zinc-900 dark:text-white">{course.semester || 'N/A'}</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-zinc-500">Credits</span>
 <span className="font-bold text-zinc-900 dark:text-white">{course.credits || '3'}</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-zinc-500">Views</span>
 <span className="font-bold text-zinc-900 dark:text-white">{course.views || '0'}</span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-zinc-500">Modules</span>
 <span className="font-bold text-zinc-900 dark:text-white">{course.modules?.length || 0}</span>
 </div>
 </div>
 </motion.div>

 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
