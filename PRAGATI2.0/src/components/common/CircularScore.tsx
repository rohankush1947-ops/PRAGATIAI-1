import React from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'Match Score',
  sublabel,
  color = '#0284C7'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = color;
  if (score >= 90) strokeColor = '#10B981'; // emerald
  else if (score >= 75) strokeColor = '#0EA5E9'; // sky
  else if (score >= 60) strokeColor = '#F59E0B'; // amber
  else strokeColor = '#EF4444'; // red

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {score}%
          </span>
          {label && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <p className="text-xs text-slate-600 mt-2 font-medium max-w-[160px]">
          {sublabel}
        </p>
      )}
    </div>
  );
};
