'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layers, CheckCircle, Clock, BookOpen, AlertCircle, Plus, Send, Edit2, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FacultyExamPortionsPage() {
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', code: '', examType: 'Custom Exam', date: '' });
  
  const [addingPortionFor, setAddingPortionFor] = useState<number | null>(null);
  const [newPortionTitle, setNewPortionTitle] = useState('');

  const [editingPortion, setEditingPortion] = useState<{ courseId: number, moduleIndex: number, title: string } | null>(null);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.name || !newExam.code || !newExam.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCourses([
      ...courses,
      {
        id: Math.random(),
        name: newExam.name,
        code: newExam.code,
        examType: newExam.examType,
        date: newExam.date,
        totalModules: 0,
        completedModules: 0,
        portions: [],
        published: false
      }
    ]);
    setIsCreatingExam(false);
    setNewExam({ name: '', code: '', examType: 'Custom Exam', date: '' });
    toast.success('Custom exam created successfully!');
  };

  const handleAddPortion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortionTitle || addingPortionFor === null) return;
    
    setCourses(courses.map(course => {
      if (course.id === addingPortionFor) {
        return {
          ...course,
          portions: [...course.portions, { title: newPortionTitle, status: 'Pending' }],
          totalModules: course.totalModules + 1
        };
      }
      return course;
    }));
    
    setAddingPortionFor(null);
    setNewPortionTitle('');
    toast.success('New portion added successfully!');
  };

  const handleEditPortion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortion || !editingPortion.title) return;
    
    setCourses(courses.map(course => {
      if (course.id === editingPortion.courseId) {
        const newPortions = [...course.portions];
        newPortions[editingPortion.moduleIndex].title = editingPortion.title;
        return { ...course, portions: newPortions };
      }
      return course;
    }));
    
    setEditingPortion(null);
    toast.success('Portion updated successfully!');
  };

 const [courses, setCourses] = useState([
 {
 id: 1,
 name: 'Database Management Systems',
 code: 'CS401',
 examType: 'Midterm 2',
 date: 'Oct 15, 2026',
 totalModules: 5,
 completedModules: 3,
 portions: [
 { title: 'Module 1: Intro to DBMS', status: 'Completed' },
 { title: 'Module 2: ER Modeling', status: 'Completed' },
 { title: 'Module 3: Relational Algebra & SQL', status: 'Completed' },
 { title: 'Module 4: Normalization', status: 'In Progress' },
 { title: 'Module 5: Transaction Management', status: 'Pending' },
 ],
 published: true
 },
 {
 id: 2,
 name: 'Computer Networks',
 code: 'CS402',
 examType: 'Midterm 2',
 date: 'Oct 18, 2026',
 totalModules: 5,
 completedModules: 2,
 portions: [
 { title: 'Module 1: Physical Layer', status: 'Completed' },
 { title: 'Module 2: Data Link Layer', status: 'Completed' },
 { title: 'Module 3: Network Layer', status: 'In Progress' },
 { title: 'Module 4: Transport Layer', status: 'Pending' },
 { title: 'Module 5: Application Layer', status: 'Pending' },
 ],
 published: false
 }
 ]);

 const toggleModuleStatus = (courseId: number, moduleIndex: number) => {
 setCourses(courses.map(course => {
 if (course.id === courseId) {
 const newPortions = [...course.portions];
 const current = newPortions[moduleIndex].status;
 const nextStatus = current === 'Pending' ? 'In Progress' : current === 'In Progress' ? 'Completed' : 'Pending';
 newPortions[moduleIndex].status = nextStatus;
 
 const completed = newPortions.filter(p => p.status === 'Completed').length;
 return { ...course, portions: newPortions, completedModules: completed };
 }
 return course;
 }));
 };

 const handlePublish = (courseId: number) => {
 setCourses(courses.map(course => {
 if (course.id === courseId) {
 toast.success(`Portions published for ${course.name}! Students notified.`);
 return { ...course, published: true };
 }
 return course;
 }));
 };

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Exam Portions Management</h1>
 <p className="text-muted mt-1">Track syllabus coverage and publish portions for upcoming exams</p>
 <button onClick={() => setIsCreatingExam(true)} className="btn btn-primary flex items-center gap-2 shadow-lg shadow-orange-500/20 mt-4"><Plus size={18} /> Create Custom Exam</button>
 </div>
 </div>

 {isCreatingExam && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
            <button onClick={() => setIsCreatingExam(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Create Custom Exam</h2>
            
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Course Name *</label>
                <input required type="text" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} placeholder="e.g., Artificial Intelligence" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Course Code *</label>
                  <input required type="text" value={newExam.code} onChange={e => setNewExam({...newExam, code: e.target.value})} placeholder="e.g., CS501" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exam Type</label>
                  <input type="text" value={newExam.examType} onChange={e => setNewExam({...newExam, examType: e.target.value})} placeholder="e.g., Midterm 1" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Exam Date *</label>
                <input required type="date" value={newExam.date} onChange={e => setNewExam({...newExam, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsCreatingExam(false)} className="px-6 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addingPortionFor !== null && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
            <button onClick={() => setAddingPortionFor(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Add Syllabus Portion</h2>
            
            <form onSubmit={handleAddPortion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Portion Title *</label>
                <input required autoFocus type="text" value={newPortionTitle} onChange={e => setNewPortionTitle(e.target.value)} placeholder="e.g., Module 6: Advanced Topics" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setAddingPortionFor(null)} className="px-6 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20">
                  Add Portion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingPortion !== null && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
            <button onClick={() => setEditingPortion(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Edit Portion</h2>
            
            <form onSubmit={handleEditPortion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Portion Title *</label>
                <input required autoFocus type="text" value={editingPortion.title} onChange={e => setEditingPortion({...editingPortion, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all" />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingPortion(null)} className="px-6 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

 <div className="grid lg:grid-cols-2 gap-6">
 {courses.map(course => (
 <div key={course.id} className="card p-6 flex flex-col">
 <div className="flex justify-between items-start mb-4">
 <div>
 <span className="badge mb-2 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 dark:border dark:border-orange-500/20">{course.code}</span>
 <h2 className="text-xl font-bold">{course.name}</h2>
 <p className="text-sm text-muted mt-1 flex items-center gap-2">
 <Clock size={14} /> Upcoming: {course.examType} ({course.date})
 </p>
 </div>
 <div className="text-right">
 <div className="w-16 h-16 rounded-full border-4 border-orange-100 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden">
 <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5"></div>
 <span className="font-bold text-orange-600 dark:text-orange-400 relative z-10">
 {course.totalModules > 0 ? Math.round((course.completedModules / course.totalModules) * 100) : 0}%
 </span>
 </div>
 </div>
 </div>

 <div className="flex-1 space-y-3 mb-6 border-t border-border pt-4">
 <div className="flex justify-between items-center mb-3">
 <h3 className="font-semibold text-sm">Syllabus Breakdown</h3>
 <button onClick={() => setAddingPortionFor(course.id)} className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-1">
 <Plus size={12} /> Add Portion
 </button>
 </div>
 {course.portions.map((portion, idx) => (
 <div 
 key={idx} 
 onClick={() => toggleModuleStatus(course.id, idx)}
 className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 cursor-pointer transition-colors bg-white dark:bg-zinc-900/50"
 >
 <div className="flex items-center gap-3">
 {portion.status === 'Completed' ? <CheckCircle size={18} className="text-green-500" /> : 
 portion.status === 'In Progress' ? <Clock size={18} className="text-amber-500" /> : 
 <AlertCircle size={18} className="text-gray-400" />}
 <span className={`font-medium ${portion.status === 'Pending' ? 'text-muted' : ''}`}>{portion.title}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={`text-xs px-2 py-1 rounded-full ${
 portion.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
 portion.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
 'bg-gray-100 text-gray-500 dark:bg-gray-800'
 }`}>{portion.status}</span>
 <button onClick={(e) => { e.stopPropagation(); setEditingPortion({ courseId: course.id, moduleIndex: idx, title: portion.title }); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
 <Edit2 size={14} />
 </button>
 </div>
 </div>
 ))}
 </div>

 <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
 <span className="text-sm font-medium text-muted flex items-center gap-1">
 {course.published ? <><CheckCircle size={16} className="text-green-500"/> Published to Students</> : <><AlertCircle size={16} className="text-amber-500"/> Not Published</>}
 </span>
 <button 
 onClick={() => handlePublish(course.id)}
 disabled={course.published}
 className={`btn flex items-center gap-2 ${course.published ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'}`}
 >
 <Send size={16} /> {course.published ? 'Update Sent' : 'Publish Portions'}
 </button>
 </div>
 </div>
 ))}
 </div>
 </DashboardLayout>
 );
}
