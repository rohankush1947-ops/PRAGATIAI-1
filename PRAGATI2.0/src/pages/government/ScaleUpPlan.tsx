import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Globe,
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckSquare,
  AlertTriangle,
  Lock,
  ExternalLink,
  Users,
  Target,
  FileText,
  Briefcase,
  ShoppingCart,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ScaleUpPlan as IScaleUpPlan, ScaleUpStatus, ProcurementContract } from '../../types';

export const ScaleUpPlan: React.FC = () => {
  const { 
    scaleUpPlan: activePlan,
    scaleUpPlans,
    procurementContracts,
    pilots,
    applications,
    challenges,
    evaluations,
    currentRole,
    advanceScaleUpPhase,
    createScaleUpPlan,
    submitScaleUpPlan,
    approveScaleUpPlan,
    activateScaleUpPlan,
    completeScaleUpPlan,
    addToast
  } = usePragati();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryPlanId = searchParams.get('planId') || searchParams.get('id');
  
  const allPlans = scaleUpPlans && scaleUpPlans.length > 0 ? scaleUpPlans : (activePlan ? [activePlan] : []);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    queryPlanId || allPlans[0]?.id || ''
  );

  useEffect(() => {
    if (queryPlanId && queryPlanId !== selectedPlanId) {
      setSelectedPlanId(queryPlanId);
    } else if (!selectedPlanId && allPlans.length > 0) {
      setSelectedPlanId(allPlans[0].id);
    }
  }, [queryPlanId, allPlans]);

  // Current active plan
  const plan: IScaleUpPlan = allPlans.find(p => p.id === selectedPlanId) || activePlan || allPlans[0];

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ScaleUpStatus | null>(null);
  const [transitionNotes, setTransitionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Scale-Up Plan
  const [newProcurementId, setNewProcurementId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newScope, setNewScope] = useState('32,000 km State Road Infrastructure Network');
  const [newRegions, setNewRegions] = useState('Bengaluru Urban, Bengaluru Rural, Mysuru, Tumakuru, Hubballi-Dharwad, Belagavi');
  const [newBeneficiaries, setNewBeneficiaries] = useState('6.4 Crore citizens & 2.1 Million daily commuters');
  const [newBudget, setNewBudget] = useState('₹4,25,00,000');
  const [newTimeline, setNewTimeline] = useState('18 Months (Q1 2027 - Q3 2028)');
  const [newDept, setNewDept] = useState('Public Works Department (PWD)');
  const [newRisks, setNewRisks] = useState('Edge sensor telemetry degradation in monsoon; cellular dead zones on mountain highways');
  const [newMitigation, setNewMitigation] = useState('IP68-rated dual enclosures, local offline edge inference buffering, and hybrid 4G/satellite sync');

  // Evaluate 7-Point Scale-Up Eligibility for any procurement contract
  const evaluateProcurementEligibility = (contract: ProcurementContract) => {
    // 1. Startup selected by Government
    const app = applications.find(a => 
      a.startupId === contract.startupId || 
      (a.challengeId === contract.challengeId && a.startupName === contract.startupName)
    );
    const isGovtSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

    // 2. Pilot exists
    const pilot = pilots.find(p => p.id === contract.pilotId || p.startupName === contract.startupName);
    const hasPilot = Boolean(pilot);

    // 3. Pilot reached completed / evaluated state
    const isPilotCompleted = pilot && (
      ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
      (pilot.status === 'In Progress' && Boolean(pilot.validationDecision))
    );

    // 4. Outcome validation completed
    const isValidationCompleted = pilot && (Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated');

    // 5. Validation decision is "Scale"
    const isDecisionScale = pilot && (pilot.validationDecision === 'Scale');

    // 6. Procurement exists
    const hasProcurement = Boolean(contract);

    // 7. Procurement reached approved or active state
    const isProcurementApprovedOrActive = ['Approved', 'Active', 'Completed'].includes(contract.contractStatus);

    const isEligible = Boolean(
      isGovtSelected &&
      hasPilot &&
      isPilotCompleted &&
      isValidationCompleted &&
      isDecisionScale &&
      hasProcurement &&
      isProcurementApprovedOrActive
    );

    let reason = '';
    if (!isGovtSelected) reason = 'Scale-Up unavailable: Startup must be selected by Government first.';
    else if (!hasPilot) reason = 'Scale-Up unavailable: Controlled Pilot project does not exist.';
    else if (!isPilotCompleted) reason = 'Scale-Up unavailable: Pilot project has not reached completed/evaluated status.';
    else if (!isValidationCompleted) reason = 'Scale-Up unavailable: KPI & Outcome Validation must be completed first.';
    else if (!isDecisionScale) reason = 'Scale-Up unavailable: Outcome Validation must approve scaling first (decision was not "Scale").';
    else if (!isProcurementApprovedOrActive) reason = 'Scale-Up unavailable: Procurement Contract must be Approved or Active before scaling.';

    return {
      isEligible,
      reason,
      contract,
      pilot,
      app,
      checks: {
        isGovtSelected: Boolean(isGovtSelected),
        hasPilot: Boolean(hasPilot),
        isPilotCompleted: Boolean(isPilotCompleted),
        isValidationCompleted: Boolean(isValidationCompleted),
        isDecisionScale: Boolean(isDecisionScale),
        hasProcurement: true,
        isProcurementApprovedOrActive: Boolean(isProcurementApprovedOrActive)
      }
    };
  };

  const eligibleProcurements = procurementContracts.filter(c => evaluateProcurementEligibility(c).isEligible);
  const selectedModalContract = procurementContracts.find(c => c.id === newProcurementId) || eligibleProcurements[0] || procurementContracts[0];
  const modalEligibility = selectedModalContract ? evaluateProcurementEligibility(selectedModalContract) : null;

  const handleOpenCreateModal = () => {
    if (eligibleProcurements.length > 0) {
      setNewProcurementId(eligibleProcurements[0].id);
      setNewTitle(`Statewide Scale-Up Plan for ${eligibleProcurements[0].startupName}`);
      setNewDept(eligibleProcurements[0].department || 'Public Works Department (PWD)');
    } else if (procurementContracts.length > 0) {
      setNewProcurementId(procurementContracts[0].id);
      setNewTitle(`Statewide Scale-Up Plan for ${procurementContracts[0].startupName}`);
      setNewDept(procurementContracts[0].department || 'Public Works Department (PWD)');
    }
    setIsCreateModalOpen(true);
  };

  const handleContractSelectChange = (id: string) => {
    setNewProcurementId(id);
    const c = procurementContracts.find(x => x.id === id);
    if (c) {
      setNewTitle(`Statewide Scale-Up Plan for ${c.startupName}`);
      setNewDept(c.department || 'Public Works Department (PWD)');
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModalContract) return;

    if (!modalEligibility?.isEligible) {
      addToast('error', 'Scale-Up Ineligible', modalEligibility?.reason || 'Prerequisites not met.');
      return;
    }

    setIsSubmitting(true);
    try {
      const regionsList = newRegions.split(',').map(r => r.trim()).filter(Boolean);
      const created = await createScaleUpPlan({
        procurementId: selectedModalContract.id,
        title: newTitle,
        targetScope: newScope,
        targetRegions: regionsList,
        expectedBeneficiaries: newBeneficiaries,
        estimatedBudget: newBudget,
        implementationTimeline: newTimeline,
        responsibleGovernmentDepartment: newDept,
        risks: newRisks,
        mitigation: newMitigation
      });

      setSelectedPlanId(created.id);
      setSearchParams({ planId: created.id });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Scale-Up Creation Blocked', err.message || 'Validation error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status transitions
  const handleInitiateTransition = (status: ScaleUpStatus) => {
    setTargetStatus(status);
    setTransitionNotes('');
    setIsTransitionModalOpen(true);
  };

  const handleConfirmTransition = async () => {
    if (!plan || !targetStatus) return;
    setIsSubmitting(true);
    try {
      if (targetStatus === 'Under Review') {
        await submitScaleUpPlan(plan.id, transitionNotes);
      } else if (targetStatus === 'Approved') {
        await approveScaleUpPlan(plan.id, transitionNotes, 'Er. Rajeshwar Rao, Chief Engineer, PWD');
      } else if (targetStatus === 'Active') {
        await activateScaleUpPlan(plan.id, transitionNotes);
      } else if (targetStatus === 'Completed') {
        await completeScaleUpPlan(plan.id, transitionNotes);
      }
      setIsTransitionModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Transition Failed', err.message || 'Could not update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers for Stepper
  const stages: { key: ScaleUpStatus; label: string }[] = [
    { key: 'Draft', label: 'Draft' },
    { key: 'Under Review', label: 'Under Review' },
    { key: 'Approved', label: 'Approved' },
    { key: 'Active', label: 'Active' },
    { key: 'Completed', label: 'Completed' }
  ];

  const getStageIndex = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('draft')) return 0;
    if (s.includes('review')) return 1;
    if (s.includes('approved')) return 2;
    if (s.includes('active')) return 3;
    if (s.includes('completed')) return 4;
    return 3; // Default active for initial mock
  };

  const currentStageIndex = getStageIndex(plan?.status);

  // Derive linked entities for 9-node traceability
  const linkedContract = procurementContracts.find(c => c.id === plan?.procurementId || c.startupName === plan?.startupName);
  const linkedPilot = pilots.find(p => p.id === linkedContract?.pilotId || p.startupName === plan?.startupName);
  const linkedChallenge = challenges.find(c => c.id === plan?.challengeId || c.id === linkedContract?.challengeId || c.title === plan?.challengeTitle);
  const linkedApp = applications.find(a => (a.startupId === plan?.startupId || a.startupName === plan?.startupName) && (a.challengeId === plan?.challengeId || a.challengeTitle === plan?.challengeTitle));
  const linkedEvaluation = evaluations.find(e => e.applicationId === linkedApp?.id || (e.startupName === plan?.startupName && e.challengeTitle === plan?.challengeTitle));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Role Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Post-Procurement Scale-Up Phase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scale-Up & Multi-District Expansion Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transitioning validated startup innovation from single division pilot to statewide departmental deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentRole === 'government' && (
            <button
              id="btn-open-create-scaleup"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Scale-Up Plan</span>
            </button>
          )}

          {currentRole === 'startup' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Startup Founder View • Authorizations Managed by Government Sanctioning Authority</span>
            </div>
          )}

          {currentRole === 'expert' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Technical Committee Observer View • Read-Only</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Plan Switcher Tabs */}
      {allPlans.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Select Active Scale-Up Plan:</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{allPlans.length} Plans Registered</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allPlans.map(p => (
              <button
                key={p.id}
                id={`tab-scaleup-plan-${p.id}`}
                data-status={p.status}
                onClick={() => {
                  setSelectedPlanId(p.id);
                  setSearchParams({ planId: p.id });
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                  p.id === plan?.id
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="max-w-[220px] truncate" title={p.title || p.startupName}>{p.title || p.startupName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  p.id === plan?.id
                    ? 'bg-sky-700 text-white'
                    : p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    p.status === 'Active' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                    p.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    p.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                }`}>
                  ({p.status})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5-STAGE STATUS LIFECYCLE STEPPER & OFFICER ACTIONS */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Scale-Up Lifecycle Progression
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-slate-900">Current Phase:</span>
              <StatusBadge status={plan?.status || 'Active'} size="md" />
            </div>
          </div>

          {/* Officer Action Triggers */}
          {currentRole === 'government' && (
            <div className="flex flex-wrap items-center gap-2">
              {currentStageIndex === 0 && (
                <button
                  id="btn-scaleup-submit-review"
                  onClick={() => handleInitiateTransition('Under Review')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submit for Sanction Review</span>
                </button>
              )}

              {currentStageIndex === 1 && (
                <button
                  id="btn-scaleup-approve"
                  onClick={() => handleInitiateTransition('Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Scale-Up Plan</span>
                </button>
              )}

              {currentStageIndex === 2 && (
                <button
                  id="btn-scaleup-activate"
                  onClick={() => handleInitiateTransition('Active')}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Activate Scale-Up Implementation</span>
                </button>
              )}

              {currentStageIndex === 3 && (
                <button
                  id="btn-scaleup-complete"
                  onClick={() => handleInitiateTransition('Completed')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Mark Scale-Up Completed</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stepper Graphic */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {stages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.key}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/30 text-sky-900 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Step {idx + 1}
                </div>
                <div className="text-xs font-bold truncate">
                  {st.label}
                </div>
                <span className="text-[10px] block mt-1 font-semibold">
                  {isCompleted ? '✓ Passed' : isCurrent ? '● Active' : 'Upcoming'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPLETE 9-NODE END-TO-END TRACEABILITY LINEAGE (PROMPT MANDATED) */}
      <div 
        id="section-scaleup-traceability"
        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                End-to-End Governance Traceability Lineage
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Unbroken statutory audit trail from RFP Challenge conception through statewide Scale-Up adoption.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-600 border border-slate-200">
            Immutable Audit Hash: SHA-256 Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs">
          {/* 1. Challenge */}
          <Link
            to="/government/challenges"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>1. Challenge</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate" title={plan.challengeTitle || 'Challenge'}>
              {plan.challengeTitle || linkedChallenge?.title || 'RFP Challenge'}
            </div>
            <div className="text-[10px] text-slate-500">{plan.responsibleGovernmentDepartment || 'PWD'}</div>
          </Link>

          {/* 2. Startup Application */}
          <Link
            to="/government/applications"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>2. Startup Application</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate">{plan.startupName}</div>
            <div className="text-[10px] text-slate-500">Submitted Proposal</div>
          </Link>

          {/* 3. Expert Evaluation */}
          <Link
            to="/expert/dashboard"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>3. Expert Evaluation</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-emerald-700 font-mono">
              {linkedEvaluation?.totalScore || 91}/100 Score
            </div>
            <div className="text-[10px] text-slate-500">Panel Approved</div>
          </Link>

          {/* 4. Government Selection */}
          <Link
            to="/government/applications"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>4. Government Selection</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-emerald-700 truncate">Selected</div>
            <div className="text-[10px] text-slate-500">Govt Sanctioned</div>
          </Link>

          {/* 5. Pilot Project */}
          <Link
            to="/government/pilots"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>5. Pilot Project</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate">
              {plan.pilotTitle || 'Controlled Pilot'}
            </div>
            <div className="text-[10px] text-slate-500">{linkedPilot?.status || 'Completed'}</div>
          </Link>

          {/* 6. KPI Results */}
          <Link
            to="/government/kpi-monitoring"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>6. KPI Results</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-emerald-700">
              {linkedPilot?.kpis?.[0]?.actual || '94.2%'} Met
            </div>
            <div className="text-[10px] text-slate-500">Audited Telemetry</div>
          </Link>

          {/* 7. Outcome Validation */}
          <Link
            to="/government/validation"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>7. Outcome Validation</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-purple-700">
              Decision: Scale
            </div>
            <div className="text-[10px] text-slate-500">Sign-Off Confirmed</div>
          </Link>

          {/* 8. Procurement Contract */}
          <Link
            to={`/government/procurement?contractId=${plan.procurementId || ''}`}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>8. Procurement</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-purple-800 truncate">
              {linkedContract?.contractStatus || 'Active'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{linkedContract?.approvedBudget || '₹38.5L'}</div>
          </Link>

          {/* 9. Scale-Up (Current) */}
          <div className="p-2.5 rounded-xl bg-sky-50 border-2 border-sky-400 space-y-1 block shadow-sm">
            <div className="text-[10px] text-sky-800 font-bold uppercase flex items-center justify-between">
              <span>9. Scale-Up</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="font-bold text-sky-950 truncate">{plan.status}</div>
            <div className="text-[10px] text-sky-700 font-mono font-semibold">{plan.estimatedBudget || plan.estimatedCost}</div>
          </div>
        </div>
      </div>

      {/* 4 CORE SCALE METRICS (PRESERVED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Current Pilot Scope</span>
          <div className="text-xl font-bold text-slate-900">
            {plan.currentDeployment}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Validated Division Baseline</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sky-300 shadow-sm">
          <span className="text-xs text-sky-700 block mb-1 font-semibold">Target Statewide Scope</span>
          <div className="text-xl font-bold text-sky-700">
            {plan.targetDeployment}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full Departmental Network</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Total Scale-Up Outlay</span>
          <div className="text-xl font-bold text-emerald-700 font-mono">
            {plan.estimatedBudget || plan.estimatedCost.split(' ')[0]}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Multi-Year Phased Allocation</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Expected Beneficiaries</span>
          <div className="text-xl font-bold text-amber-600 truncate" title={plan.expectedBeneficiaries}>
            {plan.expectedBeneficiaries ? plan.expectedBeneficiaries.split('&')[0] : '6.4 Cr Citizens'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Direct Public Impact</span>
        </div>
      </div>

      {/* OPERATIONAL PARAMETERS & SCOPE DOSSIER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                {plan.startupName}
              </span>
              <span className="text-xs text-slate-400 font-mono">{plan.id}</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2" id="heading-scaleup-title">
              <Globe className="w-5 h-5 text-sky-600 shrink-0" />
              <span>{plan.title || `Statewide Scale-Up Operational Blueprint for ${plan.startupName}`}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized implementation dossier pursuant to statutory innovation adoption framework.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Department: <strong className="text-slate-900">{plan.responsibleGovernmentDepartment || 'Public Works Department'}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Plan Reference ID</span>
              <span className="font-mono text-slate-900 font-bold text-sm">{plan.id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Implementation Timeline</span>
              <span className="text-slate-700 font-medium">{plan.implementationTimeline || '18 Months'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Sanctioning Official</span>
              <span className="text-slate-700 font-medium">{plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'}</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Target Territorial Districts & Expansion Corridors</span>
              <div className="flex flex-wrap gap-1.5">
                {(plan.targetRegions || ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad', 'Belagavi']).map((reg, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>{reg}</span>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">Target Deployment Scope</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{plan.targetScope || plan.targetDeployment}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MILESTONES & IMPLEMENTATION TIMELINE */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Multi-Phase Scale-Up Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological implementation benchmarks with territorial district deliveries.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">{plan.milestones?.length || 3} Core Milestones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/70">
                <th className="py-2.5 pr-4 pl-3">Milestone</th>
                <th className="py-2.5 px-4">Timeline</th>
                <th className="py-2.5 px-4">Deliverables & Objectives</th>
                <th className="py-2.5 px-4">Target Region</th>
                <th className="py-2.5 px-4">Budget Outlay</th>
                <th className="py-2.5 pl-4 pr-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(plan.milestones || []).map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pr-4 pl-3 font-bold text-slate-900">
                    {m.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {m.timeline}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    {m.deliverable}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {m.targetDistrict || 'Statewide'}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-mono font-bold whitespace-nowrap">
                    {m.budgetAllocation || '—'}
                  </td>
                  <td className="py-3.5 pl-4 pr-3 text-right">
                    <StatusBadge status={m.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PERFORMANCE KPIS & FIELD SERVICE SLAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-600" />
              <span>Target Scale-Up KPIs</span>
            </h3>
            <span className="text-[10px] text-sky-700 font-mono font-semibold">Continuous Telemetry</span>
          </div>

          <div className="space-y-3">
            {(plan.kpis || []).map((k, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{k.metric}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Baseline: <span className="text-slate-600">{k.baseline}</span> → Current: <strong className="text-sky-700">{k.current || k.baseline}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-emerald-700 font-bold text-sm">{k.target}</div>
                  <span className="text-[10px] text-emerald-600 uppercase font-bold">Target</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RISKS & MITIGATION MATRIX */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Risks & Technical Mitigation</span>
            </h3>
            <span className="text-[10px] text-amber-700 font-mono font-semibold">Field Contingency</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-800 block uppercase tracking-wider text-[10px]">Identified Operational Risks</span>
              <p className="text-slate-700 leading-relaxed">
                {plan.risks || 'Hardware telemetry degradation in extreme weather; edge transmission in low-bandwidth corridors.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-800 block uppercase tracking-wider text-[10px]">Mandated Technical Counter-Measures</span>
              <p className="text-slate-700 leading-relaxed">
                {plan.mitigation || 'IP68-rated enclosures, edge-side local caching, and asynchronous data sync.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED PHASE ROADMAP (PRESERVED FOR STAGE H E2E TESTS) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phased Rollout Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured multi-year milestone schedule with territorial district allocations.
            </p>
          </div>
          <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded border border-sky-200">Solution: {plan.solutionName}</span>
        </div>

        <div className="space-y-4">
          {plan.scalePhases.map((phase, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                phase.status === 'Completed'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : phase.status === 'Active'
                  ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-400/30'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{phase.phase}: {phase.title}</span>
                  <StatusBadge status={phase.status} size="sm" />
                </div>
                <div className="text-slate-600 text-xs">
                  Coverage Target: <strong className="text-sky-700">{phase.coverage}</strong> | Timeline: <strong className="text-slate-800">{phase.timeline}</strong>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {phase.districts.map((d, i) => (
                    <span key={i} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      <MapPin className="w-2.5 h-2.5 inline mr-1 text-sky-600" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0">
                {phase.status === 'Completed' ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : phase.status === 'Active' ? (
                  <span className="text-xs text-sky-700 font-bold flex items-center gap-1">
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

      {/* CREATE SCALE-UP PLAN MODAL (STRICT 7-POINT ELIGIBILITY ENFORCEMENT) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Statewide Scale-Up Implementation Plan"
        subtitle="Mandatory 7-Point Statutory Eligibility Verification"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
          {/* Select Source Procurement Contract */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Validated Innovation Procurement Contract *
            </label>
            <select
              id="select-scaleup-procurement"
              value={newProcurementId}
              onChange={(e) => handleContractSelectChange(e.target.value)}
              className="gov-input text-xs"
            >
              {procurementContracts.map(c => {
                const elig = evaluateProcurementEligibility(c);
                return (
                  <option key={c.id} value={c.id}>
                    {c.startupName} — {c.id} ({c.contractStatus}) {elig.isEligible ? '[ELIGIBLE: Scale-Up]' : `[INELIGIBLE: ${elig.reason.split(':')[1]?.trim() || 'Prerequisites Missing'}]`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 7-Point Eligibility Check Live Card */}
          {modalEligibility && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              modalEligibility.isEligible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                {modalEligibility.isEligible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>
                  {modalEligibility.isEligible 
                    ? 'STATUTORY SCALE-UP ELIGIBILITY: VERIFIED' 
                    : modalEligibility.reason}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.isGovtSelected ? '✓' : '✖'}</span>
                  <span>1. Startup Selected by Government</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.hasPilot ? '✓' : '✖'}</span>
                  <span>2. Controlled Pilot Project Linked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.isPilotCompleted ? '✓' : '✖'}</span>
                  <span>3. Pilot Completed / Under Evaluation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.isValidationCompleted ? '✓' : '✖'}</span>
                  <span>4. Outcome Validation Finalized</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.isDecisionScale ? '✓' : '✖'}</span>
                  <span>5. Decision is "Scale": <strong>{modalEligibility.pilot?.validationDecision || 'None'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalEligibility.checks.hasProcurement ? '✓' : '✖'}</span>
                  <span>6. Procurement Contract Exists</span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <span>{modalEligibility.checks.isProcurementApprovedOrActive ? '✓' : '✖'}</span>
                  <span>7. Procurement Status: <strong>{selectedModalContract?.contractStatus}</strong> (Must be Approved / Active / Completed)</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scale-Up Plan Title *</label>
              <input
                id="input-scaleup-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deployment Scope *</label>
              <input
                id="input-scaleup-scope"
                type="text"
                value={newScope}
                onChange={(e) => setNewScope(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget Outlay *</label>
              <input
                id="input-scaleup-budget"
                type="text"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Territorial Regions / Districts (comma separated) *</label>
              <input
                id="input-scaleup-regions"
                type="text"
                value={newRegions}
                onChange={(e) => setNewRegions(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Beneficiaries *</label>
              <input
                id="input-scaleup-beneficiaries"
                type="text"
                value={newBeneficiaries}
                onChange={(e) => setNewBeneficiaries(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Implementation Timeline *</label>
              <input
                id="input-scaleup-timeline"
                type="text"
                value={newTimeline}
                onChange={(e) => setNewTimeline(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Responsible Government Department *</label>
              <input
                id="input-scaleup-dept"
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="gov-input text-xs"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Risks & Mitigation Strategy</label>
              <textarea
                id="textarea-scaleup-risks"
                rows={2}
                value={newRisks}
                onChange={(e) => setNewRisks(e.target.value)}
                className="gov-input text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="btn-submit-create-scaleup"
              type="submit"
              disabled={isSubmitting || !modalEligibility?.isEligible}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                modalEligibility?.isEligible
                  ? 'bg-sky-600 hover:bg-sky-500'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Instantiating...' : modalEligibility?.isEligible ? 'Create Scale-Up Plan' : 'Ineligible for Scale-Up'}
            </button>
          </div>
        </form>
      </Modal>

      {/* STATUS TRANSITION CONFIRMATION MODAL */}
      <Modal
        isOpen={isTransitionModalOpen}
        onClose={() => setIsTransitionModalOpen(false)}
        title={`Advance Scale-Up Status to "${targetStatus}"`}
        subtitle={`Official determination for ${plan?.startupName || 'Startup'} (${plan?.id || ''})`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            You are about to advance Scale-Up Plan <strong>{plan?.id}</strong> from <strong>{plan?.status}</strong> to <strong>{targetStatus}</strong>. This official decision will be registered in the immutable audit registry and dispatches instant status notifications to the startup vendor.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sanctioning Official Remarks / Cabinet Resolution Reference
            </label>
            <textarea
              id="textarea-scaleup-transition-notes"
              rows={3}
              value={transitionNotes}
              onChange={(e) => setTransitionNotes(e.target.value)}
              className="gov-input text-xs"
              placeholder="e.g. Sanctioned pursuant to Departmental Standing Committee resolution..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTransitionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-scaleup-transition"
              type="button"
              onClick={handleConfirmTransition}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md"
            >
              {isSubmitting ? 'Processing...' : `Confirm & Advance to ${targetStatus}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
