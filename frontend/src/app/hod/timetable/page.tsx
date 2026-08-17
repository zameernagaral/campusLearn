'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PlaceholderPage() {
  return (
    <DashboardLayout requiredRole="hod">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">timetable</h1>
          <p className="text-muted mt-1">This module is part of the new intelligent features and will be fully populated soon.</p>
        </div>
      </div>
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2">Module Under Construction</h2>
        <p className="text-muted max-w-md">
          The API architecture for this feature has been successfully deployed. The frontend UI specific to the <strong>hod</strong> role is currently being built out.
        </p>
      </div>
    </DashboardLayout>
  );
}
