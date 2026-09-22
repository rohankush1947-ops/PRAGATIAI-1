import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingNav } from '../../components/layout/LandingNav';
import { Footer } from '../../components/layout/Footer';
import { usePragati } from '../../context/PragatiContext';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Cpu, 
  CheckSquare, 
  Award, 
  Gauge, 
  ShoppingCart, 
  Zap, 
  AlertCircle, 
  Users, 
  Building2, 
  BarChart, 
  Rocket, 
  Scale, 
  Compass,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const { challenges, setCurrentRole } = usePragati();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'government' | 'startup' | 'expert' | 'admin', path: string) => {
    setCurrentRole(role);
    navigate(path);
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Define Challenge',
      desc: 'Government department creates an outcome-based innovation challenge using structured templates and AI formulation.',
      icon: Layers,
      color: 'from-blue-500 to-sky-600'
    },
    {
      num: '02',
      title: 'Discover Startups',
      desc: 'AI engine analyzes patent data, tech stacks, and domain records to recommend matching deep-tech startups.',
      icon: Sparkles,
      color: 'from-sky-500 to-cyan-600'
    },
    {
      num: '03',
      title: 'Screen Eligibility',
      desc: 'Automated rule-based screening verifies DPIIT status, turnover ceilings, and statutory compliance with zero bias.',
      icon: CheckSquare,
      color: 'from-cyan-500 to-teal-600'
    },
    {
      num: '04',
      title: 'Expert Evaluation',
      desc: 'Domain experts evaluate shortlisted solutions against transparent, 5-point weighted criteria.',
      icon: Award,
      color: 'from-teal-500 to-emerald-600'
    },
    {
      num: '05',
      title: 'Run Pilot',
      desc: 'Selected startups conduct controlled field pilots under structured milestone agreements with live progress tracking.',
      icon: Gauge,
      color: 'from-emerald-500 to-green-600'
    },
    {
      num: '06',
      title: 'Validate Results',
      desc: 'Field telemetry and real-world KPIs are rigorously validated against predefined target benchmarks.',
      icon: Scale,
      color: 'from-green-500 to-amber-600'
    },
    {
      num: '07',
      title: 'Procure & Scale',
      desc: 'Validated solutions fast-track into milestone-based procurement and statewide scale-up across districts.',
      icon: ShoppingCart,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070E1E] text-slate-100 flex flex-col font-sans">
      <LandingNav />

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-xs font-semibold text-sky-300 shadow-sm shadow-sky-950">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Smart India Hackathon 2026 Prototype</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-normal">Startup-Friendly Public Procurement</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              From Government Challenges to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-sky-200">
                Scalable Innovation
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              PragatiAI enables government departments to discover, evaluate, pilot, procure, and scale innovative solutions from startups through a transparent and structured workflow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-900/40 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
              >
                <span>Explore PragatiAI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-xl bg-[#0F1C36] hover:bg-[#142546] border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Prototype Demo Stats */}
            <div className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="p-4 rounded-xl bg-[#0B1528]/80 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Challenges Formulated</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1528]/80 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">350+</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Startups Discovered</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1528]/80 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">85+</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Controlled Pilots</div>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1528]/80 border border-slate-800 backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">42</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Solutions Scaled</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic mt-2.5">
                *Representative figures from prototype demonstration dataset
              </p>
            </div>
          </div>

          {/* HERO WORKFLOW DIAGRAM */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528]/90 border border-slate-800 shadow-2xl relative">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  PragatiAI Innovation Procurement Journey
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">End-to-End Gov-Tech Architecture</span>
              </div>

              {/* Responsive Flowchart */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative">
                {[
                  { name: 'Gov Challenge', icon: Building2, tag: 'RFP Formulation' },
                  { name: 'AI Discovery', icon: Sparkles, tag: 'Deep Tech Scan' },
                  { name: 'Eligibility', icon: CheckSquare, tag: 'Rule Engine' },
                  { name: 'Expert Evaluation', icon: Award, tag: 'Scoring Rubric' },
                  { name: 'Pilot Project', icon: Gauge, tag: '90-Day Field Trial' },
                  { name: 'Validation', icon: Scale, tag: 'KPI Verification' },
                  { name: 'Procurement', icon: ShoppingCart, tag: 'Milestone Contract' },
                  { name: 'Scale-Up', icon: TrendingUp, tag: 'State Rollout' }
                ].map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0F1C36] border border-slate-800 hover:border-sky-500/50 transition-all text-center flex flex-col items-center group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-110 transition-transform">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-100">{step.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{step.tag}</span>
                  </div>
                ))}
              </div>

              {/* Active demo flow banner */}
              <div className="mt-6 p-3 rounded-lg bg-sky-950/40 border border-sky-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>Live Prototype Story:</strong> PWD Bengaluru North × RoadVision AI Pothole Monitoring</span>
                </div>
                <button
                  onClick={() => handleRoleSelect('government', '/government/validation')}
                  className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  <span>View Validation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section id="about" className="py-20 bg-[#060D1D] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">The Problem Statement</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why PragatiAI?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Traditional public procurement was engineered for commoditized civil works and hardware tenders, creating a massive barrier for deep-tech startups and leaving government departments with obsolete tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Government Challenges Card */}
            <div className="p-8 rounded-2xl bg-[#0B1528] border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Government Departments</h3>
                    <p className="text-xs text-slate-400">Public Sector Innovation Bottlenecks</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                  {[
                    'Difficult to formulate outcome-based innovation challenges without prescriptive technical biases',
                    'Hard to discover relevant deep-tech startups outside legacy vendor registries',
                    'Difficulty evaluating emerging technologies without specialized domain academic review',
                    'Complex pilot management with no real-time telemetry or field milestone tracking',
                    'Procurement uncertainty under traditional L1 tender guidelines',
                    'Limited visibility into post-pilot scale-up and multi-district adoption outcomes'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400 shrink-0 text-xs mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs text-slate-400 italic">
                Result: Government departments rely on outdated legacy systems due to high perceived risk.
              </div>
            </div>

            {/* Startup Challenges Card */}
            <div className="p-8 rounded-2xl bg-[#0B1528] border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Innovative Startups</h3>
                    <p className="text-xs text-slate-400">Barriers Facing High-Growth Deep-Tech Founders</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                  {[
                    'Disqualified by traditional eligibility requirements designed for established conglomerates',
                    'High turnover and prior years-in-business barriers blocking seed-stage breakthroughs',
                    'Prolonged, opaque procurement cycles exhausting startup financial runway',
                    'Unclear pilot-to-procurement journey with pilots ending without procurement path',
                    'Zero structured visibility of real-time municipal and state government demand',
                    'Complex tender paperwork requiring dedicated government liaison teams'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400 shrink-0 text-xs mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs text-slate-400 italic">
                Result: Breakthrough Indian technologies fail to deploy in high-impact public domains.
              </div>
            </div>
          </div>

          {/* Solution Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-sky-950/80 via-[#0F1C36] to-sky-950/80 border border-sky-500/40 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              PragatiAI connects both sides through one structured, transparent platform.
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
              Transforming bureaucratic friction into a standardized 7-step innovation pipeline with automated DPIIT eligibility, explainable AI matching, and milestone-backed contracts.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 7-STEP TIMELINE */}
      <section id="how-it-works" className="py-20 bg-[#070E1E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Structured Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How PragatiAI Works
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              A 7-step structured procurement lifecycle engineered to provide absolute transparency, measurable pilot accountability, and rapid procurement execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-sky-400/70 font-mono group-hover:text-sky-400 transition-colors">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#0F1C36] border border-slate-700 flex items-center justify-center text-sky-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-sky-400 font-medium">
                    <span>Explore Step {step.num}</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}

            {/* Special Final Card: Scale-Up Outcome */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-950 to-blue-950 border border-sky-500/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Target Outcome</span>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Statewide Deployment</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Validated solutions bypass multi-year bureaucratic friction to expand from a 50 km pilot corridor to all 31 districts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sky-800/60">
                <Link
                  to="/login"
                  className="w-full text-center py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold block transition-colors"
                >
                  Enter Demonstration Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE PORTALS SELECTION */}
      <section className="py-20 bg-[#060D1D] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Multi-Stakeholder Experience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Role-Specific Workspaces
            </h2>
            <p className="text-sm text-slate-300">
              PragatiAI provides dedicated workflows customized to the exact legal, technical, and operational needs of each ecosystem participant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Government Officer */}
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Government Officer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Create outcome-based challenges, discover deep-tech startups, monitor active pilots, and authorize procurement scaling.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('government', '/government/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue as Officer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Startup */}
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Startup Founder</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discover matching government opportunities, verify DPIIT eligibility, submit proposals, and track milestone disbursements.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('startup', '/startup/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue as Startup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expert Evaluator */}
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Expert Evaluator</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conduct objective peer evaluations with weighted multi-factor rubrics and recommend high-conviction pilot shortlists.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('expert', '/expert/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue as Expert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Platform Admin */}
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Platform Admin</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inspect platform-wide telemetry, verify tamper-evident audit trails, and manage governance policies.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('admin', '/admin/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Continue as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CHALLENGES SECTION */}
      <section id="challenges" className="py-20 bg-[#070E1E] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Open Opportunities</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Active Innovation Challenges
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Explore outcome-based problem statements published by Indian government departments.
              </p>
            </div>
            <Link
              to="/government/challenges"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View All Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.slice(0, 4).map((ch) => (
              <div
                key={ch.id}
                className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-sky-400 bg-sky-950/70 border border-sky-800/50 px-2.5 py-0.5 rounded-full">
                      {ch.department}
                    </span>
                    <StatusBadge status={ch.status} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {ch.problemDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#070E1E] p-3 rounded-lg border border-slate-800 mb-4">
                    <div>
                      <span className="text-slate-400 block">Pilot Budget:</span>
                      <span className="font-semibold text-slate-200">{ch.budgetRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Duration:</span>
                      <span className="font-semibold text-slate-200">{ch.pilotDuration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(ch.techArea ?? []).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {ch.applicationsCount} Proposals Submitted
                  </span>
                  <Link
                    to="/startup/challenges"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <span>Inspect Challenge</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
