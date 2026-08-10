'use client';
import toast from 'react-hot-toast';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function FacultyLivePage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');

  const classes = [
    { id: 1, title: 'Deep Learning Basics', course: 'CS601', date: 'Today', time: '10:00 AM', duration: '1.5 hrs', attendees: 42, status: 'upcoming' },
    { id: 2, title: 'Graphs and Trees', course: 'CS501', date: 'Tomorrow', time: '02:00 PM', duration: '2 hrs', attendees: 50, status: 'upcoming' },
    { id: 3, title: 'Introduction to Pointers', course: 'CS501', date: '10 Oct 2026', time: '11:00 AM', duration: '1 hr', attendees: 48, status: 'recorded', link: '#' },
  ];

  const filteredClasses = classes.filter(c => c.status === activeTab);

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Live Classes</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Schedule and manage your live video sessions</p>
        </div>
        <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
          Schedule Live Class
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'upcoming' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Upcoming ({classes.filter(c => c.status === 'upcoming').length})
        </button>
        <button 
          onClick={() => setActiveTab('recorded')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'recorded' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          Recorded ({classes.filter(c => c.status === 'recorded').length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredClasses.map((cls, i) => (
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
                <span className={`text-[10px] font-bold uppercase tracking-widest ${cls.status === 'upcoming' ? 'text-orange-500' : 'text-zinc-500'}`}>
                  {cls.date} at {cls.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-2">
                {cls.title}
              </h3>
              <p className="text-xs font-medium text-zinc-500">
                Duration: {cls.duration} • Expected Attendees: {cls.attendees}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-0 md:pl-8">
              {activeTab === 'upcoming' ? (
                <>
                  <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800">
                    Edit
                  </button>
                  <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20">
                    Start Class
                  </button>
                </>
              ) : (
                <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-zinc-200 dark:border-zinc-800">
                  View Recording
                </button>
              )}
            </div>
          </motion.div>
        ))}
        
        {filteredClasses.length === 0 && (
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
            <p className="text-zinc-500 font-medium">No {activeTab} live classes found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
