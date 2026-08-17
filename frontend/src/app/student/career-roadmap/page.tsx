'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Map, Target, Briefcase, ChevronRight, CheckCircle, Circle, Edit2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CareerRoadmapPage() {
 const [goal, setGoal] = useState('Full Stack Developer');
 const [isEditingGoal, setIsEditingGoal] = useState(false);
 const [tempGoal, setTempGoal] = useState(goal);
 
 const [roadmapSteps, setRoadmapSteps] = useState([
 { id: 1, title: 'Programming Fundamentals', status: 'Completed' },
 { id: 2, title: 'Data Structures & Algorithms', status: 'Completed' },
 { id: 3, title: 'Database Management', status: 'Learning' },
 { id: 4, title: 'Backend Frameworks', status: 'Not Started' },
 { id: 5, title: 'Frontend Frameworks', status: 'Not Started' },
 { id: 6, title: 'Cloud Computing', status: 'Not Started' },
 ]);

 const handleSaveGoal = () => {
 if (tempGoal.trim() !== '') {
 setGoal(tempGoal);
 setIsEditingGoal(false);
 }
 };

 const handleMarkComplete = (id: number) => {
 setRoadmapSteps(steps => steps.map(s => {
 if (s.id === id) return { ...s, status: 'Completed' };
 if (s.id === id + 1) return { ...s, status: 'Learning' };
 return s;
 }));
 };

 return (
 <DashboardLayout requiredRole="student">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">My Career Roadmap</h1>
 <p className="text-muted mt-1">Plan your path to your dream career</p>
 </div>
 </div>

 <div className="grid lg:grid-cols-1 gap-6">
 {/* Goal Info */}
 <div className=" space-y-6">
 <div className="card p-6 border-t-4 border-blue-500">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <Target size={24} className="text-blue-500" />
 <h2 className="text-lg font-bold">Career Goal</h2>
 </div>
 {!isEditingGoal && (
 <button onClick={() => setIsEditingGoal(true)} className="p-2 bg-surface-2 rounded-lg hover:bg-surface-3 text-muted">
 <Edit2 size={16} />
 </button>
 )}
 </div>
 
 {isEditingGoal ? (
 <div className="flex gap-2 items-center mb-2">
 <input 
 type="text" 
 value={tempGoal} 
 onChange={(e) => setTempGoal(e.target.value)} 
 className="input flex-1 py-1 px-2"
 autoFocus
 />
 <button onClick={handleSaveGoal} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check size={16} /></button>
 <button onClick={() => setIsEditingGoal(false)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"><X size={16} /></button>
 </div>
 ) : (
 <p className="text-2xl font-bold mb-2">{goal}</p>
 )}
 
 <p className="text-sm text-muted">Target Role: SDE I</p>
 <div className="mt-4 pt-4 border-t border-border">
 <p className="text-sm font-medium mb-2">Career Readiness</p>
 <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
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
 <div className=" card p-6">
 <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Map size={20} className="text-indigo-500" /> Personalized Path</h2>
 
 <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 space-y-8">
 {roadmapSteps.map((step, i) => (
 <motion.div 
 key={step.id} 
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
 <a href="https://roadmap.sh" target="_blank" rel="noreferrer" className="btn btn-primary text-xs py-1.5 px-3">Start Course on roadmap.sh</a>
 <button onClick={() => handleMarkComplete(step.id)} className="btn btn-outline text-xs py-1.5 px-3">Mark Complete</button>
 </div>
 )}
 {step.status === 'Not Started' && (
 <div className="mt-4 flex gap-2">
 <button 
 onClick={() => {
 setRoadmapSteps(steps => steps.map(s => s.id === step.id ? { ...s, status: 'Learning' } : s));
 }} 
 className="btn btn-outline text-xs py-1.5 px-3"
 >
 Start Learning
 </button>
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
