import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Flag, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const FindChallenges: React.FC = () => {
  const { challenges } = usePragati();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');

  const filtered = challenges.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Flag className="w-4 h-4" />
          <span>Government Demand Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Find Innovation Challenges
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Explore public sector problem statements open for startup solution proposals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search open challenges by technology or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gov-input pl-10 text-xs"
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(ch => (
          <div
            key={ch.id}
            className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-sky-400 bg-sky-950/70 border border-sky-800/50 px-2.5 py-0.5 rounded-full">
                  {ch.department}
                </span>
                <StatusBadge status={ch.status} />
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-sky-300 transition-colors">
                {ch.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {ch.problemDescription}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#070E1E] p-3 rounded-xl border border-slate-800/80 mb-4">
                <div>
                  <span className="text-slate-400 block">Sanctioned Pilot Budget:</span>
                  <span className="font-bold text-slate-200">{ch.budgetRange}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Field Trial Duration:</span>
                  <span className="font-bold text-slate-200">{ch.pilotDuration}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {ch.techArea.map((tech, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Deadline: {ch.deadline}
              </span>
              <Link
                to={`/startup/apply/${ch.id}`}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Submit Solution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
