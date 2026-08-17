'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, PieChart, Activity, X, Download, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function AdminCareerAnalyticsPage() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  useEffect(() => {
    if (isGeneratingReport && reportProgress < 100) {
      const timer = setTimeout(() => setReportProgress(p => Math.min(p + 12, 100)), 150);
      return () => clearTimeout(timer);
    }
  }, [isGeneratingReport, reportProgress]);
  const departmentStats = [
    { name: 'Computer Science', activeRoadmaps: 450, avgProgress: 68, topGoal: 'Software Engineer' },
    { name: 'Information Science', activeRoadmaps: 320, avgProgress: 62, topGoal: 'Data Scientist' },
    { name: 'Electronics', activeRoadmaps: 280, avgProgress: 55, topGoal: 'VLSI Engineer' },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <Toaster position="top-right" />

      {isGeneratingReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-8 rounded-3xl w-full max-w-md border border-border shadow-2xl relative text-center">
            {reportProgress < 100 ? (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 size={32} className="text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Compiling Career Report...</h2>
                <p className="text-muted text-sm mb-8">Aggregating career roadmap progress and goals across the department.</p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="h-3 rounded-full bg-primary transition-all duration-200" 
                    style={{ width: `${reportProgress}%` }}
                  ></div>
                </div>
                <p className="font-bold text-primary">{reportProgress}%</p>
              </>
            ) : (
              <>
                <button onClick={() => { setIsGeneratingReport(false); setReportProgress(0); }} className="absolute top-4 right-4 text-muted hover:text-foreground">
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Report Ready</h2>
                <p className="text-muted text-sm mb-8">Your comprehensive Campus Career Analytics Report is complete and ready for download.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => {
                    toast.success('Report downloaded to your device!');
                    setIsGeneratingReport(false);
                  }} className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-white bg-indigo-600 hover:bg-indigo-700">
                    <Download size={18} /> Download Excel Report
                  </button>
                  <button onClick={() => setIsGeneratingReport(false)} className="btn btn-ghost w-full">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedDept && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl w-full max-w-xl border border-border shadow-2xl relative">
            <button onClick={() => setSelectedDept(null)} className="absolute top-4 right-4 text-muted hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedDept.name} Analytics</h2>
            <p className="text-muted text-sm mb-6">Detailed breakdown of career roadmap engagement.</p>
            
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-xl bg-surface-2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-muted">Active Roadmaps</p>
                  <p className="text-xl font-bold">{selectedDept.activeRoadmaps} Students</p>
                </div>
                <Users size={24} className="text-indigo-500 opacity-50" />
              </div>
              <div className="p-4 border border-border rounded-xl bg-surface-2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-muted">Average Progress</p>
                  <p className="text-xl font-bold text-green-500">{selectedDept.avgProgress}%</p>
                </div>
                <TrendingUp size={24} className="text-green-500 opacity-50" />
              </div>
              <div className="p-4 border border-border rounded-xl bg-surface-2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-muted">Most Popular Goal</p>
                  <p className="text-xl font-bold text-purple-500">{selectedDept.topGoal}</p>
                </div>
                <Target size={24} className="text-purple-500 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campus Career Analytics</h1>
          <p className="text-muted mt-1">Aggregate overview of career roadmap progress across the entire campus</p>
        </div>
        <button onClick={() => { setIsGeneratingReport(true); setReportProgress(0); }} className="btn btn-outline flex items-center gap-2">
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
          <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Campus Breakdown</h3>
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
                    <button onClick={() => setSelectedDept(dept)} className="btn btn-outline text-xs py-1.5 px-3">Drill Down</button>
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
