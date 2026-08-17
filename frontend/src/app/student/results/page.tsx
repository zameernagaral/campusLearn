'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp } from 'lucide-react';
import { getGradeColor } from '@/lib/utils';
import type { Result } from '@/types';
import { BarChart } from '@/components/charts/Charts';

export default function StudentResultsPage() {
 const [results, setResults] = useState<Result[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [selectedSem, setSelectedSem] = useState<number | null>(null);
 const [sgpa, setSgpa] = useState<number | null>(null);

 useEffect(() => {
 resultAPI.getAll().then(res => {
 const data: Result[] = res.data.data || [];
 setResults(data);
 if (data.length > 0) {
 const gpa = data.reduce((sum, r) => sum + (r.sgpa || r.gradePoints), 0) / data.length;
 setSgpa(Math.round(gpa * 100) / 100);
 }
 }).catch(() => {}).finally(() => setIsLoading(false));
 }, []);

 const semesters = [...new Set(results.map(r => r.semester))].sort();
 const filteredResults = selectedSem ? results.filter(r => r.semester === selectedSem) : results;

 const chartData = {
 labels: filteredResults.map(r => r.course.subjectCode || r.course.title.slice(0, 8)),
 datasets: [
 { label: 'Marks', data: filteredResults.map(r => Math.round((r.totalMarks / r.maxMarks) * 100)), color: '#6366f1' },
 ],
 };

 const gradeOrder = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F'];

 return (
 <DashboardLayout requiredRole="student">
 <div className="mb-6">
 <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Academic Results</h1>
 <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Your semester-wise academic performance</p>
 </div>

 {/* CGPA Banner */}
 {sgpa && (
 <div className="card p-5 mb-6 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
 <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
 <TrendingUp size={24} className="text-white" />
 </div>
 <div>
 <p className="text-sm" style={{ color: 'var(--muted)' }}>Cumulative GPA (CGPA)</p>
 <p className="text-3xl font-black" style={{ color: 'var(--primary)' }}>{sgpa}</p>
 </div>
 </div>
 )}

 {/* Semester filter */}
 <div className="flex gap-2 mb-5 flex-wrap">
 <button
 onClick={() => setSelectedSem(null)}
 className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
 style={{
 background: !selectedSem ? 'var(--primary)' : 'var(--surface-2)',
 color: !selectedSem ? 'white' : 'var(--muted)',
 }}
 >
 All Semesters
 </button>
 {semesters.map(sem => (
 <button
 key={sem}
 onClick={() => setSelectedSem(sem)}
 className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
 style={{
 background: selectedSem === sem ? 'var(--primary)' : 'var(--surface-2)',
 color: selectedSem === sem ? 'white' : 'var(--muted)',
 }}
 >
 Sem {sem}
 </button>
 ))}
 </div>

 {/* Chart */}
 {filteredResults.length > 0 && (
 <div className="card p-5 mb-6">
 <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Performance Chart</h3>
 <BarChart labels={chartData.labels} datasets={chartData.datasets} height={200} />
 </div>
 )}

 {/* Results Table */}
 <div className="card overflow-hidden">
 <div className="table-container">
 <table>
 <thead>
 <tr>
 <th>Subject</th>
 <th>Code</th>
 <th>Internal</th>
 <th>External</th>
 <th>Total</th>
 <th>Grade</th>
 <th>Grade Points</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {isLoading ? (
 Array(5).fill(null).map((_, i) => (
 <tr key={i}>{Array(8).fill(null).map((_, j) => <td key={j}><div className="skeleton h-4 rounded" /></td>)}</tr>
 ))
 ) : filteredResults.length === 0 ? (
 <tr>
 <td colSpan={8} className="text-center py-12" style={{ color: 'var(--muted)' }}>
 No results published yet
 </td>
 </tr>
 ) : (
 filteredResults.map((result, i) => (
 <motion.tr
 key={result._id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: i * 0.05 }}
 >
 <td>
 <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
 {result.course.title}
 </span>
 </td>
 <td><span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>{result.course.subjectCode}</span></td>
 <td><span className="text-sm" style={{ color: 'var(--foreground)' }}>{result.internalMarks}</span></td>
 <td><span className="text-sm" style={{ color: 'var(--foreground)' }}>{result.externalMarks}</span></td>
 <td><span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{result.totalMarks}/{result.maxMarks}</span></td>
 <td>
 <span className={`text-lg font-black ${getGradeColor(result.grade)}`}>{result.grade}</span>
 </td>
 <td>
 <span className="text-sm" style={{ color: 'var(--foreground)' }}>{result.gradePoints}</span>
 </td>
 <td>
 <span className="badge text-xs" style={{
 background: result.status === 'pass' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
 color: result.status === 'pass' ? '#10b981' : '#ef4444',
 }}>
 {result.status === 'pass' ? ' Pass' : ' Fail'}
 </span>
 </td>
 </motion.tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </DashboardLayout>
 );
}
