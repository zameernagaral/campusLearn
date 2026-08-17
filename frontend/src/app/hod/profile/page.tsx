'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/shared/Skeleton';

export default function HODProfilePage() {
 const { user } = useAuthStore();

 const profile = {
 name: user?.name,
 role: `Head of Department`,
 id: user?.employeeId || user?.rollNumber || user?._id || 'N/A',
 email: user?.email || 'N/A',
 joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
 phone: '+1 (555) 123-4567', // Hardcoded as user schema doesn't have phone
 office: 'Department Head Office',
 permissions: ['Department Management', 'Faculty Overview', 'Student Analytics', 'Course Management']
 };

 return (
 <DashboardLayout requiredRole="hod">
 <div className="max-w-4xl mx-auto">
 <div className="flex items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Profile</h1>
 <p className="text-sm mt-0.5 text-zinc-500">View and manage your Head of Department profile</p>
 </div>
 <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
 Edit Profile
 </button>
 </div>

 <div className="grid md:grid-cols-1 gap-8">
 {/* Left Column: ID Card */}
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className=""
 >
 <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:border-orange-500/30 transition-all">
 <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500" />
 
 <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 mt-4 rotate-3 group-hover:rotate-6 transition-transform">
 <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">{user?.name ? user.name.substring(0,2).toUpperCase() : 'HD'}</span>
 </div>
 
 <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors">
 {profile.name ? profile.name : <Skeleton className="h-7 w-40 mx-auto" />}
 </h2>
 <p className="text-sm font-bold text-orange-500 mb-6 uppercase tracking-widest">
 {profile.role}
 </p>

 <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Employee ID</p>
 <p className="text-lg font-bold text-zinc-900 dark:text-white tracking-widest">{profile.id}</p>
 </div>
 </div>
 </motion.div>

 {/* Right Column: Details */}
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className=" space-y-6"
 >
 <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
 <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Contact Information</h3>
 
 <div className="grid sm:grid-cols-2 gap-6">
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email Address</p>
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile.email}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Phone Number</p>
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile.phone}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Office Location</p>
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile.office}</p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Joined Since</p>
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile.joinDate}</p>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
 <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-6">System Permissions</h3>
 
 <div className="flex flex-wrap gap-3">
 {profile.permissions.map((perm, index) => (
 <span 
 key={index}
 className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800"
 >
 {perm}
 </span>
 ))}
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </DashboardLayout>
 );
}
