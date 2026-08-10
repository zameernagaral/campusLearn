'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

export default function FacultyAttendancePage() {
  const courses = [
    { id: 1, code: 'CS601', title: 'Machine Learning', time: '10:00 AM - 11:30 AM', students: 45, marked: false },
    { id: 2, code: 'CS501', title: 'Data Structures', time: '02:00 PM - 03:30 PM', students: 50, marked: true },
  ];

  const recentLogs = [
    { id: 1, course: 'Data Structures', date: 'Today, 02:00 PM', present: 48, total: 50 },
    { id: 2, course: 'Machine Learning', date: 'Yesterday, 10:00 AM', present: 42, total: 45 },
    { id: 3, course: 'Web Development', date: 'Wed, 14 Oct', present: 38, total: 40 },
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Attendance Register</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Mark and manage student attendance for your classes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Classes */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Today's Classes</h2>
          
          <div className="space-y-4">
            {courses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm hover:border-orange-500/30 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                      {course.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${course.marked ? 'text-emerald-500' : 'text-orange-500'}`}>
                      {course.marked ? 'Marked' : 'Pending'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500">{course.time} • {course.students} Students</p>
                </div>
                
                <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  
                  className={`px-8 py-3.5 font-bold rounded-xl transition-all text-sm whitespace-nowrap ${
                    course.marked 
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                  }`}
                >
                  {course.marked ? 'Edit Register' : 'Mark Attendance'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Logs Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Logs</h2>
          
          <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Average</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">92</span>
                    <span className="text-lg font-bold text-zinc-500">%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">This Week</p>
                  <p className="text-sm font-bold text-emerald-500">+2.4%</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentLogs.map((log, i) => (
                  <div key={log.id} className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-0.5">{log.course}</p>
                      <p className="text-xs font-medium text-zinc-500">{log.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {log.present}<span className="text-zinc-500">/{log.total}</span>
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Present</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="w-full py-4 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest transition-colors border-t border-zinc-100 dark:border-zinc-800">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
