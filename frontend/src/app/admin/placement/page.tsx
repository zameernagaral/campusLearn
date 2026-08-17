'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, PieChart, Activity, Briefcase, Building, CheckCircle, RefreshCw, X, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Skeleton, ListSkeleton } from '@/components/shared/Skeleton';

export default function AdminPlacementAnalyticsPage() {
 const [isSyncing, setIsSyncing] = useState(false);
 const [selectedCompany, setSelectedCompany] = useState<any>(null);

 useEffect(() => {
 if (isSyncing) {
 const timer = setTimeout(() => {
 setIsSyncing(false);
 toast.success('Successfully synchronized latest data with TPO office');
 }, 2500);
 return () => clearTimeout(timer);
 }
 }, [isSyncing]);
 const companyStats = [
 { name: 'Google', required: 85, readyStudents: 45, applicants: 120 },
 { name: 'Microsoft', required: 80, readyStudents: 60, applicants: 150 },
 { name: 'Amazon', required: 75, readyStudents: 110, applicants: 200 },
 { name: 'TCS', required: 60, readyStudents: 450, applicants: 800 },
 ];

 return (
 <DashboardLayout requiredRole="admin">
 <Toaster position="top-right" />

 {isSyncing && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-[#0f1115] p-8 rounded-3xl w-full max-w-sm border border-zinc-800 shadow-2xl relative">
 <div className="flex flex-col items-center mb-6">
   <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
     <RefreshCw size={32} className="text-orange-500 animate-spin" />
   </div>
   <h2 className="text-xl font-black text-white">Syncing TPO Data...</h2>
   <p className="text-sm text-zinc-400 mt-2 text-center">Fetching latest placement records</p>
 </div>
 <div className="space-y-4">
   <Skeleton className="h-4 w-full bg-zinc-800/50 rounded-lg" />
   <Skeleton className="h-4 w-5/6 mx-auto bg-zinc-800/50 rounded-lg" />
   <Skeleton className="h-4 w-4/6 mx-auto bg-zinc-800/50 rounded-lg" />
 </div>
 </div>
 </div>
 )}

 {selectedCompany && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-[#0f1115] p-6 rounded-3xl w-full max-w-xl border border-zinc-800 shadow-2xl relative">
 <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
 <X size={20} />
 </button>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center">
 <Building size={24} className="text-teal-500" />
 </div>
 <div>
 <h2 className="text-xl font-black text-white">{selectedCompany.name} Readiness List</h2>
 <p className="text-sm text-zinc-400 mt-1"><span className="font-bold text-white">{selectedCompany.readyStudents}</span> students meet the <span className="font-bold text-white">{selectedCompany.required}%</span> minimum threshold</p>
 </div>
 </div>
 
 <div className="border border-zinc-800 rounded-2xl overflow-hidden mb-6 max-h-[50vh] overflow-y-auto">
 {Array.from({ length: Math.min(selectedCompany.readyStudents, 8) }).map((_, i) => (
 <div key={i} className="p-4 border-b border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors flex justify-between items-center last:border-0">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-xs font-bold text-teal-400 border border-teal-500/20">
 {String.fromCharCode(65 + i)}
 </div>
 <div>
 <p className="font-bold text-sm text-white">Student {i + 1}</p>
 <p className="text-xs text-zinc-500 font-bold mt-0.5">Roll No: CS{100 + i}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Score: {selectedCompany.required + Math.floor(Math.random() * (100 - selectedCompany.required))}%</span>
 <button className="text-zinc-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
 </div>
 </div>
 ))}
 {selectedCompany.readyStudents > 8 && (
 <div className="p-4 text-center text-xs text-zinc-500 font-bold bg-zinc-900/50">
 + {selectedCompany.readyStudents - 8} more students
 </div>
 )}
 </div>

 <div className="flex justify-end gap-3">
 <button onClick={() => setSelectedCompany(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-colors border border-zinc-700">Close</button>
 <button onClick={() => { toast.success(`Exported ${selectedCompany.name} list as CSV`); setSelectedCompany(null); }} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-teal-500/20">Export List</button>
 </div>
 </div>
 </div>
 )}

 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-black text-white">Global Placement Overview</h1>
 <p className="text-zinc-400 mt-1 text-sm">Monitor campus-wide placement scores and company readiness</p>
 </div>
 <button onClick={() => setIsSyncing(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20">
 <RefreshCw size={16} /> Sync TPO Data
 </button>
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-teal-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl">
 <Briefcase size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Eligible Students</p>
 <h3 className="text-2xl font-black text-white">850</h3>
 </div>
 </div>
 </div>
 
 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-blue-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
 <CheckCircle size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Placement Ready</p>
 <h3 className="text-2xl font-black text-white">64%</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-orange-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
 <Building size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Companies Onboarded</p>
 <h3 className="text-2xl font-black text-white">124</h3>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl p-6 border-t-4 border-t-pink-500 border border-zinc-800 shadow-sm">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl">
 <Star size={24} />
 </div>
 <div>
 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">Avg Campus Score</p>
 <h3 className="text-2xl font-black text-white">71.4</h3>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-[#0f1115] rounded-3xl border border-zinc-800 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
 <h3 className="font-black text-white flex items-center gap-2 text-lg"><Building size={20} className="text-teal-500" /> Target Company Readiness</h3>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-900/50">
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Company Name</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Required Score Threshold</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Students Ready</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">Total Applicants</th>
 <th className="p-4 font-bold text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800 text-right">Action</th>
 </tr>
 </thead>
 <tbody>
 {companyStats.map((comp, idx) => (
 <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
 <td className="p-4 font-bold text-white">{comp.name}</td>
 <td className="p-4">
 <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">{comp.required}% Minimum</span>
 </td>
 <td className="p-4">
 <span className="font-black text-teal-400">{comp.readyStudents}</span> <span className="text-sm font-medium text-zinc-400">students</span>
 </td>
 <td className="p-4 text-sm font-bold text-zinc-300">{comp.applicants}</td>
 <td className="p-4 text-right">
 <button onClick={() => setSelectedCompany(comp)} className="text-xs font-bold text-white hover:text-zinc-300 transition-colors">View Students</button>
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
