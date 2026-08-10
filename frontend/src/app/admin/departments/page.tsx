'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminDepartmentsPage() {
  const [departments] = useState([
    { id: 'CS', name: 'Computer Science', head: 'Dr. Alan Turing', faculty: 24, students: 850, programs: 6 },
    { id: 'EE', name: 'Electrical Engineering', head: 'Dr. Nikola Tesla', faculty: 18, students: 620, programs: 4 },
    { id: 'ME', name: 'Mechanical Engineering', head: 'Dr. Henry Ford', faculty: 22, students: 710, programs: 5 },
    { id: 'BA', name: 'Business Administration', head: 'Dr. Peter Drucker', faculty: 15, students: 950, programs: 3 },
    { id: 'MD', name: 'Medicine', head: 'Dr. Alexander Fleming', faculty: 45, students: 420, programs: 8 },
    { id: 'LA', name: 'Liberal Arts', head: 'Dr. Maya Angelou', faculty: 30, students: 1100, programs: 12 },
  ]);

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Departments</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage university departments and faculties</p>
        </div>
        <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
          Add Department
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, i) => (
          <motion.div 
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                {dept.id}
              </span>
              <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="text-xs font-bold text-zinc-400 hover:text-orange-500 transition-colors uppercase tracking-widest">
                Edit
              </button>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
              {dept.name}
            </h3>
            <div className="mt-auto pt-6">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/60 mb-6">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Department Head</p>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{dept.head}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Faculty</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{dept.faculty}</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Students</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{dept.students}</span>
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Programs</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">{dept.programs}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
