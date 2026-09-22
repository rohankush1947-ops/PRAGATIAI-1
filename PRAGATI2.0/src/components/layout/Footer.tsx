import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Award, FileText, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { usePragati } from '../../context/PragatiContext';

export const Footer: React.FC = () => {
  const { resetDemoData } = usePragati();

  return (
    <footer className="bg-[#050B17] border-t border-slate-800 text-slate-400 text-sm">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1528] border border-slate-800 text-xs text-sky-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2026</span>
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

          {/* Col 4: Evaluator Demo Controls */}
          <div className="bg-[#0B1528] p-4 rounded-xl border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <span>SIH Demo Controls</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Team: <strong className="text-slate-200 font-semibold">Pragyan</strong><br />
              All data is local mock data tailored to the PWD & RoadVision AI demo journey.
            </p>
            <button
              onClick={resetDemoData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* SIH 2026 Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#091122] border border-sky-900/30 text-center my-6">
          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-4xl mx-auto">
            <strong className="text-sky-400">Notice:</strong> PragatiAI is a prototype developed for Smart India Hackathon 2026. AI recommendations are advisory and final decisions remain with authorized government officials. Does not constitute actual government procurement, certified verification, or contractual obligation.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © 2026 PRAGATI AI. Developed by Team <strong>Pragyan</strong> for Smart India Hackathon 2026.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Built for SIH 2026</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Government Tech SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
