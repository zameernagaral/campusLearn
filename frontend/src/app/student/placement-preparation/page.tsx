'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Briefcase, Code, Users, FileText, Cpu, Star, ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function PlacementPreparationPage() {
 const [companies, setCompanies] = useState([
 { name: 'Google', role: 'Software Engineer', match: 85, initial: 'G' },
 { name: 'Microsoft', role: 'SDE', match: 70, initial: 'M' }
 ]);

 const [activeModule, setActiveModule] = useState<string | null>(null);
 const [isAssessing, setIsAssessing] = useState(false);
 const [selectedOption, setSelectedOption] = useState<number | null>(null);
 const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
 
 const [isAddingCompany, setIsAddingCompany] = useState(false);
 const [newCompanyName, setNewCompanyName] = useState('');

 const handleSaveCompany = (e: React.FormEvent) => {
 e.preventDefault();
 if (newCompanyName && newCompanyName.trim() !== '') {
 setCompanies([...companies, {
 name: newCompanyName,
 role: 'Software Engineer',
 match: Math.floor(Math.random() * 40) + 50, // random 50-90
 initial: newCompanyName.charAt(0).toUpperCase()
 }]);
 setNewCompanyName('');
 setIsAddingCompany(false);
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
 
 {activeModule === 'Aptitude' && (
 <div className="w-full max-w-2xl bg-surface-2 p-6 rounded-xl border border-border">
 <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Question 1 of 20</span>
 <h2 className="text-xl font-medium mb-6">A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?</h2>
 <div className="space-y-3">
 {['120 meters', '150 meters', '180 meters', '324 meters'].map((opt, i) => (
 <button key={i} onClick={() => setSelectedOption(i)} className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedOption === i ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-border hover:border-primary hover:bg-primary/5'}`}>{opt}</button>
 ))}
 </div>
 </div>
 )}

 {activeModule === 'Coding' && (
 <div className="w-full max-w-2xl bg-surface-2 p-6 rounded-xl border border-border">
 <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Question 1 of 5</span>
 <h2 className="text-xl font-medium mb-6">What is the time complexity of binary search?</h2>
 <div className="space-y-3">
 {['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'].map((opt, i) => (
 <button key={i} onClick={() => setSelectedOption(i)} className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedOption === i ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-border hover:border-primary hover:bg-primary/5'}`}>{opt}</button>
 ))}
 </div>
 </div>
 )}

 {activeModule === 'AI Mock Interview' && (
 <div className="w-full max-w-3xl">
 <div className="bg-black aspect-video rounded-xl border-4 border-indigo-500/50 flex flex-col items-center justify-center relative overflow-hidden mb-6">
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
 <Users size={64} className="text-white/20 absolute" />
 <div className="z-20 text-center pb-8 mt-auto w-full px-8">
 <p className="text-white/70 font-mono text-sm mb-2">● REC 00:00</p>
 <p className="text-white text-xl font-medium">"Tell me about a time you had to overcome a difficult technical challenge."</p>
 </div>
 </div>
 <div className="flex justify-center gap-4">
 <button className="btn btn-outline text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">End Interview</button>
 <button onClick={() => setSelectedOption(1)} className={`btn ${selectedOption === 1 ? 'bg-indigo-600 text-white' : 'btn-primary'}`}>
 {selectedOption === 1 ? 'Speaking...' : 'Start Answering'}
 </button>
 </div>
 </div>
 )}

 {activeModule === 'Resume Analyzer' && (
 <div className="w-full max-w-2xl bg-surface-2 p-12 rounded-xl border-2 border-dashed border-primary/50 text-center">
 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
 <FileText size={32} />
 </div>
 <h2 className="text-xl font-bold mb-2">Upload your Latest Resume</h2>
 <p className="text-muted mb-8">PDF, DOCX, up to 5MB</p>
 <button onClick={() => setSelectedOption(1)} className={`btn ${selectedOption === 1 ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-primary'}`}>
 {selectedOption === 1 ? 'File Uploaded!' : 'Select File'}
 </button>
 </div>
 )}

 <div className="w-full max-w-2xl mt-6 flex justify-end">
 <button 
 onClick={() => { 
 if (selectedOption === null) {
 alert('Please interact with the module first!');
 return;
 }
 setIsAssessing(false); 
 setActiveModule(null); 
 setSelectedOption(null);
 alert('Analysis Completed Successfully! AI is updating your readiness score...');
 }} 
 className="btn btn-primary bg-indigo-600 hover:bg-indigo-700"
 >
 Submit & Analyze
 </button>
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
 <Toaster position="top-right" />
 
 {isUpdatingProfile && (
 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-6 rounded-2xl w-full max-w-md border border-border shadow-2xl relative">
 <button onClick={() => setIsUpdatingProfile(false)} className="absolute top-4 right-4 text-muted hover:text-foreground">
 <X size={20} />
 </button>
 <h2 className="text-xl font-bold mb-4">Update Placement Profile</h2>
 <div className="space-y-4">
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">LinkedIn URL</label>
 <input type="text" defaultValue="https://linkedin.com/in/student" className="input w-full p-2" />
 </div>
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">GitHub URL</label>
 <input type="text" defaultValue="https://github.com/student" className="input w-full p-2" />
 </div>
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Primary Skill</label>
 <select className="input w-full p-2">
 <option>Full Stack Development</option>
 <option>Data Science</option>
 <option>Cybersecurity</option>
 </select>
 </div>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button onClick={() => setIsUpdatingProfile(false)} className="btn btn-ghost">Cancel</button>
 <button 
 onClick={() => {
 setIsUpdatingProfile(false);
 toast.success('Profile updated successfully!');
 }} 
 className="btn btn-primary bg-teal-600 hover:bg-teal-700"
 >
 Save Changes
 </button>
 </div>
 </div>
 </div>
 )}

 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold text-foreground">AI Placement Preparation</h1>
 <p className="text-muted mt-1">Get ready for your dream job</p>
 </div>
 <button onClick={() => setIsUpdatingProfile(true)} className="btn btn-primary">Update Profile</button>
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
 <div key={i} onClick={() => alert(`Viewing AI insights and interview preparation guide for ${company.name}...`)} className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer">
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
 
 {!isAddingCompany ? (
 <div onClick={() => setIsAddingCompany(true)} className="p-4 border border-border rounded-xl flex items-center justify-between hover:border-teal-500 transition-colors cursor-pointer border-dashed">
 <div className="flex items-center gap-3 text-muted">
 <Star size={24} />
 <p className="font-bold">Add Company</p>
 </div>
 </div>
 ) : (
 <form onSubmit={handleSaveCompany} className="p-4 border border-teal-500 rounded-xl flex flex-col justify-center gap-2">
 <input 
 type="text" 
 value={newCompanyName}
 onChange={(e) => setNewCompanyName(e.target.value)}
 placeholder="Company Name..."
 className="input py-1.5 px-3 text-sm"
 autoFocus
 />
 <div className="flex gap-2">
 <button type="submit" className="btn btn-primary py-1 px-3 text-xs flex-1 bg-teal-600 hover:bg-teal-700">Save</button>
 <button type="button" onClick={() => setIsAddingCompany(false)} className="btn btn-outline py-1 px-3 text-xs flex-1">Cancel</button>
 </div>
 </form>
 )}
 </div>
 </div>
 </DashboardLayout>
 );
}
