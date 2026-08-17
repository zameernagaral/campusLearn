import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
 title: {
 default: 'CampusLearn - One Platform for Smarter College Learning',
 template: '%s | CampusLearn',
 },
 description:
 'CampusLearn is a centralized role-based e-learning platform for colleges. Manage courses, attendance, assignments, quizzes, and more - all in one place.',
 keywords: ['e-learning', 'college', 'LMS', 'courses', 'assignments', 'attendance', 'campus'],
 authors: [{ name: 'CampusLearn Team' }],
 openGraph: {
 type: 'website',
 title: 'CampusLearn - One Platform for Smarter College Learning',
 description: 'Centralized LMS for colleges. Student, Faculty, HOD, and Admin portals.',
 siteName: 'CampusLearn',
 },
 robots: { index: true, follow: true },
 manifest: '/manifest.json',
};

export const viewport: Viewport = {
 themeColor: [
 { media: '(prefers-color-scheme: light)', color: '#6366f1' },
 { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
 ],
 width: 'device-width',
 initialScale: 1,
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en" suppressHydrationWarning>
 <head>
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 </head>
 <body className={`antialiased`}>
 <Providers>{children}</Providers>
 </body>
 </html>
 );
}
