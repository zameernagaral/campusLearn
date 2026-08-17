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

 <div className="grid lg:grid-cols-3 gap-6">
 {/* Goal Info */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <Target size={24} className="text-orange-500" />
 <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Career Goal</h2>
 </div>
 {!isEditingGoal && (
 <button onClick={() => setIsEditingGoal(true)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 text-zinc-500 hover:text-orange-500 transition-colors">
 <Edit2 size={16} />
 </button>
 )}
 </div>
 
 {isEditingGoal ? (
 <div className="flex gap-2 items-center mb-4">
 <input 
 type="text" 
 value={tempGoal} 
 onChange={(e) => setTempGoal(e.target.value)} 
 className="flex-1 py-2 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-orange-500 outline-none text-sm font-bold text-zinc-900 dark:text-white"
 autoFocus
 />
 <button onClick={handleSaveGoal} className="p-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"><Check size={16} /></button>
 <button onClick={() => setIsEditingGoal(false)} className="p-2.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><X size={16} /></button>
 </div>
 ) : (
 <p className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">{goal}</p>
 )}
 
 <p className="text-sm font-medium text-zinc-500">Target Role: SDE I</p>
 <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
 <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">Career Readiness</p>
 <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
 <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
 </div>
 <p className="text-xs font-bold text-zinc-500 text-right mt-2">40% Ready</p>
 </div>
 </div>

 <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm group hover:border-orange-500/30 transition-all hover:-translate-y-1">
 <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white"><Briefcase size={18} className="text-orange-500" /> Top Target Companies</h3>
 <div className="flex flex-wrap gap-2">
 <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700">Google</span>
 <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700">Microsoft</span>
 <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700">Amazon</span>
 </div>
 </div>
 </div>

 {/* Roadmap Path */}
 <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm">
 <h2 className="text-lg font-bold mb-8 flex items-center gap-2 text-zinc-900 dark:text-white"><Map size={20} className="text-orange-500" /> Personalized Path</h2>
 
 <div className="relative border-l-2 border-orange-200 dark:border-orange-500/20 ml-4 space-y-8">
 {roadmapSteps.map((step, i) => (
 <motion.div 
 key={step.id} 
 initial={{ opacity: 0, x: -20 }} 
 animate={{ opacity: 1, x: 0 }} 
 transition={{ delay: i * 0.1 }}
 className="relative pl-8"
 >
 <span className="absolute -left-[11px] top-1.5 bg-white dark:bg-zinc-950 rounded-full p-0.5">
 {step.status === 'Completed' ? <CheckCircle size={18} className="text-emerald-500" /> : 
 step.status === 'Learning' ? <Circle size={18} className="text-orange-500 fill-orange-100 dark:fill-orange-500/20" /> :
 <Circle size={18} className="text-zinc-300 dark:text-zinc-700" />}
 </span>
 <div className={`p-5 rounded-2xl border transition-colors ${step.status === 'Learning' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'}`}>
 <div className="flex justify-between items-center">
 <h3 className="font-bold text-zinc-900 dark:text-white">{step.title}</h3>
 <span className={`text-xs px-3 py-1 font-bold rounded-full ${
 step.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
 step.status === 'Learning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
 }`}>{step.status}</span>
 </div>
 {step.status === 'Learning' && (
 <div className="mt-5 flex flex-wrap gap-3">
 <a href="https://roadmap.sh" target="_blank" rel="noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2 px-4 text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center">Start Course on roadmap.sh</a>
 <button onClick={() => handleMarkComplete(step.id)} className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500 font-bold rounded-xl py-2 px-4 text-xs transition-all">Mark Complete</button>
 </div>
 )}
 {step.status === 'Not Started' && (
 <div className="mt-5 flex gap-3">
 <button 
 onClick={() => {
 setRoadmapSteps(steps => steps.map(s => s.id === step.id ? { ...s, status: 'Learning' } : s));
 }} 
 className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500 font-bold rounded-xl py-2 px-4 text-xs transition-all"
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
