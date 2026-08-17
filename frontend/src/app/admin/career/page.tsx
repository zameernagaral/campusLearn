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
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-[#0f1115] p-8 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl relative text-center">
 {reportProgress < 100 ? (
 <>
 <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <BarChart2 size={32} className="text-orange-500 animate-pulse" />
 </div>
 <h2 className="text-2xl font-black mb-2 text-white">Compiling Career Report...</h2>
 <p className="text-zinc-400 text-sm mb-8">Aggregating career roadmap progress and goals across the department.</p>
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
 <FileText size={32} className="text-emerald-500" />
 </div>
 <h2 className="text-2xl font-black mb-2 text-white">Report Ready</h2>
 <p className="text-zinc-400 text-sm mb-8">Your comprehensive Campus Career Analytics Report is complete and ready for download.</p>
 <div className="flex flex-col gap-3">
 <button onClick={() => {
   // Generate mock CSV data
   const headers = ['Department', 'Active Roadmaps', 'Average Progress (%)', 'Most Popular Goal'];
   const csvContent = [
     headers.join(','),
     ...departmentStats.map(d => `"${d.name}",${d.activeRoadmaps},${d.avgProgress},"${d.topGoal}"`)
   ].join('\n');
   
   // Create blob and trigger download
   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const link = document.createElement('a');
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', 'Campus_Career_Analytics_Report.csv');
   link.style.visibility = 'hidden';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);

   toast.success('Report downloaded successfully!');
   setIsGeneratingReport(false);
 }} className="w-full flex items-center justify-center gap-2 py-3 text-white font-bold bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/20 transition-colors">
 <Download size={18} /> Download Excel Report
 </button>
 <button onClick={() => setIsGeneratingReport(false)} className="w-full py-3 text-white font-bold bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">Close</button>
 </div>
 </>
 )}
 </div>
 </div>
 )}

 {selectedDept && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-[#0f1115] p-6 rounded-3xl w-full max-w-xl border border-zinc-800 shadow-2xl relative">
 <button onClick={() => setSelectedDept(null)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
 <X size={20} />
 </button>
 <h2 className="text-2xl font-black mb-2 text-white">{selectedDept.name} Analytics</h2>
 <p className="text-zinc-400 text-sm mb-6">Detailed breakdown of career roadmap engagement.</p>
 
 <div className="space-y-4">
 <div className="p-5 border border-zinc-800 rounded-2xl bg-zinc-900/50 flex justify-between items-center transition-colors hover:border-zinc-700">
 <div>
 <p className="text-sm font-bold text-zinc-400">Active Roadmaps</p>
 <p className="text-xl font-black text-white mt-1">{selectedDept.activeRoadmaps} Students</p>
 </div>
 <Users size={28} className="text-indigo-500 opacity-80" />
 </div>
 <div className="p-5 border border-zinc-800 rounded-2xl bg-zinc-900/50 flex justify-between items-center transition-colors hover:border-zinc-700">
 <div>
 <p className="text-sm font-bold text-zinc-400">Average Progress</p>
 <p className="text-xl font-black text-emerald-500 mt-1">{selectedDept.avgProgress}%</p>
 </div>
 <TrendingUp size={28} className="text-emerald-500 opacity-80" />
 </div>
 <div className="p-5 border border-zinc-800 rounded-2xl bg-zinc-900/50 flex justify-between items-center transition-colors hover:border-zinc-700">
 <div>
 <p className="text-sm font-bold text-zinc-400">Most Popular Goal</p>
 <p className="text-xl font-black text-blue-500 mt-1">{selectedDept.topGoal}</p>
 </div>
 <Target size={28} className="text-blue-500 opacity-80" />
 </div>
 </div>
 </div>
 </div>
 )}

 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-black text-white">Campus Career Analytics</h1>
 <p className="text-zinc-400 mt-1 text-sm">Aggregate overview of career roadmap progress across the entire campus</p>
 </div>
 <button onClick={() => { setIsGeneratingReport(true); setReportProgress(0); }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20">
 <Download size={16} /> Export Report
 </button>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-indigo-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
 <Users size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Total Active</p>
 <h3 className="text-2xl font-black text-white">1,050</h3>
 </div>
 </div>
 </div>
 
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-emerald-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
 <Target size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Avg Completion</p>
 <h3 className="text-2xl font-black text-white">62.5%</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-blue-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
 <Map size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Roadmaps</p>
 <h3 className="text-2xl font-black text-white">985</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-orange-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
 <Activity size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">High Risk</p>
 <h3 className="text-2xl font-black text-white">42</h3>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl border border-zinc-800 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
 <h3 className="font-black text-white flex items-center gap-2 text-lg"><TrendingUp size={20} className="text-indigo-500" /> Campus Breakdown</h3>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-900/50">
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Branch / Section</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Active Roadmaps</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Average Progress</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Most Popular Goal</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800 text-right">Action</th>
 </tr>
 </thead>
 <tbody>
 {departmentStats.map((dept, idx) => (
 <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
 <td className="p-4 font-bold text-white">{dept.name}</td>
 <td className="p-4 text-sm font-medium text-zinc-300">{dept.activeRoadmaps} Students</td>
 <td className="p-4">
 <div className="flex items-center gap-3">
 <div className="w-full bg-zinc-800 rounded-full h-2 max-w-[120px]">
 <div 
 className={`h-2 rounded-full ${dept.avgProgress > 65 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
 style={{ width: `${dept.avgProgress}%` }}
 ></div>
 </div>
 <span className="text-xs font-bold text-zinc-300">{dept.avgProgress}%</span>
 </div>
 </td>
 <td className="p-4">
 <span className="text-xs px-3 py-1 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{dept.topGoal}</span>
 </td>
 <td className="p-4 text-right">
 <button onClick={() => setSelectedDept(dept)} className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg transition-colors">Drill Down</button>
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
