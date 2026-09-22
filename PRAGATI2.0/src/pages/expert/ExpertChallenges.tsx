import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { 
  Flag, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Calendar, 
  Clock, 
  Eye, 
  FileText, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  X,
  Target,
  Users
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const ExpertChallenges: React.FC = () => {
  const { challenges: contextChallenges } = usePragati();
  const { challengeId: routeChallengeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fresh challenges state from backend
  const [challenges, setChallenges] = useState<Challenge[]>(contextChallenges || []);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Sync challenges from backend API on mount to ensure fresh persisted data
  useEffect(() => {
    let isMounted = true;
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const data = await api.getChallenges();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setChallenges(data);
        }
      } catch (err) {
        console.warn('Could not fetch fresh challenges in ExpertChallenges, using context:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChallenges();
    return () => { isMounted = false; };
  }, []);

  // Update when context changes
  useEffect(() => {
    if (contextChallenges && contextChallenges.length > 0) {
      setChallenges(contextChallenges);
    }
  }, [contextChallenges]);

  // Handle direct navigation via route param or search param (e.g. /expert/challenges/:challengeId or ?challengeId=...)
  useEffect(() => {
    const targetId = routeChallengeId || searchParams.get('challengeId');
    if (targetId && challenges.length > 0) {
      const match = challenges.find(c => c.id.toUpperCase() === targetId.toUpperCase());
      if (match) {
        setSelectedChallenge(match);
        setDetailsModalOpen(true);
      }
    }
  }, [routeChallengeId, searchParams, challenges]);

  const handleOpenDetails = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setDetailsModalOpen(true);
    setSearchParams({ challengeId: ch.id });
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedChallenge(null);
    setSearchParams({});
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(challenges.map(c => c.category || c.department).filter(Boolean)))];

  // Filtering
  const filtered = challenges.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      (c.techArea && c.techArea.some(t => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || 
      (c.category === selectedCategory || c.department === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Statutory Technical Peer Review
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Rule 173 GFR / GeM Innovation Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Government Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Inspect public sector problem statements, evaluate technical feasibility, and score outcome-based RFP criteria across public departments.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/expert/dashboard"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Evaluator Dashboard</span>
          </Link>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-purple-700 block uppercase font-bold">Total Challenges</span>
            <span className="text-xl font-mono font-extrabold text-purple-900">{challenges.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-expert-search-challenges"
            type="text"
            placeholder="Search by title, department, ID (e.g. CH-007), or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gov-input pl-9 text-xs w-full"
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Sector:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-[#070E1E] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B1528] border border-slate-800 space-y-3">
          <Flag className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Government Challenges Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? `No challenges matching "${search}".` : 'No challenges currently registered in the database.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 mt-2"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(ch => (
            <div
              key={ch.id}
              id={`expert-card-${ch.id}`}
              className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      id={`badge-id-${ch.id}`}
                      className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-800/60 px-2 py-0.5 rounded"
                    >
                      {ch.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">
                      {ch.department}
                    </span>
                  </div>
                  <StatusBadge status={ch.status} />
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-purple-300 transition-colors">
                  {ch.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {ch.problemDescription || (ch as any).problemStatement}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#070E1E] p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-slate-400 block">Sanctioned Budget:</span>
                    <span className="font-bold text-slate-200">{ch.budgetRange || (ch as any).budget || '₹25 - 50 Lakhs'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pilot Duration:</span>
                    <span className="font-bold text-slate-200">{ch.pilotDuration || (ch as any).timeline || '90 Days'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(ch.techArea || []).map((tech, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{ch.applicationsCount || 0} Proposals</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id={`btn-open-challenge-${ch.id}`}
                    onClick={() => handleOpenDetails(ch)}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Challenge</span>
                  </button>
                  <Link
                    id={`btn-eval-rubric-${ch.id}`}
                    to={`/expert/evaluate/${ch.id}`}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Rubric</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHALLENGE DETAILS MODAL FOR EXPERT */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={handleCloseDetails}
        title={selectedChallenge ? `${selectedChallenge.title}` : 'Challenge Details'}
        subtitle={selectedChallenge ? `${selectedChallenge.department} • Ref ID: ${selectedChallenge.id}` : ''}
        maxWidth="3xl"
      >
        {selectedChallenge && (
          <div className="space-y-6 text-xs">
            {/* Header info pills */}
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span 
                    id="modal-challenge-id"
                    className="text-xs font-mono font-bold text-purple-300 bg-purple-950 border border-purple-700 px-2.5 py-1 rounded-full"
                  >
                    ID: {selectedChallenge.id}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    {selectedChallenge.department}
                  </span>
                </div>
                <StatusBadge status={selectedChallenge.status} />
              </div>
              <h3 id="modal-challenge-title" className="text-lg font-bold text-white">
                {selectedChallenge.title}
              </h3>
            </div>

            {/* Problem Statement */}
            <div>
              <span className="font-bold text-slate-200 block text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Problem Statement:
              </span>
              <p 
                id="modal-challenge-problem"
                className="text-slate-300 bg-[#070E1E] p-4 rounded-xl border border-slate-800 leading-relaxed text-xs sm:text-sm"
              >
                {selectedChallenge.problemDescription || (selectedChallenge as any).problemStatement}
              </p>
            </div>

            {/* Department, Sector, Budget & Timeline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Governing Dept:</span>
                <span id="modal-challenge-department" className="font-bold text-slate-200 truncate block">
                  {selectedChallenge.department}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Sector / Category:</span>
                <span id="modal-challenge-sector" className="font-bold text-slate-200 truncate block">
                  {selectedChallenge.category || (selectedChallenge as any).sector || 'General'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Sanctioned Budget:</span>
                <span id="modal-challenge-budget" className="font-bold text-emerald-400 block">
                  {selectedChallenge.budgetRange || (selectedChallenge as any).budget || '₹25 - 50 Lakhs'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Trial Timeline:</span>
                <span id="modal-challenge-timeline" className="font-bold text-sky-400 block">
                  {selectedChallenge.pilotDuration || (selectedChallenge as any).timeline || '90 Days'}
                </span>
              </div>
            </div>

            {/* Required Technologies */}
            <div>
              <span className="font-bold text-slate-200 block text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Required Technologies:
              </span>
              <div id="modal-challenge-technologies" className="flex flex-wrap gap-2">
                {(selectedChallenge.techArea || []).map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-300 font-semibold text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Capabilities / Requirements */}
            {selectedChallenge.requiredCapabilities && selectedChallenge.requiredCapabilities.length > 0 && (
              <div>
                <span className="font-bold text-slate-200 block text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  Mandatory Operational Capabilities:
                </span>
                <ul id="modal-challenge-capabilities" className="list-disc list-inside space-y-1 text-slate-300 bg-[#070E1E] p-3 rounded-xl border border-slate-800 text-[11px]">
                  {selectedChallenge.requiredCapabilities.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* KPIs */}
            {selectedChallenge.kpis && selectedChallenge.kpis.length > 0 && (
              <div>
                <span className="font-bold text-slate-200 block text-xs mb-1.5 uppercase tracking-wider">
                  Target Evaluation KPIs:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedChallenge.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#070E1E] border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">{kpi.name}</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">{kpi.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Rubric / Criteria */}
            {selectedChallenge.evaluationCriteria && selectedChallenge.evaluationCriteria.length > 0 && (
              <div>
                <span className="font-bold text-slate-200 block text-xs mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Statutory Evaluation Rubric & Weights:
                </span>
                <div className="space-y-2 bg-[#070E1E] p-3 rounded-xl border border-slate-800">
                  {selectedChallenge.evaluationCriteria.map((crit, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                      <div>
                        <span className="font-semibold text-slate-200">{crit.name}</span>
                        {crit.description && <p className="text-[10px] text-slate-400">{crit.description}</p>}
                      </div>
                      <span className="font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/80">
                        {crit.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseDetails}
                className="gov-button-secondary"
              >
                Close
              </button>

              <Link
                id={`btn-modal-evaluate-${selectedChallenge.id}`}
                to={`/expert/evaluate/${selectedChallenge.id}`}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Open Evaluation Rubric for this Challenge</span>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
