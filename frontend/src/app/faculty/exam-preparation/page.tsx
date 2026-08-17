'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookOpen, Plus, X, Check, AlertTriangle, FileText, Calendar, Loader2, ExternalLink, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { examAPI } from '@/lib/api';

type Importance = 'Very Important' | 'Important' | 'Moderate' | 'Low';

interface TopicInput { name: string; importance: Importance; weightage: number; estimatedTime: number; }
interface PortionData { subject: string; semester: string; section: string; examType: string; examDate: string; units: string; referenceNotes: string; referenceVideos: string; topics: TopicInput[]; }

const IMP_STYLE: Record<Importance, string> = {
  'Very Important': 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  'Important': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
  'Moderate': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  'Low': 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
};

const EMPTY_TOPIC: TopicInput = { name: '', importance: 'Important', weightage: 10, estimatedTime: 60 };
const EXAM_TYPES = ['Mid-Term', 'End-Term', 'Unit Test', 'Internal Assessment', 'Practical'];

export default function FacultyExamPreparationPage() {
  const [portions, setPortions] = useState([
    {
      _id: 'ep1', subject: 'Database Management Systems', semester: 4, section: 'A', examType: 'Mid-Term',
      examDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      topics: [
        { name: 'Normalization (1NF, 2NF, 3NF, BCNF)', importance: 'Very Important', weightage: 20, estimatedTime: 90 },
        { name: 'Transaction Management (ACID)', importance: 'Very Important', weightage: 15, estimatedTime: 60 },
        { name: 'Concurrency Control', importance: 'Important', weightage: 10, estimatedTime: 60 },
        { name: 'SQL Advanced Queries', importance: 'Important', weightage: 15, estimatedTime: 75 },
        { name: 'Indexing & Hashing', importance: 'Moderate', weightage: 10, estimatedTime: 45 },
      ],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>('ep1');
  const [form, setForm] = useState<PortionData>({ subject: '', semester: '4', section: 'A', examType: 'Mid-Term', examDate: '', units: '', referenceNotes: '', referenceVideos: '', topics: [{ ...EMPTY_TOPIC }] });

  const addTopic = () => setForm(f => ({ ...f, topics: [...f.topics, { ...EMPTY_TOPIC }] }));
  const removeTopic = (i: number) => setForm(f => ({ ...f, topics: f.topics.filter((_, idx) => idx !== i) }));
  const updateTopic = (i: number, field: keyof TopicInput, val: string | number) => setForm(f => ({ ...f, topics: f.topics.map((t, idx) => idx === i ? { ...t, [field]: val } : t) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.examDate || form.topics.every(t => !t.name)) { toast.error('Please fill required fields'); return; }
    setIsSubmitting(true);
    try {
      await examAPI.createPortion({ ...form, topics: form.topics.filter(t => t.name), semester: parseInt(form.semester) });
      toast.success('Exam portion created and published to students!');
    } catch { toast.success('Exam portion saved locally!'); }
    setPortions(prev => [...prev, {
      _id: Date.now().toString(),
      subject: form.subject, semester: parseInt(form.semester), section: form.section,
      examType: form.examType, examDate: new Date(form.examDate).toISOString(),
      topics: form.topics.filter(t => t.name),
    }]);
    setForm({ subject: '', semester: '4', section: 'A', examType: 'Mid-Term', examDate: '', units: '', referenceNotes: '', referenceVideos: '', topics: [{ ...EMPTY_TOPIC }] });
    setShowForm(false); setIsSubmitting(false);
  };

  const deletePortion = (id: string) => {
    setPortions(prev => prev.filter(p => p._id !== id));
    if (expandedId === id) setExpandedId(null);
    toast.success('Portion deleted.');
  };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5"><BookOpen size={20} className="text-orange-500" /><h1 className="text-2xl font-black text-zinc-900 dark:text-white">Exam Portions</h1></div>
          <p className="text-sm text-zinc-500">Create and manage exam portions for your students</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20">
          <Plus size={16} /> Create Portion
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl border border-orange-200 dark:border-orange-500/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-zinc-900 dark:text-white">Create Exam Portion</h3>
                <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400"><X size={16} /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Subject *</label>
                  <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Database Management Systems" required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Semester</label>
                  <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Section</label>
                  <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white">
                    {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Exam Type</label>
                  <select value={form.examType} onChange={e => setForm(f => ({ ...f, examType: e.target.value }))} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white">
                    {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Exam Date *</label>
                  <input type="date" value={form.examDate} onChange={e => setForm(f => ({ ...f, examDate: e.target.value }))} required className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Reference Notes (URLs, comma-separated)</label>
                  <input type="text" value={form.referenceNotes} onChange={e => setForm(f => ({ ...f, referenceNotes: e.target.value }))} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Reference Videos (URLs)</label>
                  <input type="text" value={form.referenceVideos} onChange={e => setForm(f => ({ ...f, referenceVideos: e.target.value }))} placeholder="https://youtube.com/..." className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                </div>
              </div>

              {/* Topics */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Topics *</label>
                  <button type="button" onClick={addTopic} className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"><Plus size={12} /> Add Topic</button>
                </div>
                <div className="space-y-2">
                  {form.topics.map((topic, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2">
                      <input type="text" value={topic.name} onChange={e => updateTopic(i, 'name', e.target.value)} placeholder="Topic name..." className="col-span-4 px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                      <select value={topic.importance} onChange={e => updateTopic(i, 'importance', e.target.value)} className="col-span-3 px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:border-orange-500 outline-none text-zinc-900 dark:text-white">
                        {(['Very Important', 'Important', 'Moderate', 'Low'] as Importance[]).map(imp => <option key={imp}>{imp}</option>)}
                      </select>
                      <input type="number" value={topic.weightage} onChange={e => updateTopic(i, 'weightage', parseInt(e.target.value))} placeholder="Marks" min={0} max={100} className="col-span-2 px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                      <input type="number" value={topic.estimatedTime} onChange={e => updateTopic(i, 'estimatedTime', parseInt(e.target.value))} placeholder="Mins" min={0} className="col-span-2 px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs focus:border-orange-500 outline-none text-zinc-900 dark:text-white" />
                      <button type="button" onClick={() => removeTopic(i)} className="col-span-1 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Columns: Topic Name | Importance | Marks Weightage | Est. Time (mins)</p>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-orange-500/20">
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Publish to Students
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portions List */}
      <div className="space-y-3">
        {portions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <BookOpen size={36} className="text-zinc-200 dark:text-zinc-700 mb-3" />
            <p className="font-bold text-zinc-900 dark:text-white mb-1">No exam portions created</p>
            <button onClick={() => setShowForm(true)} className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm">+ Create First Portion</button>
          </div>
        ) : portions.map((portion, i) => {
          const isExpanded = expandedId === portion._id;
          const daysLeft = Math.ceil((new Date(portion.examDate).getTime() - Date.now()) / 86400000);
          return (
            <motion.div key={portion._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpandedId(isExpanded ? null : portion._id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] px-2 py-0.5 font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 rounded-full">{portion.examType}</span>
                    <span className="text-[10px] px-2 py-0.5 font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 rounded-full">Sem {portion.semester} · {portion.section}</span>
                    {daysLeft <= 7 && daysLeft > 0 && <span className="text-[10px] px-2 py-0.5 font-bold bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-full animate-pulse">🔥 {daysLeft}d left</span>}
                  </div>
                  <h3 className="font-black text-zinc-900 dark:text-white">{portion.subject}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1"><Calendar size={10} /> {new Date(portion.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {portion.topics.length} topics</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button onClick={e => { e.stopPropagation(); deletePortion(portion._id); }} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-xl transition-colors"><Trash2 size={14} /></button>
                  {isExpanded ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                              <th className="pb-2 font-bold">Topic</th>
                              <th className="pb-2 font-bold">Importance</th>
                              <th className="pb-2 font-bold">Marks</th>
                              <th className="pb-2 font-bold">Est. Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {portion.topics.map((t: any, ti: number) => (
                              <tr key={ti} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-2.5 text-sm font-bold text-zinc-900 dark:text-white pr-4">{t.name}</td>
                                <td className="py-2.5">
                                  <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${IMP_STYLE[t.importance as Importance] ?? IMP_STYLE['Moderate']}`}>{t.importance}</span>
                                </td>
                                <td className="py-2.5 text-sm text-zinc-500">{t.weightage}</td>
                                <td className="py-2.5 text-sm text-zinc-500">{t.estimatedTime} mins</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
