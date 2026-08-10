'use client';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { X, Building } from 'lucide-react';

interface Department {
  _id: string;
  id?: string;
  name: string;
  code: string;
  head?: string;
  hod?: { _id: string; name: string };
  totalFaculty: number;
  totalStudents: number;
  programs?: number;
}

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await adminAPI.getDepartments();
      setDepartments(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return toast.error('Name and Code are required');
    
    setIsSubmitting(true);
    try {
      await adminAPI.createDepartment(newDept);
      toast.success('Department created successfully!');
      setShowAddModal(false);
      setNewDept({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Departments</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Manage university departments and faculties</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 whitespace-nowrap flex items-center gap-2">
          <Building size={16} /> Add Department
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(null).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 h-48 skeleton" />
          ))
        ) : departments.length > 0 ? (
          departments.map((dept, i) => (
            <Link key={dept._id} href={`/admin/departments/${dept._id}`} className="block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all relative overflow-hidden h-full cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg">
                    {dept.code}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-sm text-zinc-500 font-medium mb-6 flex-1">
                  Head: {dept.hod?.name || dept.head || 'Not Assigned'}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 transition-colors group-hover:bg-orange-50 dark:group-hover:bg-orange-500/5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1 group-hover:text-orange-500/70 transition-colors">Faculty</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">{dept.totalFaculty || 0}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 transition-colors group-hover:bg-orange-50 dark:group-hover:bg-orange-500/5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1 group-hover:text-orange-500/70 transition-colors">Students</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">{dept.totalStudents || 0}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="col-span-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/20">
            <p className="text-zinc-500 font-medium mb-4">No departments found.</p>
            <button onClick={() => setShowAddModal(true)} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20">
              Create First Department
            </button>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/60">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Add Department</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Department Name</label>
                  <input
                    type="text"
                    required
                    value={newDept.name}
                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Department Code</label>
                  <input
                    type="text"
                    required
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    placeholder="e.g. CS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Description (Optional)</label>
                  <textarea
                    value={newDept.description}
                    onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 resize-none h-24"
                    placeholder="Brief description of the department"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newDept.name || !newDept.code}
                    className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
