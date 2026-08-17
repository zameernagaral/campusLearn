'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Briefcase, Code, Users, FileText, Cpu, Star, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PlacementPreparationPage() {
  const [companies, setCompanies] = useState([
    { name: 'Google', role: 'Software Engineer', match: 85, initial: 'G' },
    { name: 'Microsoft', role: 'SDE', match: 70, initial: 'M' }
  ]);

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  const handleAddCompany = () => {
    const companyName = window.prompt('Enter target company name:');
    if (companyName && companyName.trim() !== '') {
      setCompanies([...companies, {
        name: companyName,
        role: 'Software Engineer',
        match: Math.floor(Math.random() * 40) + 50, // random 50-90
        initial: companyName.charAt(0).toUpperCase()
      }]);
    }
  };

  if (activeModule) {
    if (isAssessing) {
      return (
        <DashboardLayout requiredRole="student">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{activeModule} Assessment</h1>
            <span className="text-red-500 font-bold bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-lg animate-pulse">09:59</span>
          </div>
          <div className="card p-8 min-h-[50vh] flex flex-col justify-center items-center">
            <div className="w-full max-w-2xl bg-surface-2 p-6 rounded-xl border border-border">
              <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Question 1 of 15</span>
              <h2 className="text-xl font-medium mb-6">What is the time complexity of binary search?</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">O(1)</button>
                <button className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">O(n)</button>
                <button className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">O(log n)</button>
                <button className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors">O(n^2)</button>
              </div>
            </div>
            <div className="w-full max-w-2xl mt-6 flex justify-end">
              <button onClick={() => { setIsAssessing(false); setActiveModule(null); }} className="btn btn-primary">Submit Test</button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout requiredRole="student">
        <button onClick={() => setActiveModule(null)} className="btn btn-ghost mb-4 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="card p-8 text-center min-h-[60vh] flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
            {activeModule === 'Aptitude' && <Cpu size={40} />}
            {activeModule === 'Coding' && <Code size={40} />}
            {activeModule === 'AI Mock Interview' && <Users size={40} />}
            {activeModule === 'Resume Analyzer' && <FileText size={40} />}
          </div>
          <h1 className="text-3xl font-bold mb-4">{activeModule} Preparation Module</h1>
          <p className="text-muted max-w-md mx-auto mb-8">
            This interactive module provides AI-driven adaptive questions to evaluate and improve your skills in {activeModule}.
          </p>
          <button onClick={() => setIsAssessing(true)} className="btn btn-primary px-8 py-3 text-lg">Start Assessment</button>
        </div>
      </DashboardLayout>
    );
  }

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
          <div onClick={() => setActiveModule('Aptitude')} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Cpu size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Aptitude Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 80%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div onClick={() => setActiveModule('Coding')} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Code size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">Coding Preparation</h4>
              <p className="text-xs text-muted mt-1">Score: 75%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div onClick={() => setActiveModule('AI Mock Interview')} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Users size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold">AI Mock Interviews</h4>
              <p className="text-xs text-muted mt-1">Score: 60%</p>
            </div>
            <ArrowRight size={16} className="text-muted" />
          </div>
          <div onClick={() => setActiveModule('Resume Analyzer')} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
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
          {companies.map((company, i) => (
            <div key={i} className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-black">{company.initial}</div>
                <div>
                  <p className="font-bold">{company.name}</p>
                  <p className="text-xs text-muted">{company.role}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-600">{company.match}% Match</span>
            </div>
          ))}
          <div onClick={handleAddCompany} className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer border-dashed">
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
