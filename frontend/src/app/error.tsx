'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
import Link from 'next/link';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to local console (or a future tracking service)
    console.error('Captured by Next.js error boundary:', error);
  }, [error]);
 
  return (
    <div className="min-h-[70vh] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-1 bg-red-500 mb-6"></div>
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Something went wrong!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
        We've logged the error and our team will look into it. Please try again or return to the homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="btn btn-primary px-6 py-2"
        >
          Try again
        </button>
        <Link href="/" className="btn btn-secondary px-6 py-2">
          Go home
        </Link>
      </div>
    </div>
  );
}
