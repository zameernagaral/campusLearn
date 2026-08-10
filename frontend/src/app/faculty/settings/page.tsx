'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';

type SettingsItem = {
  label: string;
  value?: string;
  custom?: React.ReactNode;
  toggle?: boolean;
  action?: boolean;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

export default function FacultySettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account Settings',
      items: [
        { label: 'Full Name', value: user?.name || 'Prof. Priya Sharma' },
        { label: 'Email Address', value: user?.email || 'priya@campuslearn.com' },
        { label: 'Employee ID', value: user?.employeeId || 'F2026-042' },
      ]
    },
    {
      title: 'Display Preferences',
      items: [
        { 
          label: 'Theme', 
          custom: (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'light' ? 'bg-white text-blue-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                LIGHT
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-zinc-700 text-blue-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                DARK
              </button>
            </div>
          ) 
        },
        { 
          label: 'Language', 
          value: 'English (US)' 
        },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { label: 'Email Notifications', toggle: true },
        { label: 'Student Submission Alerts', toggle: true },
        { label: 'Department Announcements', toggle: true },
      ]
    },
    {
      title: 'Security',
      items: [
        { label: 'Change Password', action: true },
        { label: 'Two-Factor Authentication', toggle: false },
      ]
    }
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Faculty Settings</h1>
        <p className="text-sm text-zinc-500">Manage your account preferences and settings</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((section, i) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  
                  {item.custom ? item.custom : 
                   item.value ? (
                    <span className="text-zinc-500 text-sm font-medium">{item.value}</span>
                  ) : item.action ? (
                    <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      EDIT
                    </button>
                  ) : item.toggle !== undefined ? (
                    <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className={`w-12 h-6 rounded-full p-1 transition-colors ${item.toggle ? 'bg-blue-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.toggle ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 font-bold flex items-center justify-center transition-colors border border-red-100 dark:border-red-500/20"
          >
            Sign Out of CampusLearn
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
