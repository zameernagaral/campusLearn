'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, Users, Award, Star, ChevronRight, Play,
  CheckCircle, ArrowRight, Sparkles, Brain, Shield, Zap, Globe,
  BarChart3, MessageSquare, Calendar, Menu, X
} from 'lucide-react';

import BeamsBackground from '@/components/ui/beams-background';
import ActionSearchBar from '@/components/ui/action-search-bar';
import CardFlip from '@/components/ui/card-flip';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className={`font-bold text-lg tracking-tight ${scrolled ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white'}`}>CampusLearn</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Stats', 'How It Works', 'FAQ'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-zinc-600 hover:text-orange-500 dark:text-zinc-300' : 'text-zinc-600 hover:text-orange-500 dark:text-zinc-300'}`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-orange-500 dark:text-zinc-300 transition-colors px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary text-sm px-5 py-2">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-zinc-900 dark:text-white p-2"
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
          className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800"
        >
          <div className="px-6 py-4 space-y-3">
            {['Features', 'Stats', 'How It Works', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-zinc-600 dark:text-zinc-300 hover:text-orange-500 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <Link href="/login" className="block text-zinc-600 dark:text-zinc-300 hover:text-orange-500 py-2 text-sm">Sign In</Link>
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
    <BeamsBackground className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* No Badge */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl lg:text-7xl font-black leading-tight mb-6 text-zinc-950 dark:text-white"
            >
              Smarter <br/>
              <span className="text-orange-500">College Learning</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-xl"
            >
              Replace Google Classroom, WhatsApp groups, email, and multiple apps with one beautiful, powerful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/register" className="btn btn-primary px-7 py-3 text-base hover:scale-105 active:scale-95 transition-transform duration-200">
                Start Free Today <ArrowRight size={16} />
              </Link>
            </motion.div>
            
            <div className="relative z-50">
              <ActionSearchBar />
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { value: '10,000+', label: 'Students' },
                { value: '500+', label: 'Courses' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-default"
                >
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
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
              className="absolute -top-8 -left-8 rounded-2xl p-4 shadow-xl z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <CheckCircle size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">Assignment submitted!</span>
              </div>
            </motion.div>

            {/* Main dashboard mockup */}
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 h-5 rounded-md mx-4 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Dashboard mockup */}
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  {[
                    { label: 'Courses', value: '6', color: '#f97316' }, // orange-500
                    { label: 'Attendance', value: '87%', color: '#10b981' }, // emerald-500
                    { label: 'Score', value: 'A+', color: '#3b82f6' }, // blue-500
                  ].map((card) => (
                    <div key={card.label} className="flex-1 rounded-xl p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{card.label}</p>
                      <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Course list */}
                <div className="rounded-xl p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-2 font-medium">ENROLLED COURSES</p>
                  {['Data Structures', 'Machine Learning', 'Database Systems'].map((course, i) => (
                    <div key={course} className="flex items-center gap-2 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-semibold">{i + 1}</div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">{course}</span>
                      <div className="ml-auto h-1.5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${[75, 45, 60][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card 2 */}
            <motion.div
              className="absolute -bottom-6 -right-6 rounded-2xl p-4 shadow-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <BookOpen size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Study Resources</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">Access all notes...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </BeamsBackground>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { title: 'Smart Courses', desc: 'Video lessons, notes, quizzes, and live classes all in one structured course format.', feats: ['Video lessons', 'Quizzes', 'Live classes'] },
    { title: 'Study Assistant', desc: 'Get instant help, explanations, and practice questions.', feats: ['Instant help', 'Explanations', 'Practice'] },
    { title: 'Deep Analytics', desc: 'Track attendance, grades, and learning progress with beautiful visual charts.', feats: ['Attendance', 'Grades', 'Progress charts'] },
    { title: 'Discussion Forum', desc: 'Ask doubts, share resources, and collaborate in course discussion forums.', feats: ['Community', 'Sharing', 'Collaboration'] },
  ];

  return (
    <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
            Everything You Need
          </span>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Why Choose <span className="text-orange-500">CampusLearn</span>?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            We've built the most comprehensive academic platform, combining the best of learning tools in one seamless experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="w-full"
            >
              <CardFlip title={f.title} subtitle="Feature" description={f.desc} features={f.feats} />
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
    <section id="stats" className="py-20 bg-zinc-950 dark:bg-zinc-900 border-y border-zinc-800">
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
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-4xl font-black mb-1">{stat.value}</p>
              <p className="text-zinc-400 text-sm">{stat.label}</p>
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
    { step: '01', title: 'Register & Join', desc: 'Create your account and get assigned to your department and courses.', icon: <Users size={22} /> },
    { step: '02', title: 'Access Courses', desc: 'Watch video lessons, download notes, and track your progress.', icon: <BookOpen size={22} /> },
    { step: '03', title: 'Learn & Engage', desc: 'Submit assignments, attempt quizzes, and discuss in forums.', icon: <Brain size={22} /> },
    { step: '04', title: 'Earn Certificates', desc: 'Complete courses, maintain attendance, and earn certificates.', icon: <Award size={22} /> },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">How CampusLearn Works</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">Four simple steps to transform your academic experience.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-zinc-200 dark:bg-zinc-800" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12, type: "spring", stiffness: 300 }}
              className="text-center relative z-10 cursor-default"
            >
              <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
                <div className="text-white">{step.icon}</div>
              </div>
              <div className="text-xs font-bold tracking-wider mb-1 text-orange-500">STEP {step.step}</div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
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
    { q: 'Is my data secure?', a: 'We use industry-standard security and encryption.' },
  ];

  return (
    <section id="faq" className="py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-zinc-900 dark:text-white">{faq.q}</span>
                <ChevronRight size={16} className={`text-zinc-400 transition-transform ${openIndex === i ? 'rotate-90' : ''}`} />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed"
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
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
            Join 10,000+ Students
          </div>
          <h2 className="text-5xl font-black text-zinc-900 dark:text-white mb-6">
            Ready to <span className="text-orange-500">Transform</span> Your Learning?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Join CampusLearn today and experience the future of college education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn btn-primary px-8 py-3.5 text-base">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn btn-secondary text-sm px-8 py-3.5">
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
    <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-white">CampusLearn</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              One Platform for Smarter College Learning. Replacing multiple apps with one beautiful solution.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Features', 'Courses', 'Analytics'] },
            { title: 'Roles', links: ['Students', 'Faculty', 'Admin'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-zinc-900 dark:text-white text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-orange-500 dark:text-zinc-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-zinc-400">© 2024 CampusLearn. All rights reserved.</p>
          <p className="text-xs text-zinc-400 mt-2 md:mt-0">Made with ❤️ by CampusLearn Team</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-zinc-950">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
