import React, { useState } from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  Crown, 
  Building2, 
  Rocket, 
  UserCheck, 
  Flag, 
  Briefcase, 
  CheckSquare, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  Search,
  CheckCircle2,
  Users
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { challenges, startups, pilots, resetDemoData, addToast } = usePragati();

  const [userSearch, setUserSearch] = useState('');

  // 7 Platform-wide metrics (Prompt specified)
  const platformStats = [
    { label: 'Total Departments', value: '18', icon: Building2, sub: 'State & Central Bodies', color: 'text-sky-400', border: 'border-sky-500/30' },
    { label: 'Total Startups', value: '350+', icon: Rocket, sub: 'DPIIT Registered', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Total Experts', value: '48', icon: UserCheck, sub: 'IIT / IIM / NIT Chairs', color: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Active Challenges', value: challenges.length, icon: Flag, sub: 'Outcome Problem RFPs', color: 'text-blue-400', border: 'border-blue-500/30' },
    { label: 'Active Pilots', value: '8', icon: Briefcase, sub: 'Controlled Trials', color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Validated Solutions', value: '14', icon: CheckSquare, sub: 'Targets Exceeded', color: 'text-teal-400', border: 'border-teal-500/30' },
    { label: 'Scaled Solutions', value: '6', icon: TrendingUp, sub: 'Multi-District Rollouts', color: 'text-indigo-400', border: 'border-indigo-500/30' }
  ];

  // User management mock directory
  const mockUsers = [
    { name: 'Er. Rajeshwar Rao', role: 'Government Officer', dept: 'Public Works Department (PWD)', status: 'Active', email: 'rajeshwar.rao@pwd.gov.in', permissions: 'Publish & Validate' },
    { name: 'Ananya Deshmukh', role: 'Startup Founder', dept: 'RoadVision AI', status: 'Active', email: 'ananya@roadvision.ai', permissions: 'Apply & Milestone Access' },
    { name: 'Dr. Arvind Swaminathan', role: 'Expert Evaluator', dept: 'IIT Madras (Transportation AI)', status: 'Active', email: 'aswaminathan@iitm.ac.in', permissions: 'Scoring Rubric Review' },
    { name: 'S. K. Nambiar', role: 'Procurement Officer', dept: 'Finance & Accounts Division', status: 'Active', email: 'sk.nambiar@statefinance.gov.in', permissions: 'Disbursement Release' },
    { name: 'Kavita Menon', role: 'Government Officer', dept: 'Dept of Agriculture & Farmers Welfare', status: 'Active', email: 'kavita.m@agri.gov.in', permissions: 'Publish & Validate' }
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.dept.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#0F1C36] to-[#0B1528] border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Platform Administration
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Smart India Hackathon 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PragatiAI System Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time telemetry oversight, role permissions matrix, and ecosystem audit integrity controls.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2.5 rounded-xl bg-[#080E1C] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-sky-400" />
          <span>Reset Prototype Data</span>
        </button>
      </div>

      {/* 7 PLATFORM METRICS GRID (PROMPT SPECIFIED) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        {platformStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-[#0B1528] border ${stat.border} flex flex-col justify-between shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-xl sm:text-2xl font-black ${stat.color} font-mono`}>
                  {stat.value}
                </div>
                <div className="font-semibold text-white mt-0.5 leading-tight text-[11px]">
                  {stat.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {stat.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* USER MANAGEMENT & ACCESS MATRIX */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>User Management & Ecosystem Stakeholders</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized government officers, startup founders, and appointed peer evaluators.
            </p>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user or department..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="gov-input pl-8 text-xs py-1.5"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Name & Official Email</th>
                <th className="py-2.5 px-3">System Role</th>
                <th className="py-2.5 px-3">Department / Affiliation</th>
                <th className="py-2.5 px-3">Access Tier</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{u.name}</div>
                    <span className="text-[10px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200">{u.role}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {u.dept}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                      {u.permissions}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
