'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { assignmentAPI, courseAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { File } from 'lucide-react';
import type { Course } from '@/types';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    maxMarks: '100',
  });
  const [attachments, setAttachments] = useState<globalThis.File[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseAPI.getAll();
        setCourses(data.data || data || []);
      } catch (error) {
        toast.error('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course) {
      toast.error('Please select a course');
      return;
    }
    
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('course', formData.course);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dueDate', formData.dueDate);
      formDataToSend.append('maxMarks', formData.maxMarks);
      formDataToSend.append('isPublished', 'true');
      
      attachments.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      await assignmentAPI.create(formDataToSend);
      toast.success('Assignment created successfully!');
      router.push('/faculty/assignments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Assignment</h1>
            <p className="text-sm mt-0.5 text-zinc-500">Assign a new task to your students</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Assignment Title</label>
              <input 
                required
                type="text"
                placeholder="e.g. Build a Neural Network"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Course</label>
              <select
                required
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium appearance-none"
              >
                <option value="" disabled>Select a course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title} ({course.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Due Date</label>
                <input 
                  required
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Max Marks</label>
                <input 
                  required
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={formData.maxMarks}
                  onChange={e => setFormData({ ...formData, maxMarks: e.target.value })}
                  className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description & Instructions</label>
              <textarea 
                required
                rows={5}
                placeholder="Provide detailed instructions for the assignment..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachments(Array.from(e.target.files));
                    }
                  }}
                />
                {attachments.length > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <File size={32} className="text-orange-500" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {attachments.length} file{attachments.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <File size={24} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Click to browse or drag and drop</span>
                    <span className="text-xs text-zinc-500">Any file type (max 5 files, 50MB each)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
