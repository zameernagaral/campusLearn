'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getRoleDashboard } from '@/lib/utils';
import { AuthLayoutSkeleton } from '@/components/shared/Skeleton';

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

 return <AuthLayoutSkeleton />;
}
