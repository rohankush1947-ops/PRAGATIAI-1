import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  ChevronRight,
  PlusCircle,
  MapPin,
  Target,
  DollarSign,
  UserCheck,
  FileText,
  Play,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { PilotProject, PilotLifecycleStatus, PilotKPI } from '../../types';

export const GovPilots: React.FC = () => {
  const { pilots, challenges, startups, createPilotProject, updatePilotStatus, addToast } = usePragati();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPilotId = searchParams.get('pilotId');
  const [selectedPilotId, setSelectedPilotId] = useState<string>(queryPilotId || pilots[0]?.id || '');

  useEffect(() => {
    if (queryPilotId && queryPilotId !== selectedPilotId) {
      setSelectedPilotId(queryPilotId);
    }
  }, [queryPilotId]);

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  // Modal State for Creating a Pilot Project
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChallengeId, setNewChallengeId] = useState(challenges[0]?.id || '');
  const [newStartupId, setNewStartupId] = useState(startups[0]?.id || '');
  const [newDepartment, setNewDepartment] = useState('Public Works Department (PWD)');
  const [newLocation, setNewLocation] = useState('Bengaluru Urban Corridor, Division North');
  const [newObjective, setNewObjective] = useState('Verify edge sensor reliability and automated defect classification accuracy under dense traffic conditions.');
  const [newDuration, setNewDuration] = useState('90 Days');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]);
  const [newOfficer, setNewOfficer] = useState('Er. Rajeshwar Rao, Chief Engineer, PWD');
  const [newOutcomes, setNewOutcomes] = useState('Minimum 90% detection accuracy, ≤ 200ms latency, and 99% operational uptime.');
  const [newBudget, setNewBudget] = useState('₹35,00,000');
  const [newNotes, setNewNotes] = useState('Phase 1 focused on municipal vehicle retrofitting and telemetry synchronization.');
  const [isSubmittingPilot, setIsSubmittingPilot] = useState(false);

  // Status transition notes modal
  const [statusTransitionModal, setStatusTransitionModal] = useState<{
    isOpen: boolean;
    targetStatus: PilotLifecycleStatus;
    title: string;
    notes: string;
  }>({
    isOpen: false,
    targetStatus: 'Approved',
    title: '',
    notes: ''
  });

  const handleSelectPilot = (id: string) => {
    setSelectedPilotId(id);
    setSearchParams({ pilotId: id });
  };

  const handleOpenCreateModal = () => {
    const defaultChal = challenges[0];
    const defaultStartup = startups[0];
    setNewTitle(`${defaultStartup?.name || 'Startup'} Field Pilot`);
    setNewChallengeId(defaultChal?.id || '');
    setNewStartupId(defaultStartup?.id || '');
    setNewDepartment(defaultChal?.department || 'Public Works Department');
    setIsCreateModalOpen(true);
  };

  const handleCreatePilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPilot(true);

    const selectedCh = challenges.find(c => c.id === newChallengeId);
    const selectedSt = startups.find(s => s.id === newStartupId);

    const pilotData: Partial<PilotProject> = {
      title: newTitle || `${selectedSt?.name || 'Startup'} Controlled Pilot`,
      challengeId: newChallengeId,
      challengeTitle: selectedCh?.title || 'Urban Innovation RFP',
      startupId: newStartupId,
      startupName: selectedSt?.name || 'Selected Startup',
      department: newDepartment || selectedCh?.department || 'Public Works Department',
      pilotLocation: newLocation,
      objective: newObjective,
      pilotDuration: newDuration,
      startDate: newStartDate,
      endDate: newEndDate,
      governmentOfficer: newOfficer,
      expectedOutcomes: newOutcomes,
      budget: newBudget,
      notes: newNotes,
      status: 'Planning',
      progressPercent: 0,
      kpis: [
        { name: 'Detection Accuracy', description: 'Accuracy in field operations', baseline: '80%', baselineNum: 80, target: '≥ 90%', actual: '0%', unit: '%', status: 'On Track', targetNum: 90, actualNum: 0, isUserEntered: false },
        { name: 'Inference Latency', description: 'Max edge computation response time', baseline: '500ms', baselineNum: 500, target: '≤ 200ms', actual: '0ms', unit: 'ms', status: 'On Track', targetNum: 200, actualNum: 0, isUserEntered: false },
        { name: 'System Uptime', description: 'Continuous uninterrupted operation', baseline: '95%', baselineNum: 95, target: '≥ 99%', actual: '0%', unit: '%', status: 'On Track', targetNum: 99, actualNum: 0, isUserEntered: false },
        { name: 'Road Coverage', description: 'Corridor coverage percentage', baseline: '50%', baselineNum: 50, target: '≥ 80%', actual: '0%', unit: '%', status: 'On Track', targetNum: 80, actualNum: 0, isUserEntered: false }
      ]
    };

    const created = await createPilotProject(pilotData);
    setIsSubmittingPilot(false);
    setIsCreateModalOpen(false);
    if (created?.id) {
      handleSelectPilot(created.id);
    }
  };

  const handleExecuteStatusChange = async () => {
    if (!activePilot) return;
    await updatePilotStatus(
      activePilot.id,
      statusTransitionModal.targetStatus,
      statusTransitionModal.notes,
      newOfficer
    );
    setStatusTransitionModal(prev => ({ ...prev, isOpen: false }));
  };

  if (!activePilot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-sm">
          Loading pilot data...
        </p>
      </div>
    );
  }

  // Lifecycle steps array
  const lifecycleStages: Array<{ status: PilotLifecycleStatus; label: string; desc: string }> = [
    { status: 'Planning', label: '1. Planning', desc: 'MoU & Scope Definition' },
    { status: 'Approved', label: '2. Approved', desc: 'Sanctioned by Department' },
    { status: 'Active', label: '3. Active Trials', desc: 'Live Field Telemetry' },
    { status: 'Under Evaluation', label: '4. Evaluation', desc: 'Audited Telemetry Review' },
    { status: 'Completed', label: '5. Completed', desc: 'Outcome Validated' }
  ];

  // Helper to determine stage state
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
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <Briefcase className="w-4 h-4 text-sky-600" />
            <span>Structured Field Trials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pilot Project Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track active 60-90 day milestone-based pilot trials under controlled operational conditions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-open-create-pilot"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Pilot Project</span>
          </button>
          <Link
            to={`/government/kpi-monitoring?pilotId=${activePilot.id}`}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Gauge className="w-4 h-4 text-sky-600" />
            <span>Live KPI Telemetry</span>
          </Link>
          <Link
            to={`/government/validation?pilotId=${activePilot.id}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Pilot Validation</span>
          </Link>
        </div>
      </div>

      {/* PILOT SELECTOR TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-sky-700" />
            <span>All Monitored Pilot Projects ({pilots.length})</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Select a pilot to inspect field deliverables</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pilots.map((p) => {
            const isSelected = p.id === activePilot.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPilot(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSelected ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.department || 'Gov Dept'}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate mb-1">
                  {p.title || p.challengeTitle}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-sky-700">{p.startupName}</span>
                  <span className="font-mono font-semibold text-emerald-700">{p.progressPercent}% Progress</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* LIFECYCLE MANAGEMENT BANNER FOR ACTIVE PILOT */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pilot Project Lifecycle Stage
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-lg font-bold text-slate-900">
                Current Status:
              </h3>
              <StatusBadge status={activePilot.status} size="md" />
            </div>
          </div>

          {/* Quick Lifecycle Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {(activePilot.status === 'Planning') && (
              <button
                id="btn-pilot-approve"
                onClick={() => setStatusTransitionModal({
                  isOpen: true,
                  targetStatus: 'Approved',
                  title: 'Approve Pilot Project',
                  notes: 'Official administrative and technical approval sanctioned.'
                })}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Pilot</span>
              </button>
            )}

            {(activePilot.status === 'Approved') && (
              <button
                id="btn-pilot-activate"
                onClick={() => setStatusTransitionModal({
                  isOpen: true,
                  targetStatus: 'Active',
                  title: 'Activate Field Trials',
                  notes: 'Hardware deployed and live telemetry collection sanctioned.'
                })}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Activate Pilot Trials</span>
              </button>
            )}

            {(activePilot.status === 'Active' || activePilot.status === 'In Progress') && (
              <>
                <Link
                  id="link-record-kpi"
                  to={`/government/kpi-monitoring?pilotId=${activePilot.id}`}
                  className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Gauge className="w-3.5 h-3.5 text-sky-700" />
                  <span>Record KPI Telemetry</span>
                </Link>
                <button
                  id="btn-pilot-evaluate"
                  onClick={() => setStatusTransitionModal({
                    isOpen: true,
                    targetStatus: 'Under Evaluation',
                    title: 'Submit for Outcome Evaluation',
                    notes: 'Field test period concluded. Telemetry prepared for statutory validation review.'
                  })}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Submit for Outcome Evaluation</span>
                </button>
              </>
            )}

            {(activePilot.status === 'Under Evaluation' || activePilot.status === 'Under Validation') && (
              <Link
                to={`/government/validation?pilotId=${activePilot.id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Open Outcome Validation Gateway</span>
              </Link>
            )}

            {(activePilot.status === 'Scale Approved' || activePilot.status === 'Validated' || activePilot.status === 'Completed') && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Decision: {activePilot.validationDecision || 'Validated'}</span>
                </span>
                <Link
                  to={`/government/validation?pilotId=${activePilot.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  View Validation Report
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 5-Step Lifecycle Stepper Graphic */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {lifecycleStages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={st.status}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/30'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 text-[10px] flex items-center justify-center text-slate-500">
                      {idx + 1}
                    </span>
                  )}
                  <span className={isCurrent ? 'text-sky-800' : isCompleted ? 'text-emerald-800' : 'text-slate-600'}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE PILOT OVERVIEW CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                {activePilot.department}
              </span>
              <StatusBadge status={activePilot.status} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {activePilot.title || activePilot.challengeTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
              <span>Startup: <strong className="text-sky-700 font-semibold">{activePilot.startupName}</strong></span>
              <span>•</span>
              <span>Pilot Duration: <strong className="text-slate-800">{activePilot.pilotDuration}</strong></span>
              <span>•</span>
              <span>Period: <strong className="text-slate-800">{activePilot.startDate}</strong> to <strong className="text-slate-800">{activePilot.endDate}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-800">{activePilot.pilotLocation || 'Bengaluru Corridor'}</strong></span>
            </div>
          </div>

          <div className="lg:text-right shrink-0">
            <span className="text-xs text-slate-500 block mb-1">Overall Pilot Progress</span>
            <div className="text-3xl font-black text-sky-600 font-mono">
              {activePilot.progressPercent}%
            </div>
            <span className="text-[11px] text-slate-500">
              {activePilot.status === 'Planning' ? 'MoU Finalization' : activePilot.status === 'Approved' ? 'Site Mobilization' : activePilot.status === 'Active' ? 'Field Trials Running' : 'Telemetry Evaluated'}
            </span>
          </div>
        </div>

        {/* Pilot Key Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block text-[11px]">Primary Objective</span>
            <p className="text-slate-800 font-medium mt-0.5">{activePilot.objective || 'Operational verification of deep-tech prototype under municipal conditions.'}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium block text-[11px]">Supervising Officer</span>
            <p className="text-slate-800 font-medium mt-0.5">{activePilot.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD'}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium block text-[11px]">Approved Sanction Budget</span>
            <p className="text-sky-700 font-bold mt-0.5">{activePilot.budget || '₹35,00,000'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={activePilot.progressPercent}
          color="sky"
          size="lg"
          label="Field Deployment & Validation Completion"
        />

        {/* KPI TELEMETRY SUMMARY FOR THIS PILOT */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-600" />
              <span>Pilot Contract KPIs (Target vs Actual)</span>
            </h3>
            <Link
              to={`/government/kpi-monitoring?pilotId=${activePilot.id}`}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Manage & Record Measurements</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activePilot.kpis.map((kpi, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-slate-800 truncate">{kpi.name}</span>
                    <StatusBadge status={kpi.status} size="sm" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-mono text-slate-900">{kpi.actual}</span>
                    <span className="text-xs text-slate-500 font-mono">/ {kpi.target}</span>
                  </div>
                  {kpi.baseline && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Baseline: {kpi.baseline}
                    </span>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Unit: {kpi.unit}</span>
                  {kpi.isUserEntered ? (
                    <span className="text-sky-700 font-medium">Audited Entry</span>
                  ) : (
                    <span className="text-slate-400">RFP Benchmark</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6-STEP PILOT TIMELINE */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
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
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isInProgress
                      ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/30'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Step 0{idx + 1}
                      </span>
                      <StatusBadge status={m.status} size="sm" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {m.deliverables}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {m.date}
                    </span>
                    {isCompleted && <span className="text-emerald-700 font-semibold">✓ Verified</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-500 block mb-1">Hardware Units Deployed</span>
          <div className="text-2xl font-bold text-slate-900">12 Edge Cameras</div>
          <p className="text-[11px] text-slate-500 mt-1">Mounted on PWD Bolero patrol fleet</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-500 block mb-1">Road Network Monitored</span>
          <div className="text-2xl font-bold text-sky-700">520 Kilometers</div>
          <p className="text-[11px] text-slate-500 mt-1">Bengaluru North Division corridor</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-slate-500 block mb-1">Defect Verification Rate</span>
          <div className="text-2xl font-bold text-emerald-700">94.2% Accurate</div>
          <p className="text-[11px] text-slate-500 mt-1">1,480 potholes audited with GPS tagging</p>
        </div>
      </div>

      {/* CREATE PILOT PROJECT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Pilot Project"
        subtitle="Sanction controlled milestone-based field trial for selected startup"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePilotSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilot Project Title *</label>
              <input
                id="input-pilot-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. RoadVision AI Municipal Pothole Monitoring Pilot"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Government Department *</label>
              <input
                type="text"
                required
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. Public Works Department"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Challenge *</label>
              <select
                value={newChallengeId}
                onChange={(e) => {
                  setNewChallengeId(e.target.value);
                  const ch = challenges.find(c => c.id === e.target.value);
                  if (ch) setNewDepartment(ch.department);
                }}
                className="gov-input text-xs"
              >
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Selected Startup *</label>
              <select
                value={newStartupId}
                onChange={(e) => {
                  setNewStartupId(e.target.value);
                  const st = startups.find(s => s.id === e.target.value);
                  if (st) setNewTitle(`${st.name} Field Trial Pilot`);
                }}
                className="gov-input text-xs"
              >
                {startups.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.domain})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilot Location *</label>
              <input
                type="text"
                required
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. Bengaluru Urban Division, Ring Road Corridor"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilot Duration & Budget</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="gov-input text-xs"
                  placeholder="e.g. 90 Days"
                />
                <input
                  type="text"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="gov-input text-xs"
                  placeholder="e.g. ₹35,00,000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="gov-input text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="gov-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Government Officer Overseeing Pilot *</label>
            <input
              type="text"
              required
              value={newOfficer}
              onChange={(e) => setNewOfficer(e.target.value)}
              className="gov-input text-xs"
              placeholder="e.g. Er. Rajeshwar Rao, Chief Engineer, PWD"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Objective & Field Scope</label>
            <textarea
              rows={2}
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="gov-input text-xs"
              placeholder="Primary trial objective..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expected Outcomes & Targets</label>
            <textarea
              rows={2}
              value={newOutcomes}
              onChange={(e) => setNewOutcomes(e.target.value)}
              className="gov-input text-xs"
              placeholder="Verified KPI benchmarks..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Operational Notes / Special Conditions</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="gov-input text-xs"
              placeholder="Special equipment, telemetry requirements..."
            />
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-sky-800 text-[11px]">
            <strong>Automatic Lifecycle Initialization:</strong> This project will be placed in the <strong>Planning</strong> stage with standard GFR-compliant 4 core KPIs. You can approve and activate it once site agreements are signed.
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              id="btn-submit-create-pilot"
              type="submit"
              disabled={isSubmittingPilot}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmittingPilot ? 'Creating...' : 'Create Pilot Project'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* LIFECYCLE TRANSITION MODAL */}
      <Modal
        isOpen={statusTransitionModal.isOpen}
        onClose={() => setStatusTransitionModal(prev => ({ ...prev, isOpen: false }))}
        title={statusTransitionModal.title}
        subtitle={`Confirm transition of ${activePilot.startupName}'s pilot to ${statusTransitionModal.targetStatus}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            You are about to update the pilot lifecycle status to <strong>{statusTransitionModal.targetStatus}</strong>.
            This action will be permanently recorded in the immutable government audit trail and notify the startup founder.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Transition Remarks</label>
            <textarea
              rows={3}
              value={statusTransitionModal.notes}
              onChange={(e) => setStatusTransitionModal(prev => ({ ...prev, notes: e.target.value }))}
              className="gov-input text-xs"
              placeholder="Provide reason or operational details for this status change..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              onClick={() => setStatusTransitionModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-lifecycle-transition"
              onClick={handleExecuteStatusChange}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
            >
              Confirm Transition
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
