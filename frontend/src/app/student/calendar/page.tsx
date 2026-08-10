'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 2); // Simple mock calendar grid
  
  const events = [
    { id: 1, title: 'Machine Learning Midterm', type: 'exam', time: '10:00 AM - 12:00 PM', location: 'Hall A', date: 15 },
    { id: 2, title: 'Data Structures Lab', type: 'class', time: '2:00 PM - 4:00 PM', location: 'Lab 3', date: 15 },
    { id: 3, title: 'Project Submission', type: 'deadline', time: '11:59 PM', location: 'Online', date: 18 },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Academic Calendar</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage your classes, exams, and deadlines</p>
        </div>
        <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="btn btn-primary flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 border-0 text-white shadow-lg shadow-orange-500/20">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarIcon size={20} className="text-orange-500" /> August 2026
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Today
                </button>
                <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500">
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
                const isCurrentMonth = date > 0 && date <= 31;
                const isToday = date === 15;
                const dayEvents = events.filter(e => e.date === date);

                return (
                  <div key={i} className={`bg-white dark:bg-zinc-900 min-h-[100px] p-2 ${!isCurrentMonth ? 'opacity-30 bg-zinc-50/50 dark:bg-zinc-900/50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {date > 0 ? (date <= 31 ? date : date - 31) : date + 31}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div key={event.id} className={`text-[10px] p-1.5 rounded-lg truncate font-medium border ${
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
              {events.map((event, i) => (
                <motion.div 
                  key={event.id}
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
                      <Clock size={14} /> {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin size={14} /> {event.location}
                    </div>
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
