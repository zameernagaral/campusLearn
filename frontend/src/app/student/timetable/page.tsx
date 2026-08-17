'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle,
  BookOpen, Beaker, ChevronLeft, ChevronRight, ExternalLink, Bell,
  CheckCircle, XCircle, RefreshCw, Plus, LayoutGrid, List
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { timetableAPI } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClassEntry {
  _id: string;
  subject: string;
  faculty: { name: string } | string;
  classroom?: { name: string; building?: string } | null;
  room?: string;
  startTime: string;
  endTime: string;
  classType: 'Lecture' | 'Lab' | 'Tutorial' | 'Online';
  meetingLink?: string;
  status: 'Upcoming' | 'Live Now' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
  isLive?: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
function makeMockClasses(): ClassEntry[] {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const hour = today.getHours();

  return [
    { _id: 'm1', subject: 'Database Management Systems', faculty: { name: 'Dr. Rajesh Sharma' }, room: 'Room 204', startTime: `${todayStr}T09:00:00`, endTime: `${todayStr}T10:00:00`, classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz-dbms', status: hour >= 9 && hour < 10 ? 'Live Now' : hour >= 10 ? 'Completed' : 'Upcoming', notes: '' },
    { _id: 'm2', subject: 'Computer Networks', faculty: { name: 'Prof. Anita Mehta' }, room: 'Room 201', startTime: `${todayStr}T10:15:00`, endTime: `${todayStr}T11:15:00`, classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz-cn', status: hour >= 10 && hour < 11 ? 'Live Now' : hour >= 11 ? 'Completed' : 'Upcoming', notes: 'Room changed from 105 to 201' },
    { _id: 'm3', subject: 'Data Structures Lab', faculty: { name: 'Mr. Vijay Davis' }, room: 'Lab 3', startTime: `${todayStr}T13:00:00`, endTime: `${todayStr}T15:00:00`, classType: 'Lab', status: hour >= 13 && hour < 15 ? 'Live Now' : hour >= 15 ? 'Completed' : 'Upcoming', notes: '' },
    { _id: 'm4', subject: 'Operating Systems', faculty: { name: 'Dr. Priya Brown' }, room: 'Room 101', startTime: `${todayStr}T15:30:00`, endTime: `${todayStr}T16:30:00`, classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz-os', status: hour >= 15 && hour < 16 ? 'Live Now' : hour >= 16 ? 'Completed' : 'Upcoming', notes: '' },
    // Tomorrow
    { _id: 'm5', subject: 'Software Engineering', faculty: { name: 'Prof. Kiran White' }, room: 'Room 102', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0).toISOString(), classType: 'Lecture', status: 'Upcoming', notes: '' },
    { _id: 'm6', subject: 'Artificial Intelligence', faculty: { name: 'Dr. Arjun Green' }, room: 'Room 305', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0).toISOString(), classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz-ai', status: 'Upcoming', notes: '' },
    { _id: 'm7', subject: 'Computer Networks', faculty: { name: 'Prof. Anita Mehta' }, room: 'Room 201', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0).toISOString(), classType: 'Lecture', status: 'Cancelled', notes: 'Faculty on leave' },
    { _id: 'm8', subject: 'Machine Learning', faculty: { name: 'Dr. Sunita Rao' }, room: 'Lab 1', startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 0).toISOString(), endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 13, 0).toISOString(), classType: 'Lab', status: 'Upcoming', notes: '' },
  ];
}

