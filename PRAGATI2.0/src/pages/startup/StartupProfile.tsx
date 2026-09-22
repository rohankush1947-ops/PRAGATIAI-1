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
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
              DPIIT ID: DIPP89234
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Incorporated 2023</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {startup.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            {startup.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              {startup.location}
            </span>
            <span>•</span>
            <span>Stage: <strong className="text-slate-800">{startup.stage}</strong></span>
            <span>•</span>
            <span>Team: <strong className="text-slate-800">{startup.teamSize} Engineers</strong></span>
          </div>
        </div>

        {/* 3 Prominently Displayed Badges (Prompt Specified) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="p-3 rounded-xl bg-white border border-emerald-200 text-center shrink-0 min-w-[110px] shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Eligibility</span>
            <span className="text-sm font-bold text-emerald-700">Eligible</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-sky-200 text-center shrink-0 min-w-[110px] shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pilot Readiness</span>
            <span className="text-sm font-bold text-sky-700">High</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-purple-200 text-center shrink-0 min-w-[110px] shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tech Match</span>
            <span className="text-sm font-bold text-purple-700">94%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex overflow-x-auto gap-2 pb-1 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Company Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {startup.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px]">Primary Domain</span>
              <span className="font-bold text-slate-900">{startup.domain}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px]">Annual Turnover</span>
              <span className="font-bold text-slate-900">{startup.revenueRange}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px]">Public Sector Pilots</span>
              <span className="font-bold text-emerald-700">{startup.completedPilotsCount} Successfully Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. TECHNOLOGY */}
      {activeTab === 'Technology' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Proprietary Deep-Tech Architecture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-sky-700 block">Edge Inference Pipeline</span>
              <p className="text-slate-600 leading-relaxed">
                Custom TensorRT-optimized YOLOv10 model operating at 30 FPS on 15W edge processors mounted inside patrol vehicles.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-sky-700 block">Sub-Meter GIS Spatial Tagging</span>
              <p className="text-slate-600 leading-relaxed">
                Dual-band GNSS with RTK correction generates centimetre-accurate road distress coordinates exported to standard municipal GIS layers.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Technology Stack Components:</span>
            <div className="flex flex-wrap gap-2">
              {startup.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 text-sky-800 border border-slate-300 text-xs font-mono font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEAM & GOVERNANCE */}
      {activeTab === 'Team & Governance' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Core Leadership & Technical Advisory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Ananya Deshmukh</span>
              <span className="text-sky-700 text-[11px] block font-medium">Co-Founder & CEO</span>
              <p className="text-slate-500 text-[11px] mt-1">Ex-ISRO Satellite Navigation Engineer, M.Tech IIT Bombay</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Karthik Sunder</span>
              <span className="text-sky-700 text-[11px] block font-medium">Chief Technology Officer</span>
              <p className="text-slate-500 text-[11px] mt-1">PhD in Edge Computer Vision, CMU Postdoctoral Fellow</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Dr. R. Ramanathan</span>
              <span className="text-sky-700 text-[11px] block font-medium">Technical Advisor</span>
              <p className="text-slate-500 text-[11px] mt-1">Former Member, Indian Roads Congress (IRC) Safety Committee</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. PAST PROJECTS */}
      {activeTab === 'Past Projects' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Proven Government Field Deployments
          </h3>

          <div className="space-y-3">
            {startup.pastProjects.map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <span className="text-sky-700 text-xs font-medium">Client: {p.client}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-emerald-700 font-semibold">{p.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PILOT EXPERIENCE */}
      {activeTab === 'Pilot Experience' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Controlled Pilot Performance Record
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% Milestone Compliance</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-2">
            <span className="font-bold text-sky-900">Public Works Department (Bengaluru North)</span>
            <p className="text-slate-700 leading-relaxed">
              Achieved 94.2% detection precision across 520 km of arterial road network during day and night trials with automated work-order generation for PWD maintenance crews.
            </p>
          </div>
        </div>
      )}

      {/* 6. CERTIFICATIONS & FINANCIALS */}
      {activeTab === 'Certifications & Financials' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Statutory Certifications & Financial Eligibility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {startup.certifications.map((cert, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. GOV CHALLENGES */}
      {activeTab === 'Gov Challenges' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Engaged Outcome Challenges
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                AI-Based Pothole Detection and Road Condition Monitoring
              </h4>
              <span className="text-sky-700 text-xs font-medium">Public Works Department</span>
            </div>
            <StatusBadge status="Validated / Scaling" />
          </div>
        </div>
      )}
    </div>
  );
};
