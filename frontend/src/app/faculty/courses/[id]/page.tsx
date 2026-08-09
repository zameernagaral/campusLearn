'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { use, useState } from 'react';
import { Upload, X, FileText, File } from 'lucide-react';
import toast from 'react-hot-toast';
import { moduleAPI } from '@/lib/api';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return toast.error('Please select a PDF file.');
    setIsUploading(true);
    try {
      // In a real integration, we'd use FormData with moduleAPI.createDocumentLesson
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notes uploaded successfully!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
    } catch {
      toast.error('Failed to upload notes.');
    } finally {
      setIsUploading(false);
    }
  };

  // Mock data for the specific course
  const course = {
    id: unwrappedParams.id,
    title: 'Machine Learning Fundamentals',
    subjectCode: 'CS601',
    credits: 4,
    enrolled: 45,
    status: 'PUBLISHED',
    description: 'Learn Machine Learning from scratch with hands-on projects. We cover regression, classification, neural networks, and more.',
  };

  const sections = [
    { title: 'Week 1: Introduction to ML', modules: 3 },
    { title: 'Week 2: Linear Regression', modules: 4 },
    { title: 'Week 3: Neural Networks', modules: 5 },
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ← Back to Courses
        </button>

        <div className="bg-white dark:bg-zinc-950 p-6 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                  {course.subjectCode}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  {course.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                {course.title}
              </h1>
            </div>
            
            <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
              Edit Course
            </button>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-10">
            {course.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enrolled Students</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.enrolled}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Course Credits</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.credits}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Assignments</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">4</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Modules</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">12</span>
            </div>
          </div>
        </div>

        {/* Course Content Management */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Course Content</h2>
          <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-widest">
            + Add Section
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-orange-500/30 transition-colors"
            >
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1">
                  {section.title}
                </h3>
                <p className="text-xs font-medium text-zinc-500">{section.modules} Modules</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setSelectedSection(section.title); setShowUploadModal(true); }}
                  className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-white hover:bg-orange-500 transition-colors border border-orange-500/20 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-500/10"
                >
                  <FileText size={16} /> Upload Notes
                </button>
                <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  Manage
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Notes Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Upload size={20} className="text-orange-500" />
                Upload PDF Notes
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>
            
            <p className="text-sm text-zinc-500 mb-6">
              Uploading notes for: <span className="font-semibold text-zinc-900 dark:text-white">{selectedSection}</span>
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
                <input 
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Chapter 1 Summary"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">PDF File</label>
                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                  {uploadFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <File size={32} className="text-orange-500" />
                      <span className="text-sm font-medium text-zinc-900 dark:text-white truncate max-w-[200px]">{uploadFile.name}</span>
                      <span className="text-xs text-zinc-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">Click to browse or drag and drop</span>
                      <span className="text-xs text-zinc-500">PDF files only (max 10MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-4 flex justify-center items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : 'Upload Notes'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