const TYPE_STYLE: Record<string, { bg: string; text: string; icon: typeof BookOpen }> = {
  Lecture:  { bg: 'bg-blue-50 dark:bg-blue-500/10',  text: 'text-blue-600 dark:text-blue-400',  icon: BookOpen },
  Lab:      { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', icon: Beaker },
  Tutorial: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: BookOpen },
  Online:   { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', icon: Video },
};

const STATUS_STYLE: Record<string, string> = {
  'Live Now':    'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Upcoming':    'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  'Completed':   'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'Cancelled':   'bg-red-50 text-red-500 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Rescheduled': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
};

function fmt(iso: string, type: 'time' | 'date') {
  const d = new Date(iso);
  if (type === 'time') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimetablePage() {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await timetableAPI.getAll();
        const data = res.data?.data;
        setClasses(Array.isArray(data) && data.length > 0 ? data : makeMockClasses());
      } catch {
        setClasses(makeMockClasses());
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Auto-refresh every minute to update Live Now status
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClasses(prev => prev.map(c => {
        const start = new Date(c.startTime);
        const end = new Date(c.endTime);
        if (c.status === 'Cancelled' || c.status === 'Rescheduled') return c;
        if (start <= now && end >= now) return { ...c, status: 'Live Now' as const, isLive: true };
        if (end < now) return { ...c, status: 'Completed' as const };
        return { ...c, status: 'Upcoming' as const };
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const dayStart = new Date(selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(selectedDate);
  dayEnd.setHours(23, 59, 59, 999);

  const todayClasses = classes.filter(c => {
    const d = new Date(c.startTime);
    return d >= dayStart && d <= dayEnd;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const liveClass = classes.find(c => c.status === 'Live Now');

  // Build 7-day week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  const handleJoin = (cls: ClassEntry) => {
    if (cls.meetingLink) {
      window.open(cls.meetingLink, '_blank');
    } else {
      toast.error('No meeting link available for this class.');
    }
  };

  const handleAddToCalendar = (cls: ClassEntry) => {
    const start = new Date(cls.startTime);
    const end = new Date(cls.endTime);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(cls.subject)}&dates=${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Faculty: ${typeof cls.faculty === 'object' ? cls.faculty.name : cls.faculty}${cls.meetingLink ? '\nLink: ' + cls.meetingLink : ''}`)}`;
    window.open(url, '_blank');
    toast.success('Opening Google Calendar…');
  };

  const facultyName = (cls: ClassEntry) => typeof cls.faculty === 'object' ? cls.faculty.name : cls.faculty;

  return (
    <DashboardLayout requiredRole="student">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Clock size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Real-Time Timetable</h1>
          </div>
          <p className="text-sm text-zinc-500">Your classes, live status, and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            {(['daily', 'weekly'] as const).map(v => (
              <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeView === v ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Now Banner */}
      <AnimatePresence>
        {liveClass && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-4 p-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">LIVE NOW</p>
                <p className="font-black text-lg">{liveClass.subject}</p>
                <p className="text-sm opacity-80">{facultyName(liveClass)} · {liveClass.room} · {fmt(liveClass.startTime, 'time')} – {fmt(liveClass.endTime, 'time')}</p>
              </div>
            </div>
            <button onClick={() => handleJoin(liveClass)} className="flex items-center gap-2 bg-white text-red-600 font-black px-4 py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors shadow-md">
              <Video size={16} /> Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Change Alert */}
      {classes.some(c => c.notes && c.status === 'Rescheduled') && (
        <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-700 dark:text-amber-400 text-sm">Schedule Change</p>
            {classes.filter(c => c.notes && c.status === 'Rescheduled').map(c => (
              <p key={c._id} className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">{c.subject}: {c.notes}</p>
            ))}
          </div>
        </div>
      )}

      {activeView === 'daily' ? (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* Day view */}
          <div>
            {/* Date Navigator */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 shrink-0 border border-zinc-200 dark:border-zinc-800">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 3 + i);
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button key={i} onClick={() => setSelectedDate(d)}
                    className={`flex flex-col items-center min-w-[70px] py-3 px-2 rounded-2xl transition-all border ${isSelected ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-800 dark:border-zinc-700 shadow-md' : 'bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">{DAYS[d.getDay()]}</span>
                    <span className={`text-xl font-black mt-1 ${isToday && !isSelected ? 'text-orange-500' : ''}`}>{d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}</span>
                    {isToday && <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-orange-500' : 'bg-orange-500'}`} />}
                  </button>
                );
              })}
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 shrink-0 border border-zinc-200 dark:border-zinc-800">
                <ChevronRight size={16} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-zinc-50 dark:bg-[#0a0a0a] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 w-full flex flex-col sm:flex-row gap-4 animate-pulse">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                        <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                      </div>
                      <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                      <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    </div>
                    <div className="sm:text-right space-y-2 mt-4 sm:mt-0 flex flex-col sm:items-end">
                      <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                      <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-[#0a0a0a] rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <CalendarIcon size={40} className="text-zinc-300 dark:text-zinc-700 mb-3" />
                <p className="font-bold text-zinc-900 dark:text-white mb-1">No classes today</p>
                <p className="text-sm text-zinc-500">Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((cls, i) => {
                  const typeStyle = TYPE_STYLE[cls.classType] ?? TYPE_STYLE.Lecture;
                  const isLive = cls.status === 'Live Now';
                  const isCancelled = cls.status === 'Cancelled';
                  
                  // In premium dark theme, active cards have blue/indigo borders
                  const borderColor = isLive ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-zinc-200 dark:border-[#1e293b]';
                  const bgColor = 'bg-white dark:bg-[#0f1115] hover:dark:bg-[#13161c]';

                  return (
                    <motion.div key={cls._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`${bgColor} rounded-2xl border ${borderColor} overflow-hidden transition-all duration-300`}>
                      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {isLive && (
                              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />Live Now
                              </span>
                            )}
                            {!isLive && <span className={`text-xs px-2.5 py-1 font-bold rounded-full border ${STATUS_STYLE[cls.status]}`}>{cls.status}</span>}
                            <span className={`text-xs px-2.5 py-1 font-bold rounded-full ${typeStyle.bg} ${typeStyle.text}`}>{cls.classType}</span>
                            <span className="text-xs px-2.5 py-1 font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">CS-A</span>
                          </div>
                          <h3 className={`font-black text-zinc-900 dark:text-white text-lg ${isCancelled ? 'line-through text-zinc-400' : ''}`}>{cls.subject}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Faculty: {facultyName(cls)}</p>
                          {cls.notes && <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {cls.notes}</p>}
                        </div>
                        <div className="sm:text-right shrink-0 flex flex-col sm:items-end justify-between">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 justify-start sm:justify-end">
                              <Clock size={14} className={isLive ? 'text-indigo-500' : 'text-zinc-400'} /> 
                              {fmt(cls.startTime, 'time')} - {fmt(cls.endTime, 'time')}
                            </p>
                            {cls.room && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5 justify-start sm:justify-end"><MapPin size={14} /> {cls.room}</p>}
                          </div>
                          
                          {/* Actions */}
                          {!isCancelled && (
                            <div className="flex gap-2 mt-4 sm:mt-0">
                              {(isLive || cls.meetingLink) && (
                                <button onClick={() => handleJoin(cls)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isLive ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                                  <Video size={14} /> {isLive ? 'Join Link' : 'Join Link'}
                                </button>
                              )}
                              <button onClick={() => handleAddToCalendar(cls)} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors" title="Add to Calendar">
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Weekly Overview */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-black text-zinc-900 dark:text-white text-sm">Week Overview</h3>
              </div>
              <div className="p-4 space-y-2">
                {weekDays.map(d => {
                  const dayClasses = classes.filter(c => new Date(c.startTime).toDateString() === d.toDateString());
                  const isSelected = d.toDateString() === selectedDate.toDateString();
                  const isToday = d.toDateString() === new Date().toDateString();
                  return (
                    <button key={d.toISOString()} onClick={() => setSelectedDate(d)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${isSelected ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                      <span className={`font-bold ${isToday ? 'text-orange-500' : 'text-zinc-700 dark:text-zinc-300'}`}>{DAYS[d.getDay()]} {d.getDate()}</span>
                      <span className="text-xs text-zinc-400">{dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Stats */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-black text-zinc-900 dark:text-white text-sm mb-3">This Week</h3>
              <div className="space-y-2">
                {[
                  { label: 'Total Classes', value: classes.filter(c => weekDays.some(d => new Date(c.startTime).toDateString() === d.toDateString())).length, icon: BookOpen, color: 'text-blue-500' },
                  { label: 'Completed', value: classes.filter(c => c.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-500' },
                  { label: 'Cancelled', value: classes.filter(c => c.status === 'Cancelled').length, icon: XCircle, color: 'text-red-500' },
                  { label: 'Rescheduled', value: classes.filter(c => c.status === 'Rescheduled').length, icon: RefreshCw, color: 'text-amber-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className={color} />
                      <span className="text-xs text-zinc-500">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly grid view */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">
            {weekDays.map(d => (
              <div key={d.toISOString()} className={`px-2 py-3 text-center border-r last:border-r-0 border-zinc-100 dark:border-zinc-800 ${d.toDateString() === new Date().toDateString() ? 'bg-orange-50 dark:bg-orange-500/5' : ''}`}>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">{DAYS[d.getDay()]}</p>
                <p className={`text-lg font-black mt-0.5 ${d.toDateString() === new Date().toDateString() ? 'text-orange-500' : 'text-zinc-700 dark:text-zinc-300'}`}>{d.getDate()}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weekDays.map(d => {
              const dayCs = classes.filter(c => new Date(c.startTime).toDateString() === d.toDateString()).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
              return (
                <div key={d.toISOString()} className="min-h-[200px] p-2 border-r last:border-r-0 border-zinc-100 dark:border-zinc-800 space-y-1">
                  {dayCs.map(cls => {
                    const typeStyle = TYPE_STYLE[cls.classType] ?? TYPE_STYLE.Lecture;
                    return (
                      <div key={cls._id} className={`text-[9px] p-1.5 rounded-lg border truncate font-semibold cursor-pointer hover:opacity-80 transition-opacity ${cls.status === 'Live Now' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : cls.status === 'Cancelled' ? 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700 line-through' : `${typeStyle.bg} ${typeStyle.text} border-zinc-100 dark:border-zinc-800`}`}
                        title={`${cls.subject} - ${fmt(cls.startTime, 'time')} to ${fmt(cls.endTime, 'time')}`}>
                        {fmt(cls.startTime, 'time')} {cls.subject.split(' ').slice(0, 2).join(' ')}
                      </div>
                    );
                  })}
                  {dayCs.length === 0 && <div className="text-[10px] text-zinc-300 dark:text-zinc-700 text-center pt-4">Free</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
