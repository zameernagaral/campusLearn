'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star } from 'lucide-react';

export default function FacultyCareerAnalyticsPage() {
  const studentsProgress = [
    { name: 'John Doe', rollNo: 'CS001', goal: 'Full Stack Developer', progress: 75, status: 'On Track' },
    { name: 'Jane Smith', rollNo: 'CS002', goal: 'Data Scientist', progress: 85, status: 'Excelling' },
    { name: 'Alex Johnson', rollNo: 'CS003', goal: 'Cloud Architect', progress: 40, status: 'Needs Attention' },
    { name: 'Sarah Williams', rollNo: 'CS004', goal: 'Frontend Developer', progress: 60, status: 'On Track' },
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Career Progress</h1>
          <p className="text-muted mt-1">Monitor how your students are advancing towards their career goals</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 border-t-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Mentored Students</p>
              <h3 className="text-2xl font-bold">124</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-6 border-t-4 border-emerald-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Avg Goal Completion</p>
              <h3 className="text-2xl font-bold">68%</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-purple-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
              <Map size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Active Roadmaps</p>
              <h3 className="text-2xl font-bold">92</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Student Progress Tracker</h3>
          <button className="text-sm text-indigo-500 hover:text-indigo-600 font-medium">View All Students</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2">
                <th className="p-4 font-semibold text-sm text-muted">Student</th>
                <th className="p-4 font-semibold text-sm text-muted">Career Goal</th>
                <th className="p-4 font-semibold text-sm text-muted">Progress</th>
                <th className="p-4 font-semibold text-sm text-muted">Status</th>
                <th className="p-4 font-semibold text-sm text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsProgress.map((student, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{student.name}</p>
                    <p className="text-xs text-muted">{student.rollNo}</p>
                  </td>
                  <td className="p-4 text-sm font-medium">{student.goal}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[120px]">
                        <div 
                          className={`h-2 rounded-full ${student.progress > 70 ? 'bg-green-500' : student.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      student.status === 'Excelling' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      student.status === 'On Track' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                    }`}>{student.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="btn btn-outline text-xs py-1.5 px-3">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
