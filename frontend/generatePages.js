const fs = require('fs');
const path = require('path');

const studentDir = path.join(__dirname, 'src', 'app', 'student');

const pages = [
  {
    path: 'career-roadmap',
    content: `'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Map, Target, Briefcase, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CareerRoadmapPage() {
  const [goal, setGoal] = useState('Full Stack Developer');
  
  const roadmapSteps = [
    { title: 'Programming Fundamentals', status: 'Completed' },
    { title: 'Data Structures & Algorithms', status: 'Completed' },
    { title: 'Database Management', status: 'Learning' },
    { title: 'Backend Frameworks', status: 'Not Started' },
    { title: 'Frontend Frameworks', status: 'Not Started' },
    { title: 'Cloud Computing', status: 'Not Started' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Career Roadmap</h1>
          <p className="text-muted mt-1">Plan your path to your dream career</p>
        </div>
        <button className="btn btn-primary">Edit Goal</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goal Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Target size={24} className="text-purple-500" />
              <h2 className="text-lg font-bold">Career Goal</h2>
            </div>
            <p className="text-2xl font-bold mb-2">{goal}</p>
            <p className="text-sm text-muted">Target Role: SDE I</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium mb-2">Career Readiness</p>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-right mt-1">40% Ready</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={18} /> Top Target Companies</h3>
            <div className="flex flex-wrap gap-2">
              <span className="badge">Google</span>
              <span className="badge">Microsoft</span>
              <span className="badge">Amazon</span>
            </div>
          </div>
        </div>

        {/* Roadmap Path */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><Map size={20} className="text-indigo-500" /> Personalized Path</h2>
          
          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900 ml-4 space-y-8">
            {roadmapSteps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="relative pl-6"
              >
                <span className="absolute -left-[11px] top-1 bg-background">
                  {step.status === 'Completed' ? <CheckCircle size={20} className="text-green-500 bg-background" /> : 
                   step.status === 'Learning' ? <Circle size={20} className="text-indigo-500 fill-indigo-100 dark:fill-indigo-900" /> :
                   <Circle size={20} className="text-gray-300 dark:text-gray-700 bg-background" />}
                </span>
                <div className={\`p-4 rounded-xl border \${step.status === 'Learning' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-border'}\`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{step.title}</h3>
                    <span className={\`text-xs px-2 py-1 rounded-full \${
                      step.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      step.status === 'Learning' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30' :
                      'bg-gray-100 text-gray-500 dark:bg-gray-800'
                    }\`}>{step.status}</span>
                  </div>
                  {step.status === 'Learning' && (
                    <div className="mt-4 flex gap-2">
                      <button className="btn btn-primary text-xs py-1.5 px-3">Start Course</button>
                      <button className="btn btn-outline text-xs py-1.5 px-3">Mark Complete</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
`
  },
  {
    path: 'timetable',
    content: `'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Clock, Calendar as CalendarIcon, Video, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState('today');

  const classes = [
    { subject: 'Database Management Systems', time: '10:00 AM - 11:00 AM', type: 'Lecture', faculty: 'Dr. Smith', room: 'Room 204', status: 'Live Now' },
    { subject: 'Computer Networks', time: '11:15 AM - 12:15 PM', type: 'Lecture', faculty: 'Prof. Johnson', room: 'Room 201', status: 'Upcoming' },
    { subject: 'Data Structures Lab', time: '01:00 PM - 03:00 PM', type: 'Lab', faculty: 'Mr. Davis', room: 'Lab 3', status: 'Upcoming' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Real-Time Timetable</h1>
          <p className="text-muted mt-1">Manage your schedule and live classes</p>
        </div>
        <div className="flex bg-surface-2 p-1 rounded-xl">
          <button className={\`px-4 py-1.5 rounded-lg text-sm font-medium \${activeTab === 'today' ? 'bg-primary text-white shadow-sm' : 'text-muted'}\`} onClick={() => setActiveTab('today')}>Today</button>
          <button className={\`px-4 py-1.5 rounded-lg text-sm font-medium \${activeTab === 'week' ? 'bg-primary text-white shadow-sm' : 'text-muted'}\`} onClick={() => setActiveTab('week')}>Weekly</button>
        </div>
      </div>

      {/* Smart Alerts for Timetable */}
      <div className="mb-6 p-4 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 flex items-start gap-3">
        <AlertTriangle className="text-orange-500 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-orange-700 dark:text-orange-400">Schedule Change</p>
          <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">Computer Networks has been rescheduled to Room 201 (previously Room 105).</p>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((cls, i) => (
          <div key={i} className={\`card p-5 border-l-4 \${cls.status === 'Live Now' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-blue-500'}\`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={\`text-xs px-2 py-0.5 rounded-full font-bold \${cls.status === 'Live Now' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}\`}>
                    {cls.status === 'Live Now' && <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>}
                    {cls.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{cls.type}</span>
                </div>
                <h3 className="text-xl font-bold mt-2">{cls.subject}</h3>
                <p className="text-muted text-sm mt-1">Faculty: {cls.faculty}</p>
              </div>
              <div className="text-right">
                <p className="font-bold flex items-center justify-end gap-1"><Clock size={16} /> {cls.time}</p>
                <p className="text-sm text-muted flex items-center justify-end gap-1 mt-1"><MapPin size={16} /> {cls.room}</p>
              </div>
            </div>
            
            {cls.status === 'Live Now' && (
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <button className="btn btn-primary flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
                  <Video size={18} /> Join Class
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
`
  },
  {
    path: 'exam-preparation',
    content: `'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Book, Clock, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExamPreparationPage() {
  const topics = [
    { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: '🔴 Very Important', status: 'Completed' },
    { name: 'Transaction Management (ACID properties)', importance: '🔴 Very Important', status: 'Learning' },
    { name: 'Concurrency Control', importance: '🟠 Important', status: 'Not Started' },
    { name: 'Indexing (B-Trees, Hash Indexes)', importance: '🟡 Moderate', status: 'Not Started' }
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Exam Preparation</h1>
          <p className="text-muted mt-1">AI-guided study plans for upcoming exams</p>
        </div>
      </div>

      {/* Hero Exam Countdown */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Clock size={150} />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">UPCOMING EXAM</div>
            <h2 className="text-3xl font-black mb-1">Database Management Systems</h2>
            <p className="text-white/80">Mid-Term Examination · Sem 4</p>
          </div>
          <div className="text-center bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-4xl font-black">5</p>
            <p className="text-sm font-medium uppercase tracking-wider">Days Left</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Col - Progress & Plan */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-5 border-t-4 border-indigo-500">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18} className="text-indigo-500" /> Syllabus Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black">72%</span>
              <span className="text-sm text-muted pb-1">Completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Book size={18} className="text-green-500" /> Today's Smart Plan</h3>
            <div className="p-3 bg-surface-2 rounded-xl mb-3 border border-border">
              <p className="font-bold text-sm">1. Transaction Management</p>
              <p className="text-xs text-muted mt-1">Est. time: 45 mins · 🔴 Very Important</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-primary text-xs w-full py-1.5">Start Studying</button>
              </div>
            </div>
            <div className="p-3 bg-surface-2 rounded-xl border border-border">
              <p className="font-bold text-sm">2. Concurrency Control</p>
              <p className="text-xs text-muted mt-1">Est. time: 60 mins · 🟠 Important</p>
            </div>
          </div>
        </div>

        {/* Right Col - Topic List */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Topic Breakdown</h3>
            <div className="flex gap-2">
              <button className="btn btn-outline text-xs"><FileText size={14} /> Previous Papers</button>
              <button className="btn btn-outline text-xs"><Book size={14} /> Mock Test</button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Importance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t, i) => (
                  <tr key={i}>
                    <td className="font-medium text-sm max-w-xs">{t.name}</td>
                    <td className="text-xs font-semibold">{t.importance}</td>
                    <td>
                      {t.status === 'Completed' ? <span className="badge bg-green-100 text-green-700"><CheckCircle size={12} className="mr-1"/> Completed</span> :
                       t.status === 'Learning' ? <span className="badge bg-blue-100 text-blue-700">In Progress</span> :
                       <span className="badge bg-gray-100 text-gray-600">Not Started</span>}
                    </td>
                    <td>
                      <button className="text-xs text-primary font-bold hover:underline">Study →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
`
  },
  {
    path: 'placement-preparation',
    content: `'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Briefcase, Code, Users, FileText, Cpu, Star, ArrowRight } from 'lucide-react';

export default function PlacementPreparationPage() {
  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Placement Preparation</h1>
          <p className="text-muted mt-1">Get ready for your dream job</p>
        </div>
        <button className="btn btn-primary">Update Profile</button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 card p-6 flex flex-col items-center justify-center text-center border-t-4 border-teal-500">
          <div className="w-24 h-24 rounded-full border-8 border-teal-100 dark:border-teal-900 flex items-center justify-center mb-4">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">72%</span>
          </div>
          <h3 className="font-bold">Placement Ready</h3>
          <p className="text-sm text-muted mt-1">Keep practicing to reach 90%</p>
        </div>

        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Cpu size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Aptitude Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 80%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Code size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Coding Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 75%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Users size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">AI Mock Interviews</h4>
              <p className="text-xs text-muted mt-1">Score: 60%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><FileText size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Resume Analyzer</h4>
              <p className="text-xs text-muted mt-1">Score: 85%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase size={20} className="text-teal-500"/> Target Companies</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-black">G</div>
              <div>
                <p className="font-bold">Google</p>
                <p className="text-xs text-muted">Software Engineer</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600">85% Match</span>
          </div>
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-black">M</div>
              <div>
                <p className="font-bold">Microsoft</p>
                <p className="text-xs text-muted">SDE</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600">70% Match</span>
          </div>
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer border-dashed">
            <div className="flex items-center gap-3 text-muted">
              <Star size={24} />
              <p className="font-bold">Add Company</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
`
  }
];

pages.forEach(page => {
  const pageDir = path.join(studentDir, page.path);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), page.content);
  console.log('Created ' + page.path + '/page.tsx');
});
