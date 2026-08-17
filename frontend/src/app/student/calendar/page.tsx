'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { calendarAPI } from '@/lib/api';

export default function CalendarPage() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [events, setEvents] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

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

 useEffect(() => {
 fetchEvents();
 }, []);

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
 <DashboardLayout requiredRole="student">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Academic Calendar</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Manage your classes, exams, and deadlines</p>
 </div>
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
 <div key={event._id} className={`text-[10px] p-1.5 rounded-lg truncate font-medium border ${
 event.type === 'exam' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
 event.type === 'class' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
 }`}>
 {event.title}
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
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
 <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Upcoming Events</h3>
 
 <div className="space-y-4">
 {isLoading ? (
 <div className="flex justify-center py-8">
 <span className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
 </div>
 ) : events.length === 0 ? (
 <p className="text-zinc-500 text-sm text-center py-4">No upcoming events.</p>
 ) : events.filter(e => new Date(e.startTime) >= new Date()).slice(0, 5).map((event, i) => (
 <motion.div 
 key={event._id}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.1 }}
 className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
 >
 <div className="flex items-center gap-2 mb-2">
 <span className={`w-2 h-2 rounded-full ${
 event.type === 'exam' ? 'bg-red-500' :
 event.type === 'class' ? 'bg-blue-500' : 'bg-orange-500'
 }`} />
 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{event.type}</span>
 </div>
 
 <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-3">{event.title}</h4>
 
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
 </DashboardLayout>
 );
}
