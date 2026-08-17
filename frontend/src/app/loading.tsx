export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 border-2 border-orange-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        
        {/* Solid spinning ring */}
        <div className="absolute inset-0 border-4 border-zinc-100 dark:border-zinc-800 rounded-full border-t-orange-500 animate-spin" style={{ animationDuration: '1s' }}></div>
      </div>
      <p className="text-sm font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase animate-pulse">
        Loading
      </p>
    </div>
  );
}
