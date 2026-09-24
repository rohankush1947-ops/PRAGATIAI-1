import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { ProcurementContract as IProcurementContract, ProcurementContractStatus } from '../../types';
import { 
  ShoppingCart, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Building2,
  Download,
  PlusCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Target,
  Award,
  Briefcase,
  Users,
  Flag,
  FileCheck2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const ProcurementContract: React.FC = () => {
  const { 
    procurementContracts, 
    pilots, 
    applications, 
    evaluations, 
    challenges,
    currentRole, 
    releaseProcurementMilestone, 
    createProcurementContract,
    updateProcurementStatus,
    addToast 
  } = usePragati();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryContractId = searchParams.get('contractId') || searchParams.get('id');
  const [selectedContractId, setSelectedContractId] = useState<string>(
    queryContractId || procurementContracts[0]?.id || ''
  );

  useEffect(() => {
    if (queryContractId && queryContractId !== selectedContractId) {
      setSelectedContractId(queryContractId);
    } else if (!selectedContractId && procurementContracts.length > 0) {
      setSelectedContractId(procurementContracts[0].id);
    }
  }, [queryContractId, procurementContracts]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ProcurementContractStatus | null>(null);
  const [transitionNotes, setTransitionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New contract form state
  const [newPilotId, setNewPilotId] = useState('');
  const [newMethod, setNewMethod] = useState('Rule 173 GFR Innovation Direct Purchase via GeM');
  const [newBudget, setNewBudget] = useState('₹45,00,000');
  const [newDeliverables, setNewDeliverables] = useState('Production deployment across 12 urban corridors with SLA compliance');
  const [newPaymentInfo, setNewPaymentInfo] = useState('PFMS/2026/GEM-ESCROW with 100% statutory bank guarantee');
  const [newNotes, setNewNotes] = useState('Authorized pursuant to Rule 173 of GFR 2017 following successful outcome-validated pilot trial.');

  // Current contract
  const contract = procurementContracts.find(c => c.id === selectedContractId) || procurementContracts[0];

  // Derive linked entities for traceability
  const linkedPilot = pilots.find(p => p.id === contract?.pilotId || p.startupName === contract?.startupName);
  const linkedChallenge = challenges.find(c => c.id === contract?.challengeId || c.title === contract?.challengeTitle);
  const linkedApp = applications.find(a => (a.startupId === contract?.startupId || a.startupName === contract?.startupName) && (a.challengeId === contract?.challengeId || a.challengeTitle === contract?.challengeTitle));
  const linkedEvaluation = evaluations.find(e => e.applicationId === linkedApp?.id || (e.startupName === contract?.startupName && e.challengeTitle === contract?.challengeTitle));

  // 5-Point Eligibility evaluation for pilots
  const evaluatePilotEligibility = (p: typeof pilots[0]) => {
    // 1. Startup selected by Government
    const app = applications.find(a => a.startupId === p.startupId || a.id === p.applicationId || (a.challengeId === p.challengeId && a.startupName === p.startupName));
    const isStartupSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

    // 2. Pilot exists
    const hasPilot = Boolean(p);

    // 3. Pilot in Under Evaluation or Completed state
    const isPilotInValidState = 
      ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(p.status) ||
      (p.status === 'In Progress' && Boolean(p.validationDecision));

    // 4. Outcome validation completed
    const isValidationCompleted = Boolean(p.validationDecision) || p.validationStatus === 'Validated';

    // 5. Validation decision is "Scale"
    const isDecisionScale = p.validationDecision === 'Scale';

    const isEligible = isStartupSelected && hasPilot && isPilotInValidState && isValidationCompleted && isDecisionScale;

    return {
      isEligible,
      isStartupSelected,
      hasPilot,
      isPilotInValidState,
      isValidationCompleted,
      isDecisionScale
    };
  };

  // List of all eligible pilots
  const eligiblePilots = pilots.filter(p => evaluatePilotEligibility(p).isEligible);

  // Selected pilot in create modal
  const selectedModalPilot = pilots.find(p => p.id === newPilotId) || eligiblePilots[0] || pilots[0];
  const modalPilotEligibility = selectedModalPilot ? evaluatePilotEligibility(selectedModalPilot) : null;

  const handleOpenCreateModal = () => {
    if (eligiblePilots.length > 0) {
      setNewPilotId(eligiblePilots[0].id);
      setNewBudget(eligiblePilots[0].budget || '₹45,00,000');
    } else if (pilots.length > 0) {
      setNewPilotId(pilots[0].id);
      setNewBudget(pilots[0].budget || '₹35,00,000');
    }
    setIsCreateModalOpen(true);
  };

  const handlePilotSelectChange = (pilotId: string) => {
    setNewPilotId(pilotId);
    const p = pilots.find(x => x.id === pilotId);
    if (p && p.budget) {
      setNewBudget(p.budget);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModalPilot) return;

    if (!modalPilotEligibility?.isEligible) {
      addToast(
        'error',
        'Procurement Ineligible',
        'Cannot create procurement for an unvalidated or ineligible solution. Decision must be "Scale".'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createProcurementContract({
        pilotId: selectedModalPilot.id,
        procurementMethod: newMethod,
        approvedBudget: newBudget,
        contractValue: newBudget,
        deliverables: newDeliverables,
        paymentInfo: newPaymentInfo,
        notes: newNotes
      });
      setSelectedContractId(created.id);
      setSearchParams({ contractId: created.id });
      setIsCreateModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Procurement Creation Blocked', err.message || 'Validation error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitiateTransition = (status: ProcurementContractStatus) => {
    setTargetStatus(status);
    setTransitionNotes('');
    setIsTransitionModalOpen(true);
  };

  const handleConfirmTransition = async () => {
    if (!contract || !targetStatus) return;
    setIsSubmitting(true);
    try {
      await updateProcurementStatus(
        contract.id, 
        targetStatus, 
        transitionNotes, 
        'Er. Rajeshwar Rao, Chief Engineer, PWD'
      );
      setIsTransitionModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Status Update Failed', err.message || 'Error updating status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadContract = () => {
    addToast('info', 'Document Download Simulated', `Procurement_Contract_${contract?.id || '2026'}_Executed.pdf simulated download.`);
  };

  // Helper for lifecycle stages
  const stages: { key: ProcurementContractStatus; label: string }[] = [
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
    return 0;
  };

  const currentStageIndex = getStageIndex(contract?.contractStatus);

  if (!contract && procurementContracts.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Procurement Contracts Yet</h2>
        <p className="text-xs text-slate-500">
          Outcome-validated pilots with a "Scale" decision are eligible for innovation procurement.
        </p>
        {currentRole === 'government' && (
          <button
            id="btn-open-create-procurement"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold"
          >
            Create Procurement Record
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Post-Pilot Innovation Procurement (Rule 173 GFR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement & Milestone Contract
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Statutory commercial direct purchase contract with milestone escrow schedule tied to audited field KPIs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentRole === 'government' && (
            <button
              id="btn-open-create-procurement"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Procurement Record</span>
            </button>
          )}

          <button
            onClick={handleDownloadContract}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Download Contract PDF</span>
          </button>

          <Link
            to="/government/scale-up"
            className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Scale-Up Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Contract Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Select Procurement Contract:</span>
          </span>
          <span className="text-[11px] text-slate-500">{procurementContracts.length} Contracts Active</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {procurementContracts.map(c => (
            <button
              key={c.id}
              id={`tab-contract-${c.id}`}
              data-status={c.contractStatus}
              onClick={() => {
                setSelectedContractId(c.id);
                setSearchParams({ contractId: c.id });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                c.id === contract.id
                  ? 'bg-purple-700 border-purple-500 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{c.startupName}</span>
              <span className="text-[10px] opacity-80">({c.contractStatus})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5-STAGE STATUS LIFECYCLE STEPPER */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Contract Lifecycle Progression
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-slate-900">Current Phase:</span>
              <StatusBadge status={contract.contractStatus} size="md" />
            </div>
          </div>

          {/* Officer Action Triggers based on current stage */}
          {currentRole === 'government' && (
            <div className="flex flex-wrap items-center gap-2">
              {currentStageIndex === 0 && (
                <button
                  id="btn-procurement-submit-review"
                  onClick={() => handleInitiateTransition('Under Review')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submit for Review</span>
                </button>
              )}

              {currentStageIndex === 1 && (
                <button
                  id="btn-procurement-approve"
                  onClick={() => handleInitiateTransition('Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Procurement</span>
                </button>
              )}

              {currentStageIndex === 2 && (
                <button
                  id="btn-procurement-activate"
                  onClick={() => handleInitiateTransition('Active')}
                  className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Activate Contract (Disburse Escrow)</span>
                </button>
              )}

              {currentStageIndex === 3 && (
                <button
                  id="btn-procurement-complete"
                  onClick={() => handleInitiateTransition('Completed')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Mark Contract Completed</span>
                </button>
              )}
            </div>
          )}

          {currentRole === 'startup' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Vendor View • Authorizations Managed by Sanctioning Authority</span>
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
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200 text-purple-900 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Step {idx + 1}
                </div>
                <div className="text-xs font-bold truncate">
                  {st.label}
                </div>
                <span className="text-[10px] block mt-1">
                  {isCompleted ? '✓ Passed' : isCurrent ? '● Active' : 'Upcoming'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL END-TO-END TRACEABILITY LINEAGE (PROMPT SPECIFIED) */}
      <div 
        id="section-procurement-traceability"
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
              Statutory verification chain validating eligibility pursuant to Rule 173 GFR Direct Procurement guidelines.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-600 border border-slate-200">
            Audit Hash: SHA-256 Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
          {/* 1. Challenge */}
          <Link
            to="/government/challenges"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>1. Challenge</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate" title={contract.challengeTitle}>
              {contract.challengeTitle}
            </div>
            <div className="text-[10px] text-slate-500">{contract.department}</div>
          </Link>

          {/* 2. Startup */}
          <Link
            to="/government/applications"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>2. Selected Startup</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate">{contract.startupName}</div>
            <div className="text-[10px] text-emerald-700 font-medium">✓ Govt Selected</div>
          </Link>

          {/* 3. Evaluation */}
          <Link
            to="/expert/dashboard"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>3. Evaluation</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-emerald-700 font-mono">
              {contract.expertScore || 91}/100 Score
            </div>
            <div className="text-[10px] text-slate-500">Panel Recommendation</div>
          </Link>

          {/* 4. Pilot */}
          <Link
            to="/government/pilots"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>4. Pilot Project</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-semibold text-slate-900 truncate">
              {contract.pilotTitle || '90-Day Field Trial'}
            </div>
            <div className="text-[10px] text-slate-500">{linkedPilot?.status || 'Completed'}</div>
          </Link>

          {/* 5. KPI Results */}
          <Link
            to="/government/kpi-monitoring"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>5. KPI Telemetry</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-emerald-700">
              {linkedPilot?.kpis?.[0]?.actual || '94.2%'} Met
            </div>
            <div className="text-[10px] text-slate-500">Audited Field Data</div>
          </Link>

          {/* 6. Outcome Validation */}
          <Link
            to="/government/validation"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 transition-colors group space-y-1 block"
          >
            <div className="flex items-center justify-between text-[10px] text-sky-700 font-bold uppercase">
              <span>6. Validation</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-bold text-purple-700">
              Decision: {contract.validationDecision || 'Scale'}
            </div>
            <div className="text-[10px] text-slate-500">Officer Authorized</div>
          </Link>

          {/* 7. Procurement */}
          <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1 block">
            <div className="text-[10px] text-purple-700 font-bold uppercase">
              7. Procurement
            </div>
            <div className="font-semibold text-purple-900 truncate">
              {contract.contractStatus}
            </div>
            <div className="text-[10px] text-purple-700 font-mono">{contract.approvedBudget}</div>
          </div>
        </div>
      </div>

      {/* CONTRACT SUMMARY DOSSIER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 uppercase font-mono">
                {contract.id}
              </span>
              <StatusBadge status={contract.contractStatus} />
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Ref: {contract.referenceId || 'REF-GFR173'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {contract.challengeTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Awarded to: <strong className="text-sky-700">{contract.startupName}</strong></span>
              <span>•</span>
              <span>Procuring Authority: <strong className="text-slate-800">{contract.department}</strong></span>
              <span>•</span>
              <span>Officer: <strong className="text-slate-800">{contract.governmentOfficer || 'Er. Rajeshwar Rao'}</strong></span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-slate-500 block">Sanctioned Contract Value</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {contract.approvedBudget}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Performance-Linked Escrow</span>
          </div>
        </div>

        {/* Contract Key Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Validated Solution
            </span>
            <p className="text-slate-900 font-semibold">{contract.validatedSolution}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Statutory Procurement Method
            </span>
            <p className="text-slate-900 font-semibold">{contract.procurementMethod}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Contract Period & Dates
            </span>
            <p className="text-slate-900 font-semibold">
              {contract.contractStartDate || contract.executedDate} → {contract.contractEndDate || '2027-03-31'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Primary Contract Deliverables
            </span>
            <p className="text-slate-700 leading-relaxed font-normal">
              {contract.deliverables || 'Full production deployment, continuous hardware telemetry streaming, 99% uptime guarantee, and municipal operator training.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Payment & Escrow Reference
            </span>
            <p className="text-slate-800 font-mono text-[11px]">
              {contract.paymentInfo || 'PFMS PFMS/2026/GEM-ESCROW'}
            </p>
          </div>

          {contract.pilotResultsSummary && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 sm:col-span-2 lg:col-span-3">
              <span className="text-emerald-800 text-[11px] uppercase tracking-wider font-bold block">
                Audited Pilot Performance Summary & Technical Justification
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                {contract.pilotResultsSummary}
              </p>
            </div>
          )}

          {contract.notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2 lg:col-span-3">
              <span className="text-slate-600 text-[11px] uppercase tracking-wider font-semibold block">
                Administrative Notes & Legal Citations
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {contract.notes}
              </p>
            </div>
          )}
        </div>

        {/* MILESTONE PAYOUT SCHEDULE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-purple-700" />
              <span>Milestone Payout Schedule (Performance-Contingent)</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">100% Escrow Protected</span>
          </div>

          <div className="space-y-3">
            {contract.milestones.map((m) => {
              const isReleased = m.status === 'Released';
              const isPending = m.status === 'Pending Verification';
              return (
                <div
                  key={m.milestoneNumber}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isReleased
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : isPending
                      ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-400/30'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                      <StatusBadge status={m.status} size="sm" />
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Deliverable: {m.deliverable}
                    </p>
                    <div className="text-purple-800 font-bold font-mono text-xs">
                      Payout Value: {m.payout}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isReleased ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Disbursed</span>
                      </span>
                    ) : currentRole === 'government' ? (
                      <button
                        onClick={() => releaseProcurementMilestone(contract.id, m.milestoneNumber)}
                        className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Authorize Payment</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        Pending Government Verification
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CREATE PROCUREMENT CONTRACT MODAL (STRICT 5-POINT ELIGIBILITY GUARD) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Innovation Procurement Record"
        subtitle="Rule 173 GFR Innovation Direct Purchase & Milestone Escrow Creation"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateContract} className="space-y-5 text-xs">
          {/* Pilot Selection with Eligibility Audit */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Select Validated Pilot Project *
            </label>
            <select
              id="select-procurement-pilot"
              value={newPilotId}
              onChange={(e) => handlePilotSelectChange(e.target.value)}
              className="gov-select text-xs font-medium"
              required
            >
              {pilots.map(p => {
                const el = evaluatePilotEligibility(p);
                return (
                  <option key={p.id} value={p.id}>
                    {p.startupName} — {p.title || p.challengeTitle} [{el.isEligible ? 'ELIGIBLE: Scale' : `INELIGIBLE: ${p.status}`}]
                  </option>
                );
              })}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Statutory Rule: Only solutions with completed pilots and an official "Scale" outcome validation decision may be procured.
            </p>
          </div>

          {/* Eligibility Verification Card */}
          {selectedModalPilot && (
            <div className={`p-4 rounded-xl border ${
              modalPilotEligibility?.isEligible 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-2">
                {modalPilotEligibility?.isEligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prerequisites Satisfied — Eligible for GeM Direct Procurement</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Statutory Ineligibility Guard Active</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span>{modalPilotEligibility?.isStartupSelected ? '✓' : '✖'}</span>
                  <span>1. Startup Selected by Government</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalPilotEligibility?.hasPilot ? '✓' : '✖'}</span>
                  <span>2. Field Pilot Sanctioned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalPilotEligibility?.isPilotInValidState ? '✓' : '✖'}</span>
                  <span>3. Pilot Completed / Under Evaluation ({selectedModalPilot.status})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{modalPilotEligibility?.isValidationCompleted ? '✓' : '✖'}</span>
                  <span>4. Outcome Validation Finalized</span>
                </div>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <span>{modalPilotEligibility?.isDecisionScale ? '✓' : '✖'}</span>
                  <span>5. Official Validation Decision: <strong>{selectedModalPilot.validationDecision || 'None'}</strong> (Must be "Scale")</span>
                </div>
              </div>

              {!modalPilotEligibility?.isEligible && (
                <div className="mt-3 pt-2 border-t border-rose-200 text-[11px] font-semibold text-rose-800">
                  ⚠ Ineligible: Arbitrary startups cannot bypass the evaluation and pilot validation lifecycle. Complete pilot trials and record a "Scale" decision before initiating procurement.
                </div>
              )}
            </div>
          )}

          {/* Contract Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sanctioned Contract Value *
              </label>
              <input
                id="input-procurement-budget"
                type="text"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="gov-input text-xs"
                placeholder="₹45,00,000"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statutory Procurement Method *
              </label>
              <select
                id="select-procurement-method"
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
                className="gov-select text-xs"
              >
                <option value="Rule 173 GFR Innovation Direct Purchase via GeM">Rule 173 GFR Innovation Direct Purchase via GeM</option>
                <option value="Quality & Cost Based Selection (QCBS) Fast-Track">Quality & Cost Based Selection (QCBS) Fast-Track</option>
                <option value="Section 7(3) Innovation Runway Framework">Section 7(3) Innovation Runway Framework</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Contract Deliverables *
              </label>
              <input
                type="text"
                value={newDeliverables}
                onChange={(e) => setNewDeliverables(e.target.value)}
                className="gov-input text-xs"
                placeholder="Describe key hardware, software, and operational deliverables..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment & Escrow Reference
              </label>
              <input
                type="text"
                value={newPaymentInfo}
                onChange={(e) => setNewPaymentInfo(e.target.value)}
                className="gov-input text-xs font-mono"
                placeholder="PFMS/2026/GEM-ESCROW"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Administrative Notes & Legal Citations
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="gov-input text-xs"
                placeholder="References to GFR 2017 Rule 173..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="btn-submit-create-procurement"
              type="submit"
              disabled={isSubmitting || !modalPilotEligibility?.isEligible}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                modalPilotEligibility?.isEligible
                  ? 'bg-purple-700 hover:bg-purple-600'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Creating...' : modalPilotEligibility?.isEligible ? 'Create Procurement Record' : 'Ineligible for Procurement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* STATUS TRANSITION CONFIRMATION MODAL */}
      <Modal
        isOpen={isTransitionModalOpen}
        onClose={() => setIsTransitionModalOpen(false)}
        title={`Advance Procurement Status to "${targetStatus}"`}
        subtitle={`Official determination for ${contract.startupName} (${contract.id})`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            You are about to advance contract <strong>{contract.id}</strong> from <strong>{contract.contractStatus}</strong> to <strong>{targetStatus}</strong>. This statutory action will be registered in the immutable audit registry and dispatches instant notifications to the startup vendor.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sanctioning Official Remarks / Approval Reference
            </label>
            <textarea
              id="textarea-procurement-transition-notes"
              rows={3}
              value={transitionNotes}
              onChange={(e) => setTransitionNotes(e.target.value)}
              className="gov-input text-xs"
              placeholder="e.g. Sanctioned pursuant to Finance Committee resolution..."
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
              id="btn-confirm-procurement-transition"
              type="button"
              onClick={handleConfirmTransition}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md"
            >
              {isSubmitting ? 'Processing...' : `Confirm & Advance to ${targetStatus}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
