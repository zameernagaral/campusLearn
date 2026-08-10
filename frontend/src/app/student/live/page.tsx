'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { liveClassAPI } from '@/lib/api';
import { Video } from 'lucide-react';

export default function StudentLivePage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recorded'>('upcoming');
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await liveClassAPI.getAll();
      const data = res.data?.data || res.data || [];
      
      const formatted = data.map((c: any) => {
        const dateObj = new Date(c.scheduledAt);
        return {
          id: c._id,
          title: c.title,
          course: c.course?.subjectCode || 'N/A',
          faculty: c.faculty?.name || 'Unknown',
          date: dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          duration: `${c.duration} mins`,
          status: c.status,
          link: c.meetingLink,
          recordingUrl: c.recordingUrl
        };
      });
      setClasses(formatted);
    } catch (error) {
      toast.error('Failed to load live classes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(c => 
    activeTab === 'upcoming' ? (c.status === 'upcoming' || c.status === 'scheduled') : (c.status === 'recorded' || c.status === 'completed')
  );

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
                <a 
                  href={cls.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  <Video size={16} />
                  Join Class
                </a>
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
