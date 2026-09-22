import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Gauge, 
  Building2, 
  Clock, 
  FileText 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const StartupPilots: React.FC = () => {
  const { pilots } = usePragati();
  const activePilot = pilots[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Active Contractual Trials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pilot & Milestone Deliverables
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track field deliverables, submit telemetry reports, and monitor milestone payment releases.
          </p>
        </div>

        <Link
          to="/government/kpi-monitoring"
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto"
        >
          <Gauge className="w-4 h-4" />
          <span>View Live Telemetry</span>
        </Link>
      </div>

      {/* ACTIVE PILOT CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase">
                {activePilot.department}
              </span>
              <StatusBadge status={activePilot.status} />
            </div>
            <h2 className="text-xl font-bold text-white">
              {activePilot.challengeTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilot Term: <strong>{activePilot.startDate}</strong> to <strong>{activePilot.endDate}</strong> ({activePilot.pilotDuration})
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block">Pilot Completion</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {activePilot.progressPercent}%
            </div>
            <span className="text-[11px] text-slate-400">Day 74 of 90</span>
          </div>
        </div>

        <ProgressBar
          value={activePilot.progressPercent}
          color="emerald"
          size="md"
          label="Field Milestones Completed"
        />

        {/* Milestone Deliverables */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Field Deliverables & Acceptance Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {activePilot.milestones.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{m.title}</span>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    {m.deliverables}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span>Target: {m.date}</span>
                  {m.status === 'Completed' && <span className="text-emerald-400 font-bold">Approved</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
