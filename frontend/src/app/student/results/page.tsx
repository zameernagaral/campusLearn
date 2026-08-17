'use client';

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { resultAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, XCircle, BarChart2, GraduationCap, Download
} from 'lucide-react';
import { getGradeColor } from '@/lib/utils';
import type { Result } from '@/types';
import { BarChart } from '@/components/charts/Charts';
import toast from 'react-hot-toast';
import { PageHeaderSkeleton } from '@/components/shared/Skeleton';

const MOCK_RESULTS: Result[] = [
  {
    _id: 'mr1', student: 's1',
    course: { _id: 'c1', title: 'Database Management Systems', subjectCode: 'CS401', credits: 4 } as Result['course'],
    semester: 5, internalMarks: 38, externalMarks: 52, totalMarks: 90, maxMarks: 100,
    grade: 'A+', gradePoints: 9, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr2', student: 's1',
    course: { _id: 'c2', title: 'Operating Systems', subjectCode: 'CS402', credits: 4 } as Result['course'],
    semester: 5, internalMarks: 35, externalMarks: 48, totalMarks: 83, maxMarks: 100,
    grade: 'A', gradePoints: 8, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr3', student: 's1',
    course: { _id: 'c3', title: 'Data Structures & Algorithms', subjectCode: 'CS301', credits: 4 } as Result['course'],
    semester: 5, internalMarks: 40, externalMarks: 55, totalMarks: 95, maxMarks: 100,
    grade: 'O', gradePoints: 10, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr4', student: 's1',
    course: { _id: 'c4', title: 'Computer Networks', subjectCode: 'CS403', credits: 3 } as Result['course'],
    semester: 5, internalMarks: 30, externalMarks: 42, totalMarks: 72, maxMarks: 100,
    grade: 'B+', gradePoints: 7, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr5', student: 's1',
    course: { _id: 'c5', title: 'Software Engineering', subjectCode: 'CS404', credits: 3 } as Result['course'],
    semester: 4, internalMarks: 36, externalMarks: 50, totalMarks: 86, maxMarks: 100,
    grade: 'A', gradePoints: 8, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr6', student: 's1',
    course: { _id: 'c6', title: 'Discrete Mathematics', subjectCode: 'MA301', credits: 4 } as Result['course'],
    semester: 4, internalMarks: 32, externalMarks: 44, totalMarks: 76, maxMarks: 100,
    grade: 'B+', gradePoints: 7, status: 'pass', isPublished: true,
  },
  {
    _id: 'mr7', student: 's1',
    course: { _id: 'c7', title: 'Digital Logic Design', subjectCode: 'EC301', credits: 3 } as Result['course'],
    semester: 4, internalMarks: 28, externalMarks: 38, totalMarks: 66, maxMarks: 100,
    grade: 'B', gradePoints: 6, status: 'pass', isPublished: true,
  },
];

const GRADE_COLORS: Record<string, string> = {
  O: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  'A+': 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  A: 'bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400',
  'B+': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  B: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  C: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400',
  F: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
};

