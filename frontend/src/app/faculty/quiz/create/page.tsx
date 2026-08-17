'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { quizAPI, courseAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import type { Course } from '@/types';

export default function CreateQuizPage() {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [courses, setCourses] = useState<Course[]>([]);
 
 // Quiz Metadata
 const [formData, setFormData] = useState({
 title: '',
 course: '',
 duration: '30',
 passingMarks: '40',
 startTime: '',
 endTime: '',
 isPublished: true,
 type: 'assignment'
 });

 // Questions State
 const [questions, setQuestions] = useState([
 {
 question: '',
 type: 'mcq',
 marks: 1,
 options: [
 { text: '', isCorrect: true },
 { text: '', isCorrect: false }
 ]
 }
 ]);

 useEffect(() => {
 const fetchCourses = async () => {
 try {
 const { data } = await courseAPI.getAll();
 setCourses(data.data || data || []);
 } catch (error) {
 toast.error('Failed to load courses');
 }
 };
 fetchCourses();
 }, []);

 const handleAddQuestion = () => {
 setQuestions([
 ...questions,
 {
 question: '',
 type: 'mcq',
 marks: 1,
 options: [
 { text: '', isCorrect: true },
 { text: '', isCorrect: false }
 ]
 }
 ]);
 };

 const handleRemoveQuestion = (index: number) => {
 if (questions.length === 1) return;
 const newQuestions = [...questions];
 newQuestions.splice(index, 1);
 setQuestions(newQuestions);
 };

 const handleAddOption = (qIndex: number) => {
 const newQuestions = [...questions];
 newQuestions[qIndex].options.push({ text: '', isCorrect: false });
 setQuestions(newQuestions);
 };

 const handleRemoveOption = (qIndex: number, oIndex: number) => {
 const newQuestions = [...questions];
 if (newQuestions[qIndex].options.length <= 2) return;
 newQuestions[qIndex].options.splice(oIndex, 1);
 // Ensure at least one correct option exists
 if (!newQuestions[qIndex].options.some(o => o.isCorrect)) {
 newQuestions[qIndex].options[0].isCorrect = true;
 }
 setQuestions(newQuestions);
 };

 const handleSetCorrectOption = (qIndex: number, oIndex: number) => {
 const newQuestions = [...questions];
 newQuestions[qIndex].options.forEach((opt, idx) => {
 opt.isCorrect = idx === oIndex;
 });
 setQuestions(newQuestions);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!formData.course) {
 toast.error('Please select a course');
 return;
 }
 
 // Validate questions
 for (let i = 0; i < questions.length; i++) {
 const q = questions[i];
 if (!q.question.trim()) {
 toast.error(`Question ${i + 1} text is required`);
 return;
 }
 for (let j = 0; j < q.options.length; j++) {
 if (!q.options[j].text.trim()) {
 toast.error(`Question ${i + 1}, Option ${j + 1} text is required`);
 return;
 }
 }
 }

 setIsLoading(true);
 try {
 const payload = {
 ...formData,
 questions,
 };

 await quizAPI.create(payload);
 toast.success('Quiz created successfully!');
 router.push('/faculty/quiz');
 } catch (error: any) {
 toast.error(error.response?.data?.message || 'Failed to create quiz');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <DashboardLayout requiredRole="faculty">
 <div className="max-w-4xl mx-auto pb-24">
 <div className="flex items-center gap-4 mb-8">
 <button 
 onClick={() => router.back()}
 className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
 >
 ← Back
 </button>
 <div>
 <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create New Quiz</h1>
 <p className="text-sm mt-0.5 text-zinc-500">Add multiple choice questions for your students</p>
 </div>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 {/* Quiz Settings */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
 >
 <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs">1</span>
 Quiz Settings
 </h2>
 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quiz Title</label>
 <input 
 required
 type="text"
 placeholder="e.g. Midterm Examination"
 value={formData.title}
 onChange={e => setFormData({ ...formData, title: e.target.value })}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Course</label>
 <select
 required
 value={formData.course}
 onChange={e => setFormData({ ...formData, course: e.target.value })}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium appearance-none"
 >
 <option value="" disabled>Select a course...</option>
 {courses.map(course => (
 <option key={course._id} value={course._id}>
 {course.title} ({course.subjectCode})
 </option>
 ))}
 </select>
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration (Minutes)</label>
 <input 
 required
 type="number"
 min="1"
 value={formData.duration}
 onChange={e => setFormData({ ...formData, duration: e.target.value })}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Start Time</label>
 <input 
 required
 type="datetime-local"
 value={formData.startTime}
 onChange={e => setFormData({ ...formData, startTime: e.target.value })}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
 />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">End Time</label>
 <input 
 required
 type="datetime-local"
 value={formData.endTime}
 onChange={e => setFormData({ ...formData, endTime: e.target.value })}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium"
 />
 </div>
 </div>
 </div>
 </motion.div>

 {/* Questions Builder */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 >
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
 <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs">2</span>
 Questions Builder
 </h2>
 </div>

 <div className="space-y-6">
 {questions.map((q, qIndex) => (
 <div key={qIndex} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
 {questions.length > 1 && (
 <button 
 type="button"
 onClick={() => handleRemoveQuestion(qIndex)}
 className="absolute top-6 right-6 text-zinc-400 hover:text-red-500 transition-colors"
 >
 <Trash2 size={18} />
 </button>
 )}
 
 <div className="mb-6 pr-8">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Question {qIndex + 1}</label>
 <textarea 
 required
 rows={2}
 placeholder="Enter the question text..."
 value={q.question}
 onChange={(e) => {
 const newQ = [...questions];
 newQ[qIndex].question = e.target.value;
 setQuestions(newQ);
 }}
 className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium resize-none"
 />
 </div>

 <div className="space-y-3">
 <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Options</label>
 {q.options.map((opt, oIndex) => (
 <div key={oIndex} className="flex items-center gap-3">
 <button
 type="button"
 onClick={() => handleSetCorrectOption(qIndex, oIndex)}
 className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
 opt.isCorrect 
 ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
 : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 hover:border-emerald-500/50'
 }`}
 title="Mark as correct answer"
 >
 <CheckCircle2 size={16} />
 </button>
 <input 
 required
 type="text"
 placeholder={`Option ${oIndex + 1}`}
 value={opt.text}
 onChange={(e) => {
 const newQ = [...questions];
 newQ[qIndex].options[oIndex].text = e.target.value;
 setQuestions(newQ);
 }}
 className={`flex-1 p-3 rounded-xl border focus:outline-none transition-all text-sm font-medium ${
 opt.isCorrect 
 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
 : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
 }`}
 />
 {q.options.length > 2 && (
 <button
 type="button"
 onClick={() => handleRemoveOption(qIndex, oIndex)}
 className="p-3 text-zinc-400 hover:text-red-500 transition-colors"
 >
 <X size={18} />
 </button>
 )}
 </div>
 ))}
 </div>

 <button
 type="button"
 onClick={() => handleAddOption(qIndex)}
 className="mt-4 text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
 >
 <Plus size={14} /> Add Option
 </button>
 </div>
 ))}
 </div>

 <button
 type="button"
 onClick={handleAddQuestion}
 className="mt-6 w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-500 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-orange-500/30 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
 >
 <Plus size={18} /> Add Another Question
 </button>
 </motion.div>

 <div className="fixed bottom-0 left-0 right-0 md:left-64 p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4 z-40">
 <button 
 type="button"
 onClick={() => router.back()}
 className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors text-sm"
 >
 Cancel
 </button>
 <button 
 type="submit"
 disabled={isLoading}
 className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50"
 >
 {isLoading ? 'Creating...' : 'Publish Quiz'}
 </button>
 </div>
 </form>
 </div>
 </DashboardLayout>
 );
}
