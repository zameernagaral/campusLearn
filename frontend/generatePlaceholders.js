const fs = require('fs');
const path = require('path');

const roles = ['student', 'faculty', 'hod', 'admin'];
const navItems = {
  student: ['dashboard', 'courses', 'career-roadmap', 'timetable', 'exam-preparation', 'placement-preparation', 'assignments', 'attendance', 'quiz', 'results', 'certificates', 'leaderboard', 'forum', 'ai-assistant', 'calendar', 'live'],
  faculty: ['dashboard', 'timetable', 'exam-preparation', 'courses', 'assignments', 'attendance', 'quiz', 'live', 'career-analytics', 'analytics', 'calendar'],
  hod: ['dashboard', 'timetable', 'faculty', 'students', 'courses', 'exam-analytics', 'career-analytics', 'placement-analytics', 'reports'],
  admin: ['dashboard', 'timetable', 'career', 'exam-preparation', 'placement', 'companies', 'users', 'departments', 'courses', 'analytics', 'settings'],
};

const baseDir = path.join(__dirname, 'src', 'app');

roles.forEach(role => {
  navItems[role].forEach(item => {
    const pageDir = path.join(baseDir, role, item);
    const pageFile = path.join(pageDir, 'page.tsx');
    
    if (!fs.existsSync(pageFile)) {
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }
      
      const content = `'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PlaceholderPage() {
  return (
    <DashboardLayout requiredRole="${role}">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">${item.replace(/-/g, ' ')}</h1>
          <p className="text-muted mt-1">This module is part of the new intelligent features and will be fully populated soon.</p>
        </div>
      </div>
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">Module Under Construction</h2>
        <p className="text-muted max-w-md">
          The API architecture for this feature has been successfully deployed. The frontend UI specific to the <strong>${role}</strong> role is currently being built out.
        </p>
      </div>
    </DashboardLayout>
  );
}
`;
      fs.writeFileSync(pageFile, content);
      console.log('Created ' + role + '/' + item + '/page.tsx');
    }
  });
});
