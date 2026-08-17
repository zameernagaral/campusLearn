'use client';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FacultyProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href={`/${user.role}/dashboard`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4 text-sm font-medium">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Faculty Profile</h1>
        <p className="text-zinc-500">Manage your professional information and settings</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left column - Identity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/20 to-blue-500/5 dark:from-blue-500/10 dark:to-transparent" />
            
            <div className="relative z-10">
              <div className="w-28 h-28 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-500/20 mb-6 border-4 border-white dark:border-zinc-900">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{user.name}</h2>
              <p className="text-zinc-500 font-medium mb-6">Faculty Member</p>

              <div className="flex justify-center gap-3 mb-8">
                <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl flex items-center justify-center transition-colors text-sm">
                  Edit Profile
                </button>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300 truncate">{user.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Employee ID</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{user.employeeId || 'F2026-042'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Office</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Faculty Block B, Room 402</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Professional Details */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
              Professional Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Department</p>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {typeof user.department === 'object' ? user.department?.name : 'Computer Science'}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Designation</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{user.designation || 'Associate Professor'}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Total Courses</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{user.teachingCourses?.length || 3}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Joined Date</p>
                <p className="font-semibold text-zinc-900 dark:text-white">Aug 2021</p>
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
              Teaching Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-base mb-1">Active Courses</p>
                  <p className="text-sm text-zinc-500">Currently teaching 3 courses this semester</p>
                </div>
                <div className="text-2xl font-black text-blue-500">3</div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white text-base mb-1">Total Students</p>
                  <p className="text-sm text-zinc-500">Managing 150+ students across sections</p>
                </div>
                <div className="text-2xl font-black text-blue-500">150+</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8">
            <button 
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 font-bold flex items-center justify-center transition-colors border border-red-100 dark:border-red-500/20"
            >
              Sign Out of CampusLearn
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
