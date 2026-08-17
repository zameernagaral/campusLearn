'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageSquare, ArrowLeft, Loader2, Send } from 'lucide-react';
import { discussionAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ListSkeleton } from '@/components/shared/Skeleton';

export default function ForumPostPage() {
 const { id } = useParams();
 const router = useRouter();
 const [post, setPost] = useState<any>(null);
 const [comments, setComments] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [newComment, setNewComment] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
 fetchPost();
 }, [id]);

 const fetchPost = async () => {
 try {
 setIsLoading(true);
 const res = await discussionAPI.getOne(id as string);
 setPost(res.data.data.post);
 setComments(res.data.data.comments);
 } catch (error) {
 toast.error('Failed to load discussion');
 router.push('/student/forum');
 } finally {
 setIsLoading(false);
 }
 };

 const handlePostComment = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newComment.trim()) return;
 
 try {
 setIsSubmitting(true);
 await discussionAPI.addComment(id as string, newComment);
 setNewComment('');
 toast.success('Comment added!');
 fetchPost();
 } catch (error) {
 toast.error('Failed to add comment');
 } finally {
 setIsSubmitting(false);
 }
 };

 if (isLoading) {
 return (
 <DashboardLayout requiredRole="student">
 <ListSkeleton count={5} height="h-24" />
 </DashboardLayout>
 );
 }

 if (!post) return null;

 return (
 <DashboardLayout requiredRole="student">
 <button 
 onClick={() => router.push('/student/forum')}
 className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-6"
 >
 <ArrowLeft size={16} /> Back to Forum
 </button>

 <div className="max-w-4xl space-y-6">
 {/* Main Post */}
 <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
 <div className="flex items-center gap-2 mb-4">
 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 uppercase tracking-wide">
 {post.type}
 </span>
 {post.tags?.map((t: string) => (
 <span key={t} className="text-[10px] font-bold text-zinc-400">#{t}</span>
 ))}
 </div>
 
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{post.title}</h1>
 
 <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center font-bold text-orange-600 text-sm border border-orange-200 dark:border-orange-800/50">
 {post.author?.name?.charAt(0) || '?'}
 </div>
 <div>
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{post.author?.name || 'Unknown'}</p>
 <p className="text-xs font-medium text-zinc-500">
 {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
 </p>
 </div>
 </div>
 
 <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed mb-6">
 {post.content}
 </div>
 
 <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
 <span className="flex items-center gap-1">
 <MessageSquare size={14} /> {comments.length} Comments
 </span>
 <span>{post.views} Views</span>
 </div>
 </div>

 {/* Comments Section */}
 <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
 <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
 <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
 <MessageSquare size={18} className="text-orange-500" /> Responses
 </h3>
 </div>
 
 <div className="p-6 space-y-6">
 {comments.length === 0 ? (
 <div className="text-center py-8 text-zinc-500 text-sm">
 No responses yet. Be the first to reply!
 </div>
 ) : (
 comments.map((comment) => (
 <div key={comment._id} className="flex gap-4">
 <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400 text-xs shrink-0">
 {comment.author?.name?.charAt(0) || '?'}
 </div>
 <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl rounded-tl-sm p-4 border border-zinc-100 dark:border-zinc-800">
 <div className="flex items-baseline justify-between mb-2">
 <p className="text-sm font-bold text-zinc-900 dark:text-white">{comment.author?.name || 'Unknown'}</p>
 <p className="text-[10px] font-medium text-zinc-400">
 {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
 </p>
 </div>
 <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
 </div>
 </div>
 ))
 )}
 </div>
 
 <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
 <form onSubmit={handlePostComment} className="flex gap-2">
 <input
 type="text"
 value={newComment}
 onChange={e => setNewComment(e.target.value)}
 placeholder="Write a reply..."
 className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
 />
 <button
 type="submit"
 disabled={isSubmitting || !newComment.trim()}
 className="px-6 py-3 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center"
 >
 {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
 </button>
 </form>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
