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
 <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-6 rounded-2xl w-full max-w-2xl border border-border shadow-2xl relative">
 <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 text-muted hover:text-foreground">
 <X size={20} />
 </button>
 <div className="flex items-start gap-4 mb-6">
 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
 {selectedStudent.name.charAt(0)}
 </div>
 <div>
 <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
 <p className="text-muted">{selectedStudent.rollNo} • Last Active: {selectedStudent.lastActive}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="p-4 rounded-xl border border-border bg-surface-2">
 <p className="text-sm text-muted font-bold mb-1 flex items-center gap-2"><Target size={16} /> Career Goal</p>
 <p className="font-medium text-lg">{selectedStudent.goal}</p>
 </div>
 <div className="p-4 rounded-xl border border-border bg-surface-2">
 <p className="text-sm text-muted font-bold mb-1 flex items-center gap-2"><TrendingUp size={16} /> Progress Status</p>
 <div className="flex items-center gap-3">
 <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
 <div 
 className={`h-2 rounded-full ${selectedStudent.progress > 70 ? 'bg-green-500' : selectedStudent.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} 
 style={{ width: `${selectedStudent.progress}%` }}
 ></div>
 </div>
 <span className="text-sm font-bold">{selectedStudent.progress}%</span>
 </div>
 </div>
 </div>

 <div className="mb-6">
 <p className="text-sm text-muted font-bold mb-2 flex items-center gap-2"><Award size={16} /> Acquired Skills</p>
 <div className="flex flex-wrap gap-2">
 {selectedStudent.skills.map((skill: string, i: number) => (
 <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-200 dark:border-indigo-800">
 {skill}
 </span>
 ))}
 </div>
 </div>

 <div className="flex justify-end gap-3 pt-4 border-t border-border">
 <button onClick={() => setSelectedStudent(null)} className="btn btn-ghost">Close</button>
 <button 
 onClick={() => {
 toast.success(`Message sent to ${selectedStudent.name}!`);
 setSelectedStudent(null);
 }} 
 className="btn btn-primary"
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

 <div className="grid lg:grid-cols-1 gap-6 mb-6">
 <div className="card p-6 border-t-4 border-blue-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
 <Users size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Mentored Students</p>
 <h3 className="text-2xl font-bold">124</h3>
 </div>
 </div>
 </div>
 
 <div className="card p-6 border-t-4 border-emerald-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl">
 <Target size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Avg Goal Completion</p>
 <h3 className="text-2xl font-bold">68%</h3>
 </div>
 </div>
 </div>

 <div className="card p-6 border-t-4 border-blue-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
 <Map size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Active Roadmaps</p>
 <h3 className="text-2xl font-bold">92</h3>
 </div>
 </div>
 </div>
 </div>

 <div className="card p-0 overflow-hidden">
 <div className="p-5 border-b border-border flex justify-between items-center">
 <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Student Progress Tracker</h3>
 <button 
 onClick={() => setShowAll(!showAll)} 
 className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
 >
 {showAll ? 'View Less' : 'View All Students'}
 </button>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-surface-2">
 <th className="p-4 font-semibold text-sm text-muted">Student</th>
 <th className="p-4 font-semibold text-sm text-muted">Career Goal</th>
 <th className="p-4 font-semibold text-sm text-muted">Progress</th>
 <th className="p-4 font-semibold text-sm text-muted">Status</th>
 <th className="p-4 font-semibold text-sm text-muted text-right">Action</th>
 </tr>
 </thead>
 <tbody>
 {displayedStudents.map((student, idx) => (
 <tr key={idx} className="border-b border-border hover:bg-surface-2/50 transition-colors">
 <td className="p-4">
 <p className="font-bold">{student.name}</p>
 <p className="text-xs text-muted">{student.rollNo}</p>
 </td>
 <td className="p-4 text-sm font-medium">{student.goal}</td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[120px]">
 <div 
 className={`h-2 rounded-full ${student.progress > 70 ? 'bg-green-500' : student.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} 
 style={{ width: `${student.progress}%` }}
 ></div>
 </div>
 <span className="text-xs font-bold">{student.progress}%</span>
 </div>
 </td>
 <td className="p-4">
 <span className={`text-xs px-2 py-1 rounded-full font-medium ${
 student.status === 'Excelling' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
 student.status === 'On Track' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
 }`}>{student.status}</span>
 </td>
 <td className="p-4 text-right">
 <button onClick={() => setSelectedStudent(student)} className="btn btn-outline text-xs py-1.5 px-3">View Details</button>
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
