'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  User, Bell, Shield, Paintbrush, ChevronRight, LogOut, Moon, Sun,
  AlertTriangle, Mail, Smartphone, BookOpen, Clock, Loader2, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface NotificationPrefs {
  attendanceAlerts: boolean;
  dailySummary: boolean;
  smsCritical: boolean;
  assignmentReminders: boolean;
  examAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  attendanceAlerts: true,
  dailySummary: false,
  smsCritical: true,
  assignmentReminders: true,
  examAlerts: true,
  pushNotifications: true,
  emailNotifications: true,
};

function prefsKey(userId: string) {
  return `notificationPrefs_${userId}`;
}

function loadPrefs(userId: string): NotificationPrefs {
  try {
    const raw = localStorage.getItem(prefsKey(userId));
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0 ${
        enabled ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm ${
          enabled ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [twoFactor, setTwoFactor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user?._id) setPrefs(loadPrefs(user._id));
  }, [user?._id]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setHasChanges(true);
  };

  const saveNotifications = () => {
    if (!user?._id) return;
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(prefsKey(user._id), JSON.stringify(prefs));
      setIsSaving(false);
      setHasChanges(false);
      toast.success('Notification preferences saved!');
    }, 400);
  };

  const NOTIFICATION_ITEMS: { key: keyof NotificationPrefs; icon: typeof Bell; label: string; desc: string }[] = [
    { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
    { key: 'pushNotifications', icon: Bell, label: 'Push Notifications', desc: 'Browser and in-app alerts' },
    { key: 'attendanceAlerts', icon: AlertTriangle, label: 'Attendance Alerts', desc: 'When attendance drops below 75%' },
    { key: 'assignmentReminders', icon: BookOpen, label: 'Assignment Reminders', desc: 'Pending submission reminders' },
    { key: 'examAlerts', icon: Clock, label: 'Exam Alerts', desc: 'Upcoming exam notifications' },
    { key: 'dailySummary', icon: Mail, label: 'Daily Summary', desc: 'Morning attendance digest' },
    { key: 'smsCritical', icon: Smartphone, label: 'SMS (Critical Only)', desc: 'SMS for severe warnings' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your account preferences and settings</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900/40 rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Account</h2>
          </div>
          <div className="space-y-1">
            {[
              { label: 'Personal Information', value: user?.name || '—' },
              { label: 'Email Address', value: user?.email || '—' },
              { label: 'Roll Number', value: user?.rollNumber || '—' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className="text-zinc-500 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900/40 rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Paintbrush size={20} />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Preferences</h2>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Theme</span>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                    theme === 'light' ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  <Sun size={16} />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                    theme === 'dark' ? 'bg-zinc-700 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Moon size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Language</span>
              <span className="text-zinc-500 text-sm">English (US)</span>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900/40 rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Notifications</h2>
                <p className="text-xs text-zinc-500">Synced with attendance page settings</p>
              </div>
            </div>
            <AnimatePresence>
              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={saveNotifications}
                  disabled={isSaving}
                  className="py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Save
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            {NOTIFICATION_ITEMS.map(({ key, icon: Icon, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-transparent hover:border-orange-500/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl shrink-0">
                    <Icon size={16} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{label}</p>
                    <p className="text-xs text-zinc-500">{desc}</p>
                  </div>
                </div>
                <ToggleSwitch enabled={prefs[key]} onChange={() => togglePref(key)} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-zinc-900/40 rounded-3xl p-6 lg:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Security</h2>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => toast('Password change will be available soon', { icon: '🔒' })}
              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Change Password</span>
              <ChevronRight size={16} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
            </button>
            <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300">Two-Factor Authentication</p>
                <p className="text-xs text-zinc-500 mt-0.5">Add an extra layer of security</p>
              </div>
              <ToggleSwitch enabled={twoFactor} onChange={() => { setTwoFactor(v => !v); toast.success(twoFactor ? '2FA disabled' : '2FA enabled'); }} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 transition-colors border border-red-100 dark:border-red-500/20"
          >
            <LogOut size={18} /> Sign Out of CampusLearn
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
