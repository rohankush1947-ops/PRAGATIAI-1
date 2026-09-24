import React, { useState } from 'react';
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
  FileText,
  Target,
  Award,
  Layers,
  MapPin,
  TrendingUp,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const StartupPilots: React.FC = () => {
  const { pilots } = usePragati();
  const [selectedPilotId, setSelectedPilotId] = useState<string>(pilots[0]?.id || '');

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  if (!activePilot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-sm">
          No pilot projects currently assigned to your startup account.
        </p>
      </div>
    );
  }

  // Lifecycle steps array
  const lifecycleStages = [
    { status: 'Planning', label: '1. Planning', desc: 'MoU & Scope' },
    { status: 'Approved', label: '2. Approved', desc: 'Sanctioned' },
    { status: 'Active', label: '3. Active Trials', desc: 'Live Telemetry' },
    { status: 'Under Evaluation', label: '4. Evaluation', desc: 'Auditing' },
    { status: 'Completed', label: '5. Completed', desc: 'Validated' }
  ];

  const getStageIndex = (st: string) => {
    if (st === 'Planning') return 0;
    if (st === 'Approved') return 1;
    if (st === 'Active' || st === 'In Progress') return 2;
    if (st === 'Under Evaluation' || st === 'Under Validation') return 3;
    if (st === 'Completed' || st === 'Validated' || st === 'Scale Approved') return 4;
    return 0;
  };

  const currentStageIndex = getStageIndex(activePilot.status);

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
            Track field deliverables, inspect real-time telemetry KPI status, and view statutory outcome validations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/government/kpi-monitoring"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto"
          >
            <Gauge className="w-4 h-4" />
            <span>View Live Telemetry</span>
          </Link>
        </div>
      </div>

      {/* Pilot Switcher if startup has multiple pilots */}
      {pilots.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Your Pilot Trials:</span>
          {pilots.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPilotId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                p.id === activePilot.id
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                  : 'bg-[#0B1528] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p.title || p.challengeTitle} ({p.status})
            </button>
          ))}
        </div>
      )}

      {/* ACTIVE PILOT CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase">
                {activePilot.department}
              </span>
              <StatusBadge status={activePilot.status} />
              {activePilot.validationDecision && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Decision: {activePilot.validationDecision}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">
              {activePilot.title || activePilot.challengeTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Department: <strong className="text-slate-200">{activePilot.department}</strong></span>
              <span>•</span>
              <span>Term: <strong className="text-slate-200">{activePilot.startDate}</strong> to <strong className="text-slate-200">{activePilot.endDate}</strong> ({activePilot.pilotDuration})</span>
              <span>•</span>
              <span>Location: <strong className="text-slate-200">{activePilot.pilotLocation || 'Designated Corridor'}</strong></span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block">Pilot Completion</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {activePilot.progressPercent}%
            </div>
            <span className="text-[11px] text-slate-400">
              Officer: {activePilot.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer'}
            </span>
          </div>
        </div>

        {/* 5-Step Lifecycle Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {lifecycleStages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.status}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-sky-950/70 border-sky-500/60 ring-2 ring-sky-500/30'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/60'
                    : 'bg-[#070E1E] border-slate-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold mb-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3 text-sky-400 animate-spin" />
                  ) : null}
                  <span className={isCurrent ? 'text-sky-300' : isCompleted ? 'text-emerald-300' : 'text-slate-500'}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{st.desc}</p>
              </div>
            );
          })}
        </div>

        <ProgressBar
          value={activePilot.progressPercent}
          color="emerald"
          size="md"
          label="Field Milestones Completed"
        />

        {/* TARGET VS ACTUAL KPI MONITORING TABLE */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Contractual Performance KPIs (Target vs Actual)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Continuous Ingestion Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(activePilot.kpis || []).map((kpi, idx) => {
              const targetNum = typeof kpi.targetNum === 'number' ? kpi.targetNum : (parseFloat(String(kpi.target).replace(/[^0-9.]/g, '')) || 0);
              const actualNum = typeof kpi.actualNum === 'number' ? kpi.actualNum : (parseFloat(String(kpi.actual).replace(/[^0-9.]/g, '')) || 0);
              const pct = targetNum > 0 ? Math.min(Math.round((actualNum / targetNum) * 100), 100) : 0;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs text-white truncate">{kpi.name}</span>
                    <StatusBadge status={kpi.status} size="sm" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-emerald-400">{kpi.actual}</span>
                    <span className="text-xs text-slate-400 font-mono">/ {kpi.target}</span>
                  </div>
                  {kpi.baseline && (
                    <span className="text-[10px] text-slate-500 block">Baseline: {kpi.baseline}</span>
                  )}
                  {kpi.evidenceNotes && (
                    <p className="text-[10px] text-slate-400 italic line-clamp-1 border-t border-slate-800 pt-1 mt-1">
                      {kpi.evidenceNotes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

        {/* OUTCOME VALIDATION REPORT IF VALIDATED */}
        {(activePilot.status === 'Scale Approved' || activePilot.status === 'Validated' || activePilot.validationDecision) && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-[#0B1528] to-teal-950/50 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Outcome Validation Report</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-700">
                Decision: {activePilot.validationDecision?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "{activePilot.officialObservations || activePilot.validationRemarks || 'The solution exceeded predefined pilot KPIs and demonstrated strong operational performance.'}"
            </p>
            <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Authorized Official: <strong className="text-slate-200">{activePilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'}</strong></span>
              <span>Signed on: {activePilot.decisionDate || '2026-12-10'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
