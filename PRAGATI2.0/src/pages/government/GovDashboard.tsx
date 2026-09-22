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
  BarChart2
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
  const { challenges, pilots, applications, auditLogs, scaleUpPlan } = usePragati();
  const navigate = useNavigate();

  // Prompt specified KPIs:
  // Active Challenges: 12, Startup Applications: 86, Active Pilots: 8, Solutions Validated: 14, Solutions Scaled: 6
  const kpiStats = [
    { label: 'Active Challenges', value: '12', icon: Flag, sub: 'Across 4 State Departments', color: 'text-sky-400', border: 'border-sky-500/30' },
    { label: 'Startup Applications', value: '86', icon: Users, sub: 'DPIIT Screened Proposals', color: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Active Pilots', value: '8', icon: Briefcase, sub: 'Controlled 60-90 Day Trials', color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Solutions Validated', value: '14', icon: CheckSquare, sub: 'Exceeded KPI Targets', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Solutions Scaled', value: '6', icon: TrendingUp, sub: 'Statewide Deployment', color: 'text-purple-400', border: 'border-purple-500/30' }
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#0F1C36] to-[#0B1528] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Public Works Department (PWD)</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Government Officer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Er. Rajeshwar Rao
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            You are overseeing the Public Works Innovation Portfolio. RoadVision AI pilot in Bengaluru North has achieved 82% progress with 94.2% detection accuracy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/government/ai-assistant"
            className="px-4 py-2.5 rounded-xl bg-[#080E1C] hover:bg-slate-800 border border-sky-500/40 text-xs font-semibold text-sky-400 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
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
            <div
              key={idx}
              className={`p-4 rounded-xl bg-[#0B1528] border ${kpi.border} flex flex-col justify-between shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#0F1C36] border border-slate-700 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-black tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                  {kpi.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE SPOTLIGHT STORY: ROADVISION AI PILOT */}
      <div className="p-6 rounded-2xl bg-[#0B1528] border border-sky-500/40 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                ACTIVE PILOT SPOTLIGHT
              </span>
              <span className="text-xs text-slate-400">90-Day Controlled Deployment</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              AI-Based Pothole Detection & Road Condition Monitoring
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Startup: <strong className="text-sky-400">RoadVision AI</strong> | Corridor: 520 km Bengaluru North
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/government/kpi-monitoring"
              className="px-3.5 py-2 rounded-lg bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
            >
              Live Telemetry
            </Link>
            <Link
              to="/government/validation"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Validate & Scale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mini progress bar & KPI chips */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Pilot Progress</span>
            <div className="flex items-center justify-between font-bold text-white mb-1.5">
              <span>82% Completed</span>
              <span className="text-sky-400">Day 74 of 90</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-2 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Detection Accuracy</span>
            <div className="text-xl font-black text-emerald-400">94.2%</div>
            <span className="text-[11px] text-slate-400">Target was ≥ 90% (+4.2%)</span>
          </div>

          <div className="bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">False Positive Rate</span>
            <div className="text-xl font-black text-emerald-400">6.1%</div>
            <span className="text-[11px] text-slate-400">Target was ≤ 10% (-3.9%)</span>
          </div>

          <div className="bg-[#070E1E] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Validation Recommendation</span>
            <div className="text-xl font-black text-sky-400">SCALE</div>
            <span className="text-[11px] text-slate-400">5-District Expansion Ready</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Challenges by Department */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
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
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Application Pipeline Funnel</h3>
              <p className="text-xs text-slate-400">Conversion from proposal to procurement</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">86 Inflow</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis type="category" dataKey="stage" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Startups" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Pilot Success Rate */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Pilot Success Outcomes</h3>
              <p className="text-xs text-slate-400">Performance against benchmark targets</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold">90% Pass Rate</span>
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
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {pilotOutcomeData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Procurement Disbursement (in Lakhs) */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Procurement Disbursement Trend</h3>
              <p className="text-xs text-slate-400">Milestone payments released (in ₹ Lakhs)</p>
            </div>
            <span className="text-xs text-purple-400 font-semibold">₹98L Released</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={procurementTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="value" name="Payout (₹ Lakhs)" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 4, fill: '#A855F7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY AUDIT TRAIL */}
      <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Ecosystem Activity</h3>
            <p className="text-xs text-slate-400">Tamper-evident audit timeline across government and startups</p>
          </div>
          <Link
            to="/government/audit-log"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View Full Audit Registry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                    {log.userRole}
                  </span>
                </div>
                <p className="text-slate-400 leading-normal">{log.details}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>By: <strong>{log.userName}</strong></span>
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
