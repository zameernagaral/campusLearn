'use client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { courseAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function HODCoursesPage() {
 const [courses, setCourses] = useState<any[]>([]);
 const [semesterFilter, setSemesterFilter] = useState('');
 const [isLoading, setIsLoading] = useState(true);
 const { user } = useAuthStore();

 useEffect(() => {
 if (user?.department) {
 fetchCourses();
 }
 }, [semesterFilter, user?.department]);

 const fetchCourses = async () => {
 setIsLoading(true);
 try {
 const deptId = typeof user?.department === 'object' ? (user.department as any)._id : user?.department;
 const res = await courseAPI.getAll({
 semester: semesterFilter || undefined,
 department: deptId || undefined,
 });
 setCourses(res.data?.data || []);
 } catch (err) {
 toast.error('Failed to load courses');
 } finally {
 setIsLoading(false);
 }
 };

 const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
 try {
 await courseAPI.update(courseId, { isPublished: !currentStatus });
 toast.success(currentStatus ? 'Course moved to Draft' : 'Course Published');
 fetchCourses();
 } catch (err) {
 toast.error('Failed to update course status');
 }
 };

 return (
 <DashboardLayout requiredRole="hod">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Courses</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Monitor all courses in your department</p>
 </div>
 </div>

 {/* Filters */}
 <div className="card p-4 mb-5 flex flex-wrap gap-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
 <select
 value={semesterFilter}
 onChange={e => setSemesterFilter(e.target.value)}
 className="px-4 py-2 rounded-xl text-sm outline-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-w-[150px]"
 >
 <option value="">All Semesters</option>
 {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
 <option key={s} value={s}>Semester {s}</option>
 ))}
 </select>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {isLoading ? (
 Array(6).fill(null).map((_, i) => (
 <div key={i} className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 h-48 skeleton" />
 ))
 ) : courses.length > 0 ? (
 courses.map((course, i) => (
 <Link 
 key={course._id} 
 href="#" 
 onClick={(e) => {
 e.preventDefault();
 toast('Course details view coming soon');
 }}
 className="block"
 >
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden h-full cursor-pointer"
 >
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
 
 <div className="flex justify-between items-start mb-6">
 <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
 {course.department?.code || 'N/A'} • Sem {course.semester || 'N/A'}
 </span>
 <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
 course.isPublished 
 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' 
 : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500'
 }`}>
 {course.isPublished ? 'Published' : 'Draft'}
 </span>
 </div>

 <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
 {course.title}
 </h3>
 <p className="text-sm text-zinc-500 font-medium mb-6 flex-1">
 By {course.faculty?.name || 'Unknown Faculty'}
 </p>

 <div className="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800/60">
 <div className="flex flex-col gap-1">
 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enrolled</span>
 <span className="text-lg font-black text-zinc-900 dark:text-white">{course.enrolledStudents?.length || 0}</span>
 </div>
 
 <button
 onClick={(e) => {
 e.preventDefault();
 handleTogglePublish(course._id, course.isPublished);
 }}
 className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-lg transition-colors text-xs border border-zinc-200 dark:border-zinc-800 z-10"
 >
 {course.isPublished ? 'Move to Draft' : 'Publish'}
 </button>
 </div>
 </motion.div>
 </Link>
 ))
 ) : (
 <div className="col-span-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
 <p className="text-zinc-500 font-medium">No courses found in your department.</p>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
