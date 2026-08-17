'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from './Sidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { getRoleDashboard } from '@/lib/utils';

interface DashboardLayoutProps {
 children: React.ReactNode;
 requiredRole?: string | string[];
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const { user, isAuthenticated, isLoading } = useAuthStore();
 const router = useRouter();

 useEffect(() => {
 if (!isLoading && !isAuthenticated) {
 router.push('/login');
 return;
 }

 if (user && requiredRole) {
 const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
 if (!roles.includes(user.role)) {
 router.push(getRoleDashboard(user.role));
 }
 }
 }, [isAuthenticated, isLoading, user, requiredRole, router]);

 if (isLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
 <div className="flex flex-col items-center gap-4">
 <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
 <span className="text-white text-2xl"></span>
 </div>
 <p style={{ color: 'var(--muted)' }} className="text-sm">Loading CampusLearn...</p>
 </div>
 </div>
 );
 }

 if (!isAuthenticated || !user) return null;

 return (
 <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
 {/* Sidebar */}
 <Sidebar
 isOpen={sidebarOpen}
 onClose={() => setSidebarOpen(false)}
 role={user.role}
 />

 {/* Mobile overlay */}
 {sidebarOpen && (
 <div
 className="fixed inset-0 z-30 bg-zinc-950/40 backdrop-blur-sm md:hidden"
 onClick={() => setSidebarOpen(false)}
 />
 )}

 {/* Main content */}
 <div
 className="flex-1 flex flex-col overflow-hidden"
 style={{ marginLeft: 'clamp(0px, 260px, 260px)' }}
 >
 <DashboardNavbar
 user={user}
 onMenuClick={() => setSidebarOpen(!sidebarOpen)}
 />

 <main className="flex-1 overflow-y-auto p-6">
 <div className="max-w-[1400px] mx-auto">
 {children}
 </div>
 </main>
 </div>
 </div>
 );
}
