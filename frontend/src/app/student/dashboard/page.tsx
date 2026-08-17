'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, UserCheck, Trophy, Flame, Bell, Star, Clock, Map, Target, Briefcase, AlertTriangle, Bot, CheckCircle, ChevronRight, PieChart } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatCardSkeleton } from '@/components/shared/StatCard';
import { CourseCard, CourseCardSkeleton } from '@/components/shared/CourseCard';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // In a real application, these would be fetched from our new APIs
  // For now, we simulate the data to show the Smart Home Dashboard layout
  const [smartData, setSmartData] = useState<any>(null);
  
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAILoading(true);
    setTimeout(() => {
      setIsAILoading(false);
      toast.success('Campus AI: To prepare for DBMS, focus on Normalization and ACID properties. Would you like to enter Focus Mode?', { duration: 5000, icon: '🤖' });
      setAiQuery('');
      setIsAskingAI(false);
    }, 1500);
  };

  useEffect(() => {
    // Simulate fetching all smart data
    setTimeout(() => {
      setSmartData({
        today: {
          nextClass: { subject: 'Database Management Systems', time: '10:00 AM', room: 'Room 204' },
          currentAttendance: 72,
          pendingAssignments: 2
        },
        academic: {
          courseProgress: 65,
          quizAvg: 85,
          examPrep: 40
        },
        career: {
          goal: 'Full Stack Developer',
          roadmapProgress: 35,
          skillsCompleted: 12,
          skillsTotal: 30
        },
        placement: {
          readiness: 72,
          aptitude: 80,
          coding: 75,
          interview: 60,
          resume: 85
        },
        alerts: [
          { type: 'warning', title: 'Attendance Risk', message: 'Your DBMS attendance is 72%. Attend 2 more classes to reach 75%.' },
          { type: 'info', title: 'Upcoming Exam', message: 'DBMS Mid-Term in 5 days.' },
          { type: 'success', title: 'Placement Recommendation', message: 'TCS is hiring. Your profile matches 85% of requirements.' }
        ]
      });
      setIsLoading(false);
      
      // Smart AI Low Shortage Notification
      setTimeout(() => {
        toast('⚠️ AI ATTENDANCE ALERT: Your DBMS attendance has fallen below the 75% threshold (currently 72%). Attend the next 2 classes to avoid debarment!', {
          duration: 10000,
          style: {
            background: 'var(--toast-bg)',
            color: '#ef4444',
            border: '1px solid #ef4444',
            fontWeight: 'bold',
            padding: '16px'
          },
        });
      }, 500);

    }, 1000);
  }, []);

  return (
    <DashboardLayout requiredRole="student">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 mb-6 gradient-primary">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.p className="text-white/80 text-sm mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
            </motion.p>
            <motion.h1 className="text-2xl font-bold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {user?.name?.split(' ')[0]}, ready to learn?
            </motion.h1>
            <p className="text-white/60 text-sm mt-1">{formatDate(new Date().toISOString())} · Semester {user?.semester}</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {user?.streak && user.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2">
                <Flame size={18} className="text-orange-300" />
                <div>
                  <p className="text-white text-xs font-bold">{user.streak} days</p>
                  <p className="text-white/60 text-xs">streak</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2">
              <Star size={18} className="text-yellow-300" />
              <div>
                <p className="text-white text-xs font-bold">{user?.points || 0} pts</p>
                <p className="text-white/60 text-xs">earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading || !smartData ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TODAY SECTION */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Clock size={20} className="text-blue-500" /> Today's Overview
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="card p-4 border-l-4 border-blue-500">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--muted)' }}>Next Class</p>
                  <p className="font-bold text-base line-clamp-1">{smartData.today.nextClass.subject}</p>
                  <p className="text-sm mt-1 text-blue-500 font-medium">{smartData.today.nextClass.time} · {smartData.today.nextClass.room}</p>
                </div>
                <div className="card p-4 border-l-4 border-orange-500">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--muted)' }}>Current Attendance</p>
                  <p className="font-bold text-xl">{smartData.today.currentAttendance}%</p>
                  <p className="text-xs mt-1 text-orange-500 font-medium">Risk: Shortage Approaching</p>
                </div>
                <div className="card p-4 border-l-4 border-green-500">
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--muted)' }}>Pending Assignments</p>
                  <p className="font-bold text-xl">{smartData.today.pendingAssignments}</p>
                  <p className="text-xs mt-1 text-green-500 font-medium">Due in 2 days</p>
                </div>
              </div>
            </section>

            {/* ACADEMIC PROGRESS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <BookOpen size={20} className="text-indigo-500" /> Academic Progress
                </h2>
              </div>
              <div className="card p-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Course Progress</span>
                      <span className="text-sm font-bold">{smartData.academic.courseProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${smartData.academic.courseProgress}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Quiz Performance</span>
                      <span className="text-sm font-bold">{smartData.academic.quizAvg}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${smartData.academic.quizAvg}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Exam Preparation Readiness</span>
                      <span className="text-sm font-bold">{smartData.academic.examPrep}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${smartData.academic.examPrep}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CAREER */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Map size={20} className="text-purple-500" /> Career Roadmap
                </h2>
                <Link href="/student/career-roadmap" className="text-sm text-purple-500 font-medium hover:underline">View Full Roadmap</Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card p-5 flex flex-col justify-center items-center text-center">
                  <Target size={32} className="text-purple-500 mb-2" />
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Current Goal</p>
                  <p className="font-bold text-lg">{smartData.career.goal}</p>
                </div>
                <div className="card p-5">
                  <p className="text-sm font-medium mb-3">Skills Progress</p>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-purple-500">{smartData.career.skillsCompleted}</span>
                    <span className="text-sm pb-1" style={{ color: 'var(--muted)' }}>/ {smartData.career.skillsTotal} completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(smartData.career.skillsCompleted / smartData.career.skillsTotal) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* AI ASSISTANT */}
            <div className="card p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Campus AI</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>"How can I help you prepare for your exams today?"</p>
                    
                    {!isAskingAI ? (
                      <button onClick={() => setIsAskingAI(true)} className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                        Ask a question →
                      </button>
                    ) : (
                      <form onSubmit={handleAskAI} className="flex gap-2 w-full mt-2">
                        <input 
                          type="text" 
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          placeholder="Type your question..." 
                          className="input flex-1 py-1 px-2 text-xs"
                          autoFocus
                          disabled={isAILoading}
                        />
                        <button disabled={isAILoading} type="submit" className="btn btn-primary py-1 px-3 text-xs">
                          {isAILoading ? '...' : 'Ask'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SMART ALERTS */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Bell size={20} className="text-red-500" /> Smart Alerts
              </h2>
              <div className="space-y-3">
                {smartData.alerts.map((alert: any, i: number) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 ${
                    alert.type === 'warning' ? 'bg-orange-50 border-orange-500 dark:bg-orange-900/20' : 
                    alert.type === 'info' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' : 
                    'bg-green-50 border-green-500 dark:bg-green-900/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      {alert.type === 'warning' ? <AlertTriangle size={18} className="text-orange-500 mt-0.5" /> : 
                       alert.type === 'info' ? <Target size={18} className="text-blue-500 mt-0.5" /> : 
                       <CheckCircle size={18} className="text-green-500 mt-0.5" />}
                      <div>
                        <p className="text-sm font-bold">{alert.title}</p>
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PLACEMENT READINESS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Briefcase size={20} className="text-teal-500" /> Placement
                </h2>
                <Link href="/student/placement-preparation" className="text-sm text-teal-500 font-medium hover:underline">Go to Prep</Link>
              </div>
              <div className="card p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Overall Readiness</p>
                    <p className="text-3xl font-bold text-teal-500">{smartData.placement.readiness}%</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-teal-500 flex items-center justify-center">
                    <Briefcase size={24} className="text-teal-500" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Aptitude</span>
                    <span className="font-bold">{smartData.placement.aptitude}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Coding</span>
                    <span className="font-bold">{smartData.placement.coding}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mock Interview</span>
                    <span className="font-bold">{smartData.placement.interview}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Resume Score</span>
                    <span className="font-bold text-green-500">{smartData.placement.resume}%</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
