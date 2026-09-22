import React from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Building2, 
  CheckCircle2,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend 
} from 'recharts';

export const GovReports: React.FC = () => {
  const { addToast } = usePragati();

  const handleExport = (reportType: string) => {
    addToast('success', 'Report Exported', `Generated ${reportType} (Simulated CSV/PDF format downloaded).`);
  };

  const startupParticipationData = [
    { state: 'Karnataka', startups: 112 },
    { state: 'Maharashtra', startups: 84 },
    { state: 'Telangana', startups: 62 },
    { state: 'Delhi NCR', startups: 54 },
    { state: 'Tamil Nadu', startups: 38 }
  ];

  const evalScoresDistribution = [
    { scoreRange: '90 - 100', count: 14 },
    { scoreRange: '80 - 89', count: 28 },
    { scoreRange: '70 - 79', count: 32 },
    { scoreRange: '< 70', count: 12 }
  ];

  const procurementPipelineData = [
    { stage: 'Pilot Phase', value: 45 },
    { stage: 'Validation Gate', value: 28 },
    { stage: 'Contract Sanctioned', value: 38.5 },
    { stage: 'Scale Procurement', value: 142 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Public Sector Innovation Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Reports & Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Comprehensive audit reports covering challenge performance, startup participation, and pilot conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('Quarterly_Innovation_Summary_Q3_2026.pdf')}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Report</span>
          </button>
        </div>
      </div>

      {/* QUICK METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 block mb-1">Total Procurement Value Created</span>
          <div className="text-3xl font-black text-white font-mono">₹2.85 Cr</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1">Across 6 scaled contracts</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 block mb-1">Average Evaluation Score</span>
          <div className="text-3xl font-black text-sky-400 font-mono">83.4/100</div>
          <span className="text-[11px] text-slate-400 mt-1">Evaluated by 24 domain IIT/IIM chairs</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 block mb-1">Pilot-to-Procurement Conversion</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">75.0%</div>
          <span className="text-[11px] text-slate-400 mt-1">6 out of 8 pilots approved for scale</span>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startup Participation by Geography */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Startup Participation by State</h3>
              <p className="text-xs text-slate-400">Total 350+ DPIIT recognized startups engaged</p>
            </div>
            <button
              onClick={() => handleExport('Startup_Participation_Data.csv')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={startupParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="state" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="startups" name="Startups" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evaluation Score Distribution */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Evaluation Score Distribution</h3>
              <p className="text-xs text-slate-400">Proposals reviewed across 5 weighted criteria</p>
            </div>
            <button
              onClick={() => handleExport('Evaluation_Analytics.csv')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evalScoresDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="scoreRange" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Proposals Evaluated" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SIMULATED EXPORTABLE PACKAGES */}
      <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Download Pre-Structured Compliance Reports
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {[
            { title: 'Pilot Outcome Verification Dossier', desc: 'Audited telemetry, KPI target compliance, and Chief Engineer authorization for PWD.', file: 'PWD_Pilot_Validation_Report.pdf' },
            { title: 'GeM Fast-Track Procurement Memo', desc: 'Single-source innovation justification under GFR Rule 173(i) with milestone schedule.', file: 'GeM_Procurement_Justification.pdf' },
            { title: 'Multi-District Scale Feasibility', desc: 'Financial outlays, phase allocation, and district PWD highway network coverage.', file: 'State_Scale_Up_Roadmap.pdf' }
          ].map((rep, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-bold text-slate-100">{rep.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>
              <button
                onClick={() => handleExport(rep.file)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
