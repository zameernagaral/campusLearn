'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
 const checkAuth = useAuthStore(s => s.checkAuth);

 useEffect(() => {
 checkAuth();
 }, [checkAuth]);

 return (
 <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
 {children}
 <Toaster
 position="top-right"
 gutter={8}
 toastOptions={{
 duration: 4000,
 style: {
 background: 'var(--toast-bg, #1e1e2e)',
 color: 'var(--toast-color, #fff)',
 border: '1px solid rgba(99,102,241,0.3)',
 borderRadius: '12px',
 padding: '12px 16px',
 fontSize: '14px',
 fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
 boxShadow: 'none',
 },
 success: {
 iconTheme: { primary: '#10b981', secondary: '#fff' },
 style: { borderLeft: '4px solid #10b981' },
 },
 error: {
 iconTheme: { primary: '#ef4444', secondary: '#fff' },
 style: { borderLeft: '4px solid #ef4444' },
 },
 }}
 />
 </ThemeProvider>
 );
}
