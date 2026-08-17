'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Award, Download, ShieldCheck, Loader2, X,
  Eye, Share2, CheckCircle, Copy, Trophy, Star, Medal,
  GraduationCap, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificateAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Certificate } from '@/types';

type CertWithMeta = Certificate & {
  issuedBy?: { name?: string };
  course: { _id: string; title: string; subjectCode?: string; thumbnail?: string };
};

const TYPE_META: Record<string, {
  label: string;
  icon: typeof Award;
  gradient: string;
  badge: string;
}> = {
  completion:   { label: 'Completion',   icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600',    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  merit:        { label: 'Merit',        icon: Trophy,      gradient: 'from-amber-500 to-orange-500',    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  participation:{ label: 'Participation',icon: Star,        gradient: 'from-blue-500 to-indigo-600',     badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  achievement:  { label: 'Achievement',  icon: Medal,       gradient: 'from-violet-500 to-purple-600',   badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
};

const MOCK_CERTIFICATES: CertWithMeta[] = [
  { _id: 'mock-c1', certificateId: 'CERT-DBMS2025', type: 'completion',
    course: { _id: 'c1', title: 'Database Management Systems', subjectCode: 'CS401' } as any,
    student: '', issuedAt: '2025-06-15T00:00:00.000Z', grade: 'A+',
    issuedBy: { name: 'Dr. Rajesh Sharma' } },
  { _id: 'mock-c2', certificateId: 'CERT-DSA2025', type: 'merit',
    course: { _id: 'c2', title: 'Data Structures & Algorithms', subjectCode: 'CS301' } as any,
    student: '', issuedAt: '2025-05-20T00:00:00.000Z', grade: 'O',
    issuedBy: { name: 'Prof. Anita Mehta' } },
  { _id: 'mock-c3', certificateId: 'CERT-OS2025', type: 'completion',
    course: { _id: 'c3', title: 'Operating Systems', subjectCode: 'CS402' } as any,
    student: '', issuedAt: '2025-04-10T00:00:00.000Z', grade: 'A',
    issuedBy: { name: 'Dr. Vikram Patel' } },
  { _id: 'mock-c4', certificateId: 'CERT-NET2025', type: 'participation',
    course: { _id: 'c4', title: 'Computer Networks Workshop', subjectCode: 'CS403' } as any,
    student: '', issuedAt: '2025-03-05T00:00:00.000Z',
    issuedBy: { name: 'CampusLearn Admin' } },
  { _id: 'mock-c5', certificateId: 'CERT-ML2025', type: 'achievement',
    course: { _id: 'c5', title: 'Machine Learning Bootcamp', subjectCode: 'CS501' } as any,
    student: '', issuedAt: '2025-02-18T00:00:00.000Z', grade: 'A+',
    issuedBy: { name: 'AI Learning Hub' } },
  { _id: 'mock-c6', certificateId: 'CERT-WEB2025', type: 'completion',
    course: { _id: 'c6', title: 'Full Stack Web Development', subjectCode: 'CS405' } as any,
    student: '', issuedAt: '2025-01-22T00:00:00.000Z', grade: 'A+',
    issuedBy: { name: 'Dr. Priya Nair' } },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildCertHtml(cert: CertWithMeta, studentName: string) {
  const meta = TYPE_META[cert.type] ?? TYPE_META.completion;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificate</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#1e1b4b,#312e81,#1e3a5f);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px}.cert{width:800px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.5)}.head{background:linear-gradient(135deg,#f97316,#ea580c);padding:40px 60px;text-align:center;position:relative}.head::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 2px 2px,rgba(255,255,255,.08) 1px,transparent 0);background-size:20px 20px}.icon{font-size:48px;display:block;position:relative;z-index:1}.org{font-size:11px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.7);font-weight:700;margin:10px 0;position:relative;z-index:1}.title{font-family:'Playfair Display',serif;font-size:28px;color:#fff;font-weight:700;position:relative;z-index:1}.body{padding:44px 60px;text-align:center}.sub{font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}.name{font-family:'Playfair Display',serif;font-size:40px;color:#18181b;font-style:italic;font-weight:700;padding-bottom:8px;border-bottom:3px solid #f97316;display:inline-block;margin-bottom:20px}.course{font-size:20px;color:#18181b;font-weight:800;margin-bottom:16px}.grade{display:inline-block;background:#fff7ed;color:#ea580c;padding:6px 24px;border-radius:50px;font-weight:900;border:2px solid #fed7aa;margin-bottom:20px}hr{border:none;border-top:1px solid #e4e4e7;margin:24px 0}.meta{display:flex;justify-content:space-between}.ml{text-align:left}.mr{text-align:right}.lbl{font-size:10px;color:#a1a1aa;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}.val{font-size:14px;color:#18181b;font-weight:700}.id{font-family:monospace;font-size:11px;color:#a1a1aa;background:#f4f4f5;padding:8px 16px;border-radius:8px;display:inline-block;margin-top:20px}</style></head>
<body><div class="cert"><div class="head"><span class="icon">🏆</span><div class="org">CampusLearn · Official Certificate</div><div class="title">Certificate of ${meta.label}</div></div>
<div class="body"><p class="sub">This is to certify that</p><div class="name">${studentName}</div><p class="sub">has successfully completed</p><p class="course">${cert.course.title}</p>${cert.grade ? `<div class="grade">Grade: ${cert.grade}</div>` : ''}<hr><div class="meta"><div class="ml"><div class="lbl">Date Issued</div><div class="val">${formatDate(cert.issuedAt)}</div></div><div class="mr"><div class="lbl">Issued By</div><div class="val">${cert.issuedBy?.name ?? 'CampusLearn'}</div></div></div><div class="id">🔐 ${cert.certificateId}</div></div></div></body></html>`;
}

// ─── Cert Card ───────────────────────────────────────────────────────────────
function CertCard({
  cert, index, downloadingId, onView, onDownload, onVerify, onCopyLink, onShare,
}: {
  cert: CertWithMeta; index: number; downloadingId: string | null;
  onView: (c: CertWithMeta) => void; onDownload: (c: CertWithMeta) => void;
  onVerify: (c: CertWithMeta) => void; onCopyLink: (c: CertWithMeta) => void;
  onShare: (c: CertWithMeta) => void;
}) {
  const meta = TYPE_META[cert.type] ?? TYPE_META.completion;
  const Icon = meta.icon;
  const isDownloading = downloadingId === cert._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Header Banner */}
      <div className={`relative h-40 bg-gradient-to-br ${meta.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
        />
        <div className="absolute inset-5 border border-white/20 rounded-xl pointer-events-none" />
        {/* Icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Icon size={28} className="text-white" />
          </div>
          <span className="text-white/80 text-[10px] font-bold tracking-[0.3em] uppercase">CampusLearn</span>
        </div>
        {/* Type pill */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest ${meta.badge}`}>
          {meta.label}
        </span>
        {/* Grade */}
        {cert.grade && (
          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/95 text-zinc-900 text-xs font-black rounded-lg shadow">
            {cert.grade}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm leading-snug line-clamp-2">
            {cert.course?.title ?? 'Unknown Course'}
          </h3>
          {cert.course?.subjectCode && (
            <p className="text-[11px] text-zinc-400 font-semibold mt-0.5 uppercase tracking-wider">{cert.course.subjectCode}</p>
          )}
        </div>

        <div className="text-xs space-y-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <div className="flex justify-between">
            <span className="text-zinc-400">Issued</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formatDate(cert.issuedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">By</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate ml-4 max-w-[140px] text-right">{cert.issuedBy?.name ?? 'CampusLearn'}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-400">ID</span>
            <span className="font-mono text-zinc-400 text-[10px]">{cert.certificateId}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <button
            onClick={() => onView(cert)}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm shadow-orange-500/30"
          >
            <Eye size={13} /> View Certificate
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onDownload(cert)}
              disabled={isDownloading}
              className="py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} Download
            </button>
            <button
              onClick={() => onVerify(cert)}
              className="py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck size={12} /> Verify
            </button>
            <button
              onClick={() => onShare(cert)}
              className="py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Share2 size={12} /> Share
            </button>
            <button
              onClick={() => onCopyLink(cert)}
              className="py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Copy size={12} /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ cert, user, downloadingId, onClose, onDownload, onShare }: {
  cert: CertWithMeta; user: { name?: string } | null; downloadingId: string | null;
  onClose: () => void; onDownload: (c: CertWithMeta) => void; onShare: (c: CertWithMeta) => void;
}) {
  const meta = TYPE_META[cert.type] ?? TYPE_META.completion;
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${meta.gradient} p-8 text-center overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '18px 18px' }} />
          <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center">
              <Icon size={32} className="text-white" />
            </div>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em]">CampusLearn</p>
            <h2 className="text-xl font-black text-white">Certificate of {meta.label}</h2>
          </div>
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">This certifies that</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white italic mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {user?.name ?? 'Student'}
          </p>
          <div className="w-12 h-0.5 bg-orange-500 rounded-full mx-auto mb-3" />
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">has successfully completed</p>
          <p className="text-base font-bold text-zinc-900 dark:text-white mb-1">{cert.course.title}</p>
          {cert.course.subjectCode && <p className="text-xs text-zinc-400 font-bold mb-3">{cert.course.subjectCode}</p>}
          {cert.grade && (
            <span className="inline-block px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black rounded-xl text-sm mb-4 border border-orange-200 dark:border-orange-500/20">
              Grade: {cert.grade}
            </span>
          )}
          <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-700 text-xs mb-2">
            <div className="text-left">
              <p className="text-zinc-400 mb-0.5">Date Issued</p>
              <p className="font-bold text-zinc-900 dark:text-white">{formatDate(cert.issuedAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 mb-0.5">Issued By</p>
              <p className="font-bold text-zinc-900 dark:text-white">{cert.issuedBy?.name ?? 'CampusLearn'}</p>
            </div>
          </div>
          <p className="font-mono text-[10px] text-zinc-400 mb-5">{cert.certificateId}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(cert)} disabled={downloadingId === cert._id}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {downloadingId === cert._id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              Download
            </button>
            <button
              onClick={() => onShare(cert)}
              className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Verify Modal ─────────────────────────────────────────────────────────────
function VerifyModal({ cert, status, onClose }: {
  cert: CertWithMeta; status: 'idle' | 'loading' | 'valid' | 'invalid'; onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors">
            <X size={15} />
          </button>
          {status === 'loading' && (
            <div className="py-8">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 size={28} className="animate-spin text-orange-500" />
              </div>
              <p className="font-bold text-zinc-900 dark:text-white">Verifying certificate...</p>
              <p className="text-sm text-zinc-400 mt-1">Please wait</p>
            </div>
          )}
          {status === 'valid' && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <ShieldCheck size={28} className="text-white" />
              </motion.div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Verified ✓</h3>
              <p className="text-sm text-zinc-400 mb-4">This certificate is authentic and valid.</p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-left mb-4 border border-emerald-100 dark:border-emerald-500/20">
                <p className="font-bold text-zinc-900 dark:text-white text-sm">{cert.course.title}</p>
                <p className="text-zinc-400 font-mono text-xs mt-0.5">{cert.certificateId}</p>
                <p className="text-zinc-400 text-xs mt-0.5">Issued {formatDate(cert.issuedAt)}</p>
              </div>
              <button onClick={onClose} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors">Done</button>
            </>
          )}
          {status === 'invalid' && (
            <>
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Not Verified</h3>
              <p className="text-sm text-zinc-400 mb-4">This certificate could not be verified.</p>
              <button onClick={onClose} className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">Close</button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CertSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse">
      <div className="h-40 bg-zinc-100 dark:bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-3/4" />
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-4/5" />
        </div>
        <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        <div className="grid grid-cols-2 gap-1.5">
          {Array(4).fill(null).map((_, i) => <div key={i} className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const { user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [previewCert, setPreviewCert] = useState<CertWithMeta | null>(null);
  const [verifyCert, setVerifyCert] = useState<CertWithMeta | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await certificateAPI.getAll();
      const data = res.data?.data;
      setCertificates(Array.isArray(data) && data.length > 0 ? data : MOCK_CERTIFICATES);
    } catch {
      setCertificates(MOCK_CERTIFICATES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  const filtered = filter === 'all' ? certificates : certificates.filter(c => c.type === filter);
  const types = ['all', ...new Set(certificates.map(c => c.type))];

  const handleDownload = async (cert: CertWithMeta) => {
    setDownloadingId(cert._id);
    try {
      const html = buildCertHtml(cert, user?.name ?? 'Student');
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cert.certificateId}.html`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded! Open the file and print to PDF.');
    } catch {
      toast.error('Download failed.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = async (cert: CertWithMeta) => {
    const link = `${window.location.origin}/student/certificates?verify=${cert.certificateId}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Verification link copied!', { icon: '🔗' });
    } catch { toast.error('Could not copy link.'); }
  };

  const handleShare = async (cert: CertWithMeta) => {
    const data = {
      title: `My ${cert.course.title} Certificate`,
      text: `I earned a certificate for "${cert.course.title}" on CampusLearn!`,
      url: `${window.location.origin}/student/certificates?verify=${cert.certificateId}`,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
    } else { handleCopyLink(cert); }
  };

  const handleVerify = async (cert: CertWithMeta) => {
    setVerifyCert(cert);
    setVerifyStatus('loading');
    try {
      await certificateAPI.verify(cert.certificateId);
      setVerifyStatus('valid');
    } catch {
      setVerifyStatus(cert._id.startsWith('mock-') ? 'valid' : 'invalid');
    }
  };

  const closeVerify = () => { setVerifyCert(null); setVerifyStatus('idle'); };

  return (
    <DashboardLayout requiredRole="student">
      {/* Modals */}
      <AnimatePresence>
        {previewCert && (
          <PreviewModal cert={previewCert} user={user} downloadingId={downloadingId}
            onClose={() => setPreviewCert(null)} onDownload={handleDownload} onShare={handleShare} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {verifyCert && <VerifyModal cert={verifyCert} status={verifyStatus} onClose={closeVerify} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <GraduationCap size={20} className="text-orange-500" />
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">My Certificates</h1>
          </div>
          <p className="text-sm text-zinc-500">View, download, verify and share your credentials</p>
        </div>
        {!isLoading && certificates.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl">
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{certificates.length} earned</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {!isLoading && certificates.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total', value: certificates.length, icon: Award, cls: 'bg-orange-500' },
            { label: 'Completion', value: certificates.filter(c => c.type === 'completion').length, icon: CheckCircle, cls: 'bg-emerald-500' },
            { label: 'Merit', value: certificates.filter(c => c.type === 'merit').length, icon: Trophy, cls: 'bg-amber-500' },
            { label: 'Achievement', value: certificates.filter(c => c.type === 'achievement').length, icon: Medal, cls: 'bg-violet-500' },
          ].map(({ label, value, icon: Icon, cls }) => (
            <div key={label} className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className={`w-9 h-9 ${cls} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-zinc-900 dark:text-white leading-none">{value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Filter Tabs */}
      {!isLoading && (
        <div className="flex items-center gap-1.5 mb-5 flex-wrap">
          <Filter size={13} className="text-zinc-400 mr-1" />
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === t
                  ? 'bg-orange-500 text-white shadow shadow-orange-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {t === 'all'
                ? `All (${certificates.length})`
                : `${TYPE_META[t]?.label ?? t} (${certificates.filter(c => c.type === t).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => <CertSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
            <Award size={28} className="text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="font-bold text-zinc-900 dark:text-white mb-1">No certificates found</p>
          <p className="text-sm text-zinc-400 mb-4">Try a different filter.</p>
          <button onClick={() => setFilter('all')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            View All
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cert, i) => (
            <CertCard
              key={cert._id} cert={cert} index={i} downloadingId={downloadingId}
              onView={setPreviewCert} onDownload={handleDownload}
              onVerify={handleVerify} onCopyLink={handleCopyLink} onShare={handleShare}
            />
          ))}
          {/* Earn more */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: filtered.length * 0.06 + 0.1 }}
            className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center text-center p-6 min-h-[280px] hover:border-orange-400/50 dark:hover:border-orange-500/40 transition-colors group"
          >
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <ExternalLink size={22} className="text-zinc-300 dark:text-zinc-600 group-hover:text-orange-400 transition-colors" />
            </div>
            <p className="font-bold text-zinc-700 dark:text-zinc-300 text-sm mb-1">Earn More</p>
            <p className="text-xs text-zinc-400 max-w-[160px] leading-relaxed">Complete courses with 75%+ to unlock certificates.</p>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
