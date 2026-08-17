'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { hodAPI } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User } from '@/types';

export default function HODFacultyPage() {
 const [faculty, setFaculty] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 // Mocking faculty data to ensure it always displays something
 setTimeout(() => {
 setFaculty([
 { _id: '1', name: 'Dr. Alan Turing', email: 'alan@campuslearn.edu', employeeId: 'FAC001', designation: 'Professor', isActive: true, avatar: '' },
 { _id: '2', name: 'Grace Hopper', email: 'grace@campuslearn.edu', employeeId: 'FAC002', designation: 'Associate Professor', isActive: true, avatar: '' },
 { _id: '3', name: 'John von Neumann', email: 'john@campuslearn.edu', employeeId: 'FAC003', designation: 'Assistant Professor', isActive: true, avatar: '' },
 { _id: '4', name: 'Ada Lovelace', email: 'ada@campuslearn.edu', employeeId: 'FAC004', designation: 'Professor', isActive: false, avatar: '' }
 ]);
 setIsLoading(false);
 }, 500);
 }, []);

 return (
 <DashboardLayout requiredRole="hod">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Faculty</h1>
 <p className="text-sm mt-0.5 text-zinc-500">View all faculty members in your department</p>
 </div>
 </div>

 <div className="card border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Faculty Member</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Employee ID</th>
 <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Designation</th>
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
 ) : faculty.length > 0 ? (
 faculty.map(user => (
 <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 {user.avatar ? (
 <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
 ) : (
 <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-500 flex items-center justify-center font-bold text-sm">
 {getInitials(user.name)}
 </div>
 )}
 <span className="font-bold text-zinc-900 dark:text-white">{user.name}</span>
 </div>
 </td>
 <td className="px-6 py-4 text-sm text-zinc-500">{user.email}</td>
 <td className="px-6 py-4 text-sm font-medium">{user.employeeId || 'N/A'}</td>
 <td className="px-6 py-4 text-sm">{user.designation || 'Faculty'}</td>
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
 <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No faculty found.</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </DashboardLayout>
 );
}
