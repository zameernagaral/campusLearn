'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Layers, CheckCircle, Clock, BookOpen, AlertCircle, Plus, Send, Edit2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FacultyExamPortionsPage() {
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
        </div>
        <button className="btn btn-primary flex items-center gap-2"><Plus size={18} /> Create Custom Exam</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {courses.map(course => (
          <div key={course.id} className="card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="badge mb-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30">{course.code}</span>
                <h2 className="text-xl font-bold">{course.name}</h2>
                <p className="text-sm text-muted mt-1 flex items-center gap-2">
                  <Clock size={14} /> Upcoming: {course.examType} ({course.date})
                </p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {Math.round((course.completedModules / course.totalModules) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-6 border-t border-border pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">Syllabus Breakdown</h3>
                <button onClick={() => toast.success('Add new portion modal opened')} className="text-xs text-indigo-500 font-medium hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add Portion
                </button>
              </div>
              {course.portions.map((portion, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleModuleStatus(course.id, idx)}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-indigo-500 cursor-pointer transition-colors"
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
                    <button onClick={(e) => { e.stopPropagation(); toast.success('Edit portion modal opened'); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
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
