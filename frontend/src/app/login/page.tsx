'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getRoleDashboard } from '@/lib/utils';
import toast from 'react-hot-toast';

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
      toast.success(`Welcome back, ${user?.name?.split(' ')[0]}! 🎉`);
      router.push(getRoleDashboard(user?.role || 'student'));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f1a' }}>
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">
            Welcome to <span className="gradient-text">CampusLearn</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            One Platform for Smarter College Learning. Your academic journey starts here.
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-2xl text-left" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Demo Credentials</p>
            {[
              { role: 'Admin', email: 'admin@campuslearn.com', pass: 'Admin@123' },
              { role: 'Faculty', email: 'priya@campuslearn.com', pass: 'Faculty@123' },
              { role: 'Student', email: 'arjun@campuslearn.com', pass: 'Student@123' },
            ].map(d => (
              <div key={d.role} className="text-xs text-white/60 py-1 border-b border-white/05 last:border-0">
                <span className="text-indigo-400 font-medium">{d.role}:</span> {d.email} / {d.pass}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">CampusLearn</h2>
          </div>

          <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-white/50 text-sm mb-6">Enter your credentials to access your dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-white/60 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@university.edu"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => (e.target.style.borderColor = '#6366f1')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-white/60">Password</label>
                  <Link href="/forgot-password" className="text-xs" style={{ color: '#818cf8' }}>Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => (e.target.style.borderColor = '#6366f1')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 text-base font-semibold mt-2"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight size={16} /></span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#818cf8' }} className="font-medium hover:underline">Create account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
