import React, { useState } from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Cpu, 
  Users, 
  Award, 
  FileText, 
  Shield, 
  Briefcase, 
  DollarSign, 
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CircularScore } from '../../components/common/CircularScore';

import { useSearchParams } from 'react-router-dom';

export const StartupProfile: React.FC = () => {
  const { startups } = usePragati();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryStartupId = searchParams.get('startupId');

  const startup = 
    (queryStartupId ? startups.find(s => s.id.toLowerCase() === queryStartupId.toLowerCase()) : null) || 
    startups[0];

  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    'Overview',
    'Technology',
    'Team & Governance',
    'Past Projects',
    'Pilot Experience',
    'Certifications & Financials',
    'Gov Challenges'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#0F1C36] to-[#0B1528] border border-sky-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              DPIIT ID: DIPP89234
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Incorporated 2023</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {startup.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {startup.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {startup.location}
            </span>
            <span>•</span>
            <span>Stage: <strong className="text-slate-200">{startup.stage}</strong></span>
            <span>•</span>
            <span>Team: <strong className="text-slate-200">{startup.teamSize} Engineers</strong></span>
          </div>
        </div>

        {/* 3 Prominently Displayed Badges (Prompt Specified) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="p-3 rounded-xl bg-[#070E1E] border border-emerald-500/40 text-center shrink-0 min-w-[110px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Eligibility</span>
            <span className="text-sm font-bold text-emerald-400">Eligible</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070E1E] border border-sky-500/40 text-center shrink-0 min-w-[110px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pilot Readiness</span>
            <span className="text-sm font-bold text-sky-400">High</span>
          </div>

          <div className="p-3 rounded-xl bg-[#070E1E] border border-purple-500/40 text-center shrink-0 min-w-[110px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tech Match</span>
            <span className="text-sm font-bold text-purple-400">94%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex overflow-x-auto gap-2 pb-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Company Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {startup.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Primary Domain</span>
              <span className="font-bold text-slate-100">{startup.domain}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Annual Turnover</span>
              <span className="font-bold text-slate-100">{startup.revenueRange}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Public Sector Pilots</span>
              <span className="font-bold text-emerald-400">{startup.completedPilotsCount} Successfully Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. TECHNOLOGY */}
      {activeTab === 'Technology' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Proprietary Deep-Tech Architecture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block">Edge Inference Pipeline</span>
              <p className="text-slate-300 leading-relaxed">
                Custom TensorRT-optimized YOLOv10 model operating at 30 FPS on 15W edge processors mounted inside patrol vehicles.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block">Sub-Meter GIS Spatial Tagging</span>
              <p className="text-slate-300 leading-relaxed">
                Dual-band GNSS with RTK correction generates centimetre-accurate road distress coordinates exported to standard municipal GIS layers.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Technology Stack Components:</span>
            <div className="flex flex-wrap gap-2">
              {startup.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-[#070E1E] text-sky-300 border border-slate-700 text-xs font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEAM & GOVERNANCE */}
      {activeTab === 'Team & Governance' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Core Leadership & Technical Advisory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Ananya Deshmukh</span>
              <span className="text-sky-400 text-[11px] block">Co-Founder & CEO</span>
              <p className="text-slate-400 text-[11px] mt-1">Ex-ISRO Satellite Navigation Engineer, M.Tech IIT Bombay</p>
            </div>
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Karthik Sunder</span>
              <span className="text-sky-400 text-[11px] block">Chief Technology Officer</span>
              <p className="text-slate-400 text-[11px] mt-1">PhD in Edge Computer Vision, CMU Postdoctoral Fellow</p>
            </div>
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Dr. R. Ramanathan</span>
              <span className="text-sky-400 text-[11px] block">Technical Advisor</span>
              <p className="text-slate-400 text-[11px] mt-1">Former Member, Indian Roads Congress (IRC) Safety Committee</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAST PROJECTS */}
      {activeTab === 'Past Projects' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Proven Government Field Deployments
          </h3>

          <div className="space-y-3">
            {startup.pastProjects.map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <span className="text-sky-400 text-xs">Client: {p.client}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-emerald-400 font-semibold">{p.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PILOT EXPERIENCE */}
      {activeTab === 'Pilot Experience' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Controlled Pilot Performance Record
            </h3>
            <span className="text-xs text-emerald-400 font-bold">100% Milestone Compliance</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs space-y-2">
            <span className="font-bold text-sky-300">Public Works Department (Bengaluru North)</span>
            <p className="text-slate-300 leading-relaxed">
              Achieved 94.2% detection precision across 520 km of arterial road network during day and night trials with automated work-order generation for PWD maintenance crews.
            </p>
          </div>
        </div>
      )}

      {/* 6. CERTIFICATIONS & FINANCIALS */}
      {activeTab === 'Certifications & Financials' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Statutory Certifications & Financial Eligibility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {startup.certifications.map((cert, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#070E1E] border border-slate-800 flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. GOV CHALLENGES */}
      {activeTab === 'Gov Challenges' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Engaged Outcome Challenges
          </h3>

          <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <h4 className="font-bold text-white text-sm">
                AI-Based Pothole Detection and Road Condition Monitoring
              </h4>
              <span className="text-sky-400 text-xs">Public Works Department</span>
            </div>
            <StatusBadge status="Validated / Scaling" />
          </div>
        </div>
      )}
    </div>
  );
};
