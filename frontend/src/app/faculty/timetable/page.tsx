'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, ArrowLeft, Mic, MicOff, Camera, MonitorUp, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FacultyTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');
  const [activeClass, setActiveClass] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const allClasses = [
    { id: 1, subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', batch: 'CS-A', room: 'Room 204', status: 'Live Now', day: 'Monday', attendance: 45 },
    { id: 2, subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', batch: 'CS-B', room: 'Room 201', status: 'Upcoming', day: 'Monday', attendance: 0 },
    { id: 3, subject: 'Advanced DBMS', time: '02:00 PM - 03:00 PM', type: 'Lecture', batch: 'MTech', room: 'Room 302', status: 'Upcoming', day: 'Monday', attendance: 0 },
    { id: 4, subject: 'Database Management Systems', time: '09:00 AM - 10:00 AM', type: 'Lecture', batch: 'CS-B', room: 'Room 204', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
    { id: 5, subject: 'DBMS Lab', time: '10:15 AM - 12:15 PM', type: 'Lab', batch: 'CS-A', room: 'Lab 2', status: 'Upcoming', day: 'Tuesday', attendance: 0 },
    { id: 6, subject: 'Computer Networks', time: '10:00 AM - 11:00 AM', type: 'Lecture', batch: 'CS-A', room: 'Room 201', status: 'Upcoming', day: 'Wednesday', attendance: 0 },
  ];

  const displayedClasses = allClasses.filter(c => c.day === activeDay);

  const handleStartClass = (subject: string) => {
    setActiveClass(subject);
    toast.success(`Started live session for ${subject}`);
  };

  if (activeClass) {
    return (
      <DashboardLayout requiredRole="faculty">
        <button onClick={() => setActiveClass(null)} className="btn btn-ghost mb-4 flex items-center gap-2">
          <ArrowLeft size={16} /> End Class
        </button>
        <div className="card overflow-hidden bg-black flex flex-col h-[70vh]">
          <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-white">
            <div>
              <h2 className="font-bold">{activeClass} - Live Session</h2>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2"><Users size={12} /> 42 Students Joined</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> REC
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col items-center justify-center relative">
            <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
              <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 1</div>
              <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 2</div>
              <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">Student 3</div>
              <div className="w-32 h-24 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">+39 more</div>
            </div>
            
            <div className="w-64 h-64 rounded-full bg-gray-800 flex items-center justify-center border-4 border-indigo-500">
              <Camera size={64} className="text-gray-500" />
            </div>
            <p className="text-gray-400 mt-6 font-medium">Your Camera is Off</p>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"><MicOff size={20} /></button>
            <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><Camera size={20} /></button>
            <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"><MonitorUp size={20} /></button>
            <button onClick={() => { setActiveClass(null); toast.success('Class ended automatically. Attendance logged.'); }} className="px-6 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold hover:bg-red-600">End Meeting</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teaching Schedule</h1>
          <p className="text-muted mt-1">Manage your classes and start live lectures</p>
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
          <div className="card p-10 text-center text-muted">No classes scheduled for you on {activeDay}. Enjoy your day!</div>
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
                  <p className="text-muted text-sm mt-1">Batch: {cls.batch} • Room: {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold flex items-center justify-end gap-1"><Clock size={16} /> {cls.time}</p>
                  {cls.status === 'Live Now' ? (
                    <p className="text-sm text-green-600 font-medium flex items-center justify-end gap-1 mt-1"><Users size={14} /> {cls.attendance} expected</p>
                  ) : (
                    <p className="text-sm text-muted flex items-center justify-end gap-1 mt-1"><MapPin size={16} /> {cls.room}</p>
                  )}
                </div>
              </div>
              
              {cls.status === 'Live Now' && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <button onClick={() => handleStartClass(cls.subject)} className="btn btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Video size={18} /> Start Class
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
