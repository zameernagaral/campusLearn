'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
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
  Filler
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
  Filler
);

export default function AdminAnalyticsPage() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  const enrollmentData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Total Students',
        data: [3200, 3500, 3850, 4100, 4600, 5200],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const departmentData = {
    labels: ['CS', 'EE', 'ME', 'BA', 'MD', 'LA'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: [850, 620, 710, 950, 420, 1100],
        backgroundColor: '#f97316',
        borderRadius: 4,
      }
    ]
  };

  const metrics = [
    { label: 'Total Enrollment', value: '5,200', change: '+12%', trend: 'up' },
    { label: 'Active Courses', value: '450', change: '+5%', trend: 'up' },
    { label: 'Total Faculty', value: '380', change: '+2%', trend: 'up' },
    { label: 'Avg Graduation Rate', value: '92%', change: 'Stable', trend: 'neutral' },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">University Analytics</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Comprehensive overview of university metrics</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-xl w-fit">
          <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm transition-colors">
            Overview
          </button>
          <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            Financials
          </button>
          <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            Export
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
            className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-colors"
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

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Enrollment Growth</h3>
            <select className="bg-zinc-100 dark:bg-zinc-900 border-none text-xs font-bold text-zinc-600 dark:text-zinc-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>Last 5 Years</option>
              <option>Last 10 Years</option>
            </select>
          </div>
          <div className="flex-1 min-h-0">
            <Line data={enrollmentData} options={chartOptions as any} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 lg:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Students by Department</h3>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-widest">
              View All
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Bar data={departmentData} options={chartOptions as any} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
