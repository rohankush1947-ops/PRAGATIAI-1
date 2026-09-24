import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  CheckSquare, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PilotValidation: React.FC = () => {
  const { pilots, updateValidationDecision, addToast } = usePragati();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPilotId = searchParams.get('pilotId');
  const pilot = (queryPilotId ? pilots.find(p => p.id === queryPilotId) : null) || pilots[0];

  const [selectedDecision, setSelectedDecision] = useState<
    'Scale' | 'Modify' | 'Stop' | 'Continue Pilot'
  >('Scale');

  const [remarks, setRemarks] = useState(
    pilot
      ? `The solution by ${pilot.startupName} exceeded the predefined pilot KPIs and demonstrated strong operational performance.`
      : "The solution exceeded the predefined pilot KPIs and demonstrated strong operational performance."
  );

  useEffect(() => {
    if (pilot) {
      setRemarks(`The solution by ${pilot.startupName} exceeded the predefined pilot KPIs and demonstrated strong operational performance.`);
    }
  }, [pilot?.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pilot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-sm">
          Loading pilot data...
        </p>
      </div>
    );
  }

  const handleAuthorizeDecision = (decision: 'Scale' | 'Modify' | 'Stop' | 'Continue Pilot') => {
    setIsSubmitting(true);
    setSelectedDecision(decision);

    if (decision === 'Scale') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      updateValidationDecision(pilot.id, decision, remarks);
      setIsSubmitting(false);
      if (decision === 'Scale') {
        navigate('/government/scale-up');
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Statutory Pilot Outcome Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Pilot Validation & Decision Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Authorized human-in-the-loop decision portal comparing audited telemetry against initial RFP benchmarks.
        </p>
      </div>

      {/* Target vs Actual Scorecard */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase">
              Field Validation Report
            </span>
            <h2 className="text-xl font-bold text-white mt-1.5">
              {pilot.challengeTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Startup: <strong className="text-sky-400">{pilot.startupName}</strong> | Department: {pilot.department}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block">Overall Pilot Score</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              91/100
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">Validation Passed</span>
          </div>
        </div>

        {/* RESULTS TABLE (PROMPT SPECIFIED) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Target vs Actual Audited Outcomes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Accuracy */}
            <div className="p-4 rounded-xl bg-[#070E1E] border border-emerald-500/30">
              <span className="text-xs font-medium text-slate-300 block mb-1">Detection Accuracy</span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-emerald-400">94.2%</span>
                <span className="text-xs text-slate-400">vs Target 90%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                ✓ Exceeded target by +4.2%
              </span>
            </div>

            {/* Coverage */}
            <div className="p-4 rounded-xl bg-[#070E1E] border border-emerald-500/30">
              <span className="text-xs font-medium text-slate-300 block mb-1">Road Network Coverage</span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-emerald-400">87.0%</span>
                <span className="text-xs text-slate-400">vs Target 80%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                ✓ Exceeded target by +7.0%
              </span>
            </div>

            {/* Response Time */}
            <div className="p-4 rounded-xl bg-[#070E1E] border border-emerald-500/30">
              <span className="text-xs font-medium text-slate-300 block mb-1">Detection Time</span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-emerald-400">3.2 sec</span>
                <span className="text-xs text-slate-400">vs Target ≤ 5.0s</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                ✓ 1.8 seconds faster than limit
              </span>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION CARD (PROMPT SPECIFIED) */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Algorithmic & Technical Committee Recommendation
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-700 tracking-wider">
            SCALE
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            "The solution exceeded the predefined pilot KPIs and demonstrated strong operational performance."
          </p>
        </div>
      </div>

      {/* AUTHORIZED HUMAN DECISION SECTION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-600" />
            <span>Authorized Official Decision Required</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pursuant to Rule 173 of GFR 2017 and GeM Innovation Procurement Guidelines, human authorization is mandatory before committing public procurement funds.
          </p>
        </div>

        {/* 4 Decision Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Scale */}
          <button
            type="button"
            onClick={() => setSelectedDecision('Scale')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedDecision === 'Scale'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className={`w-5 h-5 ${selectedDecision === 'Scale' ? 'text-emerald-600' : 'text-slate-400'}`} />
              {selectedDecision === 'Scale' && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">SELECTED</span>}
            </div>
            <div className="text-sm font-bold text-slate-900">SCALE</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Approve statewide multi-district expansion and milestone contract.
            </p>
          </button>

          {/* Continue Pilot */}
          <button
            type="button"
            onClick={() => setSelectedDecision('Continue Pilot')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedDecision === 'Continue Pilot'
                ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <RotateCcw className={`w-5 h-5 ${selectedDecision === 'Continue Pilot' ? 'text-sky-600' : 'text-slate-400'}`} />
              {selectedDecision === 'Continue Pilot' && <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">SELECTED</span>}
            </div>
            <div className="text-sm font-bold text-slate-900">Continue Pilot</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Extend trial by 30 days for additional stress testing.
            </p>
          </button>

          {/* Modify */}
          <button
            type="button"
            onClick={() => setSelectedDecision('Modify')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedDecision === 'Modify'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className={`w-5 h-5 ${selectedDecision === 'Modify' ? 'text-amber-600' : 'text-slate-400'}`} />
              {selectedDecision === 'Modify' && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">SELECTED</span>}
            </div>
            <div className="text-sm font-bold text-slate-900">Modify</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Request hardware calibration or modified scope.
            </p>
          </button>

          {/* Stop */}
          <button
            type="button"
            onClick={() => setSelectedDecision('Stop')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedDecision === 'Stop'
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 text-slate-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <XCircle className={`w-5 h-5 ${selectedDecision === 'Stop' ? 'text-rose-600' : 'text-slate-400'}`} />
              {selectedDecision === 'Stop' && <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">SELECTED</span>}
            </div>
            <div className="text-sm font-bold text-slate-900">Stop</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Conclude pilot with no further procurement.
            </p>
          </button>
        </div>

        {/* Remarks Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Official Evaluation Findings & Audit Remarks *
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="gov-input text-xs"
            placeholder="Document rationale for validation decision..."
          />
        </div>

        {/* Officer Signature Meta & Commit Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Authorized Official: <strong className="text-slate-900">Er. Rajeshwar Rao, Chief Engineer, PWD</strong><br />
            Digital Token: <code className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-mono text-[10px]">PWD-VALIDATE-2026-942X</code>
          </div>

          <button
            onClick={() => handleAuthorizeDecision(selectedDecision)}
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
              selectedDecision === 'Scale'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                : selectedDecision === 'Stop'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Record "{selectedDecision.toUpperCase()}" Decision</span>
          </button>
        </div>
      </div>
    </div>
  );
};
