'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, X, Briefcase, Award } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export default function FacultyCareerAnalyticsPage() {
 const allStudents = [
 { name: 'John Doe', rollNo: 'CS001', goal: 'Full Stack Developer', progress: 75, status: 'On Track', skills: ['React', 'Node.js', 'MongoDB'], lastActive: '2 hours ago' },
 { name: 'Jane Smith', rollNo: 'CS002', goal: 'Data Scientist', progress: 85, status: 'Excelling', skills: ['Python', 'Machine Learning', 'SQL'], lastActive: '5 mins ago' },
 { name: 'Alex Johnson', rollNo: 'CS003', goal: 'Cloud Architect', progress: 40, status: 'Needs Attention', skills: ['AWS', 'Linux'], lastActive: '3 days ago' },
 { name: 'Sarah Williams', rollNo: 'CS004', goal: 'Frontend Developer', progress: 60, status: 'On Track', skills: ['HTML', 'CSS', 'JavaScript'], lastActive: '1 day ago' },
 { name: 'Michael Brown', rollNo: 'CS005', goal: 'Backend Developer', progress: 90, status: 'Excelling', skills: ['Java', 'Spring Boot', 'PostgreSQL'], lastActive: '10 mins ago' },
 { name: 'Emily Davis', rollNo: 'CS006', goal: 'UI/UX Designer', progress: 55, status: 'On Track', skills: ['Figma', 'Prototyping'], lastActive: '4 hours ago' },
 { name: 'David Wilson', rollNo: 'CS007', goal: 'DevOps Engineer', progress: 30, status: 'Needs Attention', skills: ['Docker', 'CI/CD'], lastActive: '5 days ago' },
 ];

 const [showAll, setShowAll] = useState(false);
 const [selectedStudent, setSelectedStudent] = useState<any>(null);

 const displayedStudents = showAll ? allStudents : allStudents.slice(0, 4);

 return (
 <DashboardLayout requiredRole="faculty">
 <Toaster position="top-right" />

  {selectedStudent && (
  <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
  <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
  <X size={24} />
  </button>
  <div className="flex items-start gap-4 mb-8">
  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500 font-bold text-2xl shadow-inner border border-orange-200 dark:border-orange-500/30">
  {selectedStudent.name.charAt(0)}
  </div>
  <div>
  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedStudent.name}</h2>
  <p className="text-sm font-medium text-zinc-500 mt-1">{selectedStudent.rollNo} • Last Active: {selectedStudent.lastActive}</p>
  </div>
  </div>

  <div className="grid grid-cols-2 gap-6 mb-8">
  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target size={14} className="text-orange-500" /> Career Goal</p>
  <p className="font-bold text-lg text-zinc-900 dark:text-white">{selectedStudent.goal}</p>
  </div>
  <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp size={14} className="text-orange-500" /> Progress Status</p>
  <div className="flex items-center gap-4">
  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
  <div 
  className={`h-2.5 rounded-full ${selectedStudent.progress > 70 ? 'bg-emerald-500' : selectedStudent.progress > 50 ? 'bg-orange-500' : 'bg-red-500'}`} 
  style={{ width: `${selectedStudent.progress}%` }}
  ></div>
  </div>
  <span className="text-lg font-bold text-zinc-900 dark:text-white">{selectedStudent.progress}%</span>
  </div>
  </div>
  </div>

  <div className="mb-8">
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Award size={14} className="text-orange-500" /> Acquired Skills</p>
  <div className="flex flex-wrap gap-2">
  {selectedStudent.skills.map((skill: string, i: number) => (
  <span key={i} className="px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-bold border border-orange-200 dark:border-orange-500/20">
  {skill}
  </span>
  ))}
  </div>
  </div>

  <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
  <button onClick={() => setSelectedStudent(null)} className="px-6 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Close</button>
  <button 
  onClick={() => {
  toast.success(`Message sent to ${selectedStudent.name}!`);
  setSelectedStudent(null);
  }} 
  className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all"
  >
  Send Message
  </button>
  </div>
  </div>
  </div>
  )}

 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Student Career Progress</h1>
 <p className="text-muted mt-1">Monitor how your students are advancing towards their career goals</p>
 </div>
 </div>

  <div className="grid md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
  <div className="flex items-center gap-4 mb-4">
  <div className="p-3 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
  <Users size={24} />
  </div>
  <div>
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mentored</p>
  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">124</h3>
  </div>
  </div>
  </div>
  
  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
  <div className="flex items-center gap-4 mb-4">
  <div className="p-3 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
  <Target size={24} />
  </div>
  <div>
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Avg Goal Completion</p>
  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">68%</h3>
  </div>
  </div>
  </div>

  <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
  <div className="flex items-center gap-4 mb-4">
  <div className="p-3 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
  <Map size={24} />
  </div>
  <div>
  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Roadmaps</p>
  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">92</h3>
  </div>
  </div>
  </div>
  </div>

  <div className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden backdrop-blur-sm">
  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
  <h3 className="font-bold flex items-center gap-2 text-zinc-900 dark:text-white"><TrendingUp size={18} className="text-orange-500" /> Student Progress Tracker</h3>
  <button 
  onClick={() => setShowAll(!showAll)} 
  className="text-sm text-orange-500 hover:text-orange-600 font-bold transition-colors"
  >
  {showAll ? 'View Less' : 'View All Students'}
  </button>
  </div>
  
  <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
  <thead>
  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
  <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Student</th>
  <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Career Goal</th>
  <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Progress</th>
  <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest">Status</th>
  <th className="p-4 font-bold text-xs text-zinc-500 uppercase tracking-widest text-right">Action</th>
  </tr>
  </thead>
  <tbody>
  {displayedStudents.map((student, idx) => (
  <tr key={idx} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
  <td className="p-4">
  <p className="font-bold text-zinc-900 dark:text-white">{student.name}</p>
  <p className="text-xs font-medium text-zinc-500">{student.rollNo}</p>
  </td>
  <td className="p-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">{student.goal}</td>
  <td className="p-4">
  <div className="flex items-center gap-3">
  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 max-w-[120px]">
  <div 
  className={`h-2 rounded-full ${student.progress > 70 ? 'bg-emerald-500' : student.progress > 50 ? 'bg-orange-500' : 'bg-red-500'}`} 
  style={{ width: `${student.progress}%` }}
  ></div>
  </div>
  <span className="text-xs font-bold text-zinc-900 dark:text-white">{student.progress}%</span>
  </div>
  </td>
  <td className="p-4">
  <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold ${
  student.status === 'Excelling' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
  student.status === 'On Track' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
  'bg-red-100 text-red-700 dark:bg-red-900/30'
  }`}>{student.status}</span>
  </td>
  <td className="p-4 text-right">
  <button onClick={() => setSelectedStudent(student)} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-xs border border-zinc-200 dark:border-zinc-700">View Details</button>
  </td>
  </tr>
  ))}
  </tbody>
  </table>
  </div>
  </div>
 </DashboardLayout>
 );
}
