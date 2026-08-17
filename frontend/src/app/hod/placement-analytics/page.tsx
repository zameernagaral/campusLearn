'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, PieChart, Activity, Briefcase, Building, CheckCircle, RefreshCw, X, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function HodPlacementAnalyticsPage() {
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
 <DashboardLayout requiredRole="hod">
 <Toaster position="top-right" />

 {isSyncing && (
 <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-8 rounded-3xl w-full max-w-sm border border-border shadow-2xl relative text-center">
 <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
 <RefreshCw size={32} className="text-orange-500 animate-spin" />
 </div>
 <h2 className="text-2xl font-bold mb-2">Syncing TPO Data</h2>
 <p className="text-muted text-sm">Fetching latest placement scores, eligible student counts, and newly onboarded companies from the centralized database...</p>
 </div>
 </div>
 )}

 {selectedCompany && (
 <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-6 rounded-2xl w-full max-w-xl border border-border shadow-2xl relative">
 <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 text-muted hover:text-foreground">
 <X size={20} />
 </button>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center">
 <Building size={24} className="text-teal-500" />
 </div>
 <div>
 <h2 className="text-xl font-bold">{selectedCompany.name} Readiness List</h2>
 <p className="text-sm text-muted">{selectedCompany.readyStudents} students meet the {selectedCompany.required}% minimum threshold</p>
 </div>
 </div>
 
 <div className="border border-border rounded-xl overflow-hidden mb-6 max-h-[60vh] overflow-y-auto">
 {Array.from({ length: Math.min(selectedCompany.readyStudents, 8) }).map((_, i) => (
 <div key={i} className="p-4 border-b border-border bg-surface hover:bg-surface-2 transition-colors flex justify-between items-center last:border-0">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
 {String.fromCharCode(65 + i)}
 </div>
 <div>
 <p className="font-bold text-sm">Student {i + 1}</p>
 <p className="text-xs text-muted">Roll No: CS{100 + i}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Score: {selectedCompany.required + Math.floor(Math.random() * (100 - selectedCompany.required))}%</span>
 <button className="text-muted hover:text-primary"><ChevronRight size={16} /></button>
 </div>
 </div>
 ))}
 {selectedCompany.readyStudents > 8 && (
 <div className="p-3 text-center text-xs text-muted font-medium bg-surface-2">
 + {selectedCompany.readyStudents - 8} more students
 </div>
 )}
 </div>

 <div className="flex justify-end gap-3">
 <button onClick={() => setSelectedCompany(null)} className="btn btn-ghost">Close</button>
 <button onClick={() => { toast.success(`Exported ${selectedCompany.name} list as CSV`); setSelectedCompany(null); }} className="btn btn-primary bg-teal-600 hover:bg-teal-700">Export List</button>
 </div>
 </div>
 </div>
 )}

 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Placement Readiness Overview</h1>
 <p className="text-muted mt-1">Monitor department-wide placement scores and company readiness</p>
 </div>
 <button onClick={() => setIsSyncing(true)} className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white flex items-center gap-2">
 <RefreshCw size={18} /> Sync TPO Data
 </button>
 </div>

 <div className="grid lg:grid-cols-4 gap-6 mb-6">
 <div className="card p-6 border-t-4 border-teal-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-xl">
 <Briefcase size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Eligible Students</p>
 <h3 className="text-2xl font-bold">850</h3>
 </div>
 </div>
 </div>
 
 <div className="card p-6 border-t-4 border-blue-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
 <CheckCircle size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Placement Ready</p>
 <h3 className="text-2xl font-bold">64%</h3>
 </div>
 </div>
 </div>

 <div className="card p-6 border-t-4 border-orange-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
 <Building size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Companies Onboarded</p>
 <h3 className="text-2xl font-bold">124</h3>
 </div>
 </div>
 </div>

 <div className="card p-6 border-t-4 border-pink-500">
 <div className="flex items-center gap-4 mb-4">
 <div className="p-3 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 rounded-xl">
 <Star size={24} />
 </div>
 <div>
 <p className="text-sm text-muted font-medium">Avg Dept Score</p>
 <h3 className="text-2xl font-bold">71.4</h3>
 </div>
 </div>
 </div>
 </div>

 <div className="card p-0 overflow-hidden">
 <div className="p-5 border-b border-border flex justify-between items-center">
 <h3 className="font-bold flex items-center gap-2"><Building size={18} className="text-teal-500" /> Target Company Readiness</h3>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-surface-2">
 <th className="p-4 font-semibold text-sm text-muted">Company Name</th>
 <th className="p-4 font-semibold text-sm text-muted">Required Score Threshold</th>
 <th className="p-4 font-semibold text-sm text-muted">Students Ready</th>
 <th className="p-4 font-semibold text-sm text-muted">Total Applicants</th>
 <th className="p-4 font-semibold text-sm text-muted text-right">Action</th>
 </tr>
 </thead>
 <tbody>
 {companyStats.map((comp, idx) => (
 <tr key={idx} className="border-b border-border hover:bg-surface-2/50 transition-colors">
 <td className="p-4 font-bold">{comp.name}</td>
 <td className="p-4">
 <span className="badge bg-gray-100 text-gray-700 dark:bg-gray-800 border">{comp.required}% Minimum</span>
 </td>
 <td className="p-4">
 <span className="font-bold text-teal-600">{comp.readyStudents}</span> students
 </td>
 <td className="p-4 text-sm font-medium">{comp.applicants}</td>
 <td className="p-4 text-right">
 <button onClick={() => setSelectedCompany(comp)} className="btn btn-outline text-xs py-1.5 px-3">View Students</button>
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
