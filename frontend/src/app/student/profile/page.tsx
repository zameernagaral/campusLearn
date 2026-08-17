'use client';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';
import { User, Mail, GraduationCap, MapPin, Calendar, Clock, Edit2, LogOut, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInitials, getRoleColor } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
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
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Profile</h1>
        <p className="text-zinc-500">Manage your account and personal information</p>
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
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-500/20 to-orange-500/5 dark:from-orange-500/10 dark:to-transparent" />

            <div className="relative z-10">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-orange-500/20 mb-6 border-4 border-white dark:border-zinc-900">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{user.name}</h2>
              <span className={cn('badge uppercase font-bold tracking-wider text-xs mb-4 inline-block', getRoleColor(user.role))}>
                {user.role}
              </span>

              <p className="text-zinc-500 flex items-center justify-center gap-2 mb-6">
                <Mail size={16} />
                {user.email}
              </p>

              <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }} className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Right column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-8"
        >
          {/* Academic Info */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">Academic Details</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-zinc-500 block mb-2">Student ID</label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <span className="font-medium">STU-{Math.floor(Math.random() * 90000) + 10000}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-500 block mb-2">Department</label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <span className="font-medium">Computer Science</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-500 block mb-2">Enrollment Year</label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <span className="font-medium">2024 (Semester 5)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-500 block mb-2">Campus Location</label>
                <div className="flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <span className="font-medium">Main Block, Building C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">Recent Activity</h3>

            <div className="space-y-6">
              {[
                { title: "Logged in from new device", time: "2 hours ago", type: "system" },
                { title: "Submitted Assignment: Machine Learning", time: "Yesterday", type: "academic" },
                { title: "Password changed successfully", time: "Last week", type: "security" }
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-zinc-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
