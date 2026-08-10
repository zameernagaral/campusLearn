'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';

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

export default function HODSettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Email Notifications': true,
    'System Maintenance Alerts': true,
    'Audit Logging': false,
    'Two-Factor Authentication': false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (label: string) => {
    setToggles(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account Settings',
      items: [
        { label: 'Full Name', value: user?.name || 'Loading...' },
        { label: 'Email Address', value: user?.email || 'Loading...' },
        { label: 'Employee ID', value: user?.employeeId || user?.rollNumber || user?._id || 'N/A' },
      ]
    },
    {
      title: 'System Preferences',
      items: [
        { 
          label: 'Theme', 
          custom: (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit h-9">
              {mounted ? (
                <>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                  >
                    LIGHT
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-zinc-700 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                  >
                    DARK
                  </button>
                </>
              ) : (
                <div className="w-24" />
              )}
            </div>
          )
        },
        { label: 'Email Notifications', toggle: true },
        { label: 'System Maintenance Alerts', toggle: true },
        { label: 'Audit Logging', toggle: true },
      ]
    },
    {
      title: 'Security',
      items: [
        { label: 'Two-Factor Authentication', toggle: true },
        { label: 'Change Password', action: true },
        { label: 'Active Sessions', action: true },
      ]
    }
  ];

  return (
    <DashboardLayout requiredRole="hod">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Department Settings</h1>
            <p className="text-sm mt-0.5 text-zinc-500">Manage your Head of Department portal preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-6">{section.title}</h2>
              
              <div className="space-y-6">
                {section.items.map((item, j) => (
                  <div key={j} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{item.label}</span>
                    
                    {item.custom ? (
                      item.custom
                    ) : item.toggle ? (
                      <div 
                        onClick={() => handleToggle(item.label)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-colors shadow-inner ${toggles[item.label] ? 'bg-orange-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'}`}
                      >
                        <motion.div 
                          layout
                          transition={{ type: "spring", stiffness: 700, damping: 30 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm" 
                        />
                      </div>
                    ) : item.action ? (
                      <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }}  className="text-xs font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        Manage
                      </button>
                    ) : (
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <button 
              onClick={handleLogout}
              className="w-full sm:w-auto px-8 py-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 font-bold rounded-xl transition-colors text-sm border border-red-100 dark:border-red-500/20"
            >
              Sign Out Securely
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
