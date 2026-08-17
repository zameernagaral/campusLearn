import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col p-6 md:p-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-zinc-500 dark:text-zinc-400 mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight size={14} className="mx-1" />
          </li>
          <li className="text-zinc-900 dark:text-white font-bold" aria-current="page">
            Thank You
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 -mt-24">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white">
          Thank You!
        </h1>
        <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Your request has been successfully received. We appreciate your interest and will be in touch shortly.
        </p>
        <div className="pt-8">
          <Link href="/" className="btn btn-primary px-8 py-3 text-base">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
