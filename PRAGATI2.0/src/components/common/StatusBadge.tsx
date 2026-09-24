import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyle = (val: string) => {
    const s = val.toLowerCase();
    if (s.includes('not achieved') || s.includes('reject') || s.includes('stop') || s.includes('close') || s.includes('ineligible') || s.includes('terminated')) {
      return 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-500/10';
    }
    if (s.includes('risk') || s.includes('review') || s.includes('evaluation') || s.includes('pending') || s.includes('re-pilot') || s.includes('medium') || s.includes('draft') || s.includes('planned') || s.includes('planning')) {
      return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-500/10';
    }
    if (s.includes('scale') || s.includes('procured') || s.includes('validated') || s.includes('exceeded') || s.includes('met') || s.includes('achieved') || s.includes('on track') || s.includes('shortlisted') || s.includes('eligible') || s.includes('completed') || s.includes('released') || s.includes('approved')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/10';
    }
    if (s.includes('pilot') || s.includes('in progress') || s.includes('published') || s.includes('active') || s.includes('open') || s.includes('high')) {
      return 'bg-sky-50 text-sky-800 border-sky-300 ring-1 ring-sky-500/10';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClass} ${getStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
