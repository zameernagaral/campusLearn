'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Plus, BookOpen, Dumbbell, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calendarAPI } from '@/lib/api';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENT_STYLE: Record<string, { dot: string; pill: string; icon: typeof BookOpen }> = {
  exam:    { dot: 'bg-red-500',    pill: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',    icon: AlertCircle },
  class:   { dot: 'bg-blue-500',   pill: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', icon: BookOpen },
  event:   { dot: 'bg-orange-500', pill: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', icon: Dumbbell },
  default: { dot: 'bg-zinc-400',   pill: 'bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600',    icon: CalendarIcon },
};

const MOCK_EVENTS = [
  { _id: 'e1', title: 'DBMS End Sem Exam', type: 'exam',  startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 9, 0).toISOString(),  location: 'Hall A' },
  { _id: 'e2', title: 'DSA Lab Session',   type: 'class', startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 10, 0).toISOString(), location: 'CS Lab 2' },
  { _id: 'e3', title: 'Tech Fest 2025',    type: 'event', startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11, 0).toISOString(), location: 'Auditorium' },
  { _id: 'e4', title: 'OS Mid Term',       type: 'exam',  startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 9, 30).toISOString(), location: 'Hall B' },
  { _id: 'e5', title: 'Networks Tutorial', type: 'class', startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 14, 14, 0).toISOString(), location: 'Room 301' },
  { _id: 'e6', title: 'Industry Talk',     type: 'event', startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 15, 0).toISOString(), location: 'Seminar Hall' },
];

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await calendarAPI.getAll();
        const data = res.data?.data || res.data || [];
        setEvents(Array.isArray(data) && data.length > 0 ? data : MOCK_EVENTS);
      } catch {
        setEvents(MOCK_EVENTS);
        toast.error('Using demo events');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToday  = () => { setCurrentDate(new Date()); setSelectedDay(null); };

  const getEventsForDay = (day: number) =>
    events.filter(e => {
      const d = new Date(e.startTime);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  const upcomingEvents = events
    .filter(e => new Date(e.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 6);

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  // Build calendar cells: leading blanks + days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <DashboardLayout requiredRole="student">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarIcon size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Academic Calendar</h1>
          </div>
          <p className="text-sm text-zinc-500">Track your classes, exams and events</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl">
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{events.length} events this semester</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* ── Calendar Panel ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              {MONTH_NAMES[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                <ChevronLeft size={18} />
              </button>
              <button onClick={goToday} className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-xs font-bold text-zinc-600 dark:text-zinc-300">
                Today
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-2.5 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          {isLoading ? (
            <div className="p-6 grid grid-cols-7 gap-1">
              {Array(35).fill(null).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 border-l border-t border-zinc-100 dark:border-zinc-800">
              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`blank-${idx}`} className="min-h-[80px] border-b border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20" />;
                }
                const dayEvts = getEventsForDay(day);
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`min-h-[80px] border-b border-r border-zinc-100 dark:border-zinc-800 p-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                      isSelected ? 'bg-orange-50 dark:bg-orange-500/10' : ''
                    }`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 ${
                      isToday ? 'bg-orange-500 text-white shadow-sm' :
                      isSelected ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                      'text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvts.slice(0, 2).map(e => {
                        const style = EVENT_STYLE[e.type] ?? EVENT_STYLE.default;
                        return (
                          <div key={e._id} className={`text-[9px] px-1.5 py-0.5 rounded-md truncate font-semibold border ${style.pill}`}>
                            {e.title}
                          </div>
                        );
                      })}
                      {dayEvts.length > 2 && (
                        <p className="text-[9px] text-zinc-400 font-semibold pl-1">+{dayEvts.length - 2} more</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-zinc-100 dark:border-zinc-800">
            {Object.entries(EVENT_STYLE).filter(([k]) => k !== 'default').map(([type, s]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-xs text-zinc-400 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Selected day events */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-orange-200 dark:border-orange-500/30 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 bg-orange-50 dark:bg-orange-500/10 border-b border-orange-100 dark:border-orange-500/20">
                  <p className="text-sm font-black text-orange-600 dark:text-orange-400">
                    {MONTH_NAMES[month]} {selectedDay}
                  </p>
                  <p className="text-xs text-orange-400 dark:text-orange-500">{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="p-4 space-y-3">
                  {selectedEvents.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-2">No events on this day.</p>
                  ) : selectedEvents.map(event => {
                    const style = EVENT_STYLE[event.type] ?? EVENT_STYLE.default;
                    const Icon = style.icon;
                    return (
                      <div key={event._id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.pill} border`}>
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 dark:text-white text-sm leading-snug truncate">{event.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">{fmtTime(event.startTime)}</p>
                          {event.location && <p className="text-xs text-zinc-400 flex items-center gap-1"><MapPin size={10} />{event.location}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-black text-zinc-900 dark:text-white text-sm">Upcoming Events</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Next scheduled activities</p>
            </div>
            <div className="p-4 space-y-3">
              {isLoading ? (
                Array(4).fill(null).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon size={28} className="text-zinc-200 dark:text-zinc-700 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">No upcoming events</p>
                </div>
              ) : upcomingEvents.map((event, i) => {
                const style = EVENT_STYLE[event.type] ?? EVENT_STYLE.default;
                const Icon = style.icon;
                return (
                  <motion.div key={event._id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${style.pill}`}>
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-zinc-900 dark:text-white text-xs leading-snug truncate">{event.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {fmtDate(event.startTime)} · {fmtTime(event.startTime)}
                      </p>
                      {event.location && (
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {event.location}
                        </p>
                      )}
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
            <h3 className="font-black text-zinc-900 dark:text-white text-sm mb-3">This Month</h3>
            <div className="space-y-2">
              {(['exam','class','event'] as const).map(type => {
                const count = events.filter(e => {
                  const d = new Date(e.startTime);
                  return e.type === type && d.getMonth() === month && d.getFullYear() === year;
                }).length;
                const style = EVENT_STYLE[type];
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className="text-xs text-zinc-500 capitalize">{type}s</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
