'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function FacultyAnalyticsPage() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#fafafa',
        bodyColor: '#fafafa',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: 'Inter' }, color: '#a1a1aa' }
      },
      y: {
        grid: { color: '#27272a', borderDash: [5, 5], drawBorder: false },
        ticks: { font: { family: 'Inter' }, color: '#a1a1aa' }
      }
    }
  };

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Average Score',
        data: [72, 75, 78, 76, 82, 85],
        backgroundColor: '#f97316',
        borderRadius: 4,
      }
    ]
  };

  const metrics = [
    { label: 'Total Students', value: '150+', change: '+12%', trend: 'up' },
    { label: 'Avg Attendance', value: '88%', change: '+2.4%', trend: 'up' },
    { label: 'Avg Assignment Score', value: '82/100', change: '+5%', trend: 'up' },
    { label: 'Course Completion', value: '45%', change: 'On track', trend: 'neutral' },
  ];

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Track student performance and course engagement</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl w-fit">
          <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm transition-colors">
            Overview
          </button>
          <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            Detailed Reports
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
              <span className="text-6xl font-black text-orange-500">{i + 1}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 relative z-10">{metric.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 relative z-10">{metric.value}</h3>
            <p className={`text-xs font-bold relative z-10 ${
              metric.trend === 'up' ? 'text-emerald-500' : 'text-zinc-500'
            }`}>
              {metric.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Class Performance Trends</h3>
              <select className="bg-zinc-100 dark:bg-zinc-900 border-none text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option>All Courses</option>
                <option>CS601 Machine Learning</option>
                <option>CS501 Data Structures</option>
              </select>
            </div>
            <div className="flex-1 min-h-0">
              <Bar data={performanceData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Performers Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Needs Attention</h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {[
                { name: 'Arjun Mehta', course: 'CS601', reason: 'Missed 3 assignments', status: 'critical' },
                { name: 'Sarah Khan', course: 'CS501', reason: 'Low quiz scores', status: 'warning' },
                { name: 'Ravi Kumar', course: 'CS601', reason: 'Low attendance', status: 'warning' },
              ].map((student, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">{student.name}</p>
                    <p className="text-xs font-medium text-zinc-500">{student.reason}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                    student.status === 'critical' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500'
                  }`}>
                    {student.course}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="w-full mt-4 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm">
              View All Students
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
