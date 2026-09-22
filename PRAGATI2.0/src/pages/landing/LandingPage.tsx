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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col font-sans">
      <LandingNav />

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50/70 via-white to-[#F4F6F9]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-200/40 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-300 text-xs font-semibold text-sky-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
              <span>Smart India Hackathon 2026 Prototype</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">Startup-Friendly Public Procurement</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              From Government Challenges to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900">
                Scalable Innovation
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              PragatiAI enables government departments to discover, evaluate, pilot, procure, and scale innovative solutions from startups through a transparent and structured workflow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-md shadow-sky-900/10 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
              >
                <span>Explore PragatiAI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-sm transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Prototype Demo Stats */}
            <div className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">120+</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Challenges Formulated</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-700">350+</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Startups Discovered</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">85+</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Controlled Pilots</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">42</div>
                  <div className="text-xs text-slate-500 font-semibold mt-1">Solutions Scaled</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic mt-2.5">
                *Representative figures from prototype demonstration dataset
              </p>
            </div>
          </div>

          {/* HERO WORKFLOW DIAGRAM */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xl relative">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  <span className="text-slate-800">PragatiAI Innovation Procurement Journey</span>
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">End-to-End Gov-Tech Architecture</span>
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
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 transition-all text-center flex flex-col items-center group shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 mb-2 group-hover:scale-110 transition-transform">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{step.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{step.tag}</span>
                  </div>
                ))}
              </div>

              {/* Active demo flow banner */}
              <div className="mt-6 p-3 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span><strong>Live Prototype Story:</strong> PWD Bengaluru North × RoadVision AI Pothole Monitoring</span>
                </div>
                <button
                  onClick={() => handleRoleSelect('government', '/government/validation')}
                  className="text-sky-700 hover:text-sky-800 font-bold flex items-center gap-1"
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
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">The Problem Statement</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why PragatiAI?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Traditional public procurement was engineered for commoditized civil works and hardware tenders, creating a massive barrier for deep-tech startups and leaving government departments with obsolete tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Government Challenges Card */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Government Departments</h3>
                    <p className="text-xs text-slate-500 font-medium">Public Sector Innovation Bottlenecks</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {[
                    'Difficult to formulate outcome-based innovation challenges without prescriptive technical biases',
                    'Hard to discover relevant deep-tech startups outside legacy vendor registries',
                    'Difficulty evaluating emerging technologies without specialized domain academic review',
                    'Complex pilot management with no real-time telemetry or field milestone tracking',
                    'Procurement uncertainty under traditional L1 tender guidelines',
                    'Limited visibility into post-pilot scale-up and multi-district adoption outcomes'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0 text-xs mt-0.5 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                Result: Government departments rely on outdated legacy systems due to high perceived risk.
              </div>
            </div>

            {/* Startup Challenges Card */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Innovative Startups</h3>
                    <p className="text-xs text-slate-500 font-medium">Barriers Facing High-Growth Deep-Tech Founders</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  {[
                    'Disqualified by traditional eligibility requirements designed for established conglomerates',
                    'High turnover and prior years-in-business barriers blocking seed-stage breakthroughs',
                    'Prolonged, opaque procurement cycles exhausting startup financial runway',
                    'Unclear pilot-to-procurement journey with pilots ending without procurement path',
                    'Zero structured visibility of real-time municipal and state government demand',
                    'Complex tender paperwork requiring dedicated government liaison teams'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0 text-xs mt-0.5 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                Result: Breakthrough Indian technologies fail to deploy in high-impact public domains.
              </div>
            </div>
          </div>

          {/* Solution Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-300 text-center shadow-sm">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              PragatiAI connects both sides through one structured, transparent platform.
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto font-medium">
              Transforming bureaucratic friction into a standardized 7-step innovation pipeline with automated DPIIT eligibility, explainable AI matching, and milestone-backed contracts.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 7-STEP TIMELINE */}
      <section id="how-it-works" className="py-20 bg-[#F4F6F9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Structured Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How PragatiAI Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A 7-step structured procurement lifecycle engineered to provide absolute transparency, measurable pilot accountability, and rapid procurement execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-sky-700/60 font-mono group-hover:text-sky-700 transition-colors">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-sky-700 font-semibold">
                    <span>Explore Step {step.num}</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}

            {/* Special Final Card: Scale-Up Outcome */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-700 to-blue-900 text-white border border-sky-600 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Target Outcome</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Statewide Deployment</h3>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Validated solutions bypass multi-year bureaucratic friction to expand from a 50 km pilot corridor to all 31 districts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20">
                <Link
                  to="/login"
                  className="w-full text-center py-2 px-3 bg-white hover:bg-slate-100 text-sky-900 rounded-lg text-xs font-bold block transition-colors shadow-sm"
                >
                  Enter Demonstration Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE PORTALS SELECTION */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Multi-Stakeholder Experience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Role-Specific Workspaces
            </h2>
            <p className="text-sm text-slate-600">
              PragatiAI provides dedicated workflows customized to the exact legal, technical, and operational needs of each ecosystem participant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Government Officer */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Government Officer</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create outcome-based challenges, discover deep-tech startups, monitor active pilots, and authorize procurement scaling.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('government', '/government/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Continue as Officer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Startup */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-4">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Startup Founder</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover matching government opportunities, verify DPIIT eligibility, submit proposals, and track milestone disbursements.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('startup', '/startup/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Continue as Startup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expert Evaluator */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-white transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-800 mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Expert Evaluator</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conduct objective peer evaluations with weighted multi-factor rubrics and recommend high-conviction pilot shortlists.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('expert', '/expert/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Continue as Expert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Platform Admin */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Platform Admin</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspect platform-wide telemetry, verify tamper-evident audit trails, and manage governance policies.
                </p>
              </div>
              <button
                onClick={() => handleRoleSelect('admin', '/admin/dashboard')}
                className="mt-6 w-full py-2.5 px-4 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Continue as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CHALLENGES SECTION */}
      <section id="challenges" className="py-20 bg-[#F4F6F9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Open Opportunities</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Active Innovation Challenges
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore outcome-based problem statements published by Indian government departments.
              </p>
            </div>
            <Link
              to="/government/challenges"
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View All Challenges</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.slice(0, 4).map((ch) => (
              <div
                key={ch.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                      {ch.department}
                    </span>
                    <StatusBadge status={ch.status} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {ch.problemDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                    <div>
                      <span className="text-slate-500 block">Pilot Budget:</span>
                      <span className="font-bold text-slate-900">{ch.budgetRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Duration:</span>
                      <span className="font-bold text-slate-900">{ch.pilotDuration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(ch.techArea ?? []).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {ch.applicationsCount} Proposals Submitted
                  </span>
                  <Link
                    to="/startup/challenges"
                    className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
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
