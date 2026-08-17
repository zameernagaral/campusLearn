'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Map, Target, Briefcase, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CareerRoadmapPage() {
  const [goal, setGoal] = useState('Full Stack Developer');
  
  const roadmapSteps = [
    { title: 'Programming Fundamentals', status: 'Completed' },
    { title: 'Data Structures & Algorithms', status: 'Completed' },
    { title: 'Database Management', status: 'Learning' },
    { title: 'Backend Frameworks', status: 'Not Started' },
    { title: 'Frontend Frameworks', status: 'Not Started' },
    { title: 'Cloud Computing', status: 'Not Started' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Career Roadmap</h1>
          <p className="text-muted mt-1">Plan your path to your dream career</p>
        </div>
        <button className="btn btn-primary">Edit Goal</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Target size={24} className="text-purple-500" />
              <h2 className="text-lg font-bold">Career Goal</h2>
            </div>
            <p className="text-2xl font-bold mb-2">{goal}</p>
            <p className="text-sm text-muted">Target Role: SDE I</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium mb-2">Career Readiness</p>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-right mt-1">40% Ready</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18} /> Top Target Companies</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge">Google</span>
              <span className="badge">Microsoft</span>
              <span className="badge">Amazon</span>
            </div>
          </div>
        </div>

        {/* Roadmap Path */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Map size={20} className="text-indigo-500" /> Personalized Path</h2>
          
          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 space-y-8">
            {roadmapSteps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="relative pl-6"
              >
                <span className="absolute -left-[11px] top-1 bg-background">
                  {step.status === 'Completed' ? <CheckCircle size={20} className="text-green-500 bg-background" /> : 
                   step.status === 'Learning' ? <Circle size={20} className="text-indigo-500 fill-indigo-100 dark:fill-indigo-900" /> :
                   <Circle size={20} className="text-gray-300 dark:text-gray-700 bg-background" />}
                </span>
                <div className={`p-4 rounded-xl border ${step.status === 'Learning' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-border'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{step.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      step.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      step.status === 'Learning' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' :
                      'bg-gray-100 text-gray-500 dark:bg-gray-800'
                    }`}>{step.status}</span>
                  </div>
                  {step.status === 'Learning' && (
                    <div className="mt-4 flex gap-2">
                      <button className="btn btn-primary text-xs py-1.5 px-3">Start Course</button>
                      <button className="btn btn-outline text-xs py-1.5 px-3">Mark Complete</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
