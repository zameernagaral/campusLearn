'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { use, useState, useEffect } from 'react';
import { Upload, X, FileText, File } from 'lucide-react';
import toast from 'react-hot-toast';
import { moduleAPI, courseAPI } from '@/lib/api';
import type { Course } from '@/types';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  const fetchCourse = async () => {
    try {
      const { data } = await courseAPI.getOne(courseId);
      setCourse(data.data);
    } catch (error) {
      toast.error('Failed to load course details');
      router.push('/faculty/courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId, router]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return toast.error('Please select a PDF file.');
    if (!selectedModuleId) return toast.error('Please select a module.');

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('document', uploadFile);
      formData.append('module', selectedModuleId);
      formData.append('course', courseId);
      formData.append('duration', '0');
      formData.append('isPublished', 'true');

      await moduleAPI.createDocumentLesson(formData);
      
      toast.success('Notes uploaded successfully!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadTitle('');
      fetchCourse();
    } catch {
      toast.error('Failed to upload notes.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return toast.error('Please enter a module title.');

    setIsCreatingModule(true);
    try {
      await moduleAPI.create({
        title: moduleTitle,
        course: courseId,
        order: (course?.modules?.length || 0) + 1,
      });

      toast.success('Module created successfully!');
      setShowAddModuleModal(false);
      setModuleTitle('');
      fetchCourse();
    } catch {
      toast.error('Failed to create module.');
    } finally {
      setIsCreatingModule(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="faculty">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) return null;

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
                  {course.subjectCode || 'N/A'}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                  {course.isPublished ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                {course.title}
              </h1>
            </div>
            
            <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap">
              Edit Course
            </button>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-10">
            {course.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Enrolled Students</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.enrolledStudents?.length || 0}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Course Credits</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.credits}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Assignments</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">0</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Modules</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">{course.modules?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Course Content Management */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Course Content</h2>
          <button 
            onClick={() => setShowAddModuleModal(true)}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-widest"
          >
            + Add Section
          </button>
        </div>

        <div className="space-y-4">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((module, i) => (
              <motion.div 
                key={module._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 group hover:border-orange-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors mb-1">
                      {module.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-500">{module.lessons?.length || 0} Lessons</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { 
                        setSelectedSection(module.title); 
                        setSelectedModuleId(module._id);
                        setShowUploadModal(true); 
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-white hover:bg-orange-500 transition-colors border border-orange-500/20 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-500/10"
                    >
                      <FileText size={16} /> Upload Notes
                    </button>
                    <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      Manage
                    </button>
                  </div>
                </div>

                {module.lessons && module.lessons.length > 0 && (
                  <div className="mt-2 space-y-2 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                    {module.lessons.map((lesson: any, j: number) => (
                      <div key={lesson._id || j} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group/lesson">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center group-hover/lesson:scale-110 transition-transform">
                            {lesson.type === 'document' ? (
                              <FileText size={16} className="text-orange-600 dark:text-orange-400" />
                            ) : (
                              <File size={16} className="text-orange-600 dark:text-orange-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{lesson.title}</p>
                            {lesson.type === 'document' && lesson.documentName && (
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{lesson.documentName}</p>
                            )}
                          </div>
                        </div>
                        {lesson.type === 'document' && lesson.documentUrl && (
                          <a 
                            href={lesson.documentUrl.startsWith('http') ? lesson.documentUrl : `http://localhost:5001/${lesson.documentUrl.replace(/\\/g, '/')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20"
                          >
                            View PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">No modules found for this course.</p>
          )}
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

      {/* Create Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-orange-500" />
                Add New Section
              </h3>
              <button 
                onClick={() => setShowAddModuleModal(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Section Title</label>
                <input 
                  required
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Week 1: Introduction"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-zinc-900 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                disabled={isCreatingModule}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-4 flex justify-center items-center gap-2"
              >
                {isCreatingModule ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : 'Create Section'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
