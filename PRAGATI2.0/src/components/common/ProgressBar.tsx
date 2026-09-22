import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'sky' | 'emerald' | 'amber' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'sky',
  size = 'md'
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorClass = {
    sky: 'bg-gradient-to-r from-sky-600 to-sky-400',
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    amber: 'bg-gradient-to-r from-amber-600 to-amber-400',
    indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-400'
  }[color];

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  }[size];

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showPercentage && <span className="font-semibold text-slate-200">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
