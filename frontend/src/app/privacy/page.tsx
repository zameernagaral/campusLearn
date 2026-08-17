import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col p-6 md:p-12">
      <nav className="flex text-sm text-zinc-500 dark:text-zinc-400 mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link></li>
          <li><ChevronRight size={14} className="mx-1" /></li>
          <li className="text-zinc-900 dark:text-white font-bold" aria-current="page">Privacy Policy</li>
        </ol>
      </nav>

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Privacy Policy</h1>
        <div className="w-16 h-1 bg-orange-500"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Last updated: August 2026</p>
        
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect information necessary to provide educational services, including names, email addresses, institutional affiliations, and course performance data.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. How We Use Information</h2>
          <p>Information is used solely to facilitate the educational experience, including attendance tracking, assignment grading, and internal analytics.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. Data Sharing</h2>
          <p>CampusLearn does NOT sell your personal data. Data is only shared with your respective educational institution or when required by law.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
        </div>
      </div>
    </div>
  );
}
