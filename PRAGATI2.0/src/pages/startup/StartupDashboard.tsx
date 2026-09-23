import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Rocket, 
  Flag, 
  FileCheck, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Building2, 
  CheckSquare, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LifecyclePipelineStepper } from '../../components/common/LifecyclePipelineStepper';

export const StartupDashboard: React.FC = () => {
  const { challenges, applications, pilots } = usePragati();

  // Dashboard Cards: Open Opportunities, Applications Submitted, Shortlisted, Active Pilots, Completed Pilots
  const statCards = [
    { label: 'Open Opportunities', value: challenges.filter(c => c.status === 'Published' || c.status === 'Applications Open' || c.status === 'Pilot Active').length, icon: Flag, color: 'text-sky-400', border: 'border-sky-500/30', path: '/startup/challenges' },
    { label: 'Applications Submitted', value: applications.length, icon: FileCheck, color: 'text-blue-400', border: 'border-blue-500/30', path: '/startup/applications' },
    { label: 'Shortlisted for Pilot', value: applications.filter(a => a.status === 'Shortlisted' || a.status === 'Pilot' || a.status === 'Validated').length, icon: Award, color: 'text-amber-400', border: 'border-amber-500/30', path: '/startup/applications' },
    { label: 'Active Pilots', value: pilots.filter(p => p.status === 'In Progress').length, icon: Briefcase, color: 'text-emerald-400', border: 'border-emerald-500/30', path: '/startup/pilots' },
    { label: 'Completed / Validated', value: pilots.filter(p => p.status === 'Validated' || p.status === 'Scale Approved').length, icon: CheckCircle2, color: 'text-purple-400', border: 'border-purple-500/30', path: '/startup/pilots' }
  ];

  // Pipeline stages: Applied → Under Review → Expert Evaluation → Shortlisted → Pilot → Validated → Procurement
  const pipelineStages = [
    { stage: 'Applied', status: 'Completed', date: '15 Sept 2026' },
    { stage: 'Under Review', status: 'Completed', date: '17 Sept 2026' },
    { stage: 'Expert Evaluation', status: 'Completed', date: '20 Sept 2026 (91/100)' },
    { stage: 'Shortlisted', status: 'Completed', date: '22 Sept 2026' },
    { stage: 'Pilot', status: 'In Progress', date: 'Day 74 of 90 (82%)' },
    { stage: 'Validated', status: 'Upcoming', date: 'Target: 94.2% Passed' },
    { stage: 'Procurement', status: 'Upcoming', date: 'GeM Runway Fast-Track' }
  ];

  return (
    <div className="space-y-8">
      {/* Startup Profile Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">RoadVision AI</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">DPIIT Recognized Deep-Tech Startup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Founder Workspace — RoadVision AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Pothole monitoring pilot with Public Works Department is currently at <strong>82% completion</strong> with <strong>94.2% detection accuracy</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/startup/eligibility"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Eligibility Checklist</span>
          </Link>
          <Link
            to="/startup/challenges"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span>Find Challenges</span>
          </Link>
        </div>
      </div>

      {/* 5 DASHBOARD KPI CARDS (PROMPT SPECIFIED) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className={`p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between group shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${card.color}`}>
                {card.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* APPLICATION & PROCUREMENT PIPELINE (PRAGATI INNOVATION LIFECYCLE) */}
      <LifecyclePipelineStepper 
        currentStage="pilot_project"
        challengeId="ch-pwd-pothole-01"
        challengeTitle="Active Opportunity: AI-Based Pothole Detection & Road Monitoring (PWD)"
      />

      {/* QUICK ACTIONS & ACTIVE ENGAGEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Engagement Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Government Pilot</h3>
            <StatusBadge status="In Progress" />
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-bold text-sky-700">
              AI-Based Pothole Detection and Road Condition Monitoring
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Client: Public Works Department, Bengaluru North Division (520 km highway corridor).
            </p>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] mt-2">
              <div>
                <span className="text-slate-500 block">Current Accuracy:</span>
                <span className="text-emerald-700 font-bold">94.2% (Target 90%)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Milestone 1 Payment:</span>
                <span className="text-emerald-700 font-bold">₹11.55L Disbursed</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <Link
              to="/startup/pilots"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Manage Pilot Deliverables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* DPIIT Regulatory & Statutory Status */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">DPIIT Exemption Badges</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% Verified
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>DPIIT Startup Certificate (DIPP89234) active & verified</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prior Turnover exemption approved under GFR Rule 173(i)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Earnest Money Deposit (EMD) exemption active on GeM portal</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <Link
              to="/startup/profile"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View Registered Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
