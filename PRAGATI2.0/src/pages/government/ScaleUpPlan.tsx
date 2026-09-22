import React from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Building2, 
  Coins, 
  Sparkles, 
  Layers, 
  Zap,
  Globe
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ScaleUpPlan: React.FC = () => {
  const { scaleUpPlan, advanceScaleUpPhase } = usePragati();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Large-Scale Public Adoption</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Scale-Up & Multi-District Expansion Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Transitioning validated startup innovation from a single division pilot to statewide departmental deployment.
        </p>
      </div>

      {/* 5-STAGE PROGRESSION FLOW (PROMPT SPECIFIED) */}
      <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Scale-Up Lifecycle Progression
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          {[
            { label: 'Pilot Success', status: 'Completed', sub: '520 km Verified' },
            { label: 'Procurement Approval', status: 'Completed', sub: 'GeM Runway Sanction' },
            { label: 'Department Deployment', status: 'Active', sub: '12 Patrol Units' },
            { label: 'Multi-District Expansion', status: 'Active', sub: '5 Key Districts' },
            { label: 'State-Level Scale', status: 'Planned', sub: 'All 31 Districts' }
          ].map((stage, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                stage.status === 'Completed'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : stage.status === 'Active'
                  ? 'bg-sky-950/40 border-sky-500/50 text-sky-200 ring-1 ring-sky-500/30'
                  : 'bg-[#070E1E] border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-80">
                Step 0{idx + 1}
              </div>
              <div className="font-bold text-slate-100 text-xs leading-snug">
                {stage.label}
              </div>
              <span className="text-[10px] text-slate-400">{stage.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4 CORE SCALE METRICS (PROMPT SPECIFIED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block mb-1">Current Deployment</span>
          <div className="text-xl font-bold text-white">
            {scaleUpPlan.currentDeployment}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Bengaluru North Division</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1528] border border-sky-500/40 shadow-sm">
          <span className="text-xs text-slate-400 block mb-1">Target Deployment</span>
          <div className="text-xl font-bold text-sky-400">
            {scaleUpPlan.targetDeployment}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full State PWD Network</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block mb-1">Estimated Cost</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {scaleUpPlan.estimatedCost.split(' ')[0]}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Phased Annual Outlay</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block mb-1">Expected Annual Impact</span>
          <div className="text-xl font-bold text-amber-400">
            ₹14.8 Cr
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Direct Highway Maintenance Savings</span>
        </div>
      </div>

      {/* DETAILED PHASE ROADMAP */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Phased Rollout Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured multi-year milestone schedule with territorial district allocations.
            </p>
          </div>
          <span className="text-xs text-sky-400 font-semibold">Solution: {scaleUpPlan.solutionName}</span>
        </div>

        <div className="space-y-4">
          {scaleUpPlan.scalePhases.map((phase, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                phase.status === 'Completed'
                  ? 'bg-[#070E1E] border-emerald-500/30'
                  : phase.status === 'Active'
                  ? 'bg-sky-950/20 border-sky-500/50 ring-1 ring-sky-500/30'
                  : 'bg-[#070E1E]/60 border-slate-800'
              }`}
            >
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{phase.phase}: {phase.title}</span>
                  <StatusBadge status={phase.status} size="sm" />
                </div>
                <div className="text-slate-300 text-xs">
                  Coverage Target: <strong className="text-sky-300">{phase.coverage}</strong> | Timeline: <strong>{phase.timeline}</strong>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {phase.districts.map((d, i) => (
                    <span key={i} className="text-[10px] bg-[#0B1528] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      <MapPin className="w-2.5 h-2.5 inline mr-1 text-sky-400" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                {phase.status === 'Completed' ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : phase.status === 'Active' ? (
                  <span className="text-xs text-sky-400 font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>In Progress</span>
                  </span>
                ) : (
                  <button
                    onClick={() => advanceScaleUpPhase(phase.phase)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>Sanction Phase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
