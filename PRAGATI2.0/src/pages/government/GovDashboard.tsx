import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Shield, 
  Flag, 
  Users, 
  Briefcase, 
  CheckSquare, 
  TrendingUp, 
  Sparkles, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Calendar, 
  Building2, 
  Clock, 
  ChevronRight,
  BarChart2,
  Gauge
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export const GovDashboard: React.FC = () => {
  const { challenges, pilots, applications, auditLogs, scaleUpPlan, scaleUpPlans, procurementContracts } = usePragati();
  const navigate = useNavigate();

  const selectedStartupsCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Pilot' || a.status === 'Validated').length;
  const activePilotsCount = pilots.filter(p => p.status === 'Active' || p.status === 'In Progress' || p.status === 'Planning' || p.status === 'Approved').length;
  const totalKpisCount = pilots.reduce((acc, p) => acc + (p.kpis?.length || 0), 0);
  const pendingValidationsCount = pilots.filter(p => p.status === 'Under Evaluation' || p.status === 'Under Validation' || p.validationStatus === 'Pending' || p.validationStatus === 'Under Review' || !p.validationDecision).length;

  // Procurement breakdown: Pending, Approved, Active, Completed
  const contractsList = procurementContracts || [];
  const procurementPendingCount = contractsList.filter(c => c.contractStatus === 'Draft' || c.contractStatus === 'Under Review' || c.contractStatus === 'Drafted').length;
  const approvedProcurementCount = contractsList.filter(c => c.contractStatus === 'Approved').length;
  const activeProcurementCount = contractsList.filter(c => c.contractStatus === 'Active').length;
  const completedProcurementCount = contractsList.filter(c => c.contractStatus === 'Completed').length;

  // Scale-Up operations breakdown (Prompt item 10)
  const plansList = (scaleUpPlans && scaleUpPlans.length > 0) ? scaleUpPlans : (scaleUpPlan ? [scaleUpPlan] : []);
  const eligibleForScaleUpCount = contractsList.filter(c => {
    const isApprovedOrActive = ['Approved', 'Active', 'Completed'].includes(c.contractStatus);
    const pilot = pilots.find(p => p.id === c.pilotId || p.challengeId === c.challengeId);
    const isValidatedScale = pilot?.validationDecision === 'Scale' || pilot?.status === 'Scale Approved' || pilot?.status === 'Validated';
    return isApprovedOrActive && isValidatedScale;
  }).length;
  const scaleUpPlansCount = plansList.length;
  const scaleUpUnderReviewCount = plansList.filter(p => p.status === 'Under Review' || p.status === 'Draft').length;
  const scaleUpApprovedCount = plansList.filter(p => p.status === 'Approved').length;
  const scaleUpActiveCount = plansList.filter(p => p.status === 'Active').length;
  const scaleUpCompletedCount = plansList.filter(p => p.status === 'Completed').length;

  // Prominently displaying: Selected Startups, Active Pilots, KPI Monitoring, Pending Validations
  const kpiStats = [
    { label: 'Selected Startups', value: String(selectedStartupsCount || 6), icon: Users, sub: 'Shortlisted for Field Pilots', color: 'text-blue-600', link: '/government/applications' },
    { label: 'Active Pilots', value: String(activePilotsCount || 8), icon: Briefcase, sub: 'Controlled 60-90 Day Trials', color: 'text-amber-600', link: '/government/pilots' },
    { label: 'KPI Monitoring', value: `${totalKpisCount || 24} Metrics`, icon: Gauge, sub: 'Live Telemetry Streams', color: 'text-sky-600', link: '/government/kpi-monitoring' },
    { label: 'Pending Validations', value: String(pendingValidationsCount || 3), icon: CheckSquare, sub: 'Awaiting Official Sign-Off', color: 'text-purple-600', link: '/government/validation' },
    { label: 'Solutions Scaled', value: '6', icon: TrendingUp, sub: 'Statewide Deployment', color: 'text-emerald-600', link: '/government/scale-up' }
  ];

  // Chart data: Challenges by department
  const departmentData = [
    { name: 'PWD Infra', count: 5, budget: 180 },
    { name: 'Agriculture', count: 3, budget: 140 },
    { name: 'Health', count: 2, budget: 95 },
    { name: 'Water & Urban', count: 2, budget: 125 }
  ];

  // Application pipeline data
  const pipelineData = [
    { stage: 'Applied', count: 86 },
    { stage: 'Screened', count: 64 },
    { stage: 'Evaluated', count: 32 },
    { stage: 'Pilots', count: 8 },
    { stage: 'Procured', count: 6 }
  ];

  // Pilot success rate distribution
  const pilotOutcomeData = [
    { name: 'Exceeded Targets (Scale)', value: 65, color: '#10B981' },
    { name: 'Met Targets (Procure)', value: 25, color: '#0284C7' },
    { name: 'Under Review', value: 10, color: '#F59E0B' }
  ];

  // Procurement disbursement status
  const procurementTrendData = [
    { month: 'Jun', value: 18 },
    { month: 'Jul', value: 34 },
    { month: 'Aug', value: 62 },
    { month: 'Sep', value: 98 },
    { month: 'Oct (Proj)', value: 145 }
  ];

  return (
    <div className="space-y-8">
      {/* Officer Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Public Works Department (PWD)</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Government Officer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, Er. Rajeshwar Rao
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            You are overseeing the Public Works Innovation Portfolio. RoadVision AI pilot in Bengaluru North has achieved 82% progress with 94.2% detection accuracy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/government/ai-assistant"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-sky-300 text-xs font-semibold text-sky-700 flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>AI Challenge Assistant</span>
          </Link>
          <Link
            to="/government/create-challenge"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Challenge</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD KPIS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiStats.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between shadow-sm group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-sky-700 transition-colors">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-black tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium truncate">
                  {kpi.sub}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* FAST-TRACK INNOVATION PROCUREMENT PIPELINE (PROMPT MANDATED) */}
      <div className="p-6 rounded-2xl bg-white border border-purple-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                Fast-Track Commercialization
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Rule 173 GFR Innovation Procurement Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct purchase contracts and milestone-linked escrow disbursements for validated solutions.
            </p>
          </div>
          <Link
            to="/government/procurement"
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage All Procurement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Procurement Pending */}
          <Link
            to="/government/procurement"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-purple-800">
              Procurement Pending
            </span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">
              {procurementPendingCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Draft & Under Review</span>
          </Link>

          {/* Approved Procurement */}
          <Link
            to="/government/procurement"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-purple-800">
              Approved Procurement
            </span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {approvedProcurementCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sanctioned by Finance</span>
          </Link>

          {/* Active Procurement */}
          <Link
            to="/government/procurement"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-purple-800">
              Active Procurement
            </span>
            <div className="text-2xl font-black text-sky-700 font-mono mt-1">
              {activeProcurementCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Escrow Disbursing</span>
          </Link>

          {/* Completed Procurement */}
          <Link
            to="/government/procurement"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-purple-800">
              Completed Procurement
            </span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              {completedProcurementCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Final Payouts Cleared</span>
          </Link>
        </div>
      </div>

      {/* STATEWIDE SCALE-UP & COMMERCIAL EXPANSION OPERATIONS (PROMPT MANDATED) */}
      <div id="section-gov-scaleup-operations" className="p-6 rounded-2xl bg-white border border-indigo-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase">
                Post-Procurement Scale-Up
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Statewide Deployment & Commercial Expansion Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phased transition from successful procurement contracts to statewide institutional adoption across Karnataka.
            </p>
          </div>
          <Link
            to="/government/scale-up"
            id="link-gov-manage-scaleup"
            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Manage Scale-Up Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Eligible for Scale-Up */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-eligible"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Eligible for Scale-Up
            </span>
            <div className="text-2xl font-black text-indigo-700 font-mono mt-1">
              {eligibleForScaleUpCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">7-Point Clearance Met</span>
          </Link>

          {/* Total Scale-Up Plans */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-plans"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Scale-Up Plans
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {scaleUpPlansCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Active Portfolios</span>
          </Link>

          {/* Under Review */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-under-review"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Under Review
            </span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">
              {scaleUpUnderReviewCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Draft & Reviewing</span>
          </Link>

          {/* Approved */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-approved"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Approved
            </span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {scaleUpApprovedCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sanctioned for Rollout</span>
          </Link>

          {/* Active */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-active"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Active
            </span>
            <div className="text-2xl font-black text-sky-600 font-mono mt-1">
              {scaleUpActiveCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Statewide Execution</span>
          </Link>

          {/* Completed */}
          <Link
            to="/government/scale-up"
            id="stat-scaleup-completed"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all block group"
          >
            <span className="text-[11px] font-semibold text-slate-600 block group-hover:text-indigo-800">
              Completed
            </span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              {scaleUpCompletedCount}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Full State Coverage</span>
          </Link>
        </div>
      </div>

      {/* ACTIVE SPOTLIGHT STORY: ROADVISION AI PILOT */}
      <div className="p-6 rounded-2xl bg-white border border-sky-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                ACTIVE PILOT SPOTLIGHT
              </span>
              <span className="text-xs text-slate-500">90-Day Controlled Deployment</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI-Based Pothole Detection & Road Condition Monitoring
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Startup: <strong className="text-sky-700">RoadVision AI</strong> | Corridor: 520 km Bengaluru North
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/government/kpi-monitoring"
              className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700"
            >
              Live Telemetry
            </Link>
            <Link
              to="/government/validation"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Validate & Scale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mini progress bar & KPI chips */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Pilot Progress</span>
            <div className="flex items-center justify-between font-bold text-slate-900 mb-1.5">
              <span>82% Completed</span>
              <span className="text-sky-700">Day 74 of 90</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-2 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Detection Accuracy</span>
            <div className="text-xl font-black text-emerald-600">94.2%</div>
            <span className="text-[11px] text-slate-500">Target was ≥ 90% (+4.2%)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">False Positive Rate</span>
            <div className="text-xl font-black text-emerald-600">6.1%</div>
            <span className="text-[11px] text-slate-500">Target was ≤ 10% (-3.9%)</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Validation Recommendation</span>
            <div className="text-xl font-black text-sky-700">SCALE</div>
            <span className="text-[11px] text-slate-500">5-District Expansion Ready</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Challenges by Department */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Challenges by Department</h3>
              <p className="text-xs text-slate-400">Active outcome challenges and allocation</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold">12 Total</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Active Challenges" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Application Pipeline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Application Pipeline Funnel</h3>
              <p className="text-xs text-slate-500">Conversion from proposal to procurement</p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">86 Inflow</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis type="category" dataKey="stage" stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }}
                />
                <Bar dataKey="count" name="Startups" fill="#0284C7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Pilot Success Rate */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pilot Success Outcomes</h3>
              <p className="text-xs text-slate-500">Performance against benchmark targets</p>
            </div>
            <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">90% Pass Rate</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pilotOutcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pilotOutcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {pilotOutcomeData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 font-medium">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Procurement Disbursement (in Lakhs) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Procurement Disbursement Trend</h3>
              <p className="text-xs text-slate-500">Milestone payments released (in ₹ Lakhs)</p>
            </div>
            <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">₹98L Released</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={procurementTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px', color: '#0F172A' }}
                />
                <Line type="monotone" dataKey="value" name="Payout (₹ Lakhs)" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4, fill: '#0284C7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY AUDIT TRAIL */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Ecosystem Activity</h3>
            <p className="text-xs text-slate-500">Tamper-evident audit timeline across government and startups</p>
          </div>
          <Link
            to="/government/audit-log"
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <span>View Full Audit Registry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                    {log.userRole}
                  </span>
                </div>
                <p className="text-slate-600 leading-normal">{log.details}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>By: <strong className="text-slate-600">{log.userName}</strong></span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
              <StatusBadge status={log.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

