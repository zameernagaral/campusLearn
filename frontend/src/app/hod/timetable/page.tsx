'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, Users, Upload, X, FileText, Filter } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function HODTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [isUploadingTimetable, setIsUploadingTimetable] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-md border border-border shadow-2xl relative">
            <button onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Upload size={20} className="text-primary"/> Upload Master Timetable</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted">Upload the master department timetable in CSV or Excel format. Our AI will automatically parse, detect conflicts, and sync it to all faculty schedules.</p>
              
              <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-primary/50 ${file ? 'border-primary bg-primary/5' : 'border-border bg-surface-2'}`}>
                <FileText size={24} style={{ color: file ? 'var(--primary)' : 'var(--muted)' }} />
                <p className="text-sm font-medium" style={{ color: file ? 'var(--primary)' : 'var(--foreground)' }}>
                  {file ? file.name : 'Drag and drop your file here'}
                </p>
                {!file && <p className="text-xs text-muted">CSV, XLSX (Max 10MB)</p>}
                <input type="file" className="hidden" id="timetable-upload" accept=".csv,.xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
                <label htmlFor="timetable-upload" className="mt-2 btn btn-secondary text-xs px-3 py-1.5 cursor-pointer">
                  {file ? 'Change File' : 'Browse Files'}
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => { setIsUploadingTimetable(false); setFile(null); }} className="btn btn-ghost">Cancel</button>
              <button 
                disabled={!file}
                onClick={() => {
                  setIsUploadingTimetable(false);
                  setFile(null);
                  toast.success('Master timetable uploaded and synced across department!');
                }} 
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                Sync Department
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Timetable</h1>
          <p className="text-muted mt-1">Monitor all ongoing and upcoming classes across the department</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast('Filters coming soon', { icon: '🔍' })} className="btn btn-ghost flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
          <button onClick={() => setIsUploadingTimetable(true)} className="btn btn-primary flex items-center gap-2">
            <Upload size={18} /> Upload Master
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
        {days.map((day, idx) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all ${activeDay === day ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface border-border hover:border-primary/30'}`}
          >
            <span className="text-xs font-medium uppercase opacity-80 mb-1">{day.substring(0, 3)}</span>
            <span className="text-xl font-bold">0{idx + 5}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayedClasses.length === 0 ? (
          <div className="card p-10 text-center text-muted">No classes scheduled for the department on {activeDay}.</div>
        ) : (
          displayedClasses.map((cls) => (
            <div key={cls.id} className={`card p-5 border-l-4 ${cls.status === 'Live Now' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-blue-500'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cls.status === 'Live Now' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {cls.status === 'Live Now' && <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-1 animate-pulse"></span>}
                      {cls.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{cls.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">{cls.batch}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-2">{cls.subject}</h3>
                  <p className="text-muted text-sm mt-1">Faculty: <span className="font-medium text-foreground">{cls.faculty}</span></p>
                </div>
                <div className="text-right">
                  <p className="font-bold flex items-center justify-end gap-1"><Clock size={16} /> {cls.time}</p>
                  {cls.status === 'Live Now' ? (
                    <p className="text-sm text-green-600 font-medium flex items-center justify-end gap-1 mt-1"><Users size={14} /> {cls.attendance} present</p>
                  ) : (
                    <p className="text-sm text-muted flex items-center justify-end gap-1 mt-1"><MapPin size={16} /> {cls.room}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
