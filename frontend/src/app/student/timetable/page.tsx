'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState('today');

  const classes = [
    { subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Smith', room: 'Room 204', status: 'Live Now' },
    { subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', faculty: 'Prof. Johnson', room: 'Room 201', status: 'Upcoming' },
    { subject: 'Data Structures Lab', time: '01:00 PM - 03:00 PM', type: 'Lab', faculty: 'Mr. Davis', room: 'Lab 3', status: 'Upcoming' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Real-Time Timetable</h1>
          <p className="text-muted mt-1">Manage your schedule and live classes</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl">
          <button className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'today' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('today')}>Today</button>
          <button className={`px-4 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'week' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('week')}>Weekly</button>
        </div>
      </div>

      {/* Smart Alerts for Timetable */}
      <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 flex items-start gap-3">
        <AlertTriangle className="text-orange-500 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-orange-700 dark:text-orange-400">Schedule Change</p>
          <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">Computer Networks has been rescheduled to Room 201 (previously Room 105).</p>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((cls, i) => (
          <div key={i} className={`card p-5 border-l-4 ${cls.status === 'Live Now' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-blue-500'}`}>
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
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <button className="btn btn-primary flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
                  <Video size={18} /> Join Class
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