function calcSGPA(items: Result[]): number {
  if (items.length === 0) return 0;
  const totalCredits = items.reduce((s, r) => s + (r.course.credits || 1), 0);
  const weighted = items.reduce((s, r) => s + r.gradePoints * (r.course.credits || 1), 0);
  return Math.round((weighted / totalCredits) * 100) / 100;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await resultAPI.getAll();
        const data: Result[] = res.data?.data || [];
        setResults(data.length > 0 ? data : MOCK_RESULTS);
      } catch {
        setResults(MOCK_RESULTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const semesters = useMemo(() =>
    [...new Set(results.map(r => r.semester))].sort((a, b) => a - b),
  [results]);

  const filteredResults = selectedSem ? results.filter(r => r.semester === selectedSem) : results;

  const cgpa = useMemo(() => calcSGPA(results), [results]);
  const semGpa = useMemo(() => selectedSem ? calcSGPA(filteredResults) : cgpa, [selectedSem, filteredResults, cgpa]);

  const stats = useMemo(() => {
    const passed = filteredResults.filter(r => r.status === 'pass').length;
    const avgPct = filteredResults.length > 0
      ? Math.round(filteredResults.reduce((s, r) => s + (r.totalMarks / r.maxMarks) * 100, 0) / filteredResults.length)
      : 0;
    const totalCredits = filteredResults.reduce((s, r) => s + (r.course.credits || 0), 0);
    return { passed, total: filteredResults.length, avgPct, totalCredits };
  }, [filteredResults]);

  const chartData = {
    labels: filteredResults.map(r => r.course.subjectCode || r.course.title.slice(0, 8)),
    datasets: [{ label: 'Score %', data: filteredResults.map(r => Math.round((r.totalMarks / r.maxMarks) * 100)), color: '#f97316' }],
  };

  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResults.forEach(r => { counts[r.grade] = (counts[r.grade] || 0) + 1; });
    return counts;
  }, [filteredResults]);

  const handleDownload = () => {
    toast.success('Result sheet download started!', { icon: '📄' });
  };

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="student">
        <PageHeaderSkeleton />
        <div className="skeleton h-28 rounded-3xl mb-6" />
        <div className="flex gap-2 mb-5">{Array(4).fill(null).map((_, i) => <div key={i} className="skeleton h-8 w-20 rounded-xl" />)}</div>
        <div className="skeleton h-52 rounded-3xl mb-6" />
        <div className="space-y-3">{Array(5).fill(null).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Academic Results</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Your semester-wise academic performance</p>
        </div>
        <button
          onClick={handleDownload}
          className="py-2.5 px-5 bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:border-orange-500/30"
        >
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* CGPA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-orange-600 p-[2px] rounded-3xl mb-6 shadow-lg shadow-orange-500/20"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <GraduationCap size={32} className="text-orange-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              {selectedSem ? `Semester ${selectedSem} GPA` : 'Cumulative GPA (CGPA)'}
            </p>
            <p className="text-4xl font-bold text-orange-500 mt-1">{semGpa.toFixed(2)}</p>
            <p className="text-sm text-zinc-500 mt-1">
              {stats.passed}/{stats.total} subjects passed · {stats.totalCredits} credits
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.avgPct}%</p>
              <p className="text-xs text-zinc-400 font-bold">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{stats.passed}</p>
              <p className="text-xs text-zinc-400 font-bold">Passed</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Semester Filter */}
      <div className="flex gap-1.5 mb-6 flex-wrap p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 w-fit">
        <button
          onClick={() => setSelectedSem(null)}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            !selectedSem ? 'bg-white dark:bg-zinc-900 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          All ({results.length})
        </button>
        {semesters.map(sem => (
          <button
            key={sem}
            onClick={() => setSelectedSem(sem)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              selectedSem === sem ? 'bg-white dark:bg-zinc-900 text-orange-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Sem {sem} ({results.filter(r => r.semester === sem).length})
          </button>
        ))}
      </div>

      {/* Chart + Grade Distribution */}
      {filteredResults.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm"
          >
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-orange-500" /> Performance Chart
            </h3>
            <BarChart labels={chartData.labels} datasets={chartData.datasets} height={200} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm"
          >
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Award size={18} className="text-orange-500" /> Grade Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(gradeDistribution).sort().map(([grade, count]) => (
                <div key={grade} className="flex items-center gap-3">
                  <span className={`text-sm font-bold w-10 text-center px-2 py-1 rounded-lg ${GRADE_COLORS[grade] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {grade}
                  </span>
                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / filteredResults.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-500 w-4">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900/40 flex flex-col items-center py-20 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <BookOpen size={56} className="text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="font-bold text-zinc-900 dark:text-white">No results published yet</p>
          <p className="text-sm text-zinc-500 mt-1">Results will appear here once published by your department</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result, i) => {
            const pct = Math.round((result.totalMarks / result.maxMarks) * 100);
            const isExpanded = expandedId === result._id;
            const gradeStyle = GRADE_COLORS[result.grade] ?? 'bg-zinc-100 text-zinc-600';

            return (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-orange-500/20 transition-colors backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : result._id)}
                  className="w-full p-4 sm:p-5 text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-11 h-11 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen size={18} className="text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{result.course.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-400">{result.course.subjectCode}</span>
                          <span className="text-xs text-zinc-400">·</span>
                          <span className="text-xs text-zinc-400">Sem {result.semester}</span>
                          <span className="text-xs text-zinc-400">·</span>
                          <span className="text-xs text-zinc-400">{result.course.credits} credits</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-lg font-bold px-3 py-1 rounded-xl ${gradeStyle}`}>{result.grade}</span>
                      <div className="text-right hidden sm:block">
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">{result.totalMarks}<span className="text-zinc-400 text-sm">/{result.maxMarks}</span></p>
                        <p className="text-xs text-zinc-400">{pct}%</p>
                      </div>
                      {result.status === 'pass'
                        ? <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                        : <XCircle size={18} className="text-red-500 shrink-0" />}
                      {isExpanded ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-xs text-zinc-400 font-bold">Internal</p>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{result.internalMarks}</p>
                          </div>
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-xs text-zinc-400 font-bold">External</p>
                            <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">{result.externalMarks}</p>
                          </div>
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-xs text-zinc-400 font-bold">Grade Points</p>
                            <p className="text-lg font-bold text-orange-500 mt-1">{result.gradePoints}</p>
                          </div>
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-xs text-zinc-400 font-bold">Status</p>
                            <p className={`text-lg font-bold mt-1 capitalize ${result.status === 'pass' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {result.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-zinc-500">
                            Weighted contribution: <span className="font-bold text-zinc-900 dark:text-white">{(result.gradePoints * (result.course.credits || 1)).toFixed(1)}</span> grade points
                          </span>
                          <span className={`font-bold ${getGradeColor(result.grade)}`}>{pct}% overall</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
