'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building, Plus, Search, MapPin, Globe, Briefcase, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminCompaniesPage() {
 const [isAddingCompany, setIsAddingCompany] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

 const [companies, setCompanies] = useState([
 { id: 1, name: 'Google', location: 'Mountain View, CA', website: 'careers.google.com', roles: 12, status: 'Active' },
 { id: 2, name: 'Microsoft', location: 'Redmond, WA', website: 'careers.microsoft.com', roles: 8, status: 'Active' },
 { id: 3, name: 'Amazon', location: 'Seattle, WA', website: 'amazon.jobs', roles: 15, status: 'Active' },
 { id: 4, name: 'TCS', location: 'Mumbai, India', website: 'tcs.com/careers', roles: 45, status: 'Active' },
 { id: 5, name: 'Infosys', location: 'Bengaluru, India', website: 'infosys.com/careers', roles: 30, status: 'Inactive' },
 ]);

 const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

 const handleAddCompany = (e: React.FormEvent) => {
 e.preventDefault();
 toast.success('New company successfully added!');
 setIsAddingCompany(false);
 };

 return (
 <DashboardLayout requiredRole="admin">
 <Toaster position="top-right" />

 {isAddingCompany && (
 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface p-6 rounded-2xl w-full max-w-md border border-border shadow-2xl">
 <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building size={20} className="text-primary"/> Add New Company</h2>
 <form onSubmit={handleAddCompany} className="space-y-4">
 <div>
 <label className="block text-sm font-medium mb-1 text-muted">Company Name</label>
 <input type="text" required className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2" placeholder="e.g. Meta" />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1 text-muted">Headquarters Location</label>
 <input type="text" required className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2" placeholder="e.g. Menlo Park, CA" />
 </div>
 <div>
 <label className="block text-sm font-medium mb-1 text-muted">Careers Website</label>
 <input type="url" required className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2" placeholder="https://" />
 </div>
 <div className="pt-4 flex justify-end gap-2">
 <button type="button" onClick={() => setIsAddingCompany(false)} className="btn btn-ghost">Cancel</button>
 <button type="submit" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700">Add Company</button>
 </div>
 </form>
 </div>
 </div>
 )}

 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-2xl font-bold text-foreground">Partner Companies</h1>
 <p className="text-muted mt-1">Manage onboarding and placement partnerships across the campus</p>
 </div>
 <button onClick={() => setIsAddingCompany(true)} className="btn btn-primary flex items-center gap-2">
 <Plus size={18} /> Add Company
 </button>
 </div>

 <div className="card p-4 mb-6 flex items-center gap-3">
 <Search size={20} className="text-muted" />
 <input 
 type="text" 
 placeholder="Search companies by name..." 
 className="bg-transparent border-none outline-none w-full font-medium"
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 />
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredCompanies.map(company => (
 <div key={company.id} className="card p-6 border border-border hover:shadow-lg transition-all group">
 <div className="flex justify-between items-start mb-4">
 <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl">
 {company.name.charAt(0)}
 </div>
 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 <button className="p-1.5 text-muted hover:text-blue-500 bg-surface-2 rounded-md"><Edit2 size={14} /></button>
 <button className="p-1.5 text-muted hover:text-red-500 bg-surface-2 rounded-md"><Trash2 size={14} /></button>
 </div>
 </div>
 <h3 className="text-xl font-bold mb-1">{company.name}</h3>
 <div className="flex items-center gap-2 text-sm text-muted mb-4">
 <MapPin size={14} /> {company.location}
 </div>
 
 <div className="space-y-3 pt-4 border-t border-border">
 <div className="flex items-center justify-between text-sm">
 <span className="flex items-center gap-2 text-muted"><Globe size={14} /> Website</span>
 <span className="font-medium text-blue-500 truncate max-w-[120px]">{company.website}</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="flex items-center gap-2 text-muted"><Briefcase size={14} /> Open Roles</span>
 <span className="font-bold">{company.roles}</span>
 </div>
 </div>
 
 <div className="mt-6">
 <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${company.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
 {company.status}
 </span>
 </div>
 </div>
 ))}
 </div>
 </DashboardLayout>
 );
}
