'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Users, Map, TrendingUp, BarChart2, Star, PieChart, Activity, Briefcase, Building, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HodPlacementAnalyticsPage() {
  const companyStats = [
    { name: 'Google', required: 85, readyStudents: 45, applicants: 120 },
    { name: 'Microsoft', required: 80, readyStudents: 60, applicants: 150 },
    { name: 'Amazon', required: 75, readyStudents: 110, applicants: 200 },
    { name: 'TCS', required: 60, readyStudents: 450, applicants: 800 },
  ];

  return (
    <DashboardLayout requiredRole="hod">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Placement Readiness Overview</h1>
          <p className="text-muted mt-1">Monitor department-wide placement scores and company readiness</p>
        </div>
        <button onClick={() => toast.success('Syncing latest placement data with TPO office...')} className="btn btn-primary flex items-center gap-2">
          <TrendingUp size={18} /> Sync TPO Data
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
                    <button onClick={() => toast.success(`Viewing ready students list for ${comp.name}`)} className="btn btn-outline text-xs py-1.5 px-3">View Students</button>
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
