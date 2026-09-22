import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  FileCheck, 
  ArrowRight, 
  Eye, 
  Calendar, 
  Building2, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const StartupApplications: React.FC = () => {
  const { applications } = usePragati();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Submission Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Submitted Proposals
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time status updates across screening, evaluation, and pilot sanctioning.
          </p>
        </div>

        <Link
          to="/startup/challenges"
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto"
        >
          <span>Find More Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/40 transition-all shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-sky-400 font-semibold">{app.department}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{app.challengeTitle}</h3>
                <span className="text-[11px] text-slate-400">Submission Date: {app.submissionDate}</span>
              </div>
              <div className="sm:text-right">
                <StatusBadge status={app.status} size="md" />
                <div className="text-xs text-slate-300 font-mono font-bold mt-1.5">
                  Quoted: {app.budgetQuoted}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {app.technicalProposal}
            </p>

            {app.expertScore && (
              <div className="p-3.5 rounded-xl bg-[#070E1E] border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Expert Evaluation Score: <strong className="text-emerald-400 font-bold">{app.expertScore}/100</strong></span>
                  <span className="text-slate-400">• Recommendation: {app.expertRecommendation}</span>
                </div>
                <Link
                  to="/startup/pilots"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300"
                >
                  View Pilot Deliverables →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
