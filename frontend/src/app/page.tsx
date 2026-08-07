'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, Users, Award, Star, ChevronRight, Play,
  CheckCircle, ArrowRight, Sparkles, Brain, Shield, Zap, Globe,
  BarChart3, MessageSquare, Calendar, Menu, X
} from 'lucide-react';

// ─── Landing Navbar ───────────────────────────────────────────────────────────
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(15, 15, 26, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">CampusLearn</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Courses', 'About', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary text-sm px-5 py-2">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden"
          style={{ background: 'rgba(15, 15, 26, 0.98)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="px-6 py-4 space-y-3">
            {['Features', 'Courses', 'About', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-white/70 hover:text-white py-2 text-sm" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <Link href="/login" className="block text-white/70 hover:text-white py-2 text-sm">Sign In</Link>
            <Link href="/register" className="btn btn-primary w-full mt-2 text-sm">Get Started</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0f0f1a' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}
            >
              <Sparkles size={14} />
              <span>AI-Powered Learning Platform</span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 text-white">
              One Platform for{' '}
              <span className="gradient-text">Smarter</span>{' '}
              College Learning
            </h1>

            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Replace Google Classroom, WhatsApp groups, email, and multiple apps with one beautiful, powerful platform. Students, Faculty, HOD, and Admins — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/register" className="btn btn-primary px-7 py-3 text-base">
                Start Free Today <ArrowRight size={16} />
              </Link>
              <a href="#courses" className="btn btn-secondary px-7 py-3 text-base" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
                <Play size={16} className="fill-white" /> Watch Demo
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: '10,000+', label: 'Students' },
                { value: '500+', label: 'Courses' },
                { value: '98%', label: 'Satisfaction' },
                { value: '50+', label: 'Colleges' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating card 1 */}
            <motion.div
              className="absolute -top-8 -left-8 rounded-2xl p-4 shadow-2xl z-10"
              style={{ background: 'rgba(99,102,241,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 text-white">
                <CheckCircle size={16} className="text-emerald-300" />
                <span className="text-sm font-medium">Assignment submitted!</span>
              </div>
            </motion.div>

            {/* Main dashboard mockup */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 h-5 rounded-md mx-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Dashboard mockup */}
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  {[
                    { label: 'Courses', value: '6', color: '#6366f1' },
                    { label: 'Attendance', value: '87%', color: '#10b981' },
                    { label: 'Assignments', value: '3', color: '#f59e0b' },
                    { label: 'Score', value: 'A+', color: '#8b5cf6' },
                  ].map((card) => (
                    <div key={card.label} className="flex-1 rounded-xl p-3" style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                      <p className="text-xs text-white/50 mb-1">{card.label}</p>
                      <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Course list */}
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-white/40 mb-2 font-medium">ENROLLED COURSES</p>
                  {['Data Structures & Algorithms', 'Machine Learning', 'Database Systems'].map((course, i) => (
                    <div key={course} className="flex items-center gap-2 py-2 border-b border-white/05 last:border-0">
                      <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center text-white text-xs">{i + 1}</div>
                      <span className="text-xs text-white/70">{course}</span>
                      <div className="ml-auto h-1.5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${[75, 45, 60][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini chart placeholder */}
                <div className="rounded-xl p-3 flex items-end gap-1" style={{ background: 'rgba(255,255,255,0.03)', height: 80 }}>
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm gradient-primary" style={{ height: `${h}%`, opacity: 0.7 + i * 0.04 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <motion.div
              className="absolute -bottom-6 -right-6 rounded-2xl p-4 shadow-2xl"
              style={{ background: 'rgba(26,26,46,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/50">AI Assistant</p>
                  <p className="text-sm font-medium text-white">Ask me anything...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: <BookOpen size={24} />, title: 'Smart Courses', desc: 'Video lessons, notes, quizzes, and live classes all in one structured course format.', color: '#6366f1' },
    { icon: <Brain size={24} />, title: 'AI Study Assistant', desc: 'Get instant help, explanations, and quiz generation powered by GPT-4.', color: '#8b5cf6' },
    { icon: <BarChart3 size={24} />, title: 'Deep Analytics', desc: 'Track attendance, grades, and learning progress with beautiful visual charts.', color: '#06b6d4' },
    { icon: <Shield size={24} />, title: 'Role-Based Access', desc: 'Student, Faculty, HOD, and Admin — each with tailored permissions.', color: '#10b981' },
    { icon: <MessageSquare size={24} />, title: 'Discussion Forum', desc: 'Ask doubts, share resources, and collaborate in course discussion forums.', color: '#f59e0b' },
    { icon: <Award size={24} />, title: 'Certifications', desc: 'Earn verified digital certificates upon course completion.', color: '#ef4444' },
    { icon: <Calendar size={24} />, title: 'Smart Calendar', desc: 'Never miss a deadline with integrated assignment and class scheduling.', color: '#6366f1' },
    { icon: <Zap size={24} />, title: 'Gamification', desc: 'Daily streaks, leaderboards, badges, and points to keep students motivated.', color: '#8b5cf6' },
  ];

  return (
    <section id="features" className="py-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
            <Zap size={14} /> Everything You Need
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose <span className="gradient-text">CampusLearn</span>?
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We've built the most comprehensive academic platform, combining the best of Coursera, Google Classroom, and Notion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              whileHover={{ background: `${f.color}10`, borderColor: `${f.color}30` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${f.color}20`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Statistics Section ───────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Students', icon: <Users size={24} /> },
    { value: '500+', label: 'Courses Available', icon: <BookOpen size={24} /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <Star size={24} /> },
    { value: '50+', label: 'Partner Colleges', icon: <Globe size={24} /> },
  ];

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-4xl font-black mb-1">{stat.value}</p>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { step: '01', title: 'Register & Join', desc: 'Create your account and get assigned to your department and courses by your admin.', icon: <Users size={22} /> },
    { step: '02', title: 'Access Courses', desc: 'Watch video lessons, download notes, and track your progress module by module.', icon: <BookOpen size={22} /> },
    { step: '03', title: 'Learn & Engage', desc: 'Submit assignments, attempt quizzes, and discuss in forums with AI assistance.', icon: <Brain size={22} /> },
    { step: '04', title: 'Earn Certificates', desc: 'Complete courses, maintain attendance, and earn verified digital certificates.', icon: <Award size={22} /> },
  ];

  return (
    <section className="py-24" style={{ background: '#13131f' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">How CampusLearn Works</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Four simple steps to transform your academic experience.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/8 right-1/8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-white">{step.icon}</div>
              </div>
              <div className="text-xs font-bold tracking-wider mb-1" style={{ color: '#6366f1' }}>STEP {step.step}</div>
              <h3 className="font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { name: 'Arjun Mehta', role: 'CSE Student, Sem 5', text: 'CampusLearn replaced everything — WhatsApp groups, email, Google Classroom. Everything I need is in one place. The AI assistant is a game-changer!', rating: 5, avatar: 'AM' },
    { name: 'Prof. Priya Sharma', role: 'Associate Professor', text: 'I can manage my courses, track attendance, grade assignments, and see student analytics all from one dashboard. Incredibly efficient!', rating: 5, avatar: 'PS' },
    { name: 'Dr. Rajesh Kumar', role: 'HOD, CSE Department', text: 'The HOD dashboard gives me complete visibility of my department — faculty performance, student analytics, and attendance reports at a glance.', rating: 5, avatar: 'RK' },
  ];

  return (
    <section className="py-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">What They Say</h2>
          <p className="text-white/50 text-lg">Trusted by students, faculty, and administrators</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(null).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: 'Is CampusLearn free to use?', a: 'Yes! CampusLearn is completely free for students. Colleges get an institutional license to set up the platform.' },
    { q: 'Can it replace Google Classroom?', a: 'Absolutely. CampusLearn includes everything Google Classroom offers plus attendance management, AI assistant, leaderboard, and much more.' },
    { q: 'Is my data secure?', a: 'We use industry-standard JWT authentication, bcrypt encryption, CORS protection, and MongoDB Atlas with end-to-end security.' },
    { q: 'Does it support mobile devices?', a: 'Yes! CampusLearn is fully responsive and works perfectly on mobile, tablet, and desktop. A PWA version is coming soon.' },
    { q: 'Can students watch recorded lectures?', a: 'Yes, faculty can upload video lectures via Cloudinary. Students can watch them anytime, track progress, and leave timestamps.' },
  ];

  return (
    <section className="py-24" style={{ background: '#13131f' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronRight size={16} className={`text-white/40 transition-transform ${openIndex === i ? 'rotate-90' : ''}`} />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 text-sm text-white/50 leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24" style={{ background: '#0f0f1a' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
            <Sparkles size={14} /> Join 10,000+ Students
          </div>
          <h2 className="text-5xl font-black text-white mb-6">
            Ready to <span className="gradient-text">Transform</span> Your Learning?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Join CampusLearn today and experience the future of college education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn btn-primary px-8 py-3.5 text-base">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn text-sm px-8 py-3.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 border-t" style={{ background: '#0a0a14', borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-white">CampusLearn</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              One Platform for Smarter College Learning. Replacing multiple apps with one beautiful solution.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Features', 'Courses', 'Analytics', 'AI Assistant'] },
            { title: 'Roles', links: ['Students', 'Faculty', 'HOD', 'Admin'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-white/30">© 2024 CampusLearn. All rights reserved. Built for Final Year Engineering Project.</p>
          <p className="text-xs text-white/30 mt-2 md:mt-0">Made with ❤️ by CampusLearn Team</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main style={{ background: '#0f0f1a' }}>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
