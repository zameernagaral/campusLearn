'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle, ArrowLeft, Mic, MicOff, Camera, MonitorUp } from 'lucide-react';
import { useState } from 'react';

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday');

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Real-Time Timetable</h1>
          <p className="text-muted mt-1">Manage your schedule and live classes</p>
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

      {/* Smart Alerts for Timetable */}
      {activeDay === 'Monday' && (
        <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 flex items-start gap-3">
          <AlertTriangle className="text-orange-500 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-orange-700 dark:text-orange-400">Schedule Change</p>
            <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">Computer Networks has been rescheduled to Room 201 (previously Room 105).</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayedClasses.length === 0 ? (
          <div className="card p-10 text-center text-muted">No classes scheduled for {activeDay}. Enjoy your day!</div>
        ) : (
          displayedClasses.map((cls) => (
            <div key={cls.id} className={`card p-5 border-l-4 ${cls.status === 'Live Now' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-blue-500'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cls.status === 'Live Now' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {cls.status === 'Live Now' && <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>}
                      {cls.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{cls.type}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-2">{cls.subject}</h3>
                  <p className="text-muted text-sm mt-1">Faculty: {cls.faculty}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold flex items-center justify-end gap-1"><Clock size={16} /> {cls.time}</p>
                  <p className="text-sm text-muted flex items-center justify-end gap-1 mt-1"><MapPin size={16} /> {cls.room}</p>
                </div>
              </div>
              
              {cls.status === 'Live Now' && (
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <div className="text-[10px] text-muted font-medium">
                    <p>Phone: +1 513-536-8015</p>
                    <p>PIN: 756 633 577#</p>
                  </div>
                  <a 
                    href="https://meet.google.com/sst-xvef-rvj" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Video size={18} /> Join Google Meet
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
