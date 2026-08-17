'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Map, Target, Briefcase, CheckCircle, Circle, Edit2, X, Check,
  BookOpen, Award, Code, Database, Cloud, Brain, Sparkles, Download,
  TrendingUp, Star, ChevronRight, Plus, Loader2, ExternalLink, AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────
type SkillStatus = 'Not Started' | 'Learning' | 'Practicing' | 'Completed';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  status: SkillStatus;
  skills: string[];
  resources: { label: string; url: string }[];
  estimatedWeeks: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CAREER_PATHS: Record<string, RoadmapStep[]> = {
  'Full Stack Developer': [
    { id: 1, title: 'Programming Fundamentals', description: 'Variables, loops, functions, OOP basics', status: 'Completed', skills: ['Python/JS basics', 'Problem solving', 'Git'], resources: [{ label: 'CS50x', url: 'https://cs50.harvard.edu/x' }], estimatedWeeks: 4 },
    { id: 2, title: 'Data Structures & Algorithms', description: 'Arrays, trees, graphs, sorting, searching', status: 'Completed', skills: ['Arrays', 'Linked Lists', 'Trees', 'DP'], resources: [{ label: 'LeetCode', url: 'https://leetcode.com' }], estimatedWeeks: 8 },
    { id: 3, title: 'Database Management', description: 'SQL, NoSQL, MongoDB, PostgreSQL', status: 'Learning', skills: ['SQL queries', 'MongoDB', 'ORM'], resources: [{ label: 'SQLZoo', url: 'https://sqlzoo.net' }], estimatedWeeks: 4 },
    { id: 4, title: 'Backend Development', description: 'REST APIs, Node.js/Express, authentication', status: 'Not Started', skills: ['Node.js', 'Express', 'JWT', 'REST'], resources: [{ label: 'Node.js Docs', url: 'https://nodejs.org/docs' }], estimatedWeeks: 6 },
    { id: 5, title: 'Frontend Development', description: 'React, state management, responsive design', status: 'Not Started', skills: ['React', 'TypeScript', 'CSS/Tailwind'], resources: [{ label: 'React Docs', url: 'https://react.dev' }], estimatedWeeks: 6 },
    { id: 6, title: 'Projects & Portfolio', description: 'Build 3 full-stack projects for portfolio', status: 'Not Started', skills: ['GitHub', 'Deployment', 'Documentation'], resources: [{ label: 'GitHub', url: 'https://github.com' }], estimatedWeeks: 8 },
    { id: 7, title: 'Certifications', description: 'Relevant cloud and framework certifications', status: 'Not Started', skills: ['AWS Cloud Practitioner', 'Meta Frontend'], resources: [{ label: 'AWS Training', url: 'https://aws.amazon.com/training' }], estimatedWeeks: 4 },
    { id: 8, title: 'Internship / Placement Prep', description: 'Resume, mock interviews, aptitude', status: 'Not Started', skills: ['Resume building', 'Mock interviews', 'Aptitude'], resources: [{ label: 'IndiaBix', url: 'https://indiabix.com' }], estimatedWeeks: 4 },
  ],
  'AI/ML Engineer': [
    { id: 1, title: 'Python Fundamentals', description: 'Python, NumPy, Pandas', status: 'Completed', skills: ['Python', 'NumPy', 'Pandas'], resources: [{ label: 'Python.org', url: 'https://python.org' }], estimatedWeeks: 3 },
    { id: 2, title: 'Mathematics for ML', description: 'Linear algebra, calculus, probability', status: 'Learning', skills: ['Linear Algebra', 'Statistics', 'Probability'], resources: [{ label: '3Blue1Brown', url: 'https://www.3blue1brown.com' }], estimatedWeeks: 6 },
    { id: 3, title: 'Machine Learning Basics', description: 'Supervised, unsupervised, reinforcement', status: 'Not Started', skills: ['sklearn', 'Regression', 'Classification'], resources: [{ label: 'Coursera ML', url: 'https://coursera.org/learn/machine-learning' }], estimatedWeeks: 8 },
    { id: 4, title: 'Deep Learning & Neural Networks', description: 'CNNs, RNNs, Transformers', status: 'Not Started', skills: ['TensorFlow', 'PyTorch', 'Keras'], resources: [{ label: 'fast.ai', url: 'https://fast.ai' }], estimatedWeeks: 8 },
    { id: 5, title: 'NLP & Computer Vision', description: 'Language models, image processing', status: 'Not Started', skills: ['BERT', 'OpenCV', 'HuggingFace'], resources: [{ label: 'HuggingFace', url: 'https://huggingface.co' }], estimatedWeeks: 6 },
    { id: 6, title: 'ML Projects & Research', description: 'Kaggle competitions, published projects', status: 'Not Started', skills: ['Kaggle', 'MLflow', 'Model deployment'], resources: [{ label: 'Kaggle', url: 'https://kaggle.com' }], estimatedWeeks: 10 },
    { id: 7, title: 'Placement Preparation', description: 'ML system design, coding rounds', status: 'Not Started', skills: ['System Design', 'LeetCode', 'ML concepts'], resources: [{ label: 'LeetCode', url: 'https://leetcode.com' }], estimatedWeeks: 4 },
  ],
  'Data Scientist': [
    { id: 1, title: 'Statistics & Probability', description: 'Hypothesis testing, distributions', status: 'Not Started', skills: ['Statistics', 'R/Python', 'Probability'], resources: [{ label: 'StatQuest', url: 'https://statquest.org' }], estimatedWeeks: 4 },
    { id: 2, title: 'Data Analysis & Visualization', description: 'Exploratory analysis, charts, storytelling', status: 'Not Started', skills: ['Matplotlib', 'Seaborn', 'Tableau'], resources: [{ label: 'Kaggle Courses', url: 'https://kaggle.com/learn' }], estimatedWeeks: 4 },
    { id: 3, title: 'Machine Learning for Data Science', description: 'Feature engineering, model selection', status: 'Not Started', skills: ['sklearn', 'XGBoost', 'Feature Engineering'], resources: [{ label: 'sklearn Docs', url: 'https://scikit-learn.org' }], estimatedWeeks: 6 },
    { id: 4, title: 'Big Data & Cloud', description: 'Spark, Hadoop, cloud platforms', status: 'Not Started', skills: ['PySpark', 'AWS/GCP', 'SQL at Scale'], resources: [{ label: 'Databricks', url: 'https://databricks.com' }], estimatedWeeks: 6 },
    { id: 5, title: 'Business Intelligence & Projects', description: 'End-to-end data projects, dashboards', status: 'Not Started', skills: ['Power BI', 'Dashboard building', 'Storytelling'], resources: [{ label: 'Power BI', url: 'https://powerbi.microsoft.com' }], estimatedWeeks: 6 },
  ],
  'Software Engineer': [
    { id: 1, title: 'Core CS Fundamentals', description: 'OS, DBMS, Networks, OOP', status: 'Completed', skills: ['OS concepts', 'DBMS', 'Computer Networks'], resources: [{ label: 'GeeksForGeeks', url: 'https://geeksforgeeks.org' }], estimatedWeeks: 6 },
    { id: 2, title: 'Data Structures & Algorithms', description: 'Arrays to graphs, complexity', status: 'Learning', skills: ['Arrays', 'Trees', 'Graphs', 'DP'], resources: [{ label: 'LeetCode', url: 'https://leetcode.com' }], estimatedWeeks: 12 },
    { id: 3, title: 'System Design', description: 'Scalable systems, microservices', status: 'Not Started', skills: ['HLD', 'LLD', 'Scalability'], resources: [{ label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' }], estimatedWeeks: 6 },
    { id: 4, title: 'Domain Specialization', description: 'Choose backend, frontend, or cloud', status: 'Not Started', skills: ['Domain-specific stack'], resources: [{ label: 'roadmap.sh', url: 'https://roadmap.sh' }], estimatedWeeks: 8 },
    { id: 5, title: 'Projects & Open Source', description: 'Contribute to open source', status: 'Not Started', skills: ['GitHub', 'Open Source', '3+ projects'], resources: [{ label: 'GitHub Explore', url: 'https://github.com/explore' }], estimatedWeeks: 8 },
    { id: 6, title: 'Aptitude & Interview Prep', description: 'Quant, logical, verbal', status: 'Not Started', skills: ['Quantitative', 'Logical Reasoning', 'HR prep'], resources: [{ label: 'IndiaBix', url: 'https://indiabix.com' }], estimatedWeeks: 4 },
  ],
};

const CAREER_OPTIONS = ['Full Stack Developer', 'AI/ML Engineer', 'Data Scientist', 'Software Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Cybersecurity Engineer', 'UI/UX Designer', 'Business Analyst', 'Data Analyst'];

const STATUS_STYLE: Record<SkillStatus, { badge: string; icon: typeof CheckCircle; dot: string }> = {
  'Completed':   { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', icon: CheckCircle, dot: 'bg-emerald-500' },
  'Learning':    { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',   icon: Circle, dot: 'bg-orange-500' },
  'Practicing':  { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',          icon: Circle, dot: 'bg-blue-500' },
  'Not Started': { badge: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',             icon: Circle, dot: 'bg-zinc-300 dark:bg-zinc-600' },
};

const STAT_ICONS: Record<string, typeof Target> = {
  career: Target, skills: Star, projects: Code, certs: Award,
};

export default function CareerRoadmapPage() {
  const [goal, setGoal] = useState('Full Stack Developer');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const [customGoal, setCustomGoal] = useState('');
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>(CAREER_PATHS['Full Stack Developer']);
  const [expandedStep, setExpandedStep] = useState<number | null>(2);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills' | 'analytics'>('roadmap');

  useEffect(() => {
    const steps = CAREER_PATHS[goal] || CAREER_PATHS['Full Stack Developer'];
    // Preserve existing statuses if they match
    const preserved = steps.map(s => {
      const existing = roadmapSteps.find(r => r.id === s.id);
      return existing ? { ...s, status: existing.status } : s;
    });
    setRoadmapSteps(preserved);
  }, [goal]);

  const completed = roadmapSteps.filter(s => s.status === 'Completed').length;
  const readiness = Math.round((completed / roadmapSteps.length) * 100);

  const handleSaveGoal = () => {
    const finalGoal = tempGoal === '__custom__' ? customGoal.trim() : tempGoal;
    if (!finalGoal) return;
    setIsSaving(true);
    setTimeout(() => {
      setGoal(finalGoal);
      setIsEditingGoal(false);
      setIsSaving(false);
      toast.success(`Career goal updated to "${finalGoal}"!`, { icon: '🎯' });
    }, 600);
  };

  const updateStep = (id: number, status: SkillStatus) => {
    setRoadmapSteps(prev => prev.map(s => {
      if (s.id === id) return { ...s, status };
      if (s.id === id + 1 && status === 'Completed' && s.status === 'Not Started') return { ...s, status: 'Learning' };
      return s;
    }));
    if (status === 'Completed') toast.success('Step marked as completed! 🎉');
  };

  const handleDownload = () => {
    const content = `# My Career Roadmap\n\nGoal: ${goal}\nReadiness: ${readiness}%\n\n## Steps\n${roadmapSteps.map(s => `- [${s.status === 'Completed' ? 'x' : ' '}] ${s.title} (${s.status})`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'career-roadmap.md';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Roadmap downloaded!');
  };

  return (
    <DashboardLayout requiredRole="student">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Map size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">My Career Roadmap</h1>
          </div>
          <p className="text-sm text-zinc-500">Your personalized path to becoming a {goal}</p>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors">
          <Download size={15} /> Download Roadmap
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Career Readiness', value: `${readiness}%`, icon: Target, color: 'bg-orange-500' },
          { label: 'Steps Completed', value: `${completed}/${roadmapSteps.length}`, icon: CheckCircle, color: 'bg-emerald-500' },
          { label: 'Currently Learning', value: roadmapSteps.filter(s => s.status === 'Learning').length, icon: BookOpen, color: 'bg-blue-500' },
          { label: 'Est. Weeks Left', value: roadmapSteps.filter(s => s.status !== 'Completed').reduce((a, s) => a + s.estimatedWeeks, 0), icon: TrendingUp, color: 'bg-violet-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-zinc-900 dark:text-white leading-none">{value}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-xl w-fit">
        {(['roadmap', 'skills', 'analytics'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Left: Main Content */}
        <div>
          {activeTab === 'roadmap' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <Map size={16} className="text-orange-500" /> Personalized Learning Path
                  <span className="ml-auto text-xs text-zinc-400 font-normal">{goal}</span>
                </h2>
              </div>
              <div className="p-5">
                <div className="relative border-l-2 border-orange-200 dark:border-orange-500/20 ml-3 space-y-5">
                  {roadmapSteps.map((step, i) => {
                    const style = STATUS_STYLE[step.status];
                    const isActive = step.status === 'Learning' || step.status === 'Practicing';
                    const isExpanded = expandedStep === step.id;
                    return (
                      <motion.div key={step.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pl-8">
                        {/* Timeline dot */}
                        <span className={`absolute -left-[11px] top-2 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 ${style.dot}`}>
                          {step.status === 'Completed' && <Check size={10} className="text-white" />}
                        </span>
                        {/* Card */}
                        <div className={`rounded-xl border transition-colors ${isActive ? 'border-orange-400 dark:border-orange-500/60 bg-orange-50/50 dark:bg-orange-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                          <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-bold text-zinc-900 dark:text-white text-sm">{step.title}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className={`text-[10px] px-2.5 py-1 font-bold rounded-full ${style.badge}`}>{step.status}</span>
                              <ChevronRight size={14} className={`text-zinc-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-3">
                                  {/* Skills */}
                                  <div>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Skills</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {step.skills.map(sk => (
                                        <span key={sk} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-semibold">{sk}</span>
                                      ))}
                                    </div>
                                  </div>
                                  {/* Resources */}
                                  <div>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Resources</p>
                                    {step.resources.map(r => (
                                      <a key={r.label} href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 hover:underline mb-1">
                                        <ExternalLink size={11} /> {r.label}
                                      </a>
                                    ))}
                                  </div>
                                  <p className="text-xs text-zinc-400">⏱️ Est. {step.estimatedWeeks} weeks</p>
                                  {/* Action buttons */}
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {step.status !== 'Completed' && step.status !== 'Learning' && (
                                      <button onClick={() => updateStep(step.id, 'Learning')} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1">
                                        <BookOpen size={11} /> Start Learning
                                      </button>
                                    )}
                                    {step.status === 'Learning' && (
                                      <button onClick={() => updateStep(step.id, 'Practicing')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xs transition-colors">
                                        Mark Practicing
                                      </button>
                                    )}
                                    {step.status !== 'Completed' && (
                                      <button onClick={() => updateStep(step.id, 'Completed')} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-xs transition-colors border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                                        <Check size={11} /> Mark Complete
                                      </button>
                                    )}
                                    {step.status === 'Completed' && (
                                      <button onClick={() => updateStep(step.id, 'Learning')} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-bold rounded-lg text-xs transition-colors">
                                        Undo
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="font-black text-zinc-900 dark:text-white">Skill Tracker</h2>
              </div>
              <div className="p-5 space-y-4">
                {roadmapSteps.map((step, i) => {
                  const pct = step.status === 'Completed' ? 100 : step.status === 'Practicing' ? 70 : step.status === 'Learning' ? 35 : 0;
                  const style = STATUS_STYLE[step.status];
                  return (
                    <motion.div key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">{step.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${style.badge}`}>{step.status}</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.07, duration: 0.6 }}
                          className={`h-2 rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 30 ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {step.skills.map(sk => <span key={sk} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded font-medium">{sk}</span>)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              {/* Readiness Gauge */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="font-black text-zinc-900 dark:text-white mb-5">Career Analytics</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-100 dark:text-zinc-800" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10"
                        strokeDasharray={`${readiness * 2.51} 251`} strokeLinecap="round" className="text-orange-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-zinc-900 dark:text-white">{readiness}%</span>
                      <span className="text-xs text-zinc-400">Ready</span>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    {[
                      { label: 'Skill Completion', value: readiness },
                      { label: 'Learning Progress', value: roadmapSteps.filter(s => s.status !== 'Not Started').length / roadmapSteps.length * 100 },
                      { label: 'Project Completion', value: 30 },
                      { label: 'Certification Progress', value: 15 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-500">{label}</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{Math.round(value)}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(value)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Smart Recommendations */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                <h3 className="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2"><Sparkles size={16} className="text-orange-500" /> Smart Recommendations</h3>
                <div className="space-y-3">
                  {[
                    { type: 'Course', title: 'Node.js Complete Guide', desc: 'Recommended based on your Backend Dev step', badge: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
                    { type: 'Project', title: 'Build a REST API', desc: 'Strengthen your backend skills with a real project', badge: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' },
                    { type: 'Certification', title: 'AWS Cloud Practitioner', desc: 'High-demand cert for your target role', badge: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
                  ].map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full shrink-0 mt-0.5 ${rec.badge}`}>{rec.type}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">{rec.title}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{rec.desc}</p>
                      </div>
                      <button className="shrink-0 text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline">View →</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Goal Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest mb-1">Career Goal</p>
                  <p className="text-xl font-black text-white leading-tight">{goal}</p>
                </div>
                <button onClick={() => { setTempGoal(goal); setIsEditingGoal(true); }} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors">
                  <Edit2 size={14} />
                </button>
              </div>
              {/* Readiness bar */}
              <div className="mt-4 relative z-10">
                <div className="flex justify-between text-xs text-orange-100 mb-1.5">
                  <span className="font-semibold">Career Readiness</span>
                  <span className="font-black">{readiness}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${readiness}%` }} transition={{ duration: 0.8 }}
                    className="bg-white h-2 rounded-full" />
                </div>
              </div>
            </div>

            {/* Goal editor */}
            <AnimatePresence>
              {isEditingGoal && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-zinc-100 dark:border-zinc-800">
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Career Path</p>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                      {CAREER_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setTempGoal(opt)}
                          className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${tempGoal === opt ? 'bg-orange-500 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10'}`}>
                          {opt}
                        </button>
                      ))}
                      <button onClick={() => setTempGoal('__custom__')}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${tempGoal === '__custom__' ? 'bg-orange-500 text-white' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10'}`}>
                        + Custom Goal
                      </button>
                    </div>
                    {tempGoal === '__custom__' && (
                      <input type="text" value={customGoal} onChange={e => setCustomGoal(e.target.value)} placeholder="Enter your career goal..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" autoFocus />
                    )}
                    <div className="flex gap-2">
                      <button onClick={handleSaveGoal} disabled={isSaving} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-60">
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
                      </button>
                      <button onClick={() => setIsEditingGoal(false)} className="py-2 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Target Companies */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="font-black text-zinc-900 dark:text-white text-sm mb-3 flex items-center gap-2"><Briefcase size={14} className="text-orange-500" /> Target Companies</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro'].map(c => (
                <span key={c} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700">{c}</span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="font-black text-zinc-900 dark:text-white text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'View Placement Prep', href: '/student/placement-preparation', icon: Briefcase },
                { label: 'Exam Preparation', href: '/student/exam-preparation', icon: Target },
                { label: 'My Certificates', href: '/student/certificates', icon: Award },
              ].map(({ label, href, icon: Icon }) => (
                <a key={href} href={href} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group">
                  <Icon size={14} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{label}</span>
                  <ChevronRight size={12} className="ml-auto text-zinc-300 dark:text-zinc-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
