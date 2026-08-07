'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getRoleDashboard } from '@/lib/utils';

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getRoleDashboard(user.role));
    } else if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
