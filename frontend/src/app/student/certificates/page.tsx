'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Award, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CertificatesPage() {
  const certificates = [
    { id: 1, title: 'Machine Learning Fundamentals', date: 'August 2, 2026', grade: 'A+', issuer: 'Prof. Amit Verma' },
    { id: 2, title: 'Advanced Data Structures', date: 'May 15, 2026', grade: 'A', issuer: 'Prof. Priya Sharma' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Certificates</h1>
        <p className="text-sm mt-0.5 text-zinc-500">View and download your earned course certificates</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, i) => (
          <motion.div 
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 shadow-sm border border-orange-100 dark:border-orange-500/20">
              <Award size={24} />
            </div>

            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 leading-tight flex-1">
              {cert.title}
            </h3>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Issued By</span>
                <span className="font-medium text-zinc-900 dark:text-white">{cert.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date Earned</span>
                <span className="font-medium text-zinc-900 dark:text-white">{cert.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Grade</span>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold rounded-md">
                  {cert.grade}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                <Download size={16} /> Download PDF
              </button>
              <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center min-h-[280px]"
        >
          <ShieldCheck size={40} className="text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Keep Learning</h3>
          <p className="text-sm text-zinc-500 max-w-[200px]">Complete more courses to earn verified certificates.</p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
