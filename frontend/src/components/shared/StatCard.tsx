'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
  gradient?: string;
  delay?: number;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon, iconBg, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card"
    >
      {/* Gradient orb */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6"
        style={{ background: gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            {label}
          </p>
          <motion.p
            className="text-3xl font-bold mt-1.5"
            style={{ color: 'var(--foreground)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.1, type: 'spring' }}
          >
            {value}
          </motion.p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              changeType === 'up' ? 'text-emerald-500' : changeType === 'down' ? 'text-red-500' : 'text-gray-500'
            )}>
              {changeType === 'up' ? <TrendingUp size={12} /> : changeType === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
              {change}
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background: iconBg || gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton version
export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-8 w-24 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton w-12 h-12 rounded-2xl" />
      </div>
    </div>
  );
}
