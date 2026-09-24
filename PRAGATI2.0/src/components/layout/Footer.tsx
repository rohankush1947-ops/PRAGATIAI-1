import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Award, FileText, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { usePragati } from '../../context/PragatiContext';

export const Footer: React.FC = () => {
  const { resetDemoData } = usePragati();

  return (
    <footer className="gov-dark-footer bg-[#0A192F] border-t border-slate-800 text-slate-300 text-sm relative">
      {/* Authentic Indian Government Tricolor Footer Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] shrink-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center border border-sky-400/40 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                PRAGATI <span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Bridging Government Challenges with Startup Innovation"
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112240] border border-slate-700/80 text-xs text-sky-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>National Innovation Framework</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/government/challenges" className="hover:text-sky-400 transition-colors">Problem Identification</Link></li>
              <li><Link to="/government/ai-assistant" className="hover:text-sky-400 transition-colors">AI Challenge Formulation</Link></li>
              <li><Link to="/government/discovery" className="hover:text-sky-400 transition-colors">Startup Discovery</Link></li>
              <li><Link to="/government/ai-matching" className="hover:text-sky-400 transition-colors">Explainable AI Matching</Link></li>
              <li><Link to="/startup/eligibility" className="hover:text-sky-400 transition-colors">Eligibility Screening</Link></li>
              <li><Link to="/expert/dashboard" className="hover:text-sky-400 transition-colors">Expert Evaluation</Link></li>
            </ul>
          </div>

          {/* Col 3: Piloting & Scale */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Outcome Lifecycle
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/government/pilots" className="hover:text-sky-400 transition-colors">Controlled Pilots</Link></li>
              <li><Link to="/government/kpi-monitoring" className="hover:text-sky-400 transition-colors">Real-Time KPI Monitoring</Link></li>
              <li><Link to="/government/validation" className="hover:text-sky-400 transition-colors">Pilot Validation</Link></li>
              <li><Link to="/government/procurement" className="hover:text-sky-400 transition-colors">Milestone Procurement</Link></li>
              <li><Link to="/government/scale-up" className="hover:text-sky-400 transition-colors">State-Level Scale-Up</Link></li>
              <li><Link to="/government/audit-log" className="hover:text-sky-400 transition-colors">Public Audit Trail</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform System Actions */}
          <div className="bg-[#112240] p-4 rounded-xl border border-slate-700/80 space-y-3 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="text-sky-400 font-extrabold tracking-wide">Platform Controls</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              PRAGATI AI Production Portal<br />
              Session workspace with automated state persistence and audit synchronization.
            </p>
            <button
              onClick={resetDemoData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-600 rounded-lg border border-sky-500/50 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-200" />
              <span>Reset Workspace Data</span>
            </button>
          </div>
        </div>

        {/* Advisory Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#112240] border border-sky-800/40 text-center my-6">
          <p className="text-xs text-slate-200 font-medium leading-relaxed max-w-4xl mx-auto">
            <strong className="text-sky-400 font-bold">Advisory Notice:</strong> PragatiAI is an AI-powered public procurement and innovation enablement platform. AI recommendations and evaluations are advisory and final procurement decisions remain with authorized departmental officers in compliance with General Financial Rules (GFR).
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © 2026 PRAGATI AI. All Rights Reserved. National Innovation & Procurement Platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Government Innovation Framework</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Enterprise Gov-Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
