import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
 return new Intl.DateTimeFormat('en-IN', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 ...options,
 }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
 const now = new Date();
 const d = new Date(date);
 const diffMs = now.getTime() - d.getTime();
 const diffSecs = Math.floor(diffMs / 1000);
 const diffMins = Math.floor(diffSecs / 60);
 const diffHours = Math.floor(diffMins / 60);
 const diffDays = Math.floor(diffHours / 24);

 if (diffSecs < 60) return 'just now';
 if (diffMins < 60) return `${diffMins}m ago`;
 if (diffHours < 24) return `${diffHours}h ago`;
 if (diffDays < 7) return `${diffDays}d ago`;
 return formatDate(date);
}

export function formatDuration(seconds: number): string {
 if (!seconds) return '0:00';
 const h = Math.floor(seconds / 3600);
 const m = Math.floor((seconds % 3600) / 60);
 const s = seconds % 60;
 if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
 return `${m}:${String(s).padStart(2, '0')}`;
}

export function getInitials(name: string): string {
 return name
 .split(' ')
 .map(n => n[0])
 .join('')
 .toUpperCase()
 .slice(0, 2);
}

export function getAttendanceColor(percentage: number): string {
 if (percentage >= 85) return 'text-emerald-500';
 if (percentage >= 75) return 'text-amber-500';
 return 'text-red-500';
}

export function getGradeColor(grade: string): string {
 const colors: Record<string, string> = {
 O: 'text-emerald-500',
 'A+': 'text-blue-500',
 A: 'text-blue-400',
 'B+': 'text-indigo-500',
 B: 'text-indigo-400',
 C: 'text-amber-500',
 F: 'text-red-500',
 };
 return colors[grade] || 'text-gray-500';
}

export function truncate(str: string, length: number): string {
 if (str.length <= length) return str;
 return str.substring(0, length) + '...';
}

export function getRoleColor(role: string): string {
 const colors: Record<string, string> = {
 admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
 hod: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
 faculty: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
 student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
 };
 return colors[role] || 'bg-gray-100 text-gray-700';
}

export function getRoleDashboard(role: string): string {
 const paths: Record<string, string> = {
 admin: '/admin/dashboard',
 hod: '/hod/dashboard',
 faculty: '/faculty/dashboard',
 student: '/student/dashboard',
 };
 return paths[role] || '/';
}

export const BADGE_ICONS: Record<string, string> = {
 quick_learner: '',
 first_quiz: '',
 top_performer: '',
 quiz_master: '',
 consistent_learner: '',
 streak_7: '',
 streak_30: '',
 perfect_score: '',
};
