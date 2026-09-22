import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  Gauge, 
  CheckSquare, 
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const GovPilots: React.FC = () => {
  const { pilots } = usePragati();
  const activePilot = pilots[0]; // RoadVision AI pilot

if (!activePilot) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-slate-400 text-sm">
        Loading pilot data...
      </p>
    </div>
  );
}

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Structured Field Trials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pilot Project Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track active 60-90 day milestone-based pilot trials under controlled operational conditions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/government/kpi-monitoring"
            className="px-4 py-2 rounded-xl bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Gauge className="w-4 h-4 text-sky-400" />
            <span>Live KPI Telemetry</span>
          </Link>
          <Link
            to="/government/validation"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Pilot Validation</span>
          </Link>
        </div>
      </div>

      {/* ACTIVE PILOT OVERVIEW CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F1C36] via-[#0B1528] to-[#0F1C36] border border-sky-500/40 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase">
                {activePilot.department}
              </span>
              <StatusBadge status={activePilot.status} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {activePilot.challengeTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
              <span>Startup: <strong className="text-sky-400 font-semibold">{activePilot.startupName}</strong></span>
              <span>•</span>
              <span>Pilot Duration: <strong>{activePilot.pilotDuration}</strong></span>
              <span>•</span>
              <span>Period: <strong>{activePilot.startDate}</strong> to <strong>{activePilot.endDate}</strong></span>
            </div>
          </div>

          <div className="lg:text-right shrink-0">
            <span className="text-xs text-slate-400 block mb-1">Overall Pilot Progress</span>
            <div className="text-3xl font-black text-sky-400 font-mono">
              {activePilot.progressPercent}%
            </div>
            <span className="text-[11px] text-slate-400">Day 74 of 90 Days</span>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={activePilot.progressPercent}
          color="sky"
          size="lg"
          label="Field Deployment & Validation Completion"
        />

        {/* 6-STEP PILOT TIMELINE */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            6-Step Pilot Timeline & Field Deliverables
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePilot.milestones.map((m, idx) => {
              const isCompleted = m.status === 'Completed';
              const isInProgress = m.status === 'In Progress';
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isCompleted
                      ? 'bg-[#070E1E] border-emerald-500/30'
                      : isInProgress
                      ? 'bg-sky-950/20 border-sky-500/50 ring-1 ring-sky-500/30'
                      : 'bg-[#070E1E]/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Step 0{idx + 1}
                      </span>
                      <StatusBadge status={m.status} size="sm" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1 leading-snug">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {m.deliverables}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {m.date}
                    </span>
                    {isCompleted && <span className="text-emerald-400 font-semibold">✓ Verified</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800">
          <span className="text-slate-400 block mb-1">Hardware Units Deployed</span>
          <div className="text-2xl font-bold text-white">12 Edge Cameras</div>
          <p className="text-[11px] text-slate-400 mt-1">Mounted on PWD Bolero patrol fleet</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800">
          <span className="text-slate-400 block mb-1">Road Network Monitored</span>
          <div className="text-2xl font-bold text-sky-400">520 Kilometers</div>
          <p className="text-[11px] text-slate-400 mt-1">Bengaluru North Division corridor</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800">
          <span className="text-slate-400 block mb-1">Automated Work Orders</span>
          <div className="text-2xl font-bold text-emerald-400">420 Hazards Fixed</div>
          <p className="text-[11px] text-slate-400 mt-1">Sub-meter GPS dispatched to repair crews</p>
        </div>
      </div>
    </div>
  );
};
