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
      accentColor: 'border-sky-200 hover:border-sky-500',
      buttonClass: 'bg-sky-700 hover:bg-sky-800 text-white',
      badgeText: 'Primary Demo Persona'
    },
    {
      id: 'startup' as UserRole,
      title: 'Startup Founder',
      subtitle: 'RoadVision AI',
      description: 'Discover relevant challenges, verify DPIIT eligibility, submit technical solutions, and track milestone disbursements.',
      icon: Rocket,
      path: '/startup/dashboard',
      accentColor: 'border-emerald-200 hover:border-emerald-500',
      buttonClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      badgeText: '94% Match Story'
    },
    {
      id: 'expert' as UserRole,
      title: 'Expert / Evaluator',
      subtitle: 'Dr. Arvind Swaminathan (IIT Madras)',
      description: 'Evaluate startup proposals against weighted criteria, provide domain scoring, and monitor active pilot outcomes.',
      icon: UserCheck,
      path: '/expert/dashboard',
      accentColor: 'border-purple-200 hover:border-purple-500',
      buttonClass: 'bg-purple-700 hover:bg-purple-800 text-white',
      badgeText: 'Rubric Evaluator'
    },
    {
      id: 'admin' as UserRole,
      title: 'System Administrator',
      subtitle: 'Platform Governance & Auditing',
      description: 'Review system-wide telemetry, verify immutable audit logs, inspect API transactions, and govern public procurement.',
      icon: Crown,
      path: '/admin/dashboard',
      accentColor: 'border-amber-200 hover:border-amber-500',
      buttonClass: 'bg-amber-700 hover:bg-amber-800 text-white',
      badgeText: 'Governance'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Authentic Indian Government Tricolor Header Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] shrink-0" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm w-full relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center border border-sky-400/40 shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                PRAGATI <span className="text-sky-700">AI</span>
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                SIH 2026 Prototype
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs text-slate-700 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-700" />
              <span>Reset Demo Data</span>
            </button>
            <Link
              to="/"
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 w-full relative z-10 my-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>Interactive Multi-Stakeholder Evaluation Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome to PragatiAI
          </h1>
          <p className="text-sm text-slate-600">
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
                className={`p-6 rounded-2xl bg-white border ${role.accentColor} transition-all duration-200 flex flex-col justify-between shadow-sm relative group hover:shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-sky-700">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {role.badgeText}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                    {role.title}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold mb-3">
                    {role.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSelectRole(role.id, role.path)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-xs ${role.buttonClass}`}
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
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-sky-800">Integrated Demo Storyline:</strong> Public Works Department created an AI Pothole Detection challenge → RoadVision AI matched with 94% compatibility → Scored 91/100 by IIT Madras evaluator → Field pilot achieved 94.2% accuracy → Authorized for statewide scale.
          </p>
        </div>
      </main>

      {/* Mini footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 relative z-10">
        PragatiAI — Smart India Hackathon 2026 Prototype • Team Pragyan
      </footer>
    </div>
  );
};
