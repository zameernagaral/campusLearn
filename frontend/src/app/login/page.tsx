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
import BackgroundPaths from '@/components/ui/background-paths';

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
    <div className="min-h-screen flex w-full">
      {/* Left Side: Animated BackgroundPaths & Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden border-r border-zinc-800">
        <div className="absolute inset-0 z-0">
          <BackgroundPaths className="w-full h-full" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-10 text-sm font-medium">
              <ArrowRight size={16} className="rotate-180" /> Back to home
            </Link>
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
              CampusLearn
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed font-medium">
              Your academic journey elevated. One cohesive platform for students, faculty, and administrators.
            </p>
          </div>

          <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-md">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Demo Credentials</p>
            <div className="space-y-3">
              {[
                { role: 'Admin', email: 'admin@campuslearn.com', pass: 'Admin@123' },
                { role: 'Faculty', email: 'priya@campuslearn.com', pass: 'Faculty@123' },
                { role: 'Student', email: 'arjun@campuslearn.com', pass: 'Student@123' },
              ].map(d => (
                <div key={d.role} className="flex justify-between items-center pb-3 border-b border-zinc-800 last:border-0 last:pb-0">
                  <span className="font-semibold text-sm text-zinc-300">{d.role}</span>
                  <span className="text-zinc-500 font-mono text-xs">{d.email} <span className="opacity-50">/</span> {d.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px]"
        >
          <div className="lg:hidden mb-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">CampusLearn</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Sign in</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Enter your credentials to access your account.</p>
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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 font-medium shadow-sm"
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
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all placeholder:text-zinc-400 font-medium shadow-sm"
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
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-6 shadow-lg shadow-orange-500/25"
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


        </motion.div>
      </div>
    </div>
  );
}
