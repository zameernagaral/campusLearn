'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Sun, Moon, LogOut, User as UserIcon, Settings, ChevronDown, LayoutGrid, Users, BookOpen, BarChart2, CheckSquare, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { notificationAPI, authAPI } from '@/lib/api';
import { getInitials, formatRelativeTime, getRoleColor } from '@/lib/utils';
import type { User, Notification } from '@/types';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ActionSearchBar, Action } from '@/components/ui/ActionSearchBar';

interface DashboardNavbarProps {
 user: User;
 onMenuClick: () => void;
}

export function DashboardNavbar({ user, onMenuClick }: DashboardNavbarProps) {
 const [isDark, setIsDark] = useState(false);
 const [showNotifications, setShowNotifications] = useState(false);
 const [showProfile, setShowProfile] = useState(false);
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [unreadCount, setUnreadCount] = useState(0);
 const pathname = usePathname();
 const router = useRouter();
 const { logout } = useAuthStore();

 useEffect(() => {
 const stored = localStorage.getItem('theme');
 const dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
 setIsDark(dark);
 document.documentElement.classList.toggle('dark', dark);
 }, []);

 const fetchNotifications = async () => {
 try {
 const { data } = await notificationAPI.getAll({ limit: 8 });
 setNotifications(data.data.notifications || []);
 setUnreadCount(data.data.unreadCount || 0);
 } catch (_) {}
 };

 useEffect(() => {
 fetchNotifications();
 }, []);

 const toggleTheme = () => {
 const newDark = !isDark;
 setIsDark(newDark);
 document.documentElement.classList.toggle('dark', newDark);
 localStorage.setItem('theme', newDark ? 'dark' : 'light');
 };

 const handleMarkAllRead = async () => {
 try {
 await notificationAPI.markAllRead();
 setUnreadCount(0);
 setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
 } catch (_) {}
 };

 const handleLogout = async () => {
 try { await authAPI.logout(); } catch (_) {}
 logout();
 toast.success('Logged out successfully');
 router.push('/login');
 };

 const getNotifIcon = (type: string) => {
 const icons: Record<string, string> = {
 assignment: '', quiz: '', grade: '⭐', course: '',
 announcement: '', certificate: '', system: '', discussion: '',
 };
 return icons[type] || '';
 };

 const getActions = (): Action[] => {
 const roleActions: Record<string, Action[]> = {
 admin: [
 { id: 'admin-1', label: 'Dashboard', route: '/admin/dashboard', icon: <LayoutGrid className="w-4 h-4 text-orange-500" />, end: 'Page' },
 { id: 'admin-2', label: 'Manage Users', route: '/admin/users', icon: <Users className="w-4 h-4 text-blue-500" />, end: 'Page' },
 { id: 'admin-3', label: 'Departments', route: '/admin/departments', icon: <LayoutGrid className="w-4 h-4 text-purple-500" />, end: 'Page' },
 { id: 'admin-4', label: 'University Courses', route: '/admin/courses', icon: <BookOpen className="w-4 h-4 text-green-500" />, end: 'Page' },
 { id: 'admin-5', label: 'Platform Analytics', route: '/admin/analytics', icon: <BarChart2 className="w-4 h-4 text-pink-500" />, end: 'Page' },
 { id: 'admin-6', label: 'Settings', route: '/admin/settings', icon: <Settings className="w-4 h-4 text-gray-500" />, end: 'Page' },
 ],
 faculty: [
 { id: 'faculty-1', label: 'Dashboard', route: '/faculty/dashboard', icon: <LayoutGrid className="w-4 h-4 text-orange-500" />, end: 'Page' },
 { id: 'faculty-2', label: 'My Courses', route: '/faculty/courses', icon: <BookOpen className="w-4 h-4 text-blue-500" />, end: 'Page' },
 { id: 'faculty-3', label: 'Assignments', route: '/faculty/assignments', icon: <CheckSquare className="w-4 h-4 text-purple-500" />, end: 'Page' },
 { id: 'faculty-4', label: 'Quizzes', route: '/faculty/quizzes', icon: <LayoutGrid className="w-4 h-4 text-green-500" />, end: 'Page' },
 { id: 'faculty-5', label: 'Analytics', route: '/faculty/analytics', icon: <BarChart2 className="w-4 h-4 text-pink-500" />, end: 'Page' },
 ],
 student: [
 { id: 'student-1', label: 'Dashboard', route: '/student/dashboard', icon: <LayoutGrid className="w-4 h-4 text-orange-500" />, end: 'Page' },
 { id: 'student-2', label: 'My Courses', route: '/student/courses', icon: <BookOpen className="w-4 h-4 text-blue-500" />, end: 'Page' },
 { id: 'student-3', label: 'Assignments', route: '/student/assignments', icon: <CheckSquare className="w-4 h-4 text-purple-500" />, end: 'Page' },
 { id: 'student-4', label: 'Quizzes', route: '/student/quizzes', icon: <LayoutGrid className="w-4 h-4 text-green-500" />, end: 'Page' },
 { id: 'student-5', label: 'Grades & Results', route: '/student/results', icon: <BarChart2 className="w-4 h-4 text-pink-500" />, end: 'Page' },
 ]
 };
 return roleActions[user.role] || roleActions.student;
 };

 return (
 <header
 className="sticky top-0 z-20 flex items-center gap-4 px-6 h-16"
 style={{
 background: 'var(--card)',
 borderBottom: '1px solid var(--border)',
 backdropFilter: 'blur(20px)',
 }}
 >
 <button
 onClick={onMenuClick}
 className="md:hidden p-2 rounded-lg transition-colors hover:bg-[var(--surface-2)]"
 >
 <Menu size={20} style={{ color: 'var(--muted)' }} />
 </button>

 {/* Search Bar - Hidden on mobile */}
 <div className="hidden md:block flex-1 max-w-xl mx-4">
 <ActionSearchBar actions={getActions()} />
 </div>

 <div className="flex items-center gap-2 ml-auto">
 {/* Streak badge */}
 {user.role === 'student' && user.streak > 0 && (
 <div
 className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold"
 style={{ background: 'rgba(251,146,60,0.1)', color: '#f97316', border: '1px solid rgba(251,146,60,0.2)' }}
 >
 {user.streak} day streak
 </div>
 )}

 {/* Theme toggle */}
 <button
 onClick={toggleTheme}
 className="p-2 rounded-xl transition-all hover:bg-[var(--surface-2)]"
 title="Toggle theme"
 >
 {isDark ? <Sun size={18} style={{ color: 'var(--warning)' }} /> : <Moon size={18} style={{ color: 'var(--primary)' }} />}
 </button>

 {/* Notifications */}
 <div className="relative">
 <button
 onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
 className="relative p-2 rounded-xl transition-all hover:bg-[var(--surface-2)]"
 >
 <Bell size={18} style={{ color: 'var(--muted)' }} />
 {unreadCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
 style={{ background: 'var(--danger)', fontSize: '10px' }}>
 {unreadCount > 9 ? '9+' : unreadCount}
 </span>
 )}
 </button>

 <AnimatePresence>
 {showNotifications && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
 >
 <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
 <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
 Notifications {unreadCount > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'var(--primary)', color: 'white' }}>{unreadCount}</span>}
 </h3>
 {unreadCount > 0 && (
 <button onClick={handleMarkAllRead} className="text-xs" style={{ color: 'var(--primary)' }}>
 Mark all read
 </button>
 )}
 </div>
 <div className="max-h-80 overflow-y-auto">
 {notifications.length === 0 ? (
 <div className="p-8 text-center" style={{ color: 'var(--muted)' }}>
 <Bell size={32} className="mx-auto mb-2 opacity-30" />
 <p className="text-sm">No notifications</p>
 </div>
 ) : (
 notifications.map(notif => (
 <div
 key={notif._id}
 className={cn(
 'flex gap-3 p-3 hover:bg-[var(--surface)] transition-colors cursor-pointer',
 !notif.isRead && 'bg-[rgba(99,102,241,0.05)]'
 )}
 >
 <span className="text-xl">{getNotifIcon(notif.type)}</span>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{notif.title}</p>
 <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{notif.message}</p>
 <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>{formatRelativeTime(notif.createdAt)}</p>
 </div>
 {!notif.isRead && (
 <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary)' }} />
 )}
 </div>
 ))
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Profile */}
 <div className="relative">
 <button
 onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
 className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:bg-[var(--surface-2)]"
 >
 {user.avatar ? (
 <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
 ) : (
 <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
 {getInitials(user.name)}
 </div>
 )}
 <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate" style={{ color: 'var(--foreground)' }}>
 {user.name.split(' ')[0]}
 </span>
 <ChevronDown size={14} style={{ color: 'var(--muted)' }} />
 </button>

 <AnimatePresence>
 {showProfile && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-12 w-56 rounded-2xl shadow-2xl overflow-hidden z-50"
 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
 >
 <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
 <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{user.name}</p>
 <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{user.email}</p>
 <span className={cn('badge mt-2 text-xs capitalize', getRoleColor(user.role))}>
 {user.role}
 </span>
 </div>
 <div className="p-2">
 <Link
 href={`/${user.role}/profile`}
 className="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors hover:bg-[var(--surface)]"
 style={{ color: 'var(--foreground)' }}
 onClick={() => setShowProfile(false)}
 >
 <UserIcon size={15} /> Profile
 </Link>
 <Link
 href={`/${user.role}/settings`}
 className="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors hover:bg-[var(--surface)]"
 style={{ color: 'var(--foreground)' }}
 onClick={() => setShowProfile(false)}
 >
 <Settings size={15} /> Settings
 </Link>
 <button
 onClick={handleLogout}
 className="flex items-center gap-2 p-2 rounded-lg text-sm w-full text-left transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
 style={{ color: 'var(--danger)' }}
 >
 <LogOut size={15} /> Logout
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>

 {/* Click outside handler */}
 {(showNotifications || showProfile) && (
 <div
 className="fixed inset-0 z-40"
 onClick={() => { setShowNotifications(false); setShowProfile(false); }}
 />
 )}
 </header>
 );
}
