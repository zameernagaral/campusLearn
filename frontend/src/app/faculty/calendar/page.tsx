'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { calendarAPI, courseAPI } from '@/lib/api';
import type { Course } from '@/types';
import { CalendarEventsSkeleton } from '@/components/shared/Skeleton';

export default function FacultyCalendarPage() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [events, setEvents] = useState<any[]>([]);
 const [courses, setCourses] = useState<Course[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 
 const [formData, setFormData] = useState({
 title: '',
 description: '',
 type: 'class',
 startTime: '',
 endTime: '',
 location: '',
 course: ''
 });

 const fetchEvents = async () => {
 setIsLoading(true);
 try {
 const res = await calendarAPI.getAll();
 setEvents(res.data?.data || res.data || []);
 } catch (error) {
 toast.error('Failed to load events');
 } finally {
 setIsLoading(false);
 }
 };

 const fetchCourses = async () => {
 try {
 const res = await courseAPI.getAll();
 setCourses(res.data?.data || res.data || []);
 } catch (error) {
 console.error('Failed to fetch courses:', error);
 }
 };

 useEffect(() => {
 fetchEvents();
 fetchCourses();
 }, []);

 const handleAddEvent = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsSubmitting(true);
 try {
 await calendarAPI.create(formData);
 toast.success('Event created successfully');
 setShowModal(false);
 setFormData({
 title: '', description: '', type: 'class',
 startTime: '', endTime: '', location: '', course: ''
 });
 fetchEvents();
 } catch (error: any) {
 toast.error(error.response?.data?.message || 'Failed to create event');
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleDeleteEvent = async (id: string) => {
 if (!window.confirm('Are you sure you want to delete this event?')) return;
 try {
 await calendarAPI.delete(id);
 toast.success('Event deleted');
 fetchEvents();
 } catch (error) {
 toast.error('Failed to delete event');
 }
 };

 // Calendar logic
 const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
 const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
 
 const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 const dates = Array.from({ length: 42 }, (_, i) => {
 const date = i - firstDayOfMonth + 1;
 return date;
 });

 const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
 const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
 const goToday = () => setCurrentDate(new Date());

 const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Academic Calendar</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Manage your classes, exams, and deadlines</p>
 </div>
 <button 
 onClick={() => setShowModal(true)}
 className="btn btn-primary flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 border-0 text-white shadow-lg shadow-orange-500/20 px-4 py-2 rounded-xl font-bold transition-colors"
 >
 <Plus size={16} /> Add Event
 </button>
 </div>

 <div className="grid lg:grid-cols-4 gap-8">
 <div className="lg:col-span-3">
 <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
 
 {/* Calendar Header */}
 <div className="flex items-center justify-between mb-8">
 <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
 <CalendarIcon size={20} className="text-orange-500" /> 
 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
 </h2>
 <div className="flex items-center gap-2">
 <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500">
 <ChevronLeft size={20} />
 </button>
 <button onClick={goToday} className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-sm font-semibold text-zinc-700 dark:text-zinc-300">
 Today
 </button>
 <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500">
 <ChevronRight size={20} />
 </button>
 </div>
 </div>

 {/* Calendar Grid */}
 <div className="grid grid-cols-7 gap-px bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
 {/* Days Header */}
 {days.map(day => (
 <div key={day} className="bg-white dark:bg-zinc-900 p-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
 {day}
 </div>
 ))}
 
 {/* Dates */}
 {dates.map((date, i) => {
 const isCurrentMonth = date > 0 && date <= daysInMonth;
 const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
 const isToday = isCurrentMonth && cellDate.toDateString() === new Date().toDateString();
 
 const dayEvents = events.filter(e => {
 if (!isCurrentMonth) return false;
 const eDate = new Date(e.startTime);
 return eDate.toDateString() === cellDate.toDateString();
 });

 return (
 <div key={i} className={`bg-white dark:bg-zinc-900 min-h-[100px] p-2 ${!isCurrentMonth ? 'opacity-30 bg-zinc-50/50 dark:bg-zinc-900/50' : ''}`}>
 <div className="flex items-center justify-between mb-2">
 <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-zinc-700 dark:text-zinc-300'}`}>
 {isCurrentMonth ? date : (date <= 0 ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + date : date - daysInMonth)}
 </span>
 </div>
 
 <div className="space-y-1">
 {dayEvents.map(event => (
 <div key={event._id} className={`text-[10px] p-1.5 rounded-lg truncate font-medium border group relative flex items-center justify-between ${
 event.type === 'exam' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
 event.type === 'class' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
 }`}>
 <span className="truncate">{event.title}</span>
 <button onClick={() => handleDeleteEvent(event._id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-1 shrink-0">
 <X size={12} />
 </button>
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Sidebar */}
 <div className=" space-y-6">
 <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
 <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Upcoming Events</h3>
 
 <div className="space-y-4">
 {isLoading ? (
 <CalendarEventsSkeleton count={4} />
 ) : events.length === 0 ? (
 <p className="text-zinc-500 text-sm text-center py-4">No upcoming events.</p>
 ) : events.filter(e => new Date(e.startTime) >= new Date()).slice(0, 5).map((event, i) => (
 <motion.div 
 key={event._id}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.1 }}
 className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 relative group"
 >
 <button onClick={() => handleDeleteEvent(event._id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all">
 <Trash2 size={14} />
 </button>
 <div className="flex items-center gap-2 mb-2">
 <span className={`w-2 h-2 rounded-full ${
 event.type === 'exam' ? 'bg-red-500' :
 event.type === 'class' ? 'bg-blue-500' : 'bg-orange-500'
 }`} />
 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{event.type}</span>
 </div>
 
 <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-3 pr-6">{event.title}</h4>
 
 <div className="space-y-2">
 <div className="flex items-center gap-2 text-xs text-zinc-500">
 <Clock size={14} /> 
 {new Date(event.startTime).toLocaleDateString()} {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
 </div>
 {event.location && (
 <div className="flex items-center gap-2 text-xs text-zinc-500">
 <MapPin size={14} /> {event.location}
 </div>
 )}
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Add Event Modal */}
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 my-8"
 >
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
 <CalendarIcon size={20} className="text-orange-500" />
 Add Event
 </h3>
 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
 <X size={20} className="text-zinc-500" />
 </button>
 </div>
 
 <form onSubmit={handleAddEvent} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
 <input 
 required
 value={formData.title}
 onChange={(e) => setFormData({...formData, title: e.target.value})}
 placeholder="Event title"
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white"
 />
 </div>

 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Type</label>
 <select 
 value={formData.type}
 onChange={(e) => setFormData({...formData, type: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white appearance-none"
 >
 <option value="class">Class</option>
 <option value="exam">Exam</option>
 <option value="deadline">Deadline</option>
 <option value="event">Event</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Course (Optional)</label>
 <select 
 value={formData.course}
 onChange={(e) => setFormData({...formData, course: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white appearance-none"
 >
 <option value="">No Course (General Event)</option>
 {courses.map(c => (
 <option key={c._id} value={c._id}>{c.title}</option>
 ))}
 </select>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Start</label>
 <input 
 required
 type="datetime-local"
 value={formData.startTime}
 onChange={(e) => setFormData({...formData, startTime: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">End</label>
 <input 
 required
 type="datetime-local"
 value={formData.endTime}
 onChange={(e) => setFormData({...formData, endTime: e.target.value})}
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Location (Optional)</label>
 <input 
 value={formData.location}
 onChange={(e) => setFormData({...formData, location: e.target.value})}
 placeholder="e.g. Hall A, Online"
 className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-all text-sm text-zinc-900 dark:text-white"
 />
 </div>

 <button 
 type="submit"
 disabled={isSubmitting}
 className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-6"
 >
 {isSubmitting ? 'Saving...' : 'Save Event'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </DashboardLayout>
 );
}
