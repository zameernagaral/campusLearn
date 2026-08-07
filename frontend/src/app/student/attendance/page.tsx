'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { attendanceAPI } from '@/lib/api';
import { UserCheck, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { getAttendanceColor } from '@/lib/utils';
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

  return (
    <DashboardLayout requiredRole="student">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>My Attendance</h1>

      <div className="grid lg:grid-cols-4 gap-5 mb-6">
        {/* Overall */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 card p-6 flex flex-col items-center justify-center text-center"
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
              <span className="text-2xl font-black" style={{ color: overall >= 75 ? '#10b981' : overall >= 60 ? '#f59e0b' : '#ef4444' }}>
                {overall}%
              </span>
            </div>
          </div>
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Overall Attendance</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {overall >= 75 ? '✅ Above minimum (75%)' : '⚠️ Below minimum threshold'}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="lg:col-span-3 card p-5">
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
                      <p className={`text-xl font-black ${getAttendanceColor(a.percentage)}`}>{a.percentage}%</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" style={{
                      width: `${a.percentage}%`,
                      background: a.percentage >= 75 ? 'linear-gradient(90deg,#10b981,#06b6d4)' : a.percentage >= 60 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#ef4444,#dc2626)',
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
