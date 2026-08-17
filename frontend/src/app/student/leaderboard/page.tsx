'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { userAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Star, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, BADGE_ICONS } from '@/lib/utils';

interface LeaderboardUser {
 _id: string;
 name: string;
 avatar?: string;
 points: number;
 streak: number;
 badges: string[];
 rollNumber?: string;
 department?: { name: string };
}

export default function LeaderboardPage() {
 const [users, setUsers] = useState<LeaderboardUser[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const { user } = useAuthStore();

 useEffect(() => {
 userAPI.getLeaderboard({ limit: 20 }).then(res => setUsers(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
 }, []);

 const top3 = users.slice(0, 3);
 const rest = users.slice(3);

 const rankColors = ['#f59e0b', '#94a3b8', '#cd7c3e'];
 const rankIcons = [<Crown size={20} key="1" className="text-amber-400" />, <Medal size={18} key="2" className="text-slate-400" />, <Medal size={18} key="3" style={{ color: '#cd7c3e' }} />];

 return (
 <DashboardLayout requiredRole="student">
 <div className="mb-6 text-center">
 <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}> Leaderboard</h1>
 <p className="text-sm" style={{ color: 'var(--muted)' }}>Top performers in your department</p>
 </div>

 {/* Top 3 Podium */}
 {!isLoading && top3.length >= 3 && (
 <div className="flex items-end justify-center gap-4 mb-8">
 {/* 2nd */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="flex flex-col items-center"
 >
 <div className="relative mb-2">
 {top3[1].avatar ? (
 <img src={top3[1].avatar} alt={top3[1].name} className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-400" />
 ) : (
 <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-slate-400"
 style={{ background: 'linear-gradient(135deg, #94a3b8, #64748b)' }}>
 {getInitials(top3[1].name)}
 </div>
 )}
 <div className="absolute -top-1 -right-1">{rankIcons[1]}</div>
 </div>
 <p className="text-xs font-semibold text-center max-w-16 truncate" style={{ color: 'var(--foreground)' }}>{top3[1].name.split(' ')[0]}</p>
 <p className="text-sm font-bold" style={{ color: '#94a3b8' }}>{top3[1].points} pts</p>
 <div className="w-16 h-16 mt-2 rounded-t-xl flex items-end justify-center pb-2 text-white font-bold text-xl" style={{ background: '#94a3b8' }}>2</div>
 </motion.div>

 {/* 1st */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="flex flex-col items-center"
 >
 <div className="relative mb-2">
 {top3[0].avatar ? (
 <img src={top3[0].avatar} alt={top3[0].name} className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400" />
 ) : (
 <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold ring-4 ring-amber-400"
 style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
 {getInitials(top3[0].name)}
 </div>
 )}
 <div className="absolute -top-2 -right-1">{rankIcons[0]}</div>
 </div>
 <p className="text-sm font-semibold text-center max-w-20 truncate" style={{ color: 'var(--foreground)' }}>{top3[0].name.split(' ')[0]}</p>
 <p className="font-bold" style={{ color: '#f59e0b' }}>{top3[0].points} pts</p>
 <div className="w-20 h-24 mt-2 rounded-t-xl flex items-end justify-center pb-2 text-white font-bold text-2xl gradient-primary shadow-lg">1</div>
 </motion.div>

 {/* 3rd */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="flex flex-col items-center"
 >
 <div className="relative mb-2">
 {top3[2].avatar ? (
 <img src={top3[2].avatar} alt={top3[2].name} className="w-14 h-14 rounded-full object-cover" style={{ outline: '2px solid #cd7c3e' }} />
 ) : (
 <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold ring-2"
 style={{ background: 'linear-gradient(135deg, #cd7c3e, #a56530)', outline: '2px solid #cd7c3e' }}>
 {getInitials(top3[2].name)}
 </div>
 )}
 <div className="absolute -top-1 -right-1">{rankIcons[2]}</div>
 </div>
 <p className="text-xs font-semibold text-center max-w-16 truncate" style={{ color: 'var(--foreground)' }}>{top3[2].name.split(' ')[0]}</p>
 <p className="text-sm font-bold" style={{ color: '#cd7c3e' }}>{top3[2].points} pts</p>
 <div className="w-16 h-12 mt-2 rounded-t-xl flex items-end justify-center pb-2 text-white font-bold text-xl" style={{ background: '#cd7c3e' }}>3</div>
 </motion.div>
 </div>
 )}

 {/* Rest of leaderboard */}
 <div className="card overflow-hidden">
 {isLoading ? (
 <div className="space-y-3 p-4">{Array(10).fill(null).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
 ) : (
 <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
 {rest.map((leaderUser, i) => {
 const rank = i + 4;
 const isMe = leaderUser._id === user?._id;
 return (
 <motion.div
 key={leaderUser._id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.04 }}
 className="flex items-center gap-4 p-4 transition-colors hover:bg-[var(--surface)]"
 style={{ background: isMe ? 'rgba(99,102,241,0.05)' : undefined }}
 >
 <span className="w-8 text-center font-bold text-sm" style={{ color: 'var(--muted)' }}>#{rank}</span>
 {leaderUser.avatar ? (
 <img src={leaderUser.avatar} alt={leaderUser.name} className="w-9 h-9 rounded-full object-cover" />
 ) : (
 <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
 {getInitials(leaderUser.name)}
 </div>
 )}
 <div className="flex-1">
 <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
 {leaderUser.name} {isMe && <span className="text-xs text-indigo-400">(You)</span>}
 </p>
 <div className="flex items-center gap-2">
 {leaderUser.streak > 0 && (
 <span className="flex items-center gap-0.5 text-xs text-orange-400">
 <Flame size={10} /> {leaderUser.streak}
 </span>
 )}
 {leaderUser.badges.slice(0, 3).map(b => (
 <span key={b} title={b}>{BADGE_ICONS[b] || ''}</span>
 ))}
 </div>
 </div>
 <div className="text-right">
 <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{leaderUser.points}</p>
 <p className="text-xs" style={{ color: 'var(--subtle)' }}>points</p>
 </div>
 </motion.div>
 );
 })}
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
