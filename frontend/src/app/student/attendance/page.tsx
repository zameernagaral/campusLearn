'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { attendanceAPI } from '@/lib/api';
import { UserCheck, AlertTriangle, CheckCircle, Clock, TrendingUp, Bell, X } from 'lucide-react';
import { getAttendanceColor } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';
import { BarChart, LineChart } from '@/components/charts/Charts';
import { motion } from 'framer-motion';

interface AttendanceSummary {
 course: string;
 title: string;
 total: number;
 present: number;
 absent: number;
 late: number;
 percentage: number;
}

export default function StudentAttendancePage() {
 const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [overall, setOverall] = useState(0);
 const [isSettingsOpen, setIsSettingsOpen] = useState(false);

 useEffect(() => {
 attendanceAPI.getMine().then(res => {
 const data = res.data.data || [];
 setAttendance(data);
 if (data.length > 0) {
 setOverall(Math.round(data.reduce((s: number, a: AttendanceSummary) => s + a.percentage, 0) / data.length));
 }
 }).catch(() => {}).finally(() => setIsLoading(false));
 }, []);

 // Sample trend
 const trendData = {
 labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
 datasets: [{ label: 'Attendance %', data: [90, 85, 82, 88, 78, 85], color: '#10b981' }],
 };

 const getStatusBadge = (pct: number) => {
 if (pct >= 85) return { label: 'Excellent', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
 if (pct >= 75) return { label: 'Good', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
 if (pct >= 60) return { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
 return { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
 };

 const shortageAlerts = attendance.filter(a => a.percentage < 75);

 return (
 <DashboardLayout requiredRole="student">
 <Toaster position="top-right" />
 
 {isSettingsOpen && (
 <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-6 rounded-2xl w-full max-w-md border border-border shadow-2xl relative">
 <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
 <X size={20} />
 </button>
 <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell size={20} className="text-primary"/> Notification Settings</h2>
 <div className="space-y-4">
 <div className="flex items-center justify-between p-3 border border-border rounded-xl">
 <div>
 <p className="font-bold text-sm">Attendance Alerts</p>
 <p className="text-xs text-muted">Get notified when attendance drops below 75%</p>
 </div>
 <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
 </div>
 <div className="flex items-center justify-between p-3 border border-border rounded-xl">
 <div>
 <p className="font-bold text-sm">Daily Summary</p>
 <p className="text-xs text-muted">Receive a daily email with your attendance status</p>
 </div>
 <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
 </div>
 <div className="flex items-center justify-between p-3 border border-border rounded-xl">
 <div>
 <p className="font-bold text-sm">SMS Alerts (Critical)</p>
 <p className="text-xs text-muted">Get SMS for severe shortage warnings</p>
 </div>
 <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button onClick={() => setIsSettingsOpen(false)} className="btn btn-ghost">Cancel</button>
 <button 
 onClick={() => {
 setIsSettingsOpen(false);
 toast.success('Notification preferences saved successfully!');
 }} 
 className="btn btn-primary"
 >
 Save Preferences
 </button>
 </div>
 </div>
 </div>
 )}

 <div className="flex items-center justify-between mb-6">
 <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>My Attendance</h1>
 <button onClick={() => setIsSettingsOpen(true)} className="btn btn-outline flex items-center gap-2"><Bell size={16} /> Notification Settings</button>
 </div>

 {/* Intelligent Shortage Detection */}
 {shortageAlerts.length > 0 ? (
 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 card p-5 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
 <div className="flex items-start gap-4">
 <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
 <AlertTriangle size={24} />
 </div>
 <div>
 <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">AI Shortage Detection Alert</h3>
 <p className="text-sm text-red-600 dark:text-red-300 mt-1">
 You have dropped below the mandatory 75% attendance threshold in the following courses. You must attend the next consecutive classes to avoid exam debarment.
 </p>
 <div className="mt-3 space-y-2">
 {shortageAlerts.map(course => (
 <div key={course.course} className="flex items-center gap-2 text-sm font-medium">
 <span className="w-2 h-2 rounded-full bg-red-500"></span>
 {course.title}: <span className="text-red-600 dark:text-red-400 font-bold">{course.percentage}%</span>
 <span className="text-xs text-muted ml-2">(Requires {Math.ceil((75 * course.total - 100 * course.present) / 25)} more present classes)</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 ) : (
 <div className="mb-6 card p-4 border-l-4 border-green-500 flex items-center gap-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400">
 <CheckCircle size={20} />
 <p className="font-medium text-sm">Great job! Your attendance is above the 75% threshold in all subjects.</p>
 </div>
 )}

 <div className="grid lg:grid-cols-4 gap-5 mb-6">
 {/* Overall */}
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className=" card p-6 flex flex-col items-center justify-center text-center"
 >
 <div className="relative w-28 h-28 mb-4">
 <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
 <circle cx="50" cy="50" r="40" fill="none"
 stroke={overall >= 75 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#ef4444'}
 strokeWidth="8"
 strokeDasharray={`${2 * Math.PI * 40 * overall / 100} ${2 * Math.PI * 40}`}
 strokeLinecap="round"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-2xl font-bold" style={{ color: overall >= 75 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#ef4444' }}>
 {overall}%
 </span>
 </div>
 </div>
 <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Overall Attendance</p>
 <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
 {overall >= 75 ? ' Above minimum (75%)' : '️ Below minimum threshold'}
 </p>
 </motion.div>

 {/* Stats */}
 <div className=" card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Attendance Trend</h3>
 <LineChart labels={trendData.labels} datasets={trendData.datasets} height={160} />
 </div>
 </div>

 {/* Course-wise Attendance */}
 <div className="card p-5">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Course-wise Breakdown</h3>
 {isLoading ? (
 <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
 ) : attendance.length === 0 ? (
 <div className="text-center py-12">
 <UserCheck size={48} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--muted)' }} />
 <p style={{ color: 'var(--muted)' }}>No attendance records yet</p>
 </div>
 ) : (
 <div className="space-y-4">
 {attendance.map((a, i) => {
 const status = getStatusBadge(a.percentage);
 return (
 <motion.div
 key={a.course}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.08 }}
 className="p-4 rounded-xl"
 style={{ background: 'var(--surface)' }}
 >
 <div className="flex items-center justify-between mb-2">
 <div>
 <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{a.title}</p>
 <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
 <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-500" /> {a.present} present</span>
 <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-red-400" /> {a.absent} absent</span>
 {a.late > 0 && <span className="flex items-center gap-1"><Clock size={11} className="text-amber-400" /> {a.late} late</span>}
 </div>
 </div>
 <div className="text-right">
 <p className={`text-xl font-bold ${getAttendanceColor(a.percentage)}`}>{a.percentage}%</p>
 <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: status.bg, color: status.color }}>
 {status.label}
 </span>
 </div>
 </div>
 <div className="progress">
 <div className="progress-bar" style={{
 width: `${a.percentage}%`,
 background: a.percentage >= 75 ? 'var(--success)' : a.percentage >= 60 ? 'var(--warning)' : 'var(--danger)',
 }} />
 </div>
 </motion.div>
 );
 })}
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
