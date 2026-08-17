'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { liveClassAPI } from '@/lib/api';
import { Video, ArrowLeft, Users, Camera, MicOff } from 'lucide-react';

export default function StudentLivePage() {
 const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');
 const [classes, setClasses] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [activeClass, setActiveClass] = useState<string | null>(null);

 const fetchClasses = async () => {
 setIsLoading(true);
 // Mocking to ensure UI renders since backend might not be available
 setTimeout(() => {
 setClasses([
 {
 id: '1',
 title: 'Database Management Systems - Advanced Topics',
 course: 'CS401',
 faculty: 'Dr. Alan Turing',
 date: '18 Aug 2026',
 time: '10:00 AM',
 duration: '60 mins',
 status: 'scheduled',
 link: 'https://meet.google.com/sst-xvef-rvj',
 recordingUrl: null
 }
 ]);
 setIsLoading(false);
 }, 500);
 };

 useEffect(() => {
 fetchClasses();
 }, []);

 const filteredClasses = classes.filter(c => 
 activeTab === 'upcoming' ? (c.status === 'upcoming' || c.status === 'scheduled') : (c.status === 'recorded' || c.status === 'completed')
 );

 if (activeClass) {
 return (
 <DashboardLayout requiredRole="student">
 <button onClick={() => setActiveClass(null)} className="btn btn-ghost mb-4 flex items-center gap-2">
 <ArrowLeft size={16} /> Leave Class
 </button>
 <div className="card overflow-hidden bg-zinc-950 flex flex-col h-[70vh]">
 <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-white">
 <div>
 <h2 className="font-bold">{activeClass} - Live Session</h2>
 <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><Users size={12} /> 43 Participants</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE
 </div>
 </div>
 </div>
 <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
 <div className="absolute inset-4 rounded-2xl bg-gray-800 overflow-hidden border border-gray-700 flex items-center justify-center">
 <div className="text-center">
 <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-600">
 <Video size={32} className="text-gray-400" />
 </div>
 <p className="text-white font-medium">Faculty Screen</p>
 <p className="text-sm text-gray-400 mt-1">Presentation Active</p>
 </div>
 </div>
 <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-900 rounded-xl border-2 border-green-500 overflow-hidden flex items-center justify-center shadow-2xl">
 <Camera size={24} className="text-gray-500" />
 <p className="absolute bottom-2 left-2 text-[10px] text-white font-bold bg-zinc-950/50 px-2 py-0.5 rounded">You</p>
 </div>
 </div>
 <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center gap-4">
 <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><MicOff size={20} /></button>
 <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><Camera size={20} /></button>
 <button onClick={() => setActiveClass(null)} className="px-6 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold hover:bg-red-600">Leave Meeting</button>
 </div>
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout requiredRole="student">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Live Classes</h1>
 <p className="text-sm mt-0.5 text-zinc-500">View and join your upcoming live sessions</p>
 </div>
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

 <div className="space-y-4">
 {isLoading ? (
 <div className="flex justify-center py-12">
 <span className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
 </div>
 ) : filteredClasses.map((cls, i) => (
 <motion.div 
 key={cls.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-500/30 transition-colors group"
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
 Instructor: {cls.faculty} • Duration: {cls.duration}
 </p>
 </div>

 <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-0 md:pl-8">
 {activeTab === 'upcoming' ? (
 <div className="flex flex-col items-start gap-2">
 <button 
 onClick={() => setActiveClass(cls.title)}
 className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
 >
 <Video size={16} />
 Join Class
 </button>
 </div>
 ) : (
 <a
 href={cls.recordingUrl || '#'}
 target="_blank"
 rel="noopener noreferrer"
 className={`px-6 py-3 ${cls.recordingUrl ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 text-white' : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-800'} font-bold rounded-xl transition-colors text-sm`}
 >
 {cls.recordingUrl ? 'Watch Recording' : 'Recording Unavailable'}
 </a>
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
 </DashboardLayout>
 );
}
