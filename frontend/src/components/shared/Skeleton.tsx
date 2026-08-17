'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-xl', className)} />;
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}

export function FilterTabsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit bg-zinc-100 dark:bg-zinc-800/50">
      {Array(count).fill(null).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-lg" />
      ))}
    </div>
  );
}

export function AssignmentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <div className="flex gap-3 pt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6, height = 'h-48' }: { count?: number; height?: string }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array(count).fill(null).map((_, i) => (
        <Skeleton key={i} className={cn(height, 'rounded-3xl')} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4, height = 'h-32' }: { count?: number; height?: string }) {
  return (
    <div className="space-y-4">
      {Array(count).fill(null).map((_, i) => (
        <Skeleton key={i} className={cn(height, 'rounded-2xl')} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array(rows).fill(null).map((_, i) => (
        <tr key={i}>
          {Array(cols).fill(null).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function LiveClassCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
      <div className="flex gap-3">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function CalendarEventsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array(count).fill(null).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      ))}
    </div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="space-y-3 pt-4">
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function StudentDashboardSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}

export function AuthLayoutSkeleton() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      <Skeleton className="hidden md:block w-[260px] h-screen rounded-none" />
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-16 w-full rounded-none" />
        <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full space-y-6">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <ListSkeleton count={3} height="h-24" />
        </div>
      </div>
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="min-h-[60vh] w-full p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeaderSkeleton />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <ListSkeleton count={4} />
    </div>
  );
}
