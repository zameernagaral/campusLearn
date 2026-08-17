'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { liveClassAPI, courseAPI } from '@/lib/api';
import { X, Calendar, Clock, Video, Link as LinkIcon } from 'lucide-react';
import type { Course } from '@/types';

export default function FacultyLivePage() {
 const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');
 const [classes, setClasses] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 // Modal state
 const [showModal, setShowModal] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [courses, setCourses] = useState<Course[]>([]);
 
 const [formData, setFormData] = useState({
 title: '',
 course: '',
 scheduledAt: '',
 duration: '60',
 meetingLink: '',
 platform: 'meet',
 });

 const fetchClasses = async () => {
 setIsLoading(true);
 try {
 const res = await liveClassAPI.getAll();
 const data = res.data?.data || res.data || [];
 
 const formatted = data.map((c: any) => {
 const dateObj = new Date(c.scheduledAt);
 return {
 id: c._id,
 title: c.title,
 course: c.course?.subjectCode || 'N/A',
 date: dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
 time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
 duration: `${c.duration} mins`,
 attendees: c.attendees?.length || 0,
 status: c.status,
 link: c.meetingLink,
 recordingUrl: c.recordingUrl
 };
 });
 setClasses(formatted);
 } catch (error) {
 toast.error('Failed to load live classes');
 } finally {
 setIsLoading(false);
 }
 };

 const fetchCourses = async () => {
 try {
 const res = await courseAPI.getAll();
 setCourses(res.data?.data || res.data || []);
 } catch (error) {
 console.error(error);
 }
 };

 useEffect(() => {
 fetchClasses();
 fetchCourses();
 }, []);

 const handleSchedule = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 try {
 await liveClassAPI.create(formData);
 toast.success('Live class scheduled successfully!');
 setShowModal(false);
 setFormData({
 title: '',
 course: '',
 scheduledAt: '',
 duration: '60',
 meetingLink: '',
 platform: 'meet',
 });
 fetchClasses();
 } catch (error: any) {
 toast.error(error.response?.data?.message || 'Failed to schedule class');
 } finally {
 setIsSubmitting(false);
 }
 };

 const filteredClasses = classes.filter(c => 
 activeTab === 'upcoming' ? (c.status === 'upcoming' || c.status === 'scheduled') : (c.status === 'recorded' || c.status === 'completed')
 );

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Live Classes</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Schedule and manage your live video sessions</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap"
 >
 Schedule Live Class
 </button>
 </div>

 {/* Tabs */}
 <div className="flex items-center gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl w-fit">
 <button 
 onClick={() => setActiveTab('upcoming')}
 className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'upcoming' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
 >
 Upcoming
 </button>
 <button 
 onClick={() => setActiveTab('recorded')}
 className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'recorded' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
 >
 Recorded
 </button>
 </div>

 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
 {isLoading ? (
 Array(6).fill(null).map((_, i) => (
 <div key={i} className="h-48 bg-zinc-100 dark:bg-zinc-900/50 animate-pulse rounded-3xl" />
 ))
 ) : filteredClasses.map((cls, i) => (
 <motion.div 
 key={cls.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-6 hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm shadow-sm"
 >
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-2">
 <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
 {cls.course}
 </span>
 <span className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'upcoming' ? 'text-orange-500' : 'text-zinc-500'}`}>
 {cls.date} at {cls.time}
 </span>
 </div>
 <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2">
 {cls.title}
 </h3>
 <p className="text-xs font-medium text-zinc-500">
 Duration: {cls.duration} • Expected Attendees: {cls.attendees}
 </p>
 </div>

 <div className="flex items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-auto">
 {activeTab === 'upcoming' ? (
 <>
 <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800">
 Edit
 </button>
 <a 
 href={cls.link || 'https://meet.google.com/new'} 
 target="_blank" 
 rel="noopener noreferrer"
 className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20"
 >
 Start Class
 </a>
 </>
 ) : (
 <button onClick={() => toast.success('Opening recording player...')} className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800 w-full">
 View Recording
 </button>
 )}
 </div>
 </motion.div>
 ))}
 
 {!isLoading && filteredClasses.length === 0 && (
 <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
 <p className="text-zinc-500 font-medium">No {activeTab} live classes found.</p>
 </div>
 )}
 </div>

 {/* Schedule Modal */}
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8"
 >
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
 <Video size={20} className="text-orange-500" />
 Schedule Live Class
 </h3>
 <button 
 onClick={() => setShowModal(false)}
 className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
 >
 <X size={20} className="text-zinc-500" />
 </button>
 </div>
 
 <form onSubmit={handleSchedule} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Class Title</label>
 <input 
 required
 value={formData.title}
 onChange={(e) => setFormData({...formData, title: e.target.value})}
 placeholder="e.g. Chapter 4: Neural Networks"
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white text-sm"
 />
 </div>

 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Course</label>
 <select 
 required
 value={formData.course}
 onChange={(e) => setFormData({...formData, course: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white text-sm appearance-none"
 >
 <option value="" disabled>Select a course...</option>
 {courses.map(course => (
 <option key={course._id} value={course._id}>{course.title} ({course.subjectCode})</option>
 ))}
 </select>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"><Calendar size={14}/> Date & Time</label>
 <input 
 required
 type="datetime-local"
 value={formData.scheduledAt}
 onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white text-sm"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"><Clock size={14}/> Duration</label>
 <select 
 value={formData.duration}
 onChange={(e) => setFormData({...formData, duration: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white text-sm appearance-none"
 >
 <option value="30">30 minutes</option>
 <option value="45">45 minutes</option>
 <option value="60">1 hour</option>
 <option value="90">1.5 hours</option>
 <option value="120">2 hours</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"><LinkIcon size={14}/> Meeting Link</label>
 <input 
 required
 type="url"
 placeholder="https://meet.google.com/..."
 value={formData.meetingLink}
 onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white text-sm"
 />
 </div>

 <button 
 type="submit"
 disabled={isSubmitting}
 className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-6 flex justify-center items-center gap-2"
 >
 {isSubmitting ? (
 <>
 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 Scheduling...
 </>
 ) : 'Schedule Class'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </DashboardLayout>
 );
}
