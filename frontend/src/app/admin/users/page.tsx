'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Search, Filter, Edit, Trash2, UserPlus, Shield, Upload, X } from 'lucide-react';
import { getRoleColor, getInitials, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User } from '@/types';

export default function AdminUsersPage() {
 const [users, setUsers] = useState<User[]>([]);
 const [departments, setDepartments] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [roleFilter, setRoleFilter] = useState('');
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);
 const [editingUser, setEditingUser] = useState<User | null>(null);

 const [showBulkModal, setShowBulkModal] = useState(false);
 const [csvFile, setCsvFile] = useState<File | null>(null);
 const [isUploading, setIsUploading] = useState(false);

 const [showAddUserModal, setShowAddUserModal] = useState(false);
 const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', department: '', semester: '' });
 const [isAddingUser, setIsAddingUser] = useState(false);

 const LIMIT = 15;

 const fetchUsers = async () => {
 setIsLoading(true);
 try {
 const { data } = await adminAPI.getUsers({ search, role: roleFilter || undefined, page, limit: LIMIT });
 setUsers(data.data || []);
 setTotal(data.meta?.total || 0);
 } catch { toast.error('Failed to load users'); }
 finally { setIsLoading(false); }
 };

 const fetchDepartments = async () => {
 try {
 const res = await adminAPI.getDepartments();
 setDepartments(res.data?.data || []);
 } catch (err) {
 console.error('Failed to load departments');
 }
 };

 useEffect(() => {
 fetchUsers();
 fetchDepartments();
 }, [search, roleFilter, page]);

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this user?')) return;
 try {
 await adminAPI.deleteUser(id);
 toast.success('User deleted');
 fetchUsers();
 } catch { toast.error('Failed to delete user'); }
 };

 const handleUpdateRole = async (id: string, role: string) => {
 try {
 await adminAPI.updateUser(id, { role });
 toast.success('Role updated');
 fetchUsers();
 } catch (err) {
 toast.error('Failed to update role');
 }
 };

 const handleUpdateDepartment = async (id: string, department: string) => {
 try {
 await adminAPI.updateUser(id, { department: department === 'none' ? null : department });
 toast.success('Department updated');
 fetchUsers();
 } catch (err) {
 toast.error('Failed to update department');
 }
 };

 const handleUpdateSemester = async (id: string, semester: string) => {
 try {
 await adminAPI.updateUser(id, { semester: semester === 'none' ? null : parseInt(semester) });
 toast.success('Semester updated');
 fetchUsers();
 } catch (err) {
 toast.error('Failed to update semester');
 }
 };

 const handleToggleActive = async (user: User) => {
 try {
 await adminAPI.updateUser(user._id, { isActive: !user.isActive });
 toast.success(user.isActive ? 'User deactivated' : 'User activated');
 fetchUsers();
 } catch { toast.error('Failed to update status'); }
 };

 const parseCSV = (csvText: string) => {
 const lines = csvText.split('\n').filter(line => line.trim() !== '');
 if (lines.length < 2) return [];
 const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
 
 return lines.slice(1).map(line => {
 const values = line.split(',');
 const obj: any = {};
 headers.forEach((header, index) => {
 if (values[index]) obj[header] = values[index].trim();
 });
 return obj;
 });
 };

 const handleBulkUpload = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!csvFile) return toast.error('Please select a CSV file.');

 setIsUploading(true);
 try {
 const text = await csvFile.text();
 const parsedUsers = parseCSV(text);

 if (parsedUsers.length === 0) {
 throw new Error('CSV is empty or invalid.');
 }

 // Map string department to department Object ID
 const mappedUsers = parsedUsers.map(user => {
 if (user.department) {
 const deptStr = user.department.toLowerCase();
 const match = departments.find(d => 
 d.name.toLowerCase() === deptStr || d.code.toLowerCase() === deptStr || d._id === user.department
 );
 if (match) {
 user.department = match._id;
 } else {
 delete user.department;
 }
 }
 return user;
 });

 const { data } = await adminAPI.bulkCreateUsers(mappedUsers);
 toast.success(data.message || 'Users created successfully!');
 setShowBulkModal(false);
 setCsvFile(null);
 fetchUsers();
 } catch (error: any) {
 toast.error(error.message || 'Failed to bulk create users.');
 } finally {
 setIsUploading(false);
 }
 };

 const handleAddUser = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newUser.name || !newUser.email || !newUser.department || !newUser.semester) {
 return toast.error('Name, email, department, and semester are required.');
 }

 const userPayload: any = { ...newUser };
 if (!userPayload.semester) delete userPayload.semester;
 else userPayload.semester = parseInt(userPayload.semester);
 if (!userPayload.department) delete userPayload.department;

 setIsAddingUser(true);
 try {
 const { data } = await adminAPI.bulkCreateUsers([userPayload]);
 toast.success(data.message || 'User created successfully!');
 setShowAddUserModal(false);
 setNewUser({ name: '', email: '', role: 'student', department: '', semester: '' });
 fetchUsers();
 } catch (error: any) {
 toast.error(error.message || 'Failed to create user.');
 } finally {
 setIsAddingUser(false);
 }
 };

 return (
 <DashboardLayout requiredRole="admin">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>User Management</h1>
 <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Total {total} users</p>
 </div>
 <div className="flex gap-2">
 <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary text-sm">
 <Upload size={15} /> Bulk Add (CSV)
 </button>
 <button onClick={() => setShowAddUserModal(true)} className="btn btn-primary text-sm">
 <UserPlus size={15} /> Add User
 </button>
 </div>
 </div>

 {/* Filters */}
 <div className="card p-4 mb-5 flex flex-wrap gap-3">
 <div className="relative flex-1 min-w-48">
 <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--subtle)' }} />
 <input
 type="text"
 placeholder="Search by name, email, roll number..."
 value={search}
 onChange={e => { setSearch(e.target.value); setPage(1); }}
 className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
 style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
 />
 </div>
 <select
 value={roleFilter}
 onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
 className="px-3 py-2 rounded-xl text-sm outline-none"
 style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
 >
 <option value="">All Roles</option>
 <option value="student">Students</option>
 <option value="faculty">Faculty</option>
 <option value="hod">HOD</option>
 <option value="admin">Admin</option>
 </select>
 </div>

 {/* Table */}
 <div className="card overflow-hidden">
 <div className="table-container">
 <table>
 <thead>
 <tr>
 <th>User</th>
 <th>Role</th>
 <th>Department</th>
 <th>Semester</th>
 <th>Status</th>
 <th>Joined</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {isLoading ? (
 Array(8).fill(null).map((_, i) => (
 <tr key={i}>
 {Array(7).fill(null).map((_, j) => (
 <td key={j}><div className="skeleton h-4 rounded" /></td>
 ))}
 </tr>
 ))
 ) : users.map((user, i) => (
 <motion.tr
 key={user._id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: i * 0.03 }}
 >
 <td>
 <div className="flex items-center gap-3">
 {user.avatar ? (
 <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
 ) : (
 <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
 {getInitials(user.name)}
 </div>
 )}
 <div>
 <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{user.name}</p>
 <p className="text-xs" style={{ color: 'var(--muted)' }}>{user.email}</p>
 </div>
 </div>
 </td>
 <td>
 <select
 value={user.role}
 onChange={e => handleUpdateRole(user._id, e.target.value)}
 className={cn('badge text-xs capitalize border-0 cursor-pointer', getRoleColor(user.role))}
 >
 {['student', 'faculty', 'hod', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
 </select>
 </td>
 <td>
 <select
 value={typeof user.department === 'object' && user.department ? (user.department as any)._id : user.department || 'none'}
 onChange={e => handleUpdateDepartment(user._id, e.target.value)}
 className="badge text-xs capitalize border-0 cursor-pointer bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
 >
 <option value="none">No Department</option>
 {departments.map(d => (
 <option key={d._id} value={d._id}>{d.name}</option>
 ))}
 </select>
 </td>
 <td>
 <select
 value={user.semester || 'none'}
 onChange={e => handleUpdateSemester(user._id, e.target.value)}
 className="badge text-xs capitalize border-0 cursor-pointer bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
 >
 <option value="none">N/A</option>
 {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
 <option key={s} value={s}>Sem {s}</option>
 ))}
 </select>
 </td>
 <td>
 <button
 onClick={() => handleToggleActive(user)}
 className={cn('badge text-xs cursor-pointer', user.isActive
 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
 : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
 )}
 >
 {user.isActive ? ' Active' : ' Inactive'}
 </button>
 </td>
 <td>
 <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatDate(user.createdAt)}</span>
 </td>
 <td>
 <div className="flex items-center gap-2">
 <button disabled title="Feature coming soon" style={{ opacity: 0.5, cursor: "not-allowed" }} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
 <Edit size={14} style={{ color: 'var(--primary)' }} />
 </button>
 <button
 onClick={() => handleDelete(user._id)}
 className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
 title="Delete"
 >
 <Trash2 size={14} style={{ color: 'var(--danger)' }} />
 </button>
 </div>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: 'var(--border)' }}>
 <p className="text-sm" style={{ color: 'var(--muted)' }}>
 Showing {Math.min((page - 1) * LIMIT + 1, total)}-{Math.min(page * LIMIT, total)} of {total}
 </p>
 <div className="flex gap-2">
 <button
 onClick={() => setPage(p => p - 1)}
 disabled={page === 1}
 className="btn btn-secondary text-sm px-3 py-1.5 disabled:opacity-50"
 >
 ← Prev
 </button>
 <button
 onClick={() => setPage(p => p + 1)}
 disabled={page * LIMIT >= total}
 className="btn btn-primary text-sm px-3 py-1.5 disabled:opacity-50"
 >
 Next →
 </button>
 </div>
 </div>
 </div>

 {/* Bulk Upload Modal */}
 {showBulkModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800"
 >
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold flex items-center gap-2">
 <Upload size={18} className="text-orange-500" />
 Bulk Add Users
 </h3>
 <button
 onClick={() => setShowBulkModal(false)}
 className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
 >
 <X size={18} />
 </button>
 </div>

 <form onSubmit={handleBulkUpload} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold mb-2">Upload CSV File</label>
 <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all cursor-pointer relative">
 <input
 type="file"
 accept=".csv"
 required
 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
 onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
 />
 {csvFile ? (
 <div className="flex flex-col items-center gap-1">
 <span className="text-sm font-medium text-orange-500 truncate max-w-[200px]">{csvFile.name}</span>
 <span className="text-xs text-zinc-500">{(csvFile.size / 1024).toFixed(1)} KB</span>
 </div>
 ) : (
 <div className="flex flex-col items-center gap-2">
 <span className="text-sm font-semibold">Click or drag and drop</span>
 <span className="text-xs text-zinc-500">CSV headers: name, email, role, department (optional)</span>
 </div>
 )}
 </div>
 </div>

 <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-500/20">
 <p className="text-xs font-medium text-orange-800 dark:text-orange-300">
 <span className="font-bold">Info:</span> All newly created users will have their password set to <code className="bg-orange-200 dark:bg-orange-900/50 px-1 rounded text-orange-900 dark:text-orange-200">password123</code>.
 </p>
 </div>

 <button
 type="submit"
 disabled={isUploading}
 className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2"
 >
 {isUploading ? (
 <>
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 Uploading...
 </>
 ) : 'Upload and Create Users'}
 </button>
 </form>
 </motion.div>
 </div>
 )}

 {/* Add Single User Modal */}
 {showAddUserModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800"
 >
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold flex items-center gap-2">
 <UserPlus size={18} className="text-orange-500" />
 Add New User
 </h3>
 <button
 onClick={() => setShowAddUserModal(false)}
 className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
 >
 <X size={18} />
 </button>
 </div>

 <form onSubmit={handleAddUser} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold mb-2">Full Name</label>
 <input
 type="text"
 required
 value={newUser.name}
 onChange={e => setNewUser({ ...newUser, name: e.target.value })}
 placeholder="e.g. Jane Doe"
 className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
 />
 </div>

 <div>
 <label className="block text-sm font-semibold mb-2">Email Address</label>
 <input
 type="email"
 required
 value={newUser.email}
 onChange={e => setNewUser({ ...newUser, email: e.target.value })}
 placeholder="e.g. jane@university.edu"
 className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
 />
 </div>

 <div>
 <label className="block text-sm font-semibold mb-2">Role</label>
 <select
 value={newUser.role}
 onChange={e => setNewUser({ ...newUser, role: e.target.value })}
 className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
 >
 <option value="student">Student</option>
 <option value="faculty">Faculty</option>
 <option value="hod">HOD</option>
 <option value="admin">Admin</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-semibold mb-2">Department</label>
 <select
 required
 value={newUser.department}
 onChange={e => setNewUser({ ...newUser, department: e.target.value })}
 className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
 >
 <option value="" disabled>Select Department</option>
 {departments.map(d => (
 <option key={d._id} value={d._id}>{d.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-semibold mb-2">Semester</label>
 <select
 required
 value={newUser.semester}
 onChange={e => setNewUser({ ...newUser, semester: e.target.value })}
 className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
 >
 <option value="" disabled>Select Semester</option>
 {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
 <option key={s} value={s}>Semester {s}</option>
 ))}
 </select>
 </div>

 <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-500/20">
 <p className="text-xs font-medium text-orange-800 dark:text-orange-300">
 <span className="font-bold">Info:</span> The default password will be <code className="bg-orange-200 dark:bg-orange-900/50 px-1 rounded text-orange-900 dark:text-orange-200">password123</code>.
 </p>
 </div>

 <button
 type="submit"
 disabled={isAddingUser}
 className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2 mt-4"
 >
 {isAddingUser ? (
 <>
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 Adding...
 </>
 ) : 'Add User'}
 </button>
 </form>
 </motion.div>
 </div>
 )}
 </DashboardLayout>
 );
}
