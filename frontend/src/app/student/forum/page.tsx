'use client';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageSquare, Users, TrendingUp, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForumPage() {
  const topics = [
    { id: 1, title: 'Tips for Data Structures Midterm?', author: 'Arjun Mehta', replies: 12, views: 156, tag: 'Help Needed', time: '2h ago' },
    { id: 2, title: 'Study group for Machine Learning', author: 'Priya Patel', replies: 8, views: 89, tag: 'Study Group', time: '5h ago' },
    { id: 3, title: 'Resources for React & Next.js', author: 'Rahul Kumar', replies: 24, views: 342, tag: 'Resources', time: '1d ago' },
  ];

  return (
    <DashboardLayout requiredRole="student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Discussion Forum</h1>
          <p className="text-sm mt-0.5 text-zinc-500">Connect with peers and discuss course topics</p>
        </div>
        <button onClick={() => toast("Feature coming soon!", { icon: "🚧" })}  className="btn btn-primary flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 border-0 text-white shadow-lg shadow-orange-500/20">
          <Plus size={16} /> New Discussion
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
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
              <div className="w-24 text-center hidden sm:block">Replies</div>
              <div className="w-24 text-center hidden md:block">Views</div>
              <div className="w-24 text-right px-2">Activity</div>
            </div>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {topics.map((topic, i) => (
                <motion.div 
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 flex items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex-1 px-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 uppercase tracking-wide">
                        {topic.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm group-hover:text-orange-500 transition-colors">{topic.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">Started by <span className="font-medium text-zinc-700 dark:text-zinc-300">{topic.author}</span></p>
                  </div>
                  
                  <div className="w-24 text-center hidden sm:block text-zinc-600 dark:text-zinc-400 text-sm">
                    {topic.replies}
                  </div>
                  
                  <div className="w-24 text-center hidden md:block text-zinc-500 text-sm">
                    {topic.views}
                  </div>
                  
                  <div className="w-24 text-right px-2 text-xs text-zinc-500">
                    {topic.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4">Forum Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Total Discussions</p>
                  <p className="font-bold text-zinc-900 dark:text-white">1,248</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Active Members</p>
                  <p className="font-bold text-zinc-900 dark:text-white">342</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-500" /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Machine Learning', 'Exams', 'Study Group', 'Homework Help'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer transition-colors rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
