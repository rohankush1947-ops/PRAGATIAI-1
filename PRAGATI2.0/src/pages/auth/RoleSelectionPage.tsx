import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  Rocket, 
  UserCheck, 
  Crown, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  RefreshCw
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { setCurrentRole, resetDemoData } = usePragati();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setCurrentRole(role);
    navigate(targetPath);
  };

  const roles = [
    {
      id: 'government' as UserRole,
      title: 'Government Officer',
      subtitle: 'Public Works Department (PWD)',
      description: 'Create outcome-based challenges, discover startups, manage controlled pilots, and authorize scalable procurement.',
      icon: Shield,
      path: '/government/dashboard',
      accentColor: 'border-sky-500/40 text-sky-400 bg-sky-950/40 hover:border-sky-400',
      buttonClass: 'bg-sky-600 hover:bg-sky-500 text-white',
      badgeText: 'Primary Demo Persona'
    },
    {
      id: 'startup' as UserRole,
      title: 'Startup Founder',
      subtitle: 'RoadVision AI',
      description: 'Discover relevant challenges, verify DPIIT eligibility, submit technical solutions, and track milestone disbursements.',
      icon: Rocket,
      path: '/startup/dashboard',
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40 hover:border-emerald-400',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badgeText: '94% Match Story'
    },
    {
      id: 'expert' as UserRole,
      title: 'Expert / Evaluator',
      subtitle: 'Dr. Arvind Swaminathan (IIT Madras)',
      description: 'Evaluate startup proposals against weighted criteria, provide domain scoring, and monitor active pilot outcomes.',
      icon: UserCheck,
      path: '/expert/dashboard',
      accentColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40 hover:border-purple-400',
      buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white',
      badgeText: 'Rubric Evaluator'
    },
    {
      id: 'admin' as UserRole,
      title: 'Platform Admin',
      subtitle: 'State Innovation Mission',
      description: 'Oversee platform-wide metrics, manage users, audit transactions, and ensure regulatory procurement compliance.',
      icon: Crown,
      path: '/admin/dashboard',
      accentColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40 hover:border-amber-400',
      buttonClass: 'bg-amber-600 hover:bg-amber-500 text-white',
      badgeText: 'System Governance'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070E1E] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-6 border-b border-slate-800/80 flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center border border-sky-400/40 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              PRAGATI <span className="text-sky-400">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              SIH 2026 Prototype
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1528] hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
            <span>Reset Demo Data</span>
          </button>
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full relative z-10 my-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800 text-xs font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Multi-Stakeholder Evaluation Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome to PragatiAI
          </h1>
          <p className="text-sm text-slate-300">
            Select a role to experience the complete innovation procurement journey from any stakeholder perspective. No password required.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`p-6 rounded-2xl bg-[#0B1528] border ${role.accentColor} transition-all duration-200 flex flex-col justify-between shadow-lg relative group hover:shadow-sky-950/30`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0F1C36] border border-slate-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#080E1C] border border-slate-700 text-slate-300">
                      {role.badgeText}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                    {role.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mb-3">
                    {role.subtitle}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleSelectRole(role.id, role.path)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${role.buttonClass}`}
                  >
                    <span>Continue as {role.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Storyline callout */}
        <div className="mt-8 p-4 rounded-xl bg-[#0B1528]/80 border border-slate-800 text-center">
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-sky-400">Integrated Demo Storyline:</strong> Public Works Department created an AI Pothole Detection challenge → RoadVision AI matched with 94% compatibility → Scored 91/100 by IIT Madras evaluator → Field pilot achieved 94.2% accuracy → Authorized for statewide scale.
          </p>
        </div>
      </main>

      {/* Mini footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-400 relative z-10">
        PragatiAI — Smart India Hackathon 2026 Prototype • Team Pragyan
      </footer>
    </div>
  );
};
