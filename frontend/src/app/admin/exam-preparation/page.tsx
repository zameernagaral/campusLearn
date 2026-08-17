'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, TrendingUp, BarChart2, CheckCircle, BookOpen, Clock, AlertTriangle, X, Download, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function AdminExamAnalyticsPage() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);

  useEffect(() => {
    if (isGeneratingReport && reportProgress < 100) {
      const timer = setTimeout(() => setReportProgress(p => Math.min(p + 8, 100)), 200);
      return () => clearTimeout(timer);
    }
  }, [isGeneratingReport, reportProgress]);
  const courseStats = [
    { name: 'Database Management Systems', code: 'CS401', syllabusCoverage: 72, expectedPassRate: 85, highRisk: 12 },
    { name: 'Computer Networks', code: 'CS402', syllabusCoverage: 40, expectedPassRate: 65, highRisk: 45 },
    { name: 'Operating Systems', code: 'CS403', syllabusCoverage: 90, expectedPassRate: 92, highRisk: 4 },
    { name: 'Software Engineering', code: 'CS404', syllabusCoverage: 55, expectedPassRate: 78, highRisk: 22 },
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
                <h2 className="text-2xl font-bold mb-2">Compiling Report Data...</h2>
                <p className="text-muted text-sm mb-8">Aggregating campus-wide syllabus coverage and predicting pass rates.</p>
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
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Report Ready</h2>
                <p className="text-muted text-sm mb-8">Your Campus Exam Readiness Report is complete and ready for download.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => {
                    toast.success('Report downloaded to your device!');
                    setIsGeneratingReport(false);
                  }} className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-white bg-indigo-600 hover:bg-indigo-700">
                    <Download size={18} /> Download PDF Report
                  </button>
                  <button onClick={() => setIsGeneratingReport(false)} className="btn btn-ghost w-full">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Exam Preparation</h1>
          <p className="text-muted mt-1">Track campus-wide syllabus coverage and predict exam outcomes using AI</p>
        </div>
        <button onClick={() => { setIsGeneratingReport(true); setReportProgress(0); }} className="btn btn-primary flex items-center gap-2">
          <BarChart2 size={18} /> Generate Report
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <div className="card p-6 border-t-4 border-indigo-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Avg Syllabus Covered</p>
              <h3 className="text-2xl font-bold">64%</h3>
            </div>
          </div>
        </div>
        
        <div className="card p-6 border-t-4 border-emerald-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Predicted Pass Rate</p>
              <h3 className="text-2xl font-bold">80%</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-orange-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Students at Risk</p>
              <h3 className="text-2xl font-bold text-orange-600">83</h3>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Avg Study Time/Wk</p>
              <h3 className="text-2xl font-bold">14 hrs</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Course Readiness Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2">
                <th className="p-4 font-semibold text-sm text-muted">Course Code & Name</th>
                <th className="p-4 font-semibold text-sm text-muted">Syllabus Coverage</th>
                <th className="p-4 font-semibold text-sm text-muted">Predicted Pass Rate</th>
                <th className="p-4 font-semibold text-sm text-muted">High Risk Students</th>
                <th className="p-4 font-semibold text-sm text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {courseStats.map((course, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-surface-2/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold">{course.name}</p>
                    <p className="text-xs text-muted">{course.code}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[120px]">
                        <div 
                          className={`h-2 rounded-full ${course.syllabusCoverage > 75 ? 'bg-green-500' : course.syllabusCoverage > 50 ? 'bg-blue-500' : 'bg-red-500'}`} 
                          style={{ width: `${course.syllabusCoverage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold">{course.syllabusCoverage}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${course.expectedPassRate > 80 ? 'text-green-600' : course.expectedPassRate > 60 ? 'text-orange-500' : 'text-red-500'}`}>
                      {course.expectedPassRate}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/30">
                      {course.highRisk} Students
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toast.success(`Alerting faculty for ${course.code} about syllabus coverage.`)} className="btn btn-outline text-xs py-1.5 px-3 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Alert Faculty</button>
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
