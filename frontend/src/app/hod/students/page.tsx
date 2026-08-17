'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { hodAPI } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User } from '@/types';

export default function HODStudentsPage() {
 const [students, setStudents] = useState<User[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [semesterFilter, setSemesterFilter] = useState('');

 useEffect(() => {
 fetchStudents();
 }, [semesterFilter]);

 const fetchStudents = async () => {
 setIsLoading(true);
 try {
 const { data } = await hodAPI.getStudents({ semester: semesterFilter || undefined });
 setStudents(data.data || []);
 } catch {
 toast.error('Failed to load students');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <DashboardLayout requiredRole="hod">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Students</h1>
 <p className="text-sm mt-0.5 text-zinc-500">View all students in your department</p>
 </div>
 </div>

 {/* Filters */}
 <div className="card p-4 mb-5 flex flex-wrap gap-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950">
 <select
 value={semesterFilter}
 onChange={e => setSemesterFilter(e.target.value)}
 className="px-4 py-2 rounded-xl text-sm outline-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-w-[150px]"
 >
 <option value="">All Semesters</option>
 {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
 <option key={s} value={s}>Semester {s}</option>
 ))}
 </select>
 </div>

 <div className="card border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Student</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Semester</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Points</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
 {isLoading ? (
 Array(5).fill(null).map((_, i) => (
 <tr key={i}>
 <td colSpan={5} className="px-6 py-4"><div className="h-10 skeleton rounded-xl w-full" /></td>
 </tr>
 ))
 ) : students.length > 0 ? (
 students.map(user => (
 <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 {user.avatar ? (
 <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
 ) : (
 <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500 flex items-center justify-center font-bold text-sm">
 {getInitials(user.name)}
 </div>
 )}
 <div>
 <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
 {user.rollNumber && <p className="text-xs text-zinc-500 mt-0.5">{user.rollNumber}</p>}
 </div>
 </div>
 </td>
 <td className="px-6 py-4 text-sm text-zinc-500">{user.email}</td>
 <td className="px-6 py-4">
 <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg">
 Sem {user.semester || 'N/A'}
 </span>
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col">
 <span className="text-sm font-bold text-orange-500">{user.points || 0} XP</span>
 {user.streak && user.streak > 0 && <span className="text-xs text-orange-400">{user.streak} day streak </span>}
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
 user.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500'
 }`}>
 {user.isActive ? 'Active' : 'Inactive'}
 </span>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No students found.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </DashboardLayout>
 );
}
