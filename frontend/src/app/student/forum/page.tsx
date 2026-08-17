'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageSquare, Users, TrendingUp, Search, Plus, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { discussionAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function ForumPage() {
 const router = useRouter();
 const [topics, setTopics] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [newTopic, setNewTopic] = useState({ title: '', content: '', type: 'discussion', tags: '' });

 useEffect(() => {
 fetchTopics();
 }, []);

 const fetchTopics = async () => {
 try {
 setIsLoading(true);
 const res = await discussionAPI.getAll();
 setTopics(res.data.data || []);
 } catch (error) {
 toast.error('Failed to load discussions');
 } finally {
 setIsLoading(false);
 }
 };

 const handleCreateTopic = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newTopic.title || !newTopic.content) return toast.error('Please fill all required fields');
 
 try {
 setIsSubmitting(true);
 await discussionAPI.create({
 ...newTopic,
 tags: newTopic.tags.split(',').map(t => t.trim()).filter(Boolean)
 });
 toast.success('Discussion created successfully!');
 setIsModalOpen(false);
 setNewTopic({ title: '', content: '', type: 'discussion', tags: '' });
 fetchTopics();
 } catch (error: any) {
 toast.error(error.response?.data?.message || 'Failed to create discussion');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <DashboardLayout requiredRole="student">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Discussion Forum</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Connect with peers and discuss course topics</p>
 </div>
 <button 
 onClick={() => setIsModalOpen(true)}
 className="btn btn-primary flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 border-0 text-white shadow-lg shadow-orange-500/20"
 >
 <Plus size={16} /> New Discussion
 </button>
 </div>

 <div className="grid lg:grid-cols-4 gap-6">
 <div className=" space-y-4">
 {/* Search Bar */}
 <div className="relative">
 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
 <input 
 type="text" 
 placeholder="Search discussions..." 
 className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
 />
 </div>

 {/* Topics List */}
 <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
 <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex text-xs font-semibold text-zinc-500 uppercase tracking-wider">
 <div className="flex-1 px-2">Topic</div>
 <div className="w-24 text-center hidden md:block">Views</div>
 <div className="w-24 text-right px-2">Activity</div>
 </div>
 
 <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
 {isLoading ? (
 Array(5).fill(null).map((_, i) => <div key={i} className="p-4 skeleton h-16 w-full" />)
 ) : topics.length === 0 ? (
 <div className="p-8 text-center text-zinc-500">No discussions found. Start one!</div>
 ) : (
 topics.map((topic, i) => (
 <motion.div 
 key={topic._id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => router.push(`/student/forum/${topic._id}`)}
 className="p-4 flex items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
 >
 <div className="flex-1 px-2">
 <div className="flex items-center gap-2 mb-1">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 uppercase tracking-wide">
 {topic.type}
 </span>
 {topic.tags?.map((t: string) => (
 <span key={t} className="text-[10px] text-zinc-400">#{t}</span>
 ))}
 </div>
 <h3 className="font-semibold text-zinc-900 dark:text-white text-sm group-hover:text-orange-500 transition-colors">{topic.title}</h3>
 <p className="text-xs text-zinc-500 mt-1">Started by <span className="font-medium text-zinc-700 dark:text-zinc-300">{topic.author?.name || 'Unknown'}</span></p>
 </div>
 
 <div className="w-24 text-center hidden md:block text-zinc-500 text-sm font-medium">
 {topic.views}
 </div>
 
 <div className="w-24 text-right px-2 text-xs text-zinc-500">
 {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
 </div>
 </motion.div>
 ))
 )}
 </div>
 </div>
 </div>

 <div className=" space-y-6">
 <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
 <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Forum Stats</h3>
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
 <MessageSquare size={18} />
 </div>
 <div>
 <p className="text-xs text-zinc-500">Total Discussions</p>
 <p className="font-bold text-zinc-900 dark:text-white">{topics.length}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Create Topic Modal */}
 <AnimatePresence>
 {isModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
 onClick={() => !isSubmitting && setIsModalOpen(false)}
 />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
 >
 <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
 <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Create New Discussion</h2>
 <button 
 onClick={() => setIsModalOpen(false)}
 className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
 >
 <X size={16} />
 </button>
 </div>

 <form onSubmit={handleCreateTopic}>
 <div className="p-6 space-y-4">
 <div>
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Title</label>
 <input 
 type="text" 
 value={newTopic.title}
 onChange={e => setNewTopic({...newTopic, title: e.target.value})}
 required
 className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
 placeholder="What do you want to discuss?"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Type</label>
 <select 
 value={newTopic.type}
 onChange={e => setNewTopic({...newTopic, type: e.target.value})}
 className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
 >
 <option value="discussion">General Discussion</option>
 <option value="question">Question</option>
 <option value="doubt">Doubt</option>
 </select>
 </div>
 <div>
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tags (comma separated)</label>
 <input 
 type="text" 
 value={newTopic.tags}
 onChange={e => setNewTopic({...newTopic, tags: e.target.value})}
 className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
 placeholder="e.g. React, Exams, Homework"
 />
 </div>
 <div>
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Content</label>
 <textarea 
 value={newTopic.content}
 onChange={e => setNewTopic({...newTopic, content: e.target.value})}
 required
 rows={5}
 className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
 placeholder="Write your post here..."
 />
 </div>
 </div>

 <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-3">
 <button 
 type="button"
 onClick={() => setIsModalOpen(false)}
 className="px-6 py-2.5 rounded-xl font-bold text-sm bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800"
 >
 Cancel
 </button>
 <button 
 type="submit"
 disabled={isSubmitting}
 className="px-6 py-2.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 disabled:opacity-50"
 >
 {isSubmitting && <Loader2 size={16} className="animate-spin" />}
 Post Discussion
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
