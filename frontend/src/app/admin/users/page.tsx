'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Search, Filter, Edit, Trash2, UserPlus, Shield } from 'lucide-react';
import { getRoleColor, getInitials, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const LIMIT = 15;

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search, role: roleFilter || undefined, page, limit: LIMIT });
      setUsers(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch { toast.error('Failed to load users'); }
    finally { setIsLoading(false); }
  };

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
    } catch { toast.error('Failed to update role'); }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>User Management</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Total {total} users</p>
        </div>
        <button className="btn btn-primary text-sm">
          <UserPlus size={15} /> Add User
        </button>
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
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(8).fill(null).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(null).map((_, j) => (
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
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>
                      {typeof user.department === 'object' ? (user.department as { name?: string })?.name : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={cn('badge text-xs cursor-pointer', user.isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {user.isActive ? '✓ Active' : '✗ Inactive'}
                    </button>
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatDate(user.createdAt)}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] transition-colors" title="Edit">
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
            Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total}
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
    </DashboardLayout>
  );
}
