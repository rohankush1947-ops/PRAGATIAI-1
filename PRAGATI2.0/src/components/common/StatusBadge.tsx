import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyle = (val: string) => {
    const s = val.toLowerCase();
    if (s.includes('scale') || s.includes('procured') || s.includes('validated') || s.includes('exceeded') || s.includes('met') || s.includes('shortlisted') || s.includes('eligible') || s.includes('completed') || s.includes('released')) {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20';
    }
    if (s.includes('pilot') || s.includes('in progress') || s.includes('published') || s.includes('active') || s.includes('open') || s.includes('high')) {
      return 'bg-sky-950/70 text-sky-300 border-sky-500/40 ring-1 ring-sky-500/20';
    }
    if (s.includes('review') || s.includes('evaluation') || s.includes('pending') || s.includes('medium') || s.includes('draft') || s.includes('planned')) {
      return 'bg-amber-950/70 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20';
    }
    if (s.includes('reject') || s.includes('stop') || s.includes('risk') || s.includes('ineligible') || s.includes('terminated')) {
      return 'bg-rose-950/70 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/20';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClass} ${getStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
