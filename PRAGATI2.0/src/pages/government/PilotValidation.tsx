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
  ChevronDown,
  Layers,
  Award,
  Calendar,
  Building2,
  Target,
  FileCheck
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PilotValidationDecision, PilotValidationStatus } from '../../types';
import confetti from 'canvas-confetti';

export const PilotValidation: React.FC = () => {
  const { pilots, updateValidationDecision, addToast } = usePragati();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPilotId = searchParams.get('pilotId');
  const [selectedPilotId, setSelectedPilotId] = useState<string>(queryPilotId || pilots[0]?.id || '');

  useEffect(() => {
    if (queryPilotId && queryPilotId !== selectedPilotId) {
      setSelectedPilotId(queryPilotId);
    }
  }, [queryPilotId]);

  const pilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const [selectedDecision, setSelectedDecision] = useState<PilotValidationDecision>(
    pilot?.validationDecision || 'Scale'
  );

  const [validationStatus, setValidationStatus] = useState<PilotValidationStatus>(
    pilot?.validationStatus || (pilot?.validationDecision ? 'Validated' : 'Under Review')
  );

  const [officialObservations, setOfficialObservations] = useState(
    pilot?.officialObservations || pilot?.validationRemarks ||
    (pilot ? `The solution by ${pilot.startupName} exceeded all predefined contractual pilot KPIs and demonstrated robust operational resilience under real-world municipal conditions.` : '')
  );

  const [evidenceNotes, setEvidenceNotes] = useState(
    pilot?.evidenceNotes || 'Audited GPS-tagged telemetry across 520 km municipal corridor verified by independent PWD engineers. Zero sensor calibration drift observed.'
  );

  const [authorizedOfficial, setAuthorizedOfficial] = useState(
    pilot?.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pilot) {
      setSelectedDecision(pilot.validationDecision || 'Scale');
      setValidationStatus(pilot.validationStatus || (pilot.validationDecision ? 'Validated' : 'Under Review'));
      setOfficialObservations(
        pilot.officialObservations || pilot.validationRemarks ||
        `The solution by ${pilot.startupName} exceeded all predefined contractual pilot KPIs and demonstrated robust operational resilience under real-world municipal conditions.`
      );
      setEvidenceNotes(
        pilot.evidenceNotes || 'Audited GPS-tagged telemetry across 520 km municipal corridor verified by independent PWD engineers. Zero sensor calibration drift observed.'
      );
      if (pilot.authorizedOfficial) {
        setAuthorizedOfficial(pilot.authorizedOfficial);
      }
    }
  }, [pilot?.id]);

  if (!pilot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-sm">
          Loading pilot validation report...
        </p>
      </div>
    );
  }

  // Calculate KPI achievement percentage
  const kpis = pilot.kpis || [];
  let achievedCount = 0;
  kpis.forEach(k => {
    const s = (k.status || '').toLowerCase();
    if (s.includes('achieved') || s.includes('met') || s.includes('exceeded') || s.includes('on track')) {
      achievedCount++;
    }
  });
  const achievementPct = kpis.length > 0 ? Math.round((achievedCount / kpis.length) * 100) : 92;
  const overallScore = pilot.validationScore || (achievementPct > 80 ? 91 : achievementPct);

  const handleSelectPilot = (id: string) => {
    setSelectedPilotId(id);
    setSearchParams({ pilotId: id });
  };

  const handleAuthorizeDecision = (decision: PilotValidationDecision) => {
    setIsSubmitting(true);
    setSelectedDecision(decision);

    if (decision === 'Scale') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(async () => {
      await updateValidationDecision(pilot.id, decision, officialObservations, {
        officialObservations,
        evidenceNotes,
        validationStatus: 'Validated',
        authorizedOfficial,
        validationScore: overallScore
      });
      setValidationStatus('Validated');
      setIsSubmitting(false);

      if (decision === 'Scale') {
        navigate('/government/scale-up');
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Pilot Outcome Verification & Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Pilot Outcome Validation & Decision Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Authorized human-in-the-loop decision portal comparing audited telemetry against initial RFP benchmarks.
        </p>
      </div>

      {/* Pilot Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Select Pilot to Validate:</span>
          </span>
          <span className="text-[11px] text-slate-500">{pilots.length} Pilots Available</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {pilots.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPilot(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                p.id === pilot.id
                  ? 'bg-sky-700 border-sky-600 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 shadow-xs'
              }`}
            >
              <span className="font-semibold">{p.startupName}</span>
              <span className={`text-[10px] ${p.id === pilot.id ? 'text-sky-100' : 'text-slate-500 font-medium'}`}>({p.status})</span>
            </button>
          ))}
        </div>
      </div>

      {/* OUTCOME VALIDATION REPORT CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Report Top Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                Official Validation Dossier
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Validation Status: {validationStatus}
              </span>
              <StatusBadge status={pilot.status} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {pilot.title || pilot.challengeTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Startup: <strong className="text-sky-700 font-semibold">{pilot.startupName}</strong></span>
              <span>•</span>
              <span>Department: <strong className="text-slate-800 font-medium">{pilot.department}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-slate-800 font-medium">{pilot.pilotDuration}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-800 font-medium">{pilot.pilotLocation || 'Bengaluru Corridor'}</strong></span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-slate-500 block">Overall KPI Validation Score</span>
            <div className="text-3xl font-black text-emerald-700 font-mono">
              {overallScore}/100
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {achievementPct}% Target Fulfillment
            </span>
          </div>
        </div>

        {/* AUDITED KPI RESULTS TABLE (TARGET VS ACTUAL) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Target vs Actual Audited Outcomes ({kpis.length} KPIs)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-medium">
              Fulfillment Rate: {achievementPct}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const isMet = (kpi.status || '').toLowerCase().includes('achieved') || (kpi.status || '').toLowerCase().includes('exceeded') || (kpi.status || '').toLowerCase().includes('met') || (kpi.status || '').toLowerCase().includes('on track');
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isMet
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{kpi.name}</span>
                    <StatusBadge status={kpi.status} size="sm" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-2xl font-extrabold ${isMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {kpi.actual}
                    </span>
                    <span className="text-xs text-slate-500">vs Target {kpi.target}</span>
                  </div>
                  {kpi.baseline && (
                    <span className="text-[10px] text-slate-500 block">
                      Baseline: {kpi.baseline}
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold block mt-1 ${isMet ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isMet ? '✓ Verified within target bounds' : '⚠ Did not satisfy RFP limit'}
                  </span>
                  {kpi.evidenceNotes && (
                    <p className="text-[10px] text-slate-600 mt-2 pt-2 border-t border-slate-200/80 italic line-clamp-2">
                      {kpi.evidenceNotes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ALGORITHMIC & TECHNICAL EVALUATION RECOMMENDATION CARD */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Technical Committee Review Synthesis
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-wider">
            {achievementPct >= 80 ? 'SCALE ELIGIBLE' : 'CONDITIONAL RE-PILOT'}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            "The field solution demonstrated verified KPI achievement across target corridors. Human validation by the designated Department Officer is statutorily required before procurement initiation."
          </p>
        </div>
      </div>

      {/* AUTHORIZED OFFICIAL DECISION GATEWAY */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-600" />
            <span>Authorized Official Validation Decision Gateway</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pursuant to Rule 173 of GFR 2017 and GeM Innovation Procurement Guidelines, the decision is NOT automatic. An explicit human determination must be recorded by the authorized officer.
          </p>
        </div>

        {/* 3 CORE VALIDATION DECISIONS (Scale, Re-pilot, Close) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Select Statutory Validation Decision *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Scale */}
            <button
              id="btn-decision-scale"
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
                {selectedDecision === 'Scale' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    CHOSEN
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">Scale</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Approve commercial expansion, GeM direct procurement, and multi-district rollout.
              </p>
            </button>

            {/* Re-pilot */}
            <button
              id="btn-decision-repilot"
              type="button"
              onClick={() => setSelectedDecision('Re-pilot')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedDecision === 'Re-pilot' || selectedDecision === 'Continue Pilot'
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 text-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <RotateCcw className={`w-5 h-5 ${selectedDecision === 'Re-pilot' || selectedDecision === 'Continue Pilot' ? 'text-amber-600' : 'text-slate-400'}`} />
                {(selectedDecision === 'Re-pilot' || selectedDecision === 'Continue Pilot') && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    CHOSEN
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">Re-pilot</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Extend trial for 30-60 days with hardware recalibration or expanded corridor stress-testing.
              </p>
            </button>

            {/* Close */}
            <button
              id="btn-decision-close"
              type="button"
              onClick={() => setSelectedDecision('Close')}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedDecision === 'Close' || selectedDecision === 'Stop'
                  ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 text-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <XCircle className={`w-5 h-5 ${selectedDecision === 'Close' || selectedDecision === 'Stop' ? 'text-rose-600' : 'text-slate-400'}`} />
                {(selectedDecision === 'Close' || selectedDecision === 'Stop') && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    CHOSEN
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900">Close</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Conclude pilot project with no further procurement commitments. Archive field results.
              </p>
            </button>
          </div>
        </div>

        {/* Expert/Official Observations Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Official Observations & Committee Evaluation Findings *
          </label>
          <textarea
            id="textarea-official-observations"
            rows={3}
            value={officialObservations}
            onChange={(e) => setOfficialObservations(e.target.value)}
            className="gov-input text-xs"
            placeholder="Document official findings, technical robustness analysis, and field rationale..."
          />
        </div>

        {/* Evidence & Notes Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Audited Telemetry Evidence Citations & Notes *
          </label>
          <textarea
            id="textarea-evidence-notes"
            rows={2}
            value={evidenceNotes}
            onChange={(e) => setEvidenceNotes(e.target.value)}
            className="gov-input text-xs"
            placeholder="Reference specific dataset tokens, GIS audit batches, or field engineer logs..."
          />
        </div>

        {/* Officer Signature Meta & Commit Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Authorized Official: <strong className="text-slate-900">{authorizedOfficial}</strong><br />
            Statutory Token: <code className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-mono text-[10px]">PWD-VALIDATE-{pilot.id?.toUpperCase().slice(-8) || '2026-942X'}</code>
          </div>

          <div className="flex items-center gap-3">
            {selectedDecision === 'Scale' && (
              <button
                id="btn-authorize-scale-rollout"
                type="button"
                onClick={() => handleAuthorizeDecision('Scale')}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize Scale Rollout</span>
              </button>
            )}

            <button
              id="btn-confirm-validation-decision"
              onClick={() => handleAuthorizeDecision(selectedDecision)}
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                selectedDecision === 'Scale'
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : selectedDecision === 'Close' || selectedDecision === 'Stop'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Record "{String(selectedDecision).toUpperCase()}" Decision</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
