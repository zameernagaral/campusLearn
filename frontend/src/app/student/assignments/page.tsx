'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { assignmentAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Clock, CheckCircle, AlertTriangle, Upload, FileText,
  X, Eye, Download, Loader2, Award, ArrowLeft
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Assignment } from '@/types';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import {
  PageHeaderSkeleton, FilterTabsSkeleton, AssignmentCardSkeleton
} from '@/components/shared/Skeleton';

type SubmissionStatus = 'pending' | 'submitted' | 'graded';

interface AssignmentWithStatus extends Assignment {
  submissionStatus: SubmissionStatus;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
}

const MOCK_ASSIGNMENTS: AssignmentWithStatus[] = [
  {
    _id: 'mock-1',
    title: 'DBMS Normalization Assignment',
    description: 'Write a detailed report explaining 1NF, 2NF, 3NF, and BCNF with examples. Include at least 3 real-world database schema examples and show step-by-step normalization for each.',
    course: { _id: 'c1', title: 'Database Management Systems' } as Assignment['course'],
    faculty: { _id: 'f1', name: 'Dr. Sharma' } as Assignment['faculty'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    maxMarks: 20,
    attachments: [{ name: 'normalization_template.pdf', url: '#' }],
    isPublished: true,
    allowLateSubmission: false,
    createdAt: new Date().toISOString(),
    submissionStatus: 'pending',
  },
  {
    _id: 'mock-2',
    title: 'Operating Systems – Process Scheduling',
    description: 'Implement and compare FCFS, SJF, and Round Robin scheduling algorithms. Submit source code and a comparison report with average waiting time calculations.',
    course: { _id: 'c2', title: 'Operating Systems' } as Assignment['course'],
    faculty: { _id: 'f2', name: 'Prof. Mehta' } as Assignment['faculty'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    maxMarks: 25,
    attachments: [],
    isPublished: true,
    allowLateSubmission: true,
    createdAt: new Date().toISOString(),
    submissionStatus: 'pending',
  },
  {
    _id: 'mock-3',
    title: 'Data Structures – Binary Search Tree',
    description: 'Implement a BST with insert, delete, and search operations. Include time complexity analysis and sample test cases.',
    course: { _id: 'c3', title: 'Data Structures & Algorithms' } as Assignment['course'],
    faculty: { _id: 'f3', name: 'Dr. Patel' } as Assignment['faculty'],
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    maxMarks: 15,
    attachments: [{ name: 'bst_requirements.pdf', url: '#' }],
    isPublished: true,
    allowLateSubmission: false,
    createdAt: new Date().toISOString(),
    submissionStatus: 'graded',
    grade: 13,
    feedback: 'Good implementation. Improve edge case handling for duplicate nodes.',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function storageKey(userId: string) {
  return `assignmentSubmissions_${userId}`;
}

function loadLocalSubmissions(userId: string): Record<string, Partial<AssignmentWithStatus>> {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalSubmission(userId: string, assignmentId: string, data: Partial<AssignmentWithStatus>) {
  const existing = loadLocalSubmissions(userId);
  existing[assignmentId] = { ...existing[assignmentId], ...data };
  localStorage.setItem(storageKey(userId), JSON.stringify(existing));
}

export default function StudentAssignmentsPage() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState<AssignmentWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [viewAssignment, setViewAssignment] = useState<AssignmentWithStatus | null>(null);
  const [submitAssignment, setSubmitAssignment] = useState<AssignmentWithStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const mergeWithLocalStatus = useCallback((items: Assignment[], userId: string): AssignmentWithStatus[] => {
    const local = loadLocalSubmissions(userId);
    return items.map(a => {
      const localData = local[a._id];
      const mockMatch = MOCK_ASSIGNMENTS.find(m => m._id === a._id);
      return {
        ...a,
        submissionStatus: localData?.submissionStatus ?? mockMatch?.submissionStatus ?? 'pending',
        grade: localData?.grade ?? mockMatch?.grade,
        feedback: localData?.feedback ?? mockMatch?.feedback,
        submittedAt: localData?.submittedAt ?? mockMatch?.submittedAt,
      };
    });
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const res = await assignmentAPI.getAll();
        const data: Assignment[] = res.data?.data || res.data || [];
        if (data.length > 0) {
          setAssignments(mergeWithLocalStatus(data, user?._id || 'guest'));
        } else {
          const local = user?._id ? loadLocalSubmissions(user._id) : {};
          setAssignments(MOCK_ASSIGNMENTS.map(m => ({
            ...m,
            ...local[m._id],
            submissionStatus: local[m._id]?.submissionStatus ?? m.submissionStatus,
          })));
        }
      } catch {
        const local = user?._id ? loadLocalSubmissions(user._id) : {};
        setAssignments(MOCK_ASSIGNMENTS.map(m => ({
          ...m,
          ...local[m._id],
          submissionStatus: local[m._id]?.submissionStatus ?? m.submissionStatus,
        })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [user?._id, mergeWithLocalStatus]);

  const handleSubmit = async () => {
    if (!submitAssignment) return;
    if (!content.trim() && !file) {
      toast.error('Please write an answer or attach a file.');
      return;
    }

    setSubmitting(true);
    const submittedAt = new Date().toISOString();

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (file) formData.append('files', file);
      await assignmentAPI.submit(submitAssignment._id, formData);

      setAssignments(prev => prev.map(a =>
        a._id === submitAssignment._id
          ? { ...a, submissionStatus: 'submitted' as const, submittedAt }
          : a
      ));
      if (user?._id) {
        saveLocalSubmission(user._id, submitAssignment._id, { submissionStatus: 'submitted', submittedAt });
      }
      toast.success('Assignment submitted successfully!');
    } catch {
      setAssignments(prev => prev.map(a =>
        a._id === submitAssignment._id
          ? { ...a, submissionStatus: 'submitted' as const, submittedAt }
          : a
      ));
      if (user?._id) {
        saveLocalSubmission(user._id, submitAssignment._id, { submissionStatus: 'submitted', submittedAt });
      }
      toast.success('Assignment saved locally (offline mode).');
    } finally {
      setSubmitting(false);
      setSubmitAssignment(null);
      setContent('');
      setFile(null);
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const isDone = a.submissionStatus === 'submitted' || a.submissionStatus === 'graded';
    if (filter === 'all') return true;
    if (filter === 'pending') return !isDone;
    if (filter === 'submitted') return isDone;
    return true;
  });

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => a.submissionStatus === 'pending').length,
    submitted: assignments.filter(a => a.submissionStatus !== 'pending').length,
  };

  const getDueStatus = (dueDate: string, status: SubmissionStatus) => {
    if (status !== 'pending') return null;
    const diff = new Date(dueDate).getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (diff < 0) return { label: 'Overdue', color: 'text-red-500', icon: AlertTriangle };
    if (hours < 24) return { label: 'Due today!', color: 'text-amber-500', icon: Clock };
    if (hours < 72) return { label: 'Due soon', color: 'text-orange-500', icon: Clock };
    return { label: `Due ${formatDate(dueDate)}`, color: 'text-zinc-500', icon: Clock };
  };

  const getCourseTitle = (course: Assignment['course']) =>
    typeof course === 'object' && course !== null ? (course as { title?: string }).title ?? 'Course' : 'Course';

  const getFacultyName = (faculty: Assignment['faculty']) =>
    typeof faculty === 'object' && faculty !== null ? (faculty as { name?: string }).name ?? 'Faculty' : 'Faculty';

  return (
    <DashboardLayout requiredRole="student">
      {isLoading ? (
        <>
          <PageHeaderSkeleton />
          <FilterTabsSkeleton />
          <div className="space-y-4">
            {Array(4).fill(null).map((_, i) => <AssignmentCardSkeleton key={i} />)}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Assignments</h1>
              <p className="text-sm mt-0.5 text-zinc-500">Track and submit your coursework</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm font-bold">
              <span className="text-orange-500">{counts.pending} pending</span>
              <span className="text-emerald-500">{counts.submitted} done</span>
            </div>
          </div>

          <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit bg-zinc-100 dark:bg-zinc-800/50">
            {(['all', 'pending', 'submitted'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize ${
                  filter === t
                    ? 'bg-white dark:bg-zinc-900 text-orange-500 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {t} ({counts[t]})
              </button>
            ))}
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900/40 flex flex-col items-center justify-center py-20 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <ClipboardList size={56} className="mb-4 text-zinc-300 dark:text-zinc-600" />
              <p className="font-bold text-zinc-900 dark:text-white">No {filter === 'all' ? '' : filter} assignments</p>
              <p className="text-sm text-zinc-500 mt-1">
                {filter === 'pending' ? 'Great job — you\'re all caught up!' : 'Check back later for new assignments.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment, i) => {
                const due = getDueStatus(assignment.dueDate, assignment.submissionStatus);
                const DueIcon = due?.icon ?? Clock;
                const isDone = assignment.submissionStatus !== 'pending';
                const isGraded = assignment.submissionStatus === 'graded';

                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                          <FileText size={22} className="text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-zinc-900 dark:text-white">{assignment.title}</h3>
                            {isGraded && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <Award size={12} /> {assignment.grade}/{assignment.maxMarks}
                              </span>
                            )}
                            {assignment.submissionStatus === 'submitted' && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <CheckCircle size={12} /> Submitted
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-0.5 text-zinc-500 truncate">
                            {getCourseTitle(assignment.course)} · {getFacultyName(assignment.faculty)}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {due && (
                              <span className={`flex items-center gap-1 text-xs font-medium ${due.color}`}>
                                <DueIcon size={12} /> {due.label}
                              </span>
                            )}
                            <span className="text-xs text-zinc-400">Max: {assignment.maxMarks} marks</span>
                            {assignment.submittedAt && (
                              <span className="text-xs text-zinc-400">Submitted {formatDate(assignment.submittedAt)}</span>
                            )}
                          </div>
                          {isGraded && assignment.feedback && (
                            <p className="text-xs text-zinc-500 mt-2 italic line-clamp-1">&ldquo;{assignment.feedback}&rdquo;</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setViewAssignment(assignment)}
                          className="py-2 px-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Eye size={14} /> View
                        </button>
                        {!isDone ? (
                          <button
                            onClick={() => { setSubmitAssignment(assignment); setContent(''); setFile(null); }}
                            className="py-2 px-4 text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                          >
                            <Upload size={14} /> Submit
                          </button>
                        ) : (
                          <button
                            disabled
                            className="py-2 px-4 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-xl flex items-center gap-1.5 cursor-not-allowed"
                          >
                            <CheckCircle size={14} /> Done
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* View Detail Modal */}
      <AnimatePresence>
        {viewAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh] bg-zinc-950/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setViewAssignment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{viewAssignment.title}</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      {getCourseTitle(viewAssignment.course)} · {getFacultyName(viewAssignment.faculty)}
                    </p>
                  </div>
                  <button onClick={() => setViewAssignment(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{viewAssignment.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <p className="text-xs text-zinc-400 font-bold">Due Date</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{formatDate(viewAssignment.dueDate)}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <p className="text-xs text-zinc-400 font-bold">Max Marks</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{viewAssignment.maxMarks}</p>
                  </div>
                </div>
                {viewAssignment.attachments?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Attachments</p>
                    {viewAssignment.attachments.map(att => (
                      <div key={att.name} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                          <FileText size={14} className="text-orange-500" /> {att.name}
                        </span>
                        <button className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
                          <Download size={12} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {viewAssignment.submissionStatus === 'graded' && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Grade</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{viewAssignment.grade}/{viewAssignment.maxMarks}</p>
                    {viewAssignment.feedback && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{viewAssignment.feedback}</p>
                    )}
                  </div>
                )}
                {viewAssignment.submissionStatus === 'pending' && (
                  <button
                    onClick={() => { setViewAssignment(null); setSubmitAssignment(viewAssignment); setContent(''); setFile(null); }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <Upload size={16} /> Submit Assignment
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <AnimatePresence>
        {submitAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh] bg-zinc-950/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => !submitting && setSubmitAssignment(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6"
            >
              <button
                onClick={() => !submitting && setSubmitAssignment(null)}
                className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Submit Assignment</h2>
              <p className="text-sm text-zinc-500 mb-6">{submitAssignment.title}</p>

              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Your Answer</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your answer or describe your submitted work..."
                rows={5}
                className="w-full p-4 rounded-2xl text-sm resize-none outline-none mb-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
              />

              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Attach File</label>
              <div className={`mb-6 p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                file ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-orange-300'
              }`}>
                <Upload size={20} className={file ? 'text-orange-500' : 'text-zinc-400'} />
                <p className={`text-sm font-medium ${file ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                  {file ? file.name : 'Upload a file (optional if answer provided)'}
                </p>
                {!file && <p className="text-xs text-zinc-400">PDF, DOCX, ZIP — Max 10 MB</p>}
                <input type="file" className="hidden" id="assignment-file" accept=".pdf,.doc,.docx,.zip,.txt" onChange={e => setFile(e.target.files?.[0] || null)} />
                <label htmlFor="assignment-file" className="mt-2 py-1.5 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                  {file ? 'Change File' : 'Choose File'}
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSubmitAssignment(null); setFile(null); setContent(''); }}
                  disabled={submitting}
                  className="flex-1 py-3 text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || (!content.trim() && !file)}
                  className="flex-1 py-3 text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Upload size={16} /> Submit Assignment</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
