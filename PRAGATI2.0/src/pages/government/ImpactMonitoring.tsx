import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Activity, 
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
  TrendingUp,
  BarChart3,
  Scale,
  Calendar,
  Filter,
  Check,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { 
  ImpactRecord, 
  ImpactCategory, 
  ImpactVerificationStatus, 
  ScaleUpPlan as IScaleUpPlan 
} from '../../types';
import { calculateImpactMetrics } from '../../data/mockData';

const IMPACT_CATEGORIES: ImpactCategory[] = [
  'Cost Savings',
  'Time Savings',
  'Service Delivery',
  'Citizen Reach',
  'Operational Efficiency',
  'Environmental Impact',
  'Accessibility',
  'Revenue/Financial Impact',
  'Other'
];

const CATEGORY_COLORS: Record<string, string> = {
  'Cost Savings': '#10B981',
  'Time Savings': '#3B82F6',
  'Service Delivery': '#8B5CF6',
  'Citizen Reach': '#F59E0B',
  'Operational Efficiency': '#06B6D4',
  'Environmental Impact': '#84CC16',
  'Accessibility': '#EC4899',
  'Revenue/Financial Impact': '#6366F1',
  'Other': '#64748B'
};

export const ImpactMonitoring: React.FC = () => {
  const { 
    impactRecords,
    scaleUpPlans,
    scaleUpPlan: activeScaleUp,
    procurementContracts,
    pilots,
    applications,
    challenges,
    evaluations,
    currentRole,
    createImpactRecord,
    updateImpactRecord,
    submitImpactReport,
    verifyImpactReport,
    rejectImpactReport,
    addToast
  } = usePragati();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryScaleUpId = searchParams.get('scaleUpId') || searchParams.get('planId');

  const allScaleUps = scaleUpPlans && scaleUpPlans.length > 0 ? scaleUpPlans : (activeScaleUp ? [activeScaleUp] : []);
  const [selectedScaleUpId, setSelectedScaleUpId] = useState<string>(
    queryScaleUpId || allScaleUps[0]?.id || ''
  );

  const selectedScaleUp: IScaleUpPlan | undefined = useMemo(() => {
    return allScaleUps.find(p => p.id === selectedScaleUpId) || allScaleUps[0];
  }, [allScaleUps, selectedScaleUpId]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedRecordForAction, setSelectedRecordForAction] = useState<ImpactRecord | null>(null);

  // Verification form state
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('Er. Rajeshwar Rao, Chief Engineer, PWD');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Submit telemetry form state
  const [submitCurrentValue, setSubmitCurrentValue] = useState<string>('');
  const [submitEvidence, setSubmitEvidence] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitPeriod, setSubmitPeriod] = useState('Q2 2027');

  // Create metric form state
  const [formData, setFormData] = useState({
    metricName: '',
    impactCategory: 'Time Savings' as ImpactCategory,
    reportingPeriod: 'Q1 2027',
    baselineValue: '14',
    currentValue: '2.5',
    targetValue: '2.0',
    unit: 'Days',
    beneficiaryCount: '1500000',
    geographicCoverage: 'Karnataka State Highway Corridors 1-5',
    implementationStatus: 'On Track' as 'On Track' | 'Ahead' | 'Delayed' | 'Critical',
    evidence: 'PWD Works Division automated SMS/GIS dispatch audit logs & contractor job sign-offs',
    notes: 'Direct municipal potholes inspection turnaround reduction.',
    isPreVerified: false
  });

  // Statutory 6-Point Eligibility Check for current Scale-Up
  const eligibility = useMemo(() => {
    if (!selectedScaleUp) {
      return {
        isEligible: false,
        reason: 'Impact Monitoring unavailable: No Scale-Up plan selected.',
        checks: {
          isGovtSelected: false,
          hasPilot: false,
          isPilotCompleted: false,
          isValidationCompleted: false,
          isDecisionScale: false,
          hasProcurement: false,
          isProcurementApprovedOrActive: false,
          isScaleUpApprovedOrActive: false
        }
      };
    }

    // 1. Govt selected startup
    const app = applications.find(a => 
      a.startupId === selectedScaleUp.startupId || 
      (a.challengeId === selectedScaleUp.challengeId && a.startupName === selectedScaleUp.startupName)
    );
    const isGovtSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

    // 2. Pilot exists & completed
    const pilot = pilots.find(p => p.id === selectedScaleUp.pilotId || p.startupName === selectedScaleUp.startupName);
    const hasPilot = Boolean(pilot);
    const isPilotCompleted = pilot && (
      ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
      (pilot.status === 'In Progress' && Boolean(pilot.validationDecision))
    );

    // 3. Outcome validation completed
    const isValidationCompleted = pilot && (Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated');

    // 4. Outcome validation decision = "Scale"
    const isDecisionScale = pilot && (pilot.validationDecision === 'Scale');

    // 5. Procurement contract approved/active
    const contract = procurementContracts.find(c => 
      c.id === selectedScaleUp.procurementId || 
      c.startupId === selectedScaleUp.startupId || 
      c.startupName === selectedScaleUp.startupName
    );
    const hasProcurement = Boolean(contract);
    const isProcurementApprovedOrActive = contract && ['Approved', 'Active', 'Completed'].includes(contract.contractStatus);

    // 6. Scale-Up plan approved or active
    const isScaleUpApprovedOrActive = ['Approved', 'Active', 'Completed'].includes(selectedScaleUp.status);

    const isEligible = Boolean(
      isGovtSelected &&
      hasPilot &&
      isPilotCompleted &&
      isValidationCompleted &&
      isDecisionScale &&
      hasProcurement &&
      isProcurementApprovedOrActive &&
      isScaleUpApprovedOrActive
    );

    let reason = '';
    if (!isGovtSelected) reason = 'Impact Monitoring unavailable: Startup must be selected by Government first.';
    else if (!hasPilot) reason = 'Impact Monitoring unavailable: Controlled Pilot project does not exist.';
    else if (!isPilotCompleted) reason = 'Impact Monitoring unavailable: Pilot project has not reached completed/evaluated status.';
    else if (!isValidationCompleted) reason = 'Impact Monitoring unavailable: KPI & Outcome Validation must be completed first.';
    else if (!isDecisionScale) reason = 'Impact Monitoring unavailable: Outcome Validation must approve scaling first (decision was not "Scale").';
    else if (!hasProcurement || !isProcurementApprovedOrActive) reason = 'Impact Monitoring unavailable: Procurement Contract must be Approved or Active.';
    else if (!isScaleUpApprovedOrActive) reason = `Impact Monitoring unavailable: Scale-Up plan must be Approved or Active (current status: ${selectedScaleUp.status}).`;

    return {
      isEligible,
      reason,
      pilot,
      contract,
      app,
      checks: {
        isGovtSelected: Boolean(isGovtSelected),
        hasPilot: Boolean(hasPilot),
        isPilotCompleted: Boolean(isPilotCompleted),
        isValidationCompleted: Boolean(isValidationCompleted),
        isDecisionScale: Boolean(isDecisionScale),
        hasProcurement: Boolean(hasProcurement),
        isProcurementApprovedOrActive: Boolean(isProcurementApprovedOrActive),
        isScaleUpApprovedOrActive: Boolean(isScaleUpApprovedOrActive)
      }
    };
  }, [selectedScaleUp, applications, pilots, procurementContracts]);

  // Records for selected scale up
  const scaleUpRecords = useMemo(() => {
    if (!selectedScaleUp) return [];
    return impactRecords.filter(r => 
      r.scaleUpPlanId === selectedScaleUp.id || 
      r.startupId === selectedScaleUp.startupId
    );
  }, [impactRecords, selectedScaleUp]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return scaleUpRecords.filter(r => {
      const matchCat = categoryFilter === 'All' || r.impactCategory === categoryFilter;
      const matchStatus = statusFilter === 'All' || r.verificationStatus === statusFilter;
      return matchCat && matchStatus;
    });
  }, [scaleUpRecords, categoryFilter, statusFilter]);

  // Aggregated Telemetry KPI Metrics
  const stats = useMemo(() => {
    const verified = scaleUpRecords.filter(r => r.verificationStatus === 'Verified');
    const pending = scaleUpRecords.filter(r => r.verificationStatus === 'Pending Verification');
    const totalBeneficiaries = scaleUpRecords.reduce((sum, r) => sum + (Number(r.beneficiaryCount) || 0), 0);

    const achievements = scaleUpRecords.map(r => {
      const c = calculateImpactMetrics(r.baselineValue, r.currentValue, r.targetValue);
      return c.targetAchievement;
    });
    const avgAchievement = achievements.length > 0
      ? Number((achievements.reduce((a, b) => a + b, 0) / achievements.length).toFixed(1))
      : 0;

    const costSavings = scaleUpRecords
      .filter(r => r.impactCategory === 'Cost Savings')
      .reduce((sum, r) => sum + Number(r.currentValue || 0), 0);

    const timeSavings = scaleUpRecords
      .filter(r => r.impactCategory === 'Time Savings')
      .reduce((sum, r) => {
        const diff = Number(r.baselineValue) - Number(r.currentValue);
        return sum + (diff > 0 ? diff : 0);
      }, 0);

    return {
      total: scaleUpRecords.length,
      verifiedCount: verified.length,
      pendingCount: pending.length,
      totalBeneficiaries,
      avgAchievement,
      costSavings,
      timeSavings: Number(timeSavings.toFixed(1))
    };
  }, [scaleUpRecords]);

  // Chart data: Baseline vs Current vs Target Comparison
  const comparisonChartData = useMemo(() => {
    return scaleUpRecords.slice(0, 6).map(r => {
      const calc = calculateImpactMetrics(r.baselineValue, r.currentValue, r.targetValue);
      return {
        name: r.metricName.length > 18 ? r.metricName.substring(0, 16) + '...' : r.metricName,
        fullName: r.metricName,
        Baseline: Number(r.baselineValue),
        Current: Number(r.currentValue),
        Target: Number(r.targetValue),
        unit: r.unit,
        achievement: calc.targetAchievement
      };
    });
  }, [scaleUpRecords]);

  // Chart data: Category Distribution
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    scaleUpRecords.forEach(r => {
      counts[r.impactCategory] = (counts[r.impactCategory] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [scaleUpRecords]);

  // Live preview for Create Metric modal
  const liveCreateCalc = useMemo(() => {
    return calculateImpactMetrics(
      Number(formData.baselineValue || 0),
      Number(formData.currentValue || formData.baselineValue || 0),
      Number(formData.targetValue || 0)
    );
  }, [formData.baselineValue, formData.currentValue, formData.targetValue]);

  // Traceability 10-node data
  const lineage = useMemo(() => {
    if (!selectedScaleUp) return null;
    const challenge = challenges.find(c => c.id === selectedScaleUp.challengeId) || challenges[0];
    const app = applications.find(a => a.startupId === selectedScaleUp.startupId) || applications[0];
    const evalItem = evaluations.find(e => e.applicationId === app?.id) || evaluations[0];
    const pilot = pilots.find(p => p.id === selectedScaleUp.pilotId || p.startupName === selectedScaleUp.startupName) || pilots[0];
    const contract = procurementContracts.find(c => c.id === selectedScaleUp.procurementId || c.startupId === selectedScaleUp.startupId) || procurementContracts[0];

    return {
      challenge,
      app,
      evalItem,
      pilot,
      contract,
      scaleUp: selectedScaleUp
    };
  }, [selectedScaleUp, challenges, applications, evaluations, pilots, procurementContracts]);

  // Handlers
  const handleOpenVerifyModal = (record: ImpactRecord) => {
    setSelectedRecordForAction(record);
    setVerifyNotes(`Verified against Karnataka PWD field inspection telemetry and public monitoring dashboard. Target achievement: ${record.targetAchievement}%.`);
    setIsVerifyModalOpen(true);
  };

  const handleConfirmVerify = async () => {
    if (!selectedRecordForAction) return;
    setIsSubmittingAction(true);
    try {
      await verifyImpactReport(selectedRecordForAction.id, {
        verifiedBy,
        verificationNotes: verifyNotes
      });
      setIsVerifyModalOpen(false);
      setSelectedRecordForAction(null);
    } catch (err: any) {
      addToast('error', 'Verification Failed', err.message || 'Could not verify impact report.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleOpenSubmitModal = (record: ImpactRecord) => {
    setSelectedRecordForAction(record);
    setSubmitCurrentValue(String(record.currentValue));
    setSubmitEvidence(record.evidence || '');
    setSubmitNotes(record.notes || '');
    setSubmitPeriod(record.reportingPeriod || 'Q2 2027');
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedRecordForAction) return;
    if (isNaN(Number(submitCurrentValue))) {
      addToast('error', 'Invalid Value', 'Please enter a valid numeric value for current telemetry.');
      return;
    }
    setIsSubmittingAction(true);
    try {
      await submitImpactReport(selectedRecordForAction.id, {
        currentValue: Number(submitCurrentValue),
        evidence: submitEvidence,
        notes: submitNotes,
        reportingPeriod: submitPeriod,
        reportedBy: currentRole === 'startup' ? `${selectedScaleUp?.startupName || 'Startup'} Founder` : 'Field Officer'
      });
      setIsSubmitModalOpen(false);
      setSelectedRecordForAction(null);
    } catch (err: any) {
      addToast('error', 'Submission Failed', err.message || 'Could not submit impact reporting data.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleCreateMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScaleUp) return;
    if (!formData.metricName.trim()) {
      addToast('error', 'Required Field', 'Please enter a descriptive metric name.');
      return;
    }
    if (isNaN(Number(formData.baselineValue)) || isNaN(Number(formData.targetValue))) {
      addToast('error', 'Invalid Value', 'Baseline and Target values must be numeric.');
      return;
    }

    setIsSubmittingAction(true);
    try {
      await createImpactRecord({
        scaleUpPlanId: selectedScaleUp.id,
        metricName: formData.metricName.trim(),
        impactCategory: formData.impactCategory,
        reportingPeriod: formData.reportingPeriod,
        baselineValue: Number(formData.baselineValue),
        currentValue: Number(formData.currentValue !== '' ? formData.currentValue : formData.baselineValue),
        targetValue: Number(formData.targetValue),
        unit: formData.unit,
        beneficiaryCount: Number(formData.beneficiaryCount) || 0,
        geographicCoverage: formData.geographicCoverage,
        implementationStatus: formData.implementationStatus,
        evidence: formData.evidence,
        notes: formData.notes,
        reportedBy: currentRole === 'startup' ? `${selectedScaleUp.startupName} Founder` : 'Government Officer'
      });
      setIsCreateModalOpen(false);
      setFormData({
        metricName: '',
        impactCategory: 'Time Savings',
        reportingPeriod: 'Q1 2027',
        baselineValue: '0',
        currentValue: '0',
        targetValue: '100',
        unit: '%',
        beneficiaryCount: '500000',
        geographicCoverage: 'Karnataka State Highways',
        implementationStatus: 'On Track',
        evidence: '',
        notes: '',
        isPreVerified: false
      });
    } catch (err: any) {
      addToast('error', 'Registration Blocked', err.message || 'Could not register impact metric.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Activity className="w-3.5 h-3.5" />
                Post-Scale Commercial Expansion
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Stage 10 of 10
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              Impact Monitoring & Beneficiary Analytics
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Verifiable post-procurement impact tracking, real-time citizen beneficiary telemetry, 
              and measurable <strong className="text-slate-800">Baseline vs. Current vs. Target</strong> performance evaluation under statutory human governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'government' && (
              <button
                id="btn-open-create-impact"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!eligibility.isEligible}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  eligibility.isEligible
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
                title={!eligibility.isEligible ? eligibility.reason : 'Register new impact metric'}
              >
                <PlusCircle className="w-4 h-4" />
                Register Impact Metric
              </button>
            )}

            {currentRole === 'startup' && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Building2 className="w-4 h-4" />
                Startup Founder Telemetry Portal
              </div>
            )}

            {currentRole === 'expert' && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Award className="w-4 h-4" />
                Evaluator Observer (Read-Only)
              </div>
            )}
          </div>
        </div>

        {/* Multi-ScaleUp Plan Selector Tabs */}
        {allScaleUps.length > 1 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
              Active Scale-Ups:
            </span>
            {allScaleUps.map(p => (
              <button
                key={p.id}
                id={`tab-impact-plan-${p.id}`}
                onClick={() => {
                  setSelectedScaleUpId(p.id);
                  setSearchParams({ scaleUpId: p.id });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedScaleUp?.id === p.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.startupName} ({p.title?.substring(0, 28) || 'Scale-Up'}...)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Statutory 6-Point Eligibility Gatekeeper Banner */}
      {!eligibility.isEligible ? (
        <div id="card-impact-ineligible-warning" className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-red-900">
                Impact Monitoring Creation Blocked: Statutory Prerequisites Incomplete
              </h3>
              <p className="text-xs text-red-800 leading-relaxed">
                {eligibility.reason}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.isGovtSelected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.isGovtSelected ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  1. Govt Selected Startup
                </div>
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.hasPilot && eligibility.checks.isPilotCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.hasPilot && eligibility.checks.isPilotCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  2. Pilot Completed
                </div>
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.isValidationCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.isValidationCompleted ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  3. Validation Completed
                </div>
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.isDecisionScale ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.isDecisionScale ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  4. Decision = "Scale"
                </div>
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.isProcurementApprovedOrActive ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.isProcurementApprovedOrActive ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  5. Procurement Active
                </div>
                <div className={`p-2 rounded border text-xs flex items-center gap-1.5 ${eligibility.checks.isScaleUpApprovedOrActive ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-100 border-red-200 text-red-800 font-semibold'}`}>
                  {eligibility.checks.isScaleUpApprovedOrActive ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-red-600" />}
                  6. Scale-Up Approved/Active
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Statutory Compliance Verified:</strong> {selectedScaleUp?.title} has passed all 6 prerequisites (Pilot Validated &rarr; Decision "Scale" &rarr; GFR 173 Procurement &rarr; Scale-Up Approved).
            </span>
          </div>
          <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
            Statutory Gatekeeper: PASS
          </span>
        </div>
      )}

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Beneficiaries Reached */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Citizen Reach
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span id="stat-impact-beneficiaries" className="text-2xl font-bold text-slate-900 tracking-tight">
              {(stats.totalBeneficiaries / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-600 font-medium">Citizens Reached</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Verified statewide highway commuters
          </p>
        </div>

        {/* Card 2: Average Target Achievement */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Target Fulfillment
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span id="stat-impact-achievement" className="text-2xl font-bold text-indigo-600 tracking-tight">
              {stats.avgAchievement}%
            </span>
            <span className="text-xs text-slate-600 font-medium">Avg Achievement</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, stats.avgAchievement)}%` }} 
            />
          </div>
        </div>

        {/* Card 3: Verified Impact Records */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Verification Status
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span id="stat-impact-verified-count" className="text-2xl font-bold text-slate-900 tracking-tight">
              {stats.verifiedCount} / {stats.total}
            </span>
            <span className="text-xs text-slate-600 font-medium">Verified by Govt</span>
          </div>
          <p className="mt-1 text-xs text-amber-700 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {stats.pendingCount} record(s) pending official sign-off
          </p>
        </div>

        {/* Card 4: Quantified Fiscal / Operational Savings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Quantified Savings
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span id="stat-impact-savings" className="text-2xl font-bold text-slate-900 tracking-tight">
              ₹{stats.costSavings.toFixed(1)}L
            </span>
            <span className="text-xs text-slate-600 font-medium">Expenditure Saved</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">
            + {stats.timeSavings} Days average turnaround saved
          </p>
        </div>
      </div>

      {/* Interactive Trend Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Measurable Baseline vs Current vs Target Comparison */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Measurable Impact: Baseline vs. Current Actual vs. Target
              </h2>
              <p className="text-xs text-slate-600">
                Direct comparative performance across statutory deployment KPIs.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              Telemetry Grid
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {comparisonChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-100">{data.fullName}</p>
                            <p className="text-slate-300">Baseline: <span className="font-semibold text-slate-100">{data.Baseline} {data.unit}</span></p>
                            <p className="text-emerald-400">Current Actual: <span className="font-semibold">{data.Current} {data.unit}</span></p>
                            <p className="text-indigo-300">Statutory Target: <span className="font-semibold">{data.Target} {data.unit}</span></p>
                            <p className="pt-1 text-[11px] border-t border-slate-700 text-slate-400">
                              Target Achievement: <span className="text-amber-300 font-bold">{data.achievement}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar dataKey="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Target" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-600">
                No telemetry data available for this Scale-Up.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Impact by Domain
            </h2>
            <span className="text-xs text-slate-600 font-medium">
              {scaleUpRecords.length} Metrics
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Categorical distribution of monitored citizen and fiscal outcomes.
          </p>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name] || '#64748B'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: 8, color: '#fff', fontSize: 12 }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-600">No records to chart.</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600">
            {categoryChartData.slice(0, 4).map(c => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[c.name] || '#64748B' }} />
                <span className="truncate">{c.name}</span>
                <span className="font-semibold text-slate-700 ml-auto">({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Metric Records Management Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Impact Metrics & Verification Ledger
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Measurable comparative telemetry with official human verification status.
            </p>
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              {IMPACT_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Flagged">Flagged / Rejected</option>
            </select>
          </div>
        </div>

        {/* Impact Records Cards */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
            <Activity className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">No Impact Metrics Found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {categoryFilter !== 'All' || statusFilter !== 'All'
                ? 'No metrics match the selected filter criteria. Try resetting the filters.'
                : 'No impact monitoring metrics registered yet for this Scale-Up plan.'}
            </p>
            {currentRole === 'government' && eligibility.isEligible && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Register First Metric
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const calc = calculateImpactMetrics(record.baselineValue, record.currentValue, record.targetValue);
              const isPositiveChange = calc.absoluteChange >= 0;
              const isReductionMetric = record.targetValue < record.baselineValue;

              return (
                <div 
                  key={record.id}
                  id={`card-impact-metric-${record.id}`}
                  className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all bg-slate-50/50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                          style={{ backgroundColor: CATEGORY_COLORS[record.impactCategory] || '#475569' }}
                        >
                          {record.impactCategory}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          Period: {record.reportingPeriod}
                        </span>
                        <span className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {record.geographicCoverage}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {record.metricName}
                      </h3>
                      {record.notes && (
                        <p className="text-xs text-slate-600 italic">
                          "{record.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        record.verificationStatus === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : record.verificationStatus === 'Pending Verification'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {record.verificationStatus === 'Verified' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : record.verificationStatus === 'Pending Verification' ? (
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        )}
                        {record.verificationStatus}
                      </span>
                    </div>
                  </div>

                  {/* Core 3-Column Comparative Measurement Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white rounded-lg border border-slate-200">
                    {/* Baseline */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Baseline Value
                      </span>
                      <div className="text-lg font-bold text-slate-700">
                        {record.baselineValue} <span className="text-xs font-normal text-slate-600">{record.unit}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 block">Pre-Scale Benchmark</span>
                    </div>

                    {/* Current Actual */}
                    <div className="space-y-1 md:border-l md:border-slate-100 md:pl-3">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Current Telemetry
                      </span>
                      <div className="text-xl font-bold text-emerald-600">
                        {record.currentValue} <span className="text-xs font-normal text-slate-600">{record.unit}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className={`font-bold ${isPositiveChange ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {calc.absoluteChange > 0 ? `+${calc.absoluteChange}` : calc.absoluteChange} {record.unit}
                        </span>
                        <span className="text-slate-600 text-[11px]">
                          ({calc.percentageChange > 0 ? `+${calc.percentageChange}` : calc.percentageChange}%)
                        </span>
                      </div>
                    </div>

                    {/* Target */}
                    <div className="space-y-1 md:border-l md:border-slate-100 md:pl-3">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                        Statutory Target
                      </span>
                      <div className="text-lg font-bold text-indigo-700">
                        {record.targetValue} <span className="text-xs font-normal text-slate-600">{record.unit}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 block">
                        {isReductionMetric ? 'Lower is better' : 'Target goal'}
                      </span>
                    </div>

                    {/* Target Achievement % */}
                    <div className="space-y-1.5 md:border-l md:border-slate-100 md:pl-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Achievement
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {calc.targetAchievement}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            calc.targetAchievement >= 100 
                              ? 'bg-emerald-500' 
                              : calc.targetAchievement >= 70 
                              ? 'bg-indigo-500' 
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, calc.targetAchievement)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-600 block">
                        Beneficiaries: <strong className="text-slate-700">{Number(record.beneficiaryCount || 0).toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Evidence & Verification Metadata Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-slate-600">
                    <div className="space-y-0.5">
                      <p>
                        <strong>Reported By:</strong> {record.reportedBy} on {record.createdAt}
                      </p>
                      {record.verifiedBy && (
                        <p className="text-emerald-700 font-medium">
                          <strong>Verified By:</strong> {record.verifiedBy} ({record.verifiedAt}) — {record.verificationNotes}
                        </p>
                      )}
                      {record.evidence && (
                        <p className="text-slate-600 truncate max-w-xl">
                          <strong>Audit Evidence:</strong> {record.evidence}
                        </p>
                      )}
                    </div>

                    {/* Role-Based Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Government Official Actions */}
                      {currentRole === 'government' && (
                        <>
                          {record.verificationStatus !== 'Verified' && (
                            <button
                              id={`btn-verify-impact-${record.id}`}
                              onClick={() => handleOpenVerifyModal(record)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verify Telemetry
                            </button>
                          )}
                          <button
                            id={`btn-update-telemetry-${record.id}`}
                            onClick={() => handleOpenSubmitModal(record)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                          >
                            Enter Period Result
                          </button>
                        </>
                      )}

                      {/* Startup Founder Actions */}
                      {currentRole === 'startup' && (
                        <button
                          id={`btn-submit-telemetry-${record.id}`}
                          onClick={() => handleOpenSubmitModal(record)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          Submit Period Telemetry
                        </button>
                      )}

                      {/* Expert Evaluator Actions */}
                      {currentRole === 'expert' && (
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                          Audited Record
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Complete 10-Node Statutory Lineage Traceability Section */}
      {lineage && (
        <div id="section-impact-traceability" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Unbroken Statutory Traceability Lineage (10 Stages)
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete audit breadcrumb connecting Initial Problem Challenge to Post-Scale Impact Verification.
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
              Chain of Custody: Complete
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 text-center text-xs">
            {/* Node 1: Challenge */}
            <Link 
              to="/government/challenges"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">1. Challenge</div>
              <div className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {lineage.challenge?.title || 'Road Distress'}
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Published</span>
            </Link>

            {/* Node 2: Startup Application */}
            <Link 
              to="/government/applications"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">2. Application</div>
              <div className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {lineage.app?.startupName || 'RoadVision AI'}
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Submitted</span>
            </Link>

            {/* Node 3: Expert Evaluation */}
            <Link 
              to="/expert/dashboard"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">3. Expert Eval</div>
              <div className="font-semibold text-slate-800 text-[11px]">
                {lineage.evalItem?.scores ? (lineage.evalItem.scores.technicalCapability + lineage.evalItem.scores.innovation + lineage.evalItem.scores.scalability + lineage.evalItem.scores.costEffectiveness + lineage.evalItem.scores.impact) : 91}/100 Pts
              </div>
              <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-medium">Approved</span>
            </Link>

            {/* Node 4: Government Selection */}
            <Link 
              to="/government/applications"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">4. Gov Selection</div>
              <div className="font-semibold text-slate-800 text-[11px]">Sanctioned</div>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">Pilot Award</span>
            </Link>

            {/* Node 5: Pilot Project */}
            <Link 
              to="/government/pilots"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">5. Pilot</div>
              <div className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {lineage.pilot?.title || 'Road Pilot'}
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Completed</span>
            </Link>

            {/* Node 6: KPI Monitoring */}
            <Link 
              to="/government/kpi-monitoring"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">6. KPI Telemetry</div>
              <div className="font-semibold text-slate-800 text-[11px]">4 / 4 Tracked</div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Targets Met</span>
            </Link>

            {/* Node 7: Outcome Validation */}
            <Link 
              to="/government/validation"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">7. Validation</div>
              <div className="font-semibold text-slate-800 text-[11px]">Score 94%</div>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">Scale</span>
            </Link>

            {/* Node 8: Procurement */}
            <Link 
              to="/government/procurement"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">8. Procurement</div>
              <div className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {lineage.contract?.referenceId || 'REF-GFR173'}
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Active</span>
            </Link>

            {/* Node 9: Scale-Up */}
            <Link 
              to="/government/scale-up"
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex flex-col items-center justify-between h-24"
            >
              <div className="text-[10px] font-bold text-slate-600 uppercase">9. Scale-Up</div>
              <div className="font-semibold text-slate-800 text-[11px] truncate w-full">
                {lineage.scaleUp?.title?.substring(0, 16) || 'Rollout'}...
              </div>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">Active</span>
            </Link>

            {/* Node 10: Impact Monitoring (Current) */}
            <div className="p-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50/50 flex flex-col items-center justify-between h-24">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">10. Impact</div>
              <div className="font-bold text-emerald-900 text-[11px]">
                {stats.totalBeneficiaries > 0 ? `${(stats.totalBeneficiaries / 1000000).toFixed(1)}M Reach` : 'Live'}
              </div>
              <span className="text-[10px] text-white bg-emerald-600 px-1.5 py-0.5 rounded font-bold">Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Create Impact Metric (Government Only) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Impact Monitoring Metric"
      >
        <form onSubmit={handleCreateMetric} className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
            <strong>Target Solution:</strong> {selectedScaleUp?.startupName} — {selectedScaleUp?.title}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Metric Name *
            </label>
            <input
              id="input-impact-metric-name"
              type="text"
              required
              value={formData.metricName}
              onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
              placeholder="e.g. Cumulative Manual Inspection Expenditure Saved"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Impact Category *
              </label>
              <select
                id="select-impact-category"
                value={formData.impactCategory}
                onChange={(e) => setFormData({ ...formData, impactCategory: e.target.value as ImpactCategory })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {IMPACT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporting Period *
              </label>
              <input
                id="input-impact-period"
                type="text"
                required
                value={formData.reportingPeriod}
                onChange={(e) => setFormData({ ...formData, reportingPeriod: e.target.value })}
                placeholder="e.g. Q1 2027, Month 6"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Baseline *
              </label>
              <input
                id="input-impact-baseline"
                type="number"
                step="any"
                required
                value={formData.baselineValue}
                onChange={(e) => setFormData({ ...formData, baselineValue: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Actual
              </label>
              <input
                id="input-impact-current"
                type="number"
                step="any"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target *
              </label>
              <input
                id="input-impact-target"
                type="number"
                step="any"
                required
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit *
              </label>
              <input
                id="input-impact-unit"
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Days, %, Lakhs"
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Live Calculations Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
            <span className="font-bold text-slate-700 block">Live Calculated Projection:</span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <span className="text-slate-600 block text-[11px]">Absolute Change</span>
                <span className="font-bold text-slate-800">{liveCreateCalc.absoluteChange} {formData.unit}</span>
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">% Change</span>
                <span className="font-bold text-slate-800">{liveCreateCalc.percentageChange}%</span>
              </div>
              <div>
                <span className="text-slate-600 block text-[11px]">Target Achievement</span>
                <span className="font-bold text-emerald-600">{liveCreateCalc.targetAchievement}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Beneficiaries Count
              </label>
              <input
                id="input-impact-beneficiaries"
                type="number"
                value={formData.beneficiaryCount}
                onChange={(e) => setFormData({ ...formData, beneficiaryCount: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Geographic Coverage
              </label>
              <input
                id="input-impact-coverage"
                type="text"
                value={formData.geographicCoverage}
                onChange={(e) => setFormData({ ...formData, geographicCoverage: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Evidence / Audit Reference
            </label>
            <input
              id="input-impact-evidence"
              type="text"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="e.g. Departmental ERP work orders log"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operational Notes
            </label>
            <textarea
              id="textarea-impact-notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="btn-submit-create-impact"
              type="submit"
              disabled={isSubmittingAction}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
            >
              {isSubmittingAction ? 'Registering...' : 'Register Metric in Ledger'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Verify Impact Report (Government Human Decision) */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Official Statutory Verification: Impact Report"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Human Decision Gatekeeper: "AI Recommends. Humans Decide."
            </p>
            <p className="text-[11px] text-amber-800">
              You are certifying that the reported telemetry for "{selectedRecordForAction?.metricName}" ({selectedRecordForAction?.currentValue} {selectedRecordForAction?.unit}) has been independently verified against departmental field records.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verifying Official Name & Title *
            </label>
            <input
              id="input-verify-inspector"
              type="text"
              required
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verification Findings & Official Notes *
            </label>
            <textarea
              id="textarea-verify-notes"
              rows={3}
              required
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsVerifyModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-verify-impact"
              type="button"
              disabled={isSubmittingAction}
              onClick={handleConfirmVerify}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmittingAction ? 'Certifying...' : 'Authorize Statutory Verification'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Submit Period Telemetry (Startup Founder / Field Operator) */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Reporting Period Telemetry Data"
      >
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 space-y-1">
            <p className="font-bold">Metric: {selectedRecordForAction?.metricName}</p>
            <p className="text-[11px] text-indigo-800">
              Baseline: {selectedRecordForAction?.baselineValue} {selectedRecordForAction?.unit} | Target: {selectedRecordForAction?.targetValue} {selectedRecordForAction?.unit}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Measurement ({selectedRecordForAction?.unit}) *
              </label>
              <input
                id="input-submit-current-val"
                type="number"
                step="any"
                required
                value={submitCurrentValue}
                onChange={(e) => setSubmitCurrentValue(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporting Period *
              </label>
              <input
                id="input-submit-period"
                type="text"
                value={submitPeriod}
                onChange={(e) => setSubmitPeriod(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Telemetry Evidence / API Dump Link
            </label>
            <input
              id="input-submit-evidence"
              type="text"
              value={submitEvidence}
              onChange={(e) => setSubmitEvidence(e.target.value)}
              placeholder="e.g. Sensor logs export or PWD contractor invoice"
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Remarks & Field Notes
            </label>
            <textarea
              id="textarea-submit-evidence"
              rows={3}
              value={submitNotes}
              onChange={(e) => setSubmitNotes(e.target.value)}
              placeholder="Detail operational results during this reporting period..."
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-submit-reporting"
              type="button"
              disabled={isSubmittingAction}
              onClick={handleConfirmSubmit}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
            >
              {isSubmittingAction ? 'Submitting...' : 'Submit Report for Government Verification'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImpactMonitoring;
