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
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-[#0f1115] p-8 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl relative text-center">
 {reportProgress < 100 ? (
 <>
 <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <BarChart2 size={32} className="text-orange-500 animate-pulse" />
 </div>
 <h2 className="text-2xl font-black mb-2 text-white">Compiling Report Data...</h2>
 <p className="text-zinc-400 text-sm mb-8">Aggregating campus-wide syllabus coverage and predicting pass rates.</p>
 <div className="w-full bg-zinc-800 rounded-full h-3 mb-2 overflow-hidden">
 <div 
 className="h-3 rounded-full bg-orange-500 transition-all duration-200" 
 style={{ width: `${reportProgress}%` }}
 ></div>
 </div>
 <p className="font-bold text-orange-500">{reportProgress}%</p>
 </>
 ) : (
 <>
 <button onClick={() => { setIsGeneratingReport(false); setReportProgress(0); }} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
 <X size={20} />
 </button>
 <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <CheckCircle size={32} className="text-emerald-500" />
 </div>
 <h2 className="text-2xl font-black mb-2 text-white">Report Ready</h2>
 <p className="text-zinc-400 text-sm mb-8">Your Campus Exam Readiness Report is complete and ready for download.</p>
 <div className="flex flex-col gap-3">
 <button onClick={() => {
   // Generate mock CSV data (using PDF name but CSV format for mock)
   const headers = ['Course Name', 'Course Code', 'Syllabus Coverage (%)', 'Expected Pass Rate (%)', 'High Risk Students'];
   const csvContent = [
     headers.join(','),
     ...courseStats.map(c => `"${c.name}","${c.code}",${c.syllabusCoverage},${c.expectedPassRate},${c.highRisk}`)
   ].join('\n');
   
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', 'Exam_Preparation_Report.csv');
   link.style.visibility = 'hidden';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);

   toast.success('Report downloaded successfully!');
   setIsGeneratingReport(false);
 }} className="w-full flex items-center justify-center gap-2 py-3 text-white font-bold bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/20 transition-colors">
 <Download size={18} /> Download Report
 </button>
 <button onClick={() => setIsGeneratingReport(false)} className="w-full py-3 text-white font-bold bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">Close</button>
 </div>
 </>
 )}
 </div>
 </div>
 )}

 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-black text-white">Global Exam Preparation</h1>
 <p className="text-zinc-400 mt-1 text-sm">Track campus-wide syllabus coverage and predict exam outcomes using AI</p>
 </div>
 <button onClick={() => { setIsGeneratingReport(true); setReportProgress(0); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20">
 <BarChart2 size={16} /> Generate Report
 </button>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-indigo-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
 <BookOpen size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Avg Syllabus Covered</p>
 <h3 className="text-2xl font-black text-white">64%</h3>
 </div>
 </div>
 </div>
 
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-emerald-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
 <CheckCircle size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Predicted Pass Rate</p>
 <h3 className="text-2xl font-black text-white">80%</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-orange-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
 <AlertTriangle size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Students at Risk</p>
 <h3 className="text-2xl font-black text-orange-500">83</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-blue-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
 <Clock size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Avg Study Time/Wk</p>
 <h3 className="text-2xl font-black text-white">14 hrs</h3>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl border border-zinc-800 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
 <h3 className="font-black text-white flex items-center gap-2 text-lg"><TrendingUp size={20} className="text-indigo-500" /> Course Readiness Breakdown</h3>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-900/50">
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Course Code & Name</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Syllabus Coverage</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Predicted Pass Rate</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">High Risk Students</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800 text-right">Action</th>
 </tr>
 </thead>
 <tbody>
 {courseStats.map((course, idx) => (
 <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
 <td className="p-4">
 <p className="font-bold text-white">{course.name}</p>
 <p className="text-xs text-zinc-500 font-bold mt-0.5">{course.code}</p>
 </td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-full bg-zinc-800 rounded-full h-2 max-w-[120px]">
 <div 
 className={`h-2 rounded-full ${course.syllabusCoverage > 75 ? 'bg-emerald-500' : course.syllabusCoverage > 50 ? 'bg-indigo-500' : 'bg-red-500'}`} 
 style={{ width: `${course.syllabusCoverage}%` }}
 ></div>
 </div>
 <span className="text-xs font-bold text-zinc-300">{course.syllabusCoverage}%</span>
 </div>
 </td>
 <td className="p-4">
 <span className={`text-sm font-black ${course.expectedPassRate > 80 ? 'text-emerald-500' : course.expectedPassRate > 60 ? 'text-orange-500' : 'text-red-500'}`}>
 {course.expectedPassRate}%
 </span>
 </td>
 <td className="p-4">
 <span className="text-xs px-3 py-1 rounded-full font-bold bg-red-500/10 text-red-500 border border-red-500/20">
 {course.highRisk} Students
 </span>
 </td>
 <td className="p-4 text-right">
 <button onClick={() => toast.success(`Alert dispatched to ${course.code} faculty. Syllabus completion deadline sent.`)} className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors">Alert Faculty</button>
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
