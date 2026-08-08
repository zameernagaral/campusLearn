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
import BackgroundPaths from '@/components/ui/background-paths';

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
              Join thousands of students and faculty on the smartest college platform.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-zinc-400 text-sm font-medium">
            <span>© 2026 CampusLearn</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="lg:hidden w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
              <GraduationCap size={24} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Create an account</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Enter your details to get started.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3 mb-2">
                {(['student', 'faculty'] as const).map((r) => (
                  <label key={r} className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border ${
                    role === r 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500' 
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}>
                    <input {...register('role')} type="radio" value={r} className="hidden" />
                    <span className="text-sm font-semibold capitalize">{r}</span>
                  </label>
                ))}
              </div>

              <div>
                <div className="relative group">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    {...register('name')} 
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{errors.name.message}</p>}
              </div>

              <div>
                <div className="relative group">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    {...register('email')} 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{errors.email.message}</p>}
              </div>

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative group">
                    <Hash size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                      {...register('rollNumber')} 
                      placeholder="Roll Number" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                    />
                  </div>
                  <div className="relative group">
                    <select 
                      {...register('semester')} 
                      className="w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none" 
                    >
                      <option value="">Semester</option>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    {...register('password')} 
                    type={showPass ? 'text' : 'password'} 
                    placeholder="Password (min. 8 chars)" 
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium pl-1">{errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-3 mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-8">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
