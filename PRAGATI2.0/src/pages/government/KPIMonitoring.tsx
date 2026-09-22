import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Gauge, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  BarChart2, 
  Activity, 
  Zap,
  CheckSquare
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const KPIMonitoring: React.FC = () => {
  const { pilots } = usePragati();
  const pilot = pilots[0]; // RoadVision AI pilot

  // Weekly KPI progression across 10 weeks of pilot
  const weeklyTrendData = [
    { week: 'Wk 1', accuracy: 88.5, falsePositive: 11.2, latency: 4.8, coverage: 25 },
    { week: 'Wk 2', accuracy: 89.8, falsePositive: 9.8, latency: 4.2, coverage: 40 },
    { week: 'Wk 3', accuracy: 91.2, falsePositive: 8.5, latency: 3.9, coverage: 55 },
    { week: 'Wk 4', accuracy: 92.4, falsePositive: 7.9, latency: 3.7, coverage: 68 },
    { week: 'Wk 5', accuracy: 93.1, falsePositive: 7.2, latency: 3.5, coverage: 75 },
    { week: 'Wk 6', accuracy: 93.8, falsePositive: 6.8, latency: 3.4, coverage: 82 },
    { week: 'Wk 7', accuracy: 94.2, falsePositive: 6.1, latency: 3.2, coverage: 87 }
  ];

  // Target vs Actual comparative bar chart
  const targetVsActualData = [
    { metric: 'Accuracy (%)', Target: 90, Actual: 94.2 },
    { metric: 'FP Ceiling (%)', Target: 10, Actual: 6.1 },
    { metric: 'Max Latency (s)', Target: 5.0, Actual: 3.2 },
    { metric: 'Coverage (%)', Target: 80, Actual: 87.0 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Field Telemetry & KPI Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            KPI Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Continuous verification of pilot performance metrics against contractually specified targets.
          </p>
        </div>

        <Link
          to="/government/validation"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors self-start md:self-auto"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Go to Pilot Validation</span>
        </Link>
      </div>

      {/* Context banner */}
      <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monitoring Pilot Trial
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            {pilot.challengeTitle}
          </h4>
          <span className="text-slate-400 text-[11px]">
            Startup: <strong className="text-sky-400">{pilot.startupName}</strong> | Department: {pilot.department}
          </span>
        </div>
        <StatusBadge status="All KPIs Exceeded" />
      </div>

      {/* 4 CORE KPI CARDS (PROMPT SPECIFIED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Detection Accuracy */}
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-emerald-500/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Detection Accuracy</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                Exceeded
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              94.2%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target: <strong className="text-slate-200">≥ 90%</strong> (+4.2% gain)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            Verified across 520 km roadway
          </div>
        </div>

        {/* False Positive Rate */}
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-emerald-500/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">False Positive Rate</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                Exceeded
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              6.1%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target: <strong className="text-slate-200">≤ 10%</strong> (3.9% below ceiling)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            Low false alarms on wet surfaces
          </div>
        </div>

        {/* Average Detection Time */}
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-emerald-500/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Detection Time</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                Exceeded
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              3.2 sec
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target: <strong className="text-slate-200">≤ 5.0 sec</strong> (1.8s faster)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            On-device TensorRT acceleration
          </div>
        </div>

        {/* Network Road Coverage */}
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-emerald-500/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Road Coverage</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                Exceeded
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              87.0%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target: <strong className="text-slate-200">≥ 80%</strong> (+7.0% coverage)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            Arterial and sub-arterial routes
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Accuracy Progression */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Detection Accuracy & FP Rate Over Time</h3>
              <p className="text-xs text-slate-400">Weekly telemetry progression across pilot corridor</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold font-mono">94.2% Final</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="falsePositive" name="False Positive (%)" stroke="#F43F5E" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Target vs Actual Comparative Bar */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Target vs Actual Performance</h3>
              <p className="text-xs text-slate-400">Direct comparison against contractual RFP limits</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold">100% Compliant</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetVsActualData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="metric" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Target" name="Contractual Target" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" name="Verified Field Actual" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
