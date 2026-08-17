import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col p-6 md:p-12">
      <nav className="flex text-sm text-zinc-500 dark:text-zinc-400 mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link></li>
          <li><ChevronRight size={14} className="mx-1" /></li>
          <li className="text-zinc-900 dark:text-white font-bold" aria-current="page">Terms of Service</li>
        </ol>
      </nav>

      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Terms of Service</h1>
        <div className="w-16 h-1 bg-orange-500"></div>
        <p className="text-zinc-600 dark:text-zinc-400">Last updated: August 2026</p>
        
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using CampusLearn, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. Use License</h2>
          <p>CampusLearn grants you a personal, non-exclusive, non-transferable license to access and use the platform for educational purposes within your registered institution.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. User Conduct</h2>
          <p>You agree not to use the platform for any unlawful purpose, to harass others, or to distribute malicious software or spam.</p>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Institutional Data</h2>
          <p>Institutions are responsible for managing the data they input into CampusLearn, including compliance with FERPA or relevant local educational data privacy laws.</p>
        </div>
      </div>
    </div>
  );
}
