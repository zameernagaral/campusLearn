'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI, attendanceAPI } from '@/lib/api';
import { Clock, Calendar, Check, X, FileText, Loader2, Search } from 'lucide-react';
import type { Course, User } from '@/types';

export default function FacultyAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present'|'absent'|'late'>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesRes, logsRes] = await Promise.all([
        courseAPI.getAll(),
        attendanceAPI.getAll()
      ]);
      setCourses(coursesRes.data.data);
      setRecentLogs(logsRes.data.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openMarkModal = async (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    setIsStudentsLoading(true);
    setDate(new Date().toISOString().split('T')[0]);
    setTopic('');
    
    try {
      const res = await courseAPI.getStudents(course._id);
      const studentList = res.data.data;
      setStudents(studentList);
      
      // Default everyone to present
      const defaultData: Record<string, 'present'|'absent'|'late'> = {};
      studentList.forEach((s: User) => {
        defaultData[s._id] = 'present';
      });
      setAttendanceData(defaultData);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const handleMark = (studentId: string, status: 'present'|'absent'|'late') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!topic.trim()) {
      return toast.error('Please enter a topic');
    }

    try {
      setIsSubmitting(true);
      const records = Object.entries(attendanceData).map(([student, status]) => ({
        student,
        status
      }));

      await attendanceAPI.mark({
        course: selectedCourse._id,
        date,
        topic,
        records
      });

      toast.success('Attendance marked successfully!');
      setIsModalOpen(false);
      fetchData(); // Refresh logs
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // Calculate overall stats for the dashboard
  const totalStudents = recentLogs.reduce((acc, log) => acc + log.records.length, 0);
  const totalPresent = recentLogs.reduce((acc, log) => acc + log.records.filter((r:any) => r.status === 'present' || r.status === 'late').length, 0);
  const avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Attendance Register</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Mark and manage student attendance for your classes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Your Courses</h2>
          
          <div className="space-y-4">
            {isLoading ? (
               Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-24 rounded-3xl" />)
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-zinc-950 p-8 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">You are not assigned to any courses.</p>
              </div>
            ) : (
              courses.map((course, i) => (
                <motion.div 
                  key={course._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm hover:border-emerald-500/30 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                        {course.level}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                        Active
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm font-medium text-zinc-500">{course.enrolledStudents?.length || 0} Students Enrolled</p>
                  </div>
                  
                  <button 
                    onClick={() => openMarkModal(course)}
                    className="px-8 py-3.5 font-bold rounded-xl transition-all text-sm whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  >
                    Mark Attendance
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Logs Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Logs</h2>
          
          <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Average</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">{avgAttendance}</span>
                    <span className="text-lg font-bold text-zinc-500">%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(null).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)
                ) : recentLogs.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">No recent attendance records.</p>
                ) : (
                  recentLogs.map((log) => {
                    const presentCount = log.records.filter((r:any) => r.status === 'present' || r.status === 'late').length;
                    return (
                      <div key={log._id} className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-0.5">{log.course?.title || 'Unknown Course'}</p>
                          <p className="text-xs font-medium text-zinc-500">{formatDate(log.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">
                            {presentCount}<span className="text-zinc-500">/{log.records.length}</span>
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Present</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Mark Attendance</h2>
                  <p className="text-sm text-zinc-500">{selectedCourse.title}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm border border-zinc-200 dark:border-zinc-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="attendance-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Topic Covered</label>
                      <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Introduction to React"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Student Roster</label>
                      <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-2 py-1 rounded-md">
                        {students.length} Total
                      </span>
                    </div>

                    {isStudentsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      </div>
                    ) : students.length === 0 ? (
                      <div className="text-center p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <p className="text-zinc-500 text-sm">No students enrolled in this course.</p>
                      </div>
                    ) : (
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                        {students.map((student, idx) => (
                          <div 
                            key={student._id} 
                            className={`p-4 flex items-center justify-between sm:gap-4 flex-wrap gap-y-3 ${
                              idx !== students.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/60' : ''
                            } hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 text-sm border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{student.name}</p>
                                <p className="text-xs font-medium text-zinc-500">{student.email}</p>
                              </div>
                            </div>

                            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleMark(student._id, 'present')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                  attendanceData[student._id] === 'present' 
                                    ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMark(student._id, 'late')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                  attendanceData[student._id] === 'late' 
                                    ? 'bg-white dark:bg-zinc-800 text-orange-500 shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMark(student._id, 'absent')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                                  attendanceData[student._id] === 'absent' 
                                    ? 'bg-white dark:bg-zinc-800 text-red-500 shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="attendance-form"
                  disabled={isSubmitting || students.length === 0}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Save Register
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
