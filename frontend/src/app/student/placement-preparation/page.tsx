'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Briefcase, Code, Users, FileText, Cpu, Star, ArrowRight } from 'lucide-react';

export default function PlacementPreparationPage() {
  return (
    <DashboardLayout requiredRole="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Placement Preparation</h1>
          <p className="text-muted mt-1">Get ready for your dream job</p>
        </div>
        <button className="btn btn-primary">Update Profile</button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 card p-6 flex flex-col items-center justify-center text-center border-t-4 border-teal-500">
          <div className="w-24 h-24 rounded-full border-8 border-teal-100 dark:border-teal-900 flex items-center justify-center mb-4">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">72%</span>
          </div>
          <h3 className="font-bold">Placement Ready</h3>
          <p className="text-sm text-muted mt-1">Keep practicing to reach 90%</p>
        </div>

        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Cpu size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Aptitude Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 80%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Code size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Coding Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 75%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Users size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">AI Mock Interviews</h4>
              <p className="text-xs text-muted mt-1">Score: 60%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><FileText size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Resume Analyzer</h4>
              <p className="text-xs text-muted mt-1">Score: 85%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Briefcase size={20} className="text-teal-500"/> Target Companies</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-black">G</div>
              <div>
                <p className="font-bold">Google</p>
                <p className="text-xs text-muted">Software Engineer</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600">85% Match</span>
          </div>
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-black">M</div>
              <div>
                <p className="font-bold">Microsoft</p>
                <p className="text-xs text-muted">SDE</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600">70% Match</span>
          </div>
          <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer border-dashed">
            <div className="flex items-center gap-3 text-muted">
              <Star size={24} />
              <p className="font-bold">Add Company</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
