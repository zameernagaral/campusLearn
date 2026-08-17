'use client';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-1 bg-red-500 mb-6"></div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">A critical error occurred!</h2>
          <p className="text-zinc-600 max-w-md mb-8">
            The application encountered a fatal crash. We apologize for the inconvenience.
          </p>
          <button
            onClick={() => reset()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 transition-colors"
          >
            Reload application
          </button>
        </div>
      </body>
    </html>
  );
}
