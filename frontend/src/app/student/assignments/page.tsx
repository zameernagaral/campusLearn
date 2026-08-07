'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { assignmentAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle, AlertTriangle, Upload, FileText } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { Assignment } from '@/types';
import toast from 'react-hot-toast';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    assignmentAPI.getAll().then(res => {
      setAssignments(res.data.data || []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      await assignmentAPI.submit(selectedAssignment._id, formData);
      toast.success('Assignment submitted successfully! 🎉');
      setSelectedAssignment(null);
      setContent('');
    } catch { toast.error('Submission failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const getDueStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (diff < 0) return { label: 'Overdue', color: '#ef4444', icon: <AlertTriangle size={12} /> };
    if (hours < 24) return { label: 'Due today!', color: '#f59e0b', icon: <Clock size={12} /> };
    if (hours < 72) return { label: 'Due soon', color: '#f97316', icon: <Clock size={12} /> };
    return { label: `Due ${formatDate(dueDate)}`, color: 'var(--muted)', icon: <Clock size={12} /> };
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Assignments</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Track and submit your assignments</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'var(--surface-2)' }}>
        {(['all', 'pending', 'submitted'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: filter === t ? 'var(--card)' : 'transparent',
              color: filter === t ? 'var(--primary)' : 'var(--muted)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assignment cards */}
      {isLoading ? (
        <div className="space-y-4">{Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : assignments.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20">
          <ClipboardList size={56} className="mb-4 opacity-20" style={{ color: 'var(--muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>No assignments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment, i) => {
            const status = getDueStatus(assignment.dueDate);
            return (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(99,102,241,0.1)' }}>
                      <FileText size={22} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{assignment.title}</h3>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                        {typeof assignment.course === 'object' ? (assignment.course as { title?: string })?.title : 'Course'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs" style={{ color: status.color }}>
                          {status.icon} {status.label}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--subtle)' }}>Max: {assignment.maxMarks} marks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="btn btn-primary text-sm px-4 py-2"
                    >
                      <Upload size={14} /> Submit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl p-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Submit Assignment</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{selectedAssignment.title}</p>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your answer or describe your submitted work here..."
              rows={5}
              className="w-full p-3 rounded-xl text-sm resize-none outline-none mb-4"
              style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
            />

            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
              💡 You can also upload files. For now, paste your code or answer in the text area.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setSelectedAssignment(null)} className="btn btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting || !content.trim()} className="btn btn-primary flex-1 text-sm">
                {submitting ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</span> : 'Submit Assignment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
