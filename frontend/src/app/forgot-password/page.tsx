'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [sent, setSent] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!email) return;
 setIsLoading(true);
 try {
 await authAPI.forgotPassword(email);
 setSent(true);
 } catch {
 toast.error('Failed to send reset email. Please try again.');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0f0f1a' }}>
 <div className="absolute inset-0 overflow-hidden">
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 className="w-full max-w-md relative z-10"
 >
 <div className="text-center mb-6">
 <Link href="/" className="inline-flex items-center gap-2 mb-4">
 <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
 <GraduationCap size={22} className="text-white" />
 </div>
 <span className="font-bold text-white text-lg">CampusLearn</span>
 </Link>
 </div>

 <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
 {!sent ? (
 <>
 <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
 <p className="text-white/50 text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="relative">
 <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
 <input
 type="email"
 value={email}
 onChange={e => setEmail(e.target.value)}
 placeholder="your@email.com"
 required
 className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
 style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)' }}
 />
 </div>

 <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3">
 {isLoading ? (
 <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
 ) : (
 <span className="flex items-center gap-2">Send Reset Link <ArrowRight size={16} /></span>
 )}
 </button>
 </form>
 </>
 ) : (
 <div className="text-center">
 <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
 <CheckCircle size={32} className="text-emerald-400" />
 </div>
 <h2 className="text-xl font-bold text-white mb-2">Check your email!</h2>
 <p className="text-white/50 text-sm leading-relaxed">
 We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>. Check your inbox (and spam folder).
 </p>
 <p className="text-xs text-white/30 mt-3">The link expires in 10 minutes.</p>
 </div>
 )}

 <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mt-6">
 <ArrowLeft size={14} /> Back to Sign In
 </Link>
 </div>
 </motion.div>
 </div>
 );
}
