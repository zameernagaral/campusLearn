'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getRoleDashboard } from '@/lib/utils';
import toast from 'react-hot-toast';
import BeamsBackground from '@/components/ui/beams-background';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      const { user } = useAuthStore.getState();
      toast.success(`Welcome back, ${user?.name?.split(' ')[0]}!`);
      router.push(getRoleDashboard(user?.role || 'student'));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <BeamsBackground className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-0 items-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Brand info */}
        <div className="hidden lg:flex flex-col justify-center p-12 h-full bg-gradient-to-br from-orange-500/10 to-transparent border-r border-black/5 dark:border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
              CampusLearn
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
              Your academic journey elevated. One cohesive platform for students, faculty, and administrators.
            </p>

            <div className="space-y-4 bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Demo Credentials</p>
              <div className="space-y-3">
                {[
                  { role: 'Admin', email: 'admin@campuslearn.com', pass: 'Admin@123' },
                  { role: 'Faculty', email: 'priya@campuslearn.com', pass: 'Faculty@123' },
                  { role: 'Student', email: 'arjun@campuslearn.com', pass: 'Student@123' },
                ].map(d => (
                  <div key={d.role} className="flex flex-col gap-1 pb-3 border-b border-zinc-200/50 dark:border-zinc-800 last:border-0 last:pb-0">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-300">{d.role}</span>
                    <span className="text-zinc-500 dark:text-zinc-500 font-mono text-xs">{d.email} <span className="opacity-50">/</span> {d.pass}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 lg:p-14">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="lg:hidden text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
                <GraduationCap size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">CampusLearn</h2>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Sign In</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Access your personalized dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="name@university.edu"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm bg-white/70 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-zinc-400 font-medium shadow-sm"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 transition-colors font-bold">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm bg-white/70 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-zinc-400 font-medium shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-2 font-medium">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4 shadow-lg shadow-orange-500/25"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-8">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Create account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </BeamsBackground>
  );
}
