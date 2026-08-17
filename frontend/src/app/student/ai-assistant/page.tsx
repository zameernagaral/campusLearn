'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, BookOpen, Brain, Lightbulb } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { aiAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Message {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
}

const STARTER_PROMPTS = [
 { text: 'Explain Big O notation with examples', label: 'Algorithms' },
 { text: 'What is the difference between supervised and unsupervised learning?', label: 'ML' },
 { text: 'Explain how JWT authentication works', label: 'Security' },
 { text: 'Help me prepare for my database exam', label: 'DBMS' },
 { text: 'What are the differences between TCP and UDP?', label: 'Networks' },
 { text: 'Create a study plan for the next 2 weeks', label: 'Study Plan' },
];

export default function AIAssistantPage() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLTextAreaElement>(null);
 const { user } = useAuthStore();

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const sendMessage = async (text?: string) => {
 const messageText = text || input.trim();
 if (!messageText || isLoading) return;

 const userMessage: Message = {
 id: Date.now().toString(),
 role: 'user',
 content: messageText,
 timestamp: new Date(),
 };

 setMessages(prev => [...prev, userMessage]);
 setInput('');
 setIsLoading(true);

 try {
 const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
 const { data } = await aiAPI.chat(messageText, history);

 const aiMessage: Message = {
 id: (Date.now() + 1).toString(),
 role: 'assistant',
 content: data.data.reply,
 timestamp: new Date(),
 };

 setMessages(prev => [...prev, aiMessage]);
 } catch {
 toast.error('AI assistant is unavailable. Please try again.');
 setMessages(prev => prev.filter(m => m.id !== userMessage.id));
 } finally {
 setIsLoading(false);
 inputRef.current?.focus();
 }
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 sendMessage();
 }
 };

 const clearChat = () => {
 setMessages([]);
 toast.success('Chat cleared');
 };

 const formatContent = (content: string) => {
 // Simple markdown-like formatting
 return content
 .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
 .replace(/\*(.*?)\*/g, '<em>$1</em>')
 .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.1);padding:1px 4px;border-radius:4px;font-family:monospace">$1</code>')
 .replace(/\n/g, '<br />');
 };

 return (
 <DashboardLayout requiredRole="student">
 <div className="flex h-[calc(100vh-8rem)] gap-5">
 {/* Left sidebar */}
 <div className="hidden lg:flex flex-col w-72 gap-4">
 {/* Header */}
 <div className="card p-5">
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
 <Brain size={20} className="text-white" />
 </div>
 <div>
 <h2 className="font-bold" style={{ color: 'var(--foreground)' }}>AI Study Assistant</h2>
 <p className="text-xs" style={{ color: 'var(--muted)' }}>Powered by GPT-4</p>
 </div>
 </div>
 <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
 Ask me anything about your courses, concepts, exam prep, or study strategies.
 </p>
 </div>

 {/* Starter prompts */}
 <div className="card p-4 flex-1 overflow-y-auto">
 <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
 Quick Questions
 </p>
 <div className="space-y-2">
 {STARTER_PROMPTS.map(prompt => (
 <button
 key={prompt.text}
 onClick={() => sendMessage(prompt.text)}
 className="w-full text-left p-3 rounded-xl transition-all hover:bg-[var(--surface-2)] group"
 >
 <div className="flex items-center gap-2 mb-1">
 <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--primary)' }}>
 {prompt.label}
 </span>
 </div>
 <p className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>{prompt.text}</p>
 </button>
 ))}
 </div>
 </div>

 {messages.length > 0 && (
 <button onClick={clearChat} className="btn btn-secondary text-sm gap-2">
 <Trash2 size={14} /> Clear Conversation
 </button>
 )}
 </div>

 {/* Main chat area */}
 <div className="flex-1 flex flex-col card overflow-hidden">
 {/* Chat header */}
 <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
 <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow">
 <Bot size={16} className="text-white" />
 </div>
 <div>
 <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>CampusLearn AI</p>
 <div className="flex items-center gap-1">
 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
 <p className="text-xs" style={{ color: 'var(--muted)' }}>Online · Ready to help</p>
 </div>
 </div>
 </div>

 {/* Messages */}
 <div className="flex-1 overflow-y-auto p-4 space-y-4">
 {messages.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-center px-8">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: 'spring', stiffness: 200 }}
 className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-4 animate-float"
 >
 <Bot size={36} className="text-white" />
 </motion.div>
 <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
 Hi {user?.name?.split(' ')[0]}!
 </h3>
 <p className="text-sm" style={{ color: 'var(--muted)' }}>
 I&apos;m your AI study assistant. Ask me anything about your courses, concepts, or exam preparation.
 </p>

 {/* Mobile quick prompts */}
 <div className="lg:hidden grid grid-cols-2 gap-2 mt-6 w-full max-w-sm">
 {STARTER_PROMPTS.slice(0, 4).map(p => (
 <button key={p.text} onClick={() => sendMessage(p.text)}
 className="p-3 rounded-xl text-xs text-left transition-all hover:scale-105"
 style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
 {p.label}
 </button>
 ))}
 </div>
 </div>
 ) : (
 <>
 <AnimatePresence>
 {messages.map(message => (
 <motion.div
 key={message.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
 >
 {message.role === 'assistant' && (
 <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
 <Bot size={14} className="text-white" />
 </div>
 )}

 <div className={`max-w-[75%] rounded-2xl p-3.5 ${
 message.role === 'user'
 ? 'rounded-tr-sm text-white'
 : 'rounded-tl-sm'
 }`} style={{
 background: message.role === 'user'
 ? 'var(--primary)'
 : 'var(--surface)',
 color: message.role === 'user' ? 'white' : 'var(--foreground)',
 }}>
 <div
 className="text-sm leading-relaxed"
 dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
 />
 <p className="text-xs mt-1.5 opacity-60">{formatRelativeTime(message.timestamp.toISOString())}</p>
 </div>

 {message.role === 'user' && (
 <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">
 {getInitials(user?.name || 'U')}
 </div>
 )}
 </motion.div>
 ))}
 </AnimatePresence>

 {/* Typing indicator */}
 {isLoading && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
 <div className="w-7 h-7 rounded-xl gradient-primary flex items-center justify-center">
 <Bot size={14} className="text-white" />
 </div>
 <div className="p-3.5 rounded-2xl rounded-tl-sm" style={{ background: 'var(--surface)' }}>
 <div className="flex gap-1">
 {[0, 1, 2].map(i => (
 <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }} />
 ))}
 </div>
 </div>
 </motion.div>
 )}
 <div ref={messagesEndRef} />
 </>
 )}
 </div>

 {/* Input area */}
 <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="flex gap-3 items-end">
 <div className="flex-1 relative">
 <textarea
 ref={inputRef}
 value={input}
 onChange={e => setInput(e.target.value)}
 onKeyDown={handleKeyDown}
 placeholder="Ask me anything about your studies... (Enter to send)"
 rows={1}
 className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all"
 style={{
 background: 'var(--surface)',
 border: '1.5px solid var(--border)',
 color: 'var(--foreground)',
 maxHeight: '120px',
 }}
 onInput={e => {
 const el = e.target as HTMLTextAreaElement;
 el.style.height = 'auto';
 el.style.height = Math.min(el.scrollHeight, 120) + 'px';
 }}
 />
 </div>
 <button
 onClick={() => sendMessage()}
 disabled={!input.trim() || isLoading}
 className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex-shrink-0"
 >
 {isLoading ? (
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 ) : (
 <Send size={16} />
 )}
 </button>
 </div>
 <p className="text-xs mt-2 text-center" style={{ color: 'var(--subtle)' }}>
 AI can make mistakes. Always verify important academic information with your faculty.
 </p>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}
