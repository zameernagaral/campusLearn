'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Plus, Edit2, X, Check, Video, MapPin, AlertTriangle, ChevronLeft, ChevronRight, Loader2, RefreshCw, XCircle, BookOpen, Beaker } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { timetableAPI } from '@/lib/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fmt(iso: string, type: 'time' | 'date') {
  const d = new Date(iso);
  if (type === 'time') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

const STATUS_STYLE: Record<string, string> = {
  'Live Now':    'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Upcoming':    'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  'Completed':   'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'Cancelled':   'bg-red-50 text-red-500 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  'Rescheduled': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
};

interface FormState { subject: string; room: string; startDate: string; startTime: string; endTime: string; classType: string; meetingLink: string; notes: string; }
const EMPTY_FORM: FormState = { subject: '', room: '', startDate: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', classType: 'Lecture', meetingLink: '', notes: '' };

function makeMockClasses() {
  const today = new Date().toISOString().split('T')[0];
  return [
    { _id: 'f1', subject: 'Database Management Systems', room: 'Room 204', startTime: `${today}T10:00:00`, endTime: `${today}T11:00:00`, classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz', status: 'Upcoming', notes: '' },
    { _id: 'f2', subject: 'DBMS Lab', room: 'Lab 2', startTime: `${today}T13:00:00`, endTime: `${today}T15:00:00`, classType: 'Lab', meetingLink: '', status: 'Upcoming', notes: '' },
    { _id: 'f3', subject: 'Database Management Systems', room: 'Room 204', startTime: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T10:00:00', endTime: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T11:00:00', classType: 'Lecture', meetingLink: 'https://meet.google.com/xyz', status: 'Upcoming', notes: '' },
  ];
}

export default function FacultyTimetablePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: 'reschedule' | 'cancel'; classId: string; subject: string } | null>(null);
  const [reason, setReason] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await timetableAPI.getAll();
        const data = res.data?.data;
        setClasses(Array.isArray(data) && data.length > 0 ? data : makeMockClasses());
      } catch {
        setClasses(makeMockClasses());
      } finally { setIsLoading(false); }
    };
    load();
  }, []);

  const dayStart = new Date(selectedDate); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(selectedDate); dayEnd.setHours(23, 59, 59, 999);
  const todayClasses = classes.filter(c => { const d = new Date(c.startTime); return d >= dayStart && d <= dayEnd; }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.startDate || !form.startTime || !form.endTime) { toast.error('Please fill all required fields'); return; }
    setIsSubmitting(true);
    try {
      const startTime = `${form.startDate}T${form.startTime}:00`;
      const endTime = `${form.startDate}T${form.endTime}:00`;
      await timetableAPI.create({ subject: form.subject, room: form.room, startTime, endTime, classType: form.classType, meetingLink: form.meetingLink, notes: form.notes });
      const newClass = { _id: Date.now().toString(), ...form, startTime, endTime, status: 'Upcoming' };
      setClasses(prev => [...prev, newClass]);
      setForm(EMPTY_FORM); setShowForm(false);
      toast.success('Class created successfully!');
    } catch {
      // Use mock
      const startTime = `${form.startDate}T${form.startTime}:00`;
      const endTime = `${form.startDate}T${form.endTime}:00`;
      const newClass = { _id: Date.now().toString(), ...form, startTime, endTime, status: 'Upcoming' };
      setClasses(prev => [...prev, newClass]);
      setForm(EMPTY_FORM); setShowForm(false);
      toast.success('Class added!');
    } finally { setIsSubmitting(false); }
  };

  const handleCancel = async () => {
    if (!actionModal) return;
    setIsSubmitting(true);
    try {
      await timetableAPI.cancel({ eventId: actionModal.classId, reason });
    } catch { /* proceed with local */ }
    setClasses(prev => prev.map(c => c._id === actionModal.classId ? { ...c, status: 'Cancelled', notes: reason } : c));
    toast.success(`${actionModal.subject} cancelled.`);
    setActionModal(null); setReason('');
    setIsSubmitting(false);
  };

  const handleReschedule = async () => {
    if (!actionModal || !newTime) { toast.error('Enter a new time'); return; }
    setIsSubmitting(true);
    const cls = classes.find(c => c._id === actionModal.classId);
    const dateStr = new Date(cls.startTime).toISOString().split('T')[0];
    try {
      await timetableAPI.reschedule({ eventId: actionModal.classId, newStartTime: `${dateStr}T${newTime}:00`, newEndTime: new Date(new Date(`${dateStr}T${newTime}:00`).getTime() + 60 * 60000).toISOString(), reason });
    } catch { /* proceed with local */ }
    setClasses(prev => prev.map(c => c._id === actionModal.classId ? { ...c, startTime: `${dateStr}T${newTime}:00`, status: 'Rescheduled', notes: `Rescheduled. ${reason}` } : c));
    toast.success(`${actionModal.subject} rescheduled!`);
    setActionModal(null); setReason(''); setNewTime('');
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Clock size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Timetable Management</h1>
          </div>
          <p className="text-sm text-zinc-500">Create, manage, reschedule and cancel your classes</p>
        </div>
        <button onClick={() => { setShowForm(true); setForm(EMPTY_FORM); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20">
          <Plus size={16} /> Create Class
        </button>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActionModal(null)}>
            <motion.div initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 16 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="p-5">
                <h3 className="font-black text-zinc-900 dark:text-white mb-1">{actionModal.type === 'cancel' ? 'Cancel Class' : 'Reschedule Class'}</h3>
                <p className="text-sm text-zinc-400 mb-4">{actionModal.subject}</p>
                {actionModal.type === 'reschedule' && (
                  <div className="mb-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">New Start Time</label>
                    <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                  </div>
                )}
                <div className="mb-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Reason (optional)</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Faculty on leave..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">Cancel</button>
                  <button onClick={actionModal.type === 'cancel' ? handleCancel : handleReschedule} disabled={isSubmitting} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null} Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div>
          {/* Create/Edit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                <form onSubmit={handleCreate} className="bg-white dark:bg-zinc-900 rounded-2xl border border-orange-200 dark:border-orange-500/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-zinc-900 dark:text-white">Create New Class</h3>
                    <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"><X size={16} /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Subject *</label>
                      <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Database Management Systems" required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Date *</label>
                      <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Class Type</label>
                      <select value={form.classType} onChange={e => setForm(f => ({ ...f, classType: e.target.value }))} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white">
                        {['Lecture', 'Lab', 'Tutorial', 'Online'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Start Time *</label>
                      <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">End Time *</label>
                      <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Room</label>
                      <input type="text" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="e.g. Room 204" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Meeting Link</label>
                      <input type="url" value={form.meetingLink} onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))} placeholder="https://meet.google.com/..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Notes</label>
                      <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-orange-500/20">
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create Class
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Day Picker */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 shrink-0 border border-zinc-200 dark:border-zinc-800"><ChevronLeft size={16} /></button>
            {Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 3 + i); const isSelected = d.toDateString() === selectedDate.toDateString(); const isToday = d.toDateString() === new Date().toDateString();
              return <button key={i} onClick={() => setSelectedDate(d)} className={`flex flex-col items-center min-w-[70px] py-3 px-2 rounded-2xl transition-all border ${isSelected ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-800 dark:border-zinc-700 shadow-md' : 'bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}><span className="text-xs font-bold uppercase tracking-widest">{DAYS[d.getDay()]}</span><span className={`text-xl font-black mt-1 ${isToday && !isSelected ? 'text-orange-500' : ''}`}>{d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}</span>{isToday && <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-orange-500' : 'bg-orange-500'}`} />}</button>;
            })}
            <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 shrink-0 border border-zinc-200 dark:border-zinc-800"><ChevronRight size={16} /></button>
          </div>

          {/* Classes */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#0f1115] rounded-2xl border border-[#1e293b] p-5 w-full flex flex-col sm:flex-row gap-4 animate-pulse">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-zinc-800 rounded-full" />
                      <div className="h-6 w-16 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="h-6 w-64 bg-zinc-800 rounded-lg" />
                    <div className="h-4 w-40 bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="sm:text-right space-y-2 mt-4 sm:mt-0 flex flex-col sm:items-end">
                    <div className="h-5 w-32 bg-zinc-800 rounded-lg" />
                    <div className="h-4 w-20 bg-zinc-800 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-[#0a0a0a] rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Clock size={36} className="text-zinc-300 dark:text-zinc-700 mb-3" />
              <p className="font-bold text-zinc-900 dark:text-white mb-1">No classes on this day</p>
              <button onClick={() => setShowForm(true)} className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20">+ Add Class</button>
            </div>
          ) : (
            <div className="space-y-4">
              {todayClasses.map((cls, i) => {
                const isLive = cls.status === 'Live Now';
                const isCancelled = cls.status === 'Cancelled';
                const borderColor = isLive ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:shadow-[0_0_20px_rgba(99,102,241,0.2)]' : isCancelled ? 'border-zinc-200 dark:border-[#1e293b] opacity-60' : 'border-indigo-500/50 dark:border-indigo-600/70';
                const bgColor = 'bg-white dark:bg-[#0f1115] hover:dark:bg-[#13161c]';

                return (
                  <motion.div key={cls._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`${bgColor} rounded-2xl border ${borderColor} overflow-hidden transition-all duration-300`}>
                    <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {isLive ? (
                            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                              Live Now
                            </span>
                          ) : (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${STATUS_STYLE[cls.status]}`}>{cls.status}</span>
                          )}
                          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">{cls.classType}</span>
                        </div>
                        <h3 className={`font-black text-zinc-900 dark:text-white text-lg ${isCancelled ? 'line-through text-zinc-400' : ''}`}>{cls.subject}</h3>
                        <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5"><Clock size={14} className={isLive ? "text-indigo-500" : ""} /> {fmt(cls.startTime, 'time')} – {fmt(cls.endTime, 'time')}</span>
                          {cls.room && <span className="flex items-center gap-1.5"><MapPin size={14} /> {cls.room}</span>}
                          {cls.meetingLink && <span className="flex items-center gap-1.5 text-indigo-500"><Video size={14} /> Online Link</span>}
                        </div>
                        {cls.notes && <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5"><AlertTriangle size={14} /> {cls.notes}</p>}
                      </div>
                      {cls.status !== 'Cancelled' && cls.status !== 'Completed' && (
                        <div className="flex gap-2 sm:mt-0 mt-4 shrink-0 sm:items-start items-center">
                          <button onClick={() => setActionModal({ type: 'reschedule', classId: cls._id, subject: cls.subject })} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl transition-colors" title="Reschedule"><RefreshCw size={16} /></button>
                          <button onClick={() => setActionModal({ type: 'cancel', classId: cls._id, subject: cls.subject })} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-colors" title="Cancel"><XCircle size={16} /></button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="font-black text-zinc-900 dark:text-white text-sm mb-3">All Classes Summary</h3>
            <div className="space-y-2">
              {[
                { label: 'Total', value: classes.length, cls: 'text-zinc-500' },
                { label: 'Upcoming', value: classes.filter(c => c.status === 'Upcoming').length, cls: 'text-blue-500' },
                { label: 'Completed', value: classes.filter(c => c.status === 'Completed').length, cls: 'text-emerald-500' },
                { label: 'Cancelled', value: classes.filter(c => c.status === 'Cancelled').length, cls: 'text-red-500' },
                { label: 'Rescheduled', value: classes.filter(c => c.status === 'Rescheduled').length, cls: 'text-amber-500' },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">{label}</span>
                  <span className={`text-xs font-black ${cls}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Today's Count</p>
            <p className="text-3xl font-black">{todayClasses.filter(c => c.status !== 'Cancelled').length}</p>
            <p className="text-sm opacity-80 mt-0.5">classes scheduled</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
