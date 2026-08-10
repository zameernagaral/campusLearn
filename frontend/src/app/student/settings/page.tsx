'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { User, Bell, Shield, Paintbrush, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
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
  icon: React.ReactNode;
  items: SettingsItem[];
};

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      icon: <User size={20} />,
      items: [
        { label: 'Personal Information', value: user?.name || 'Arjun Mehta' },
        { label: 'Email Address', value: user?.email || 'arjun@example.com' },
        { label: 'Roll Number', value: user?.rollNumber || 'CSE2024001' },
      ]
    },
    {
      title: 'Preferences',
      icon: <Paintbrush size={20} />,
      items: [
        { 
          label: 'Theme', 
          custom: (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-zinc-700 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Moon size={16} />
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
      icon: <Bell size={20} />,
      items: [
        { label: 'Email Notifications', toggle: true },
        { label: 'Push Notifications', toggle: true },
        { label: 'Assignment Reminders', toggle: true },
      ]
    },
    {
      title: 'Security',
      icon: <Shield size={20} />,
      items: [
        { label: 'Change Password', action: true },
        { label: 'Two-Factor Authentication', toggle: false },
      ]
    }
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Settings</h1>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                {section.icon}
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  
                  {item.custom ? item.custom : 
                   item.value ? (
                    <span className="text-zinc-500 text-sm">{item.value}</span>
                  ) : item.action ? (
                    <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  ) : item.toggle !== undefined ? (
                    <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className={`w-12 h-6 rounded-full p-1 transition-colors ${item.toggle ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
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
            className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 font-bold flex items-center justify-center gap-2 transition-colors border border-red-100 dark:border-red-500/20"
          >
            <LogOut size={18} /> Sign Out of CampusLearn
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
