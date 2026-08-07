'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Eye, EyeOff, ArrowRight, User, Mail, Lock, Hash } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'faculty']),
  rollNumber: z.string().optional(),
  semester: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authAPI.register({
        ...data,
        semester: data.semester ? parseInt(data.semester) : undefined,
      });
      toast.success('Account created! Please check your email to verify.');
      router.push('/login');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0f0f1a' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">CampusLearn</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 text-sm mt-1">Join thousands of students and faculty</p>
        </div>

        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {(['student', 'faculty'] as const).map((r) => (
                <label key={r} className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                  role === r ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/08 text-white/50 hover:border-white/20'
                }`}>
                  <input {...register('role')} type="radio" value={r} className="hidden" />
                  <span className="text-sm font-medium capitalize">{r}</span>
                </label>
              ))}
            </div>

            {/* Name */}
            <div>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input {...register('name')} placeholder="Full Name" className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none" style={inputStyle} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input {...register('email')} type="email" placeholder="Email Address" className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none" style={inputStyle} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input {...register('rollNumber')} placeholder="Roll Number" className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <select {...register('semester')} className="w-full px-3 py-3 rounded-xl text-sm outline-none appearance-none" style={{ ...inputStyle, color: 'rgba(255,255,255,0.6)' }}>
                    <option value="">Semester</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Password (min. 8 chars)" className="w-full pl-9 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none" style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3 text-base font-semibold">
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-5">
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#818cf8' }} className="font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
