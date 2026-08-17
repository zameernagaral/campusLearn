import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-8xl font-bold text-zinc-900 dark:text-white">404</h1>
        <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Page Not Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link href="/" className="btn btn-primary px-6 py-2">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
