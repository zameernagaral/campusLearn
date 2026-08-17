'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, Users, Upload, X, FileText, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function HODTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [isUploadingTimetable, setIsUploadingTimetable] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const allClasses = [
  { id: 1, subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Aditya Iyer', batch: 'CS-A', room: 'Room 204', status: 'Live Now', day: 'Monday', attendance: 45 },
  { id: 2, subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', faculty: 'Prof. Rohan Chopra', batch: 'CS-B', room: 'Room 201', status: 'Upcoming', day: 'Monday', attendance: 0 },
  { id: 3, subject: 'Advanced DBMS', time: '02:00 PM - 03:00 PM', type: 'Lecture', faculty: 'Dr. Sara Bhat', batch: 'MTech', room: 'Room 302', status: 'Upcoming', day: 'Monday', attendance: 0 },
  { id: 4, subject: 'Operating Systems', time: '09:00 AM - 10:00 AM', type: 'Lecture', faculty: 'Dr. Ishan Desai', batch: 'CS-B', room: 'Room 101', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
  { id: 5, subject: 'DBMS Lab', time: '10:15 AM - 12:15 PM', type: 'Lab', faculty: 'Dr. Aditya Iyer', batch: 'CS-A', room: 'Lab 2', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
  { id: 6, subject: 'Artificial Intelligence', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Vihaan Reddy', batch: 'CS-A', room: 'Room 305', status: 'Upcoming', day: 'Wednesday', attendance: 0 },
  ];

  const displayedClasses = allClasses.filter(c => c.day === activeDay);

  return (
  <DashboardLayout requiredRole="hod">
  <Toaster position="top-right" />
  
  {isUploadingTimetable && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0f1115] p-6 rounded-2xl w-full max-w-md border border-zinc-800 shadow-2xl relative">
      <button onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
        <X size={20} />
      </button>
      <h2 className="text-xl font-black mb-2 text-white flex items-center gap-2">
        <Upload size={20} className="text-orange-500"/> Upload Timetable
      </h2>
      <div className="space-y-4 mt-4">
        <p className="text-sm text-zinc-400">Upload the master department timetable in CSV or Excel format. Our AI will automatically parse, detect conflicts, and sync it to all faculty schedules.</p>
        
        <div className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${file ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-600'}`}>
          <FileText size={32} className={file ? 'text-orange-500' : 'text-zinc-500'} />
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {file ? file.name : 'Drag and drop your file here'}
            </p>
            {!file && <p className="text-xs text-zinc-500 mt-1">CSV, XLSX (Max 10MB)</p>}
          </div>
          <input type="file" className="hidden" id="timetable-upload" accept=".csv,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="timetable-upload" className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm border border-zinc-700">
            {file ? 'Change File' : 'Browse Files'}
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-colors border border-zinc-700">Cancel</button>
        <button 
          disabled={!file}
          onClick={() => {
            setIsUploadingTimetable(false);
            setFile(null);
            toast.success('Master timetable uploaded and synced across department!');
          }} 
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/20"
        >
          Sync Department
        </button>
      </div>
    </div>
  </div>
  )}

  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
    <div>
      <h1 className="text-2xl font-black text-white">Department Timetable</h1>
      <p className="text-zinc-400 mt-1 text-sm">Monitor all ongoing and upcoming classes across the department</p>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={() => toast('Filters coming soon')} className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors">
        <Filter size={16} /> Filter
      </button>
      <button onClick={() => setIsUploadingTimetable(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20">
        <Upload size={16} /> Upload Timetable
      </button>
    </div>
  </div>

  <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
  {days.map((day, idx) => {
    const isActive = activeDay === day;
    return (
      <button
        key={day}
        onClick={() => setActiveDay(day)}
        className={`flex flex-col items-center min-w-[70px] py-3 px-2 rounded-2xl transition-all border ${isActive ? 'bg-zinc-900 border-zinc-200 text-white shadow-md' : 'bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}
      >
        <span className="text-xs font-bold uppercase tracking-widest">{day.substring(0, 3)}</span>
        <span className={`text-xl font-black mt-1 ${isActive ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>0{idx + 5}</span>
      </button>
    );
  })}
  </div>

  <div className="space-y-4">
  {isLoading ? (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-[#0f1115] rounded-2xl border border-[#1e293b] p-5 w-full flex flex-col sm:flex-row gap-4 animate-pulse">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-zinc-800 rounded-full" />
              <div className="h-6 w-16 bg-zinc-800 rounded-full" />
              <div className="h-6 w-12 bg-zinc-800 rounded-full" />
            </div>
            <div className="h-6 w-64 bg-zinc-800 rounded-lg" />
            <div className="h-4 w-40 bg-zinc-800 rounded-lg" />
          </div>
          <div className="sm:text-right space-y-2 mt-4 sm:mt-0 flex flex-col sm:items-end">
            <div className="h-5 w-32 bg-zinc-800 rounded-lg" />
            <div className="h-4 w-20 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  ) : displayedClasses.length === 0 ? (
  <div className="card p-10 text-center text-muted">No classes scheduled for the department on {activeDay}.</div>
  ) : (
  displayedClasses.map((cls) => {
    const isLive = cls.status === 'Live Now';
    return (
      <div key={cls.id} className="bg-white dark:bg-[#0f1115] hover:dark:bg-[#13161c] rounded-2xl border border-indigo-500/50 dark:border-indigo-600/70 p-5 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {isLive ? (
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Live Now
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  Upcoming
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">{cls.type}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">{cls.batch}</span>
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">{cls.subject}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Faculty: {cls.faculty}</p>
          </div>
          <div className="text-right flex flex-col justify-between items-end">
            <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5"><Clock size={14} className="text-zinc-400 dark:text-zinc-500" /> {cls.time}</p>
            {isLive ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-2"><Users size={14} /> {cls.attendance} present</p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-2"><MapPin size={14} /> {cls.room}</p>
            )}
          </div>
        </div>
      </div>
    );
  })
  )}
  </div>
  </DashboardLayout>
 );
}
