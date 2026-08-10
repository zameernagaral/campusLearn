'use client';
import { useState, useEffect, use } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Users as UsersIcon, UserCircle, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  semester?: number;
}

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  hod?: { _id: string; name: string; email: string };
  totalFaculty: number;
  totalStudents: number;
}

export default function DepartmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [department, setDepartment] = useState<Department | null>(null);
  const [faculty, setFaculty] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'faculty' | 'students'>('faculty');
  const [selectedHod, setSelectedHod] = useState<string>('');
  const [isUpdatingHod, setIsUpdatingHod] = useState(false);
  const [facultyPage, setFacultyPage] = useState(1);
  const [hasMoreFaculty, setHasMoreFaculty] = useState(false);
  const [isLoadingMoreFaculty, setIsLoadingMoreFaculty] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [hasMoreStudents, setHasMoreStudents] = useState(false);
  const [isLoadingMoreStudents, setIsLoadingMoreStudents] = useState(false);

  const [semesterFilter, setSemesterFilter] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [unwrappedParams.id, semesterFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [deptRes, facultyRes, studentRes] = await Promise.all([
        adminAPI.getDepartment(unwrappedParams.id),
        adminAPI.getUsers({ department: unwrappedParams.id, role: 'faculty', page: 1, limit: 20, semester: semesterFilter || undefined }),
        adminAPI.getUsers({ department: unwrappedParams.id, role: 'student', page: 1, limit: 20, semester: semesterFilter || undefined })
      ]);
      setDepartment(deptRes.data.data);
      if (deptRes.data.data?.hod) {
        setSelectedHod(deptRes.data.data.hod._id);
      }
      setFaculty(facultyRes.data.data);
      setHasMoreFaculty(facultyRes.data.meta?.hasNext || false);
      setFacultyPage(1);
      
      setStudents(studentRes.data.data);
      setHasMoreStudents(studentRes.data.meta?.hasNext || false);
      setStudentPage(1);
    } catch (error) {
      toast.error('Failed to load department details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreFaculty = async () => {
    try {
      setIsLoadingMoreFaculty(true);
      const nextPage = facultyPage + 1;
      const res = await adminAPI.getUsers({ department: unwrappedParams.id, role: 'faculty', page: nextPage, limit: 20, semester: semesterFilter || undefined });
      setFaculty(prev => [...prev, ...res.data.data]);
      setFacultyPage(nextPage);
      setHasMoreFaculty(res.data.meta?.hasNext || false);
    } catch (error) {
      toast.error('Failed to load more faculty');
    } finally {
      setIsLoadingMoreFaculty(false);
    }
  };

  const loadMoreStudents = async () => {
    try {
      setIsLoadingMoreStudents(true);
      const nextPage = studentPage + 1;
      const res = await adminAPI.getUsers({ department: unwrappedParams.id, role: 'student', page: nextPage, limit: 20, semester: semesterFilter || undefined });
      setStudents(prev => [...prev, ...res.data.data]);
      setStudentPage(nextPage);
      setHasMoreStudents(res.data.meta?.hasNext || false);
    } catch (error) {
      toast.error('Failed to load more students');
    } finally {
      setIsLoadingMoreStudents(false);
    }
  };

  const handleAssignHod = async () => {
    if (!selectedHod) return;
    try {
      setIsUpdatingHod(true);
      await adminAPI.updateDepartment(unwrappedParams.id, { hod: selectedHod });
      toast.success('HOD updated successfully');
      fetchData(); // Refresh to get populated HOD
    } catch (error) {
      toast.error('Failed to update HOD');
    } finally {
      setIsUpdatingHod(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="text-center py-12">Department not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/admin/departments" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Departments
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest rounded-lg">
                {department.code}
              </span>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{department.name}</h1>
            </div>
            {department.description && (
              <p className="text-zinc-500 mt-2 text-sm max-w-2xl">{department.description}</p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Tabs) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('faculty')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'faculty' ? 'border-orange-500 text-orange-500' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  Faculty Members ({department.totalFaculty})
                </button>
                <button 
                  onClick={() => setActiveTab('students')}
                  className={`pb-4 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'students' ? 'border-orange-500 text-orange-500' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  Students ({department.totalStudents})
                </button>
              </div>
              <div className="pb-3 px-4">
                <select 
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-orange-500 transition-colors text-zinc-900 dark:text-white font-medium"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Semester</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {(activeTab === 'faculty' ? faculty : students).map((user) => (
                      <tr key={user._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {department.hod?._id === user._id && (
                              <span title="Head of Department" className="text-orange-500"><CheckCircle2 size={16} /></span>
                            )}
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          {user.semester ? `Sem ${user.semester}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(activeTab === 'faculty' ? faculty : students).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                          No {activeTab} found in this department.
                        </td>
                      </tr>
                    )}
                    {(activeTab === 'faculty' ? hasMoreFaculty : hasMoreStudents) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center">
                          <button
                            onClick={activeTab === 'faculty' ? loadMoreFaculty : loadMoreStudents}
                            disabled={isLoadingMoreFaculty || isLoadingMoreStudents}
                            className="px-4 py-2 text-sm font-bold bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                          >
                            {(isLoadingMoreFaculty || isLoadingMoreStudents) ? 'Loading...' : 'Load More Users'}
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* HOD Assignment Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <UserCircle size={18} className="text-orange-500" />
                Head of Department
              </h3>
              
              <div className="space-y-4">
                {department.hod ? (
                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                    <p className="font-bold text-zinc-900 dark:text-white">{department.hod.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{department.hod.email}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 text-center text-zinc-500 text-sm">
                    No HOD Assigned
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Reassign HOD</label>
                  <select
                    value={selectedHod}
                    onChange={(e) => setSelectedHod(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 mb-3"
                  >
                    <option value="">Select Faculty...</option>
                    {faculty.map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignHod}
                    disabled={isUpdatingHod || !selectedHod || selectedHod === department.hod?._id}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isUpdatingHod ? 'Updating...' : 'Assign HOD'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 border-dashed"
            >
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Quick Actions</h3>
              <p className="text-sm text-zinc-500 mb-4">
                To add users to this department, navigate to the User Management page and edit a user's department, or upload a bulk CSV.
              </p>
              <Link 
                href="/admin/users"
                className="block w-full py-2 text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl transition-all text-sm shadow-sm"
              >
                Go to User Management
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
