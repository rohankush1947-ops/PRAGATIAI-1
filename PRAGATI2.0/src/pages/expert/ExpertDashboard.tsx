import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { 
  UserCheck, 
  Award, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  ArrowRight, 
  Star,
  Building2,
  Flag,
  ShieldCheck,
  Eye,
  Sliders,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ExpertDashboard: React.FC = () => {
  const { applications, evaluations, pilots, challenges: contextChallenges } = usePragati();
  const [challenges, setChallenges] = useState<Challenge[]>(contextChallenges || []);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  // Sync challenges from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const loadBackendChallenges = async () => {
      setLoadingChallenges(true);
      try {
        const data = await api.getChallenges();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setChallenges(data);
        }
      } catch (err) {
        console.warn('Could not sync challenges in ExpertDashboard, using context:', err);
      } finally {
        if (isMounted) setLoadingChallenges(false);
      }
    };

    loadBackendChallenges();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (contextChallenges && contextChallenges.length > 0) {
      setChallenges(contextChallenges);
    }
  }, [contextChallenges]);

  // Metrics
  const awaitingReview = applications.filter(a => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Expert Evaluation').length;
  const completedEvals = evaluations.filter(e => e.isSubmitted).length;
  const activePilotsCount = pilots.filter(p => p.status === 'In Progress').length;
  const totalChallengesCount = challenges.length;

  return (
    <div className="space-y-8">
      {/* Evaluator Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Dr. Arvind Swaminathan
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Professor of Transportation & Deep-Tech AI, IIT Madras</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Expert Evaluator Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Statutory peer review and multi-criteria evaluation of outcome-based Government Challenges and deep-tech startup proposals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            id="btn-expert-view-all-challenges"
            to="/expert/challenges"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>Review Government Challenges</span>
          </Link>
          <Link
            to="/expert/evaluate/app-pwd-roadvision"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>Open Scoring Rubric</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Open Government Challenges</span>
          <div id="stat-expert-challenges-count" className="text-3xl font-black text-purple-700 font-mono">
            {totalChallengesCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live across departments</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Applications Awaiting Review</span>
          <div className="text-3xl font-black text-amber-700 font-mono">
            {awaitingReview}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Assigned by Review Board</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Completed Evaluations</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {completedEvals}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Scored across 5 criteria</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 block mb-1">Active Pilots Monitored</span>
          <div className="text-3xl font-black text-sky-400 font-mono">
            {activePilotsCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Field trial oversight</span>
        </div>
      </div>

      {/* GOVERNMENT CHALLENGES OPEN FOR TECHNICAL PEER REVIEW */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Government Challenges Open for Expert Review
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Newly registered and active challenges from public departments requiring technical validation.
            </p>
          </div>
          <Link
            to="/expert/challenges"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"
          >
            <span>View All ({challenges.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {challenges.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No challenges available for review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Challenge ID</th>
                  <th className="py-2.5 px-3">Title & Problem</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Timeline</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {challenges.slice(0, 6).map((ch) => (
                  <tr 
                    key={ch.id} 
                    id={`expert-dash-row-${ch.id}`}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800 text-xs">
                        {ch.id}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-bold text-white text-xs hover:text-purple-300 transition-colors">
                        {ch.title}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {ch.problemDescription || (ch as any).problemStatement}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-xs">
                      {ch.department}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">
                      {ch.budgetRange || (ch as any).budget || '₹25 - 50 Lakhs'}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {ch.pilotDuration || (ch as any).timeline || '90 Days'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ch.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          id={`btn-dash-review-${ch.id}`}
                          to={`/expert/challenges?challengeId=${ch.id}`}
                          className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </Link>
                        <Link
                          id={`btn-dash-rubric-${ch.id}`}
                          to={`/expert/evaluate/${ch.id}`}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-3 h-3" />
                          <span>Rubric</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EVALUATION QUEUE TABLE */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Assigned Startup Proposal Evaluation Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review technical proposals and provide weighted multi-criteria scores.
            </p>
          </div>
          <span className="text-xs text-purple-400 font-bold">Standard 100-Point Rubric</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Startup</th>
                <th className="py-2.5 px-3">Challenge Problem</th>
                <th className="py-2.5 px-3">Submitted</th>
                <th className="py-2.5 px-3">Current Score</th>
                <th className="py-2.5 px-3">Recommendation</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{ev.startupName}</div>
                    <span className="text-[10px] text-slate-400">Ref: {ev.applicationId}</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-slate-200 truncate font-medium">{ev.challengeTitle}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {ev.date}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-xs">
                      {ev.totalScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs font-semibold text-sky-400">
                      {ev.recommendation}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/expert/evaluate/${ev.applicationId}`}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{ev.isSubmitted ? 'Edit Rubric' : 'Score Proposal'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
