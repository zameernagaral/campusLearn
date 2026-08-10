'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminCoursesPage() {
  const [courses] = useState([
    { id: 'CS601', title: 'Machine Learning Fundamentals', dept: 'CS', instructor: 'Dr. Alan Turing', students: 120, status: 'Active' },
    { id: 'EE405', title: 'Digital Signal Processing', dept: 'EE', instructor: 'Dr. Nikola Tesla', students: 85, status: 'Active' },
    { id: 'ME302', title: 'Thermodynamics', dept: 'ME', instructor: 'Dr. Henry Ford', students: 150, status: 'Active' },
    { id: 'BA101', title: 'Introduction to Management', dept: 'BA', instructor: 'Dr. Peter Drucker', students: 200, status: 'Upcoming' },
    { id: 'CS505', title: 'Operating Systems', dept: 'CS', instructor: 'Dr. Linus Torvalds', students: 110, status: 'Active' },
    { id: 'LA201', title: 'Modern Literature', dept: 'LA', instructor: 'Dr. Maya Angelou', students: 65, status: 'Draft' },
  ]);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">University Courses</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Monitor all courses across departments</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-xl outline-none cursor-pointer uppercase tracking-widest">
            <option>All Departments</option>
            <option>CS</option>
            <option>EE</option>
            <option>ME</option>
          </select>
          <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
            New Course
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                {course.id}
              </span>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${
                course.status === 'Active' 
                  ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' 
                  : course.status === 'Upcoming'
                  ? 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                  : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
              }`}>
                {course.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
              {course.title}
            </h3>
            
            <div className="mt-auto pt-6">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/60 mb-6">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Instructor</p>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{course.instructor}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{course.dept}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Students</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{course.students}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
