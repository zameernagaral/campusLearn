'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, ArrowLeft, Mic, MicOff, Camera, MonitorUp, Users } from 'lucide-react';
import { useState } from 'react';

export default function TimetablePage() {
 const [activeDay, setActiveDay] = useState('Monday');
 const [activeClass, setActiveClass] = useState<string | null>(null);

 const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

 const allClasses = [
 { id: 1, subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Smith', room: 'Room 204', status: 'Live Now', day: 'Monday' },
 { id: 2, subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', faculty: 'Prof. Johnson', room: 'Room 201', status: 'Upcoming', day: 'Monday' },
 { id: 3, subject: 'Data Structures Lab', time: '01:00 PM - 03:00 PM', type: 'Lab', faculty: 'Mr. Davis', room: 'Lab 3', status: 'Upcoming', day: 'Monday' },
 { id: 4, subject: 'Operating Systems', time: '09:00 AM - 10:00 AM', type: 'Lecture', faculty: 'Dr. Brown', room: 'Room 101', status: 'Upcoming', day: 'Tuesday' },
 { id: 5, subject: 'Software Engineering', time: '10:15 AM - 11:15 AM', type: 'Lecture', faculty: 'Prof. White', room: 'Room 102', status: 'Upcoming', day: 'Tuesday' },
 { id: 6, subject: 'Artificial Intelligence', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Green', room: 'Room 305', status: 'Upcoming', day: 'Wednesday' },
 ];

 const displayedClasses = allClasses.filter(c => c.day === activeDay);

 return (
 <DashboardLayout requiredRole="student">
  <div className="flex items-center justify-between mb-8">
  <div>
  <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Real-Time Timetable</h1>
  <p className="text-zinc-500 font-medium mt-1">Manage your schedule and live classes</p>
  </div>
  </div>

  <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
  {days.map((day, idx) => (
  <button
  key={day}
  onClick={() => setActiveDay(day)}
  className={`flex flex-col items-center min-w-[80px] p-4 rounded-2xl border transition-all ${activeDay === day ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20 hover:-translate-y-1' : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-orange-500/30 backdrop-blur-sm hover:-translate-y-1'}`}
  >
  <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">{day.substring(0, 3)}</span>
  <span className="text-2xl font-bold">0{idx + 5}</span>
  </button>
  ))}
  </div>

  {/* Smart Alerts for Timetable */}
  {activeDay === 'Monday' && (
  <div className="mb-8 p-5 rounded-3xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5 flex items-start gap-4 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-orange-500/30">
  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
  <AlertTriangle className="text-orange-500" size={20} />
  </div>
  <div>
  <p className="font-bold text-zinc-900 dark:text-white">Schedule Change</p>
  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">Computer Networks has been rescheduled to Room 201 (previously Room 105).</p>
  </div>
  </div>
  )}

  <div className="space-y-4">
  {displayedClasses.length === 0 ? (
  <div className="bg-white dark:bg-zinc-900/40 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center font-medium text-zinc-500 backdrop-blur-sm">No classes scheduled for {activeDay}. Enjoy your day!</div>
  ) : (
  displayedClasses.map((cls) => (
  <div key={cls.id} className={`bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border backdrop-blur-sm transition-all hover:-translate-y-1 ${cls.status === 'Live Now' ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-orange-500/30 shadow-sm'}`}>
  <div className="flex justify-between items-start">
  <div>
  <div className="flex items-center gap-2 mb-3">
  <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 w-fit ${cls.status === 'Live Now' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
  {cls.status === 'Live Now' && <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
  {cls.status}
  </span>
  <span className="text-xs px-3 py-1 rounded-full font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{cls.type}</span>
  </div>
  <h3 className="text-xl font-bold mt-1 text-zinc-900 dark:text-white">{cls.subject}</h3>
  <p className="text-zinc-500 font-medium text-sm mt-1">Faculty: <span className="text-zinc-700 dark:text-zinc-300">{cls.faculty}</span></p>
  </div>
  <div className="text-right">
  <p className="font-bold flex items-center justify-end gap-1.5 text-zinc-900 dark:text-white"><Clock size={16} className="text-orange-500" /> {cls.time}</p>
  <p className="text-sm font-medium flex items-center justify-end gap-1.5 mt-2 text-zinc-500"><MapPin size={16} className="text-zinc-400" /> {cls.room}</p>
  </div>
  </div>
  
  {cls.status === 'Live Now' && (
  <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
  <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
  Meeting active
  </div>
  <button 
  onClick={() => window.open('https://meet.google.com/xyz-abcd-efg', '_blank')}
  className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2 px-6 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 text-sm"
  >
  <Video size={18} /> Join GMeet
  </button>
  </div>
  )}
  </div>
  ))
  )}
  </div>
 </DashboardLayout>
 );
}
