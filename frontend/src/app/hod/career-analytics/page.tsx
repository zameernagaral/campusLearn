'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, PieChart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HodCareerAnalyticsPage() {
  const departmentStats = [
    { name: 'Computer Science', activeRoadmaps: 450, avgProgress: 68, topGoal: 'Software Engineer' },
    { name: 'Information Science', activeRoadmaps: 320, avgProgress: 62, topGoal: 'Data Scientist' },
    { name: 'Electronics', activeRoadmaps: 280, avgProgress: 55, topGoal: 'VLSI Engineer' },
  ];

  return (
    <DashboardLayout requiredRole="hod">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Career Analytics</h1>
          <p className="text-muted mt-1">Aggregate overview of career roadmap progress across the department</p>
        </div>
        <button onClick={() => toast.success('Exporting detailed career report...')} className="btn btn-outline flex items-center gap-2">
          <BarChart2 size={18} /> Export Report
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <div className="card p-6 border-t-4 border-indigo-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Total Active Students</p>
              <h3 className="text-2xl font-bold">1,050</h3>
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
              <h3 className="text-2xl font-bold">62.5%</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-purple-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
              <Map size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Defined Roadmaps</p>
              <h3 className="text-2xl font-bold">985</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-orange-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">High Risk Students</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Department Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2">
                <th className="p-4 font-semibold text-sm text-muted">Branch / Section</th>
                <th className="p-4 font-semibold text-sm text-muted">Active Roadmaps</th>
                <th className="p-4 font-semibold text-sm text-muted">Average Progress</th>
                <th className="p-4 font-semibold text-sm text-muted">Most Popular Goal</th>
                <th className="p-4 font-semibold text-sm text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                  <td className="p-4 font-bold">{dept.name}</td>
                  <td className="p-4 text-sm font-medium">{dept.activeRoadmaps} Students</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[120px]">
                        <div 
                          className={`h-2 rounded-full ${dept.avgProgress > 65 ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${dept.avgProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold">{dept.avgProgress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30">{dept.topGoal}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toast.success(`Opening detailed view for ${dept.name}`)} className="btn btn-outline text-xs py-1.5 px-3">Drill Down</button>
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
