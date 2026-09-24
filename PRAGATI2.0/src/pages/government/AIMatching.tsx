import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { api } from '../../services/api';
import { AIMatchingResponse, AIMatchResult, Challenge } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Check, 
  Sliders,
  Loader2,
  ChevronDown,
  Info,
  ShieldCheck,
  Building2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  FileText
} from 'lucide-react';
import { CircularScore } from '../../components/common/CircularScore';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { evaluateChallengeMatches } from '../../../server/src/services/matchingEngine';

export const AIMatching: React.FC = () => {
  const { challenges, startups, shortlistStartup, addToast } = usePragati();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Challenge selection state
  const queryChallengeId = searchParams.get('challengeId');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    queryChallengeId || ''
  );
  const [externalChallenge, setExternalChallenge] = useState<Challenge | null>(null);

  // Sync state with query param if it changes
  useEffect(() => {
    if (queryChallengeId) {
      setSelectedChallengeId(queryChallengeId);
    } else if (!selectedChallengeId && challenges.length > 0) {
      setSelectedChallengeId(challenges[0].id);
    }
  }, [queryChallengeId, challenges]);

  // Load challenge directly from backend if not yet in context state
  useEffect(() => {
    if (!selectedChallengeId) return;
    const exists = challenges.some(c => c.id.toUpperCase() === selectedChallengeId.toUpperCase());
    if (!exists) {
      api.getChallengeById(selectedChallengeId)
        .then(c => {
          if (c) setExternalChallenge(c);
        })
        .catch(() => {
          // Keep externalChallenge as null
        });
    } else {
      setExternalChallenge(null);
    }
  }, [selectedChallengeId, challenges]);

  const selectedChallenge = 
    challenges.find(c => c.id.toUpperCase() === selectedChallengeId?.toUpperCase()) || 
    externalChallenge || 
    (challenges.length > 0 ? challenges[0] : null);

  // API Matching state
  const [loading, setLoading] = useState<boolean>(true);
  const [matchingData, setMatchingData] = useState<AIMatchingResponse | null>(null);
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [proposalModalOpen, setProposalModalOpen] = useState<boolean>(false);
  const [shortlistedStartups, setShortlistedStartups] = useState<Record<string, boolean>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchMatches = async (targetId: string) => {
    if (!targetId) return;
    setLoading(true);
    setFetchError(null);
    try {
      const response = await api.getAIMatching(targetId);
      setMatchingData(response);
      if (response.matches && response.matches.length > 0) {
        setActiveCandidateId(response.matches[0].startupId);
      }
    } catch (error: any) {
      console.warn('Backend API unreachable, using client-side deterministic fallback engine:', error);
      const targetChallenge = 
        challenges.find(c => c.id.toUpperCase() === targetId.toUpperCase()) || 
        externalChallenge || 
        challenges[0];
      if (targetChallenge && startups.length > 0) {
        const fallbackResults = evaluateChallengeMatches(targetChallenge, startups);
        setMatchingData({
          ...fallbackResults,
          weightsUsed: fallbackResults.weightsUsed as any,
          mode: 'fallback',
          modelUsed: 'Deterministic Fallback Engine (Client Preview Mode)',
          matches: fallbackResults.matches as any
        });
        if (fallbackResults.matches && fallbackResults.matches.length > 0) {
          setActiveCandidateId(fallbackResults.matches[0].startupId);
        }
      } else {
        const msg = error?.message || 'Unable to connect to live AI matching engine.';
        setFetchError(msg);
        addToast('error', 'Match Engine Error', 'Unable to calculate startup matches from backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI Matching evaluation from backend
  useEffect(() => {
    if (selectedChallengeId) {
      fetchMatches(selectedChallengeId);
    }
  }, [selectedChallengeId]);

  // Handle challenge change
  const handleChallengeChange = (newChallengeId: string) => {
    setSelectedChallengeId(newChallengeId);
    setSearchParams({ challengeId: newChallengeId });
  };

  // Active recommended/selected startup
  const topMatch = matchingData?.matches?.[0];
  const activeStartup: AIMatchResult | undefined = 
    matchingData?.matches?.find(m => m.startupId === activeCandidateId) || topMatch;

  const isShortlisted = activeStartup ? !!shortlistedStartups[activeStartup.startupId] : false;

  const handleShortlist = async () => {
    if (!activeStartup) return;
    setShortlistedStartups(prev => ({ ...prev, [activeStartup.startupId]: true }));
    await shortlistStartup(selectedChallengeId, activeStartup.startupId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Explainable Match Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          AI-Powered Startup Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Objective capability scoring based on verified patent records, past pilot telemetry, and technical RFP compliance.
        </p>
      </div>

      {/* Challenge Context Strip with Dropdown Selector */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Selected Department Challenge
          </span>
          {challenges.length > 1 ? (
            <div className="relative inline-block w-full max-w-md">
              <select
                id="challenge-selector"
                value={selectedChallengeId}
                onChange={(e) => handleChallengeChange(e.target.value)}
                className="w-full bg-white text-sm font-bold text-slate-900 border border-slate-300 rounded-lg py-1.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 appearance-none cursor-pointer shadow-sm"
              >
                {challenges.map(c => (
                  <option key={c.id} value={c.id} className="bg-white text-slate-900">
                    {c.title} ({c.department})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          ) : (
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              {selectedChallenge?.title}
            </h4>
          )}
          <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="text-slate-700 font-medium">{selectedChallenge?.department}</span>
            <span className="text-slate-400">•</span>
            <span className="text-sky-700 font-semibold">{selectedChallenge?.category}</span>
          </div>
        </div>

        <Link
          to="/government/challenges"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 shrink-0 flex items-center gap-1 self-start sm:self-center"
        >
          <span>All Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="p-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-800">Evaluating available startups against challenge RFP...</p>
          <span className="text-xs text-slate-500">Computing technology, domain, experience, and eligibility vectors</span>
        </div>
      )}

      {/* ERROR STATE */}
      {fetchError && !loading && !matchingData && (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-rose-200 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-slate-900">AI Match Engine Unreachable</h3>
            <p className="text-xs text-slate-600">
              {fetchError}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Ensure the PragatiAI modular backend is active via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sky-700 font-mono">npm run dev:server</code> on port 5000.
            </p>
          </div>
          <button
            id="btn-retry-matching"
            onClick={() => fetchMatches(selectedChallengeId)}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm mt-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry AI Evaluation</span>
          </button>
        </div>
      )}

      {/* CANDIDATE SELECTOR TABS STRIP */}
      {!loading && matchingData?.matches && matchingData.matches.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-700" />
              <span>Evaluated Deep-Tech Candidates ({matchingData.matches.length}):</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Select any candidate to inspect evaluation score and solution proposal
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {matchingData.matches.map((m) => {
              const isSelected = m.startupId === activeStartup?.startupId;
              return (
                <button
                  key={m.startupId}
                  id={`btn-select-candidate-${m.startupId}`}
                  onClick={() => setActiveCandidateId(m.startupId)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-900/20 border border-sky-400'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{m.rank}
                  </span>
                  <span>{m.startupName}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-sky-800 text-sky-100' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {m.overallScore}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP MATCH RECOMMENDATION CARD */}
      {!loading && activeStartup && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-8">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase">
                  Rank #{activeStartup.rank} Recommendation
                </span>
                
                {/* Engine Mode Badge */}
                {matchingData?.mode === 'ai' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-300 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-sky-600" />
                    <span>AI-Powered Match</span>
                    {matchingData.modelUsed && (
                      <span className="text-[9px] text-slate-500 font-mono normal-case">({matchingData.modelUsed})</span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase tracking-wider" title="Operating with deterministic statutory scoring">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>Rule-Based Fallback Engine</span>
                  </span>
                )}

                <span className="text-xs text-slate-500">{activeStartup.confidence} Match Confidence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {activeStartup.startupName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {activeStartup.tagline}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  {activeStartup.domain}
                </span>
                <span>Stage: <strong className="text-slate-800">{activeStartup.stage}</strong></span>
                <span>Location: <strong className="text-slate-800">{activeStartup.location}</strong></span>
              </div>
            </div>

            {/* Circular Score display */}
            <div className="flex items-center justify-center">
              <CircularScore
                score={activeStartup.overallScore}
                size={130}
                strokeWidth={9}
                label="Overall Match"
                sublabel={activeStartup.confidenceTier}
              />
            </div>
          </div>

          {/* Explainable AI Rationale Highlight */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-900 leading-relaxed">
            <strong className="text-sky-950 font-bold">Explainable AI Rationale:</strong> {activeStartup.explanation}
          </div>

          {/* EXPLAINABLE SCORING BREAKDOWN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Explainable Scoring Breakdown
              </h3>
              <span className="text-xs text-slate-500">Weights configured by RFP Rubric</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStartup.breakdown.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{factor.label}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5 font-medium">
                        ({factor.weight} weight)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {factor.score}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={factor.score} 
                    color={factor.score >= 85 ? 'emerald' : factor.score >= 70 ? 'amber' : 'sky'} 
                    size="sm" 
                    showPercentage={false} 
                  />
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Gaps Highlights */}
          {(activeStartup.strengths.length > 0 || (activeStartup.gaps && activeStartup.gaps.length > 0) || activeStartup.riskFactors.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {activeStartup.strengths.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Verified Strengths
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    {activeStartup.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {((activeStartup.gaps && activeStartup.gaps.length > 0) || activeStartup.riskFactors.length > 0) && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                  <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    Identified Gaps & Advisory Considerations
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    {(activeStartup.gaps && activeStartup.gaps.length > 0 ? activeStartup.gaps : activeStartup.riskFactors).map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              id="btn-compare-candidates"
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Compare All {matchingData?.matches?.length || 0} Candidates</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-open-proposal"
                onClick={() => setProposalModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Proposal</span>
              </button>

              <Link
                to={`/startup/profile?startupId=${activeStartup?.startupId || ''}`}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                id="btn-shortlist-pilot"
                onClick={handleShortlist}
                disabled={isShortlisted}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isShortlisted
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Shortlisted for Pilot</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Shortlist for Pilot Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON MODAL */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Candidate Comparison Matrix"
        subtitle={`Side-by-side evaluation of applicants for ${selectedChallenge?.title || 'Challenge'}`}
        maxWidth="3xl"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Click on any candidate row below to inspect their detailed explainable breakdown and rationale.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Startup Candidate</th>
                  <th className="py-2.5 px-3">Tech Match</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Readiness</th>
                  <th className="py-2.5 px-3">Overall Score</th>
                  <th className="py-2.5 px-3">Eligibility</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchingData?.matches?.map((m) => {
                  const isCurrent = m.startupId === activeStartup?.startupId;
                  return (
                    <tr
                      key={m.startupId}
                      onClick={() => {
                        setActiveCandidateId(m.startupId);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-sky-50 font-medium text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.rank === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{m.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-xs">{m.startupName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{m.domain}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-emerald-600">{m.technologyMatch}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-sky-700">{m.domainMatch}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.readinessLevel === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {m.readinessLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-sky-700 text-sm">{m.overallScore}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-medium ${
                          m.eligibilityStatus === 'Eligible' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {m.eligibilityStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCandidateId(m.startupId);
                            setCompareModalOpen(false);
                          }}
                          className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-semibold transition-colors"
                        >
                          {isCurrent ? 'Viewing' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
            <span>Evaluated {matchingData?.totalEvaluated || 0} registered startups against dynamic rubric</span>
            <button
              onClick={() => setCompareModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </Modal>

      {/* STARTUP SOLUTION PROPOSAL MODAL */}
      <Modal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        title={`Solution Proposal: ${activeStartup?.startupName || 'Startup'}`}
        subtitle={`Outcome-Based Proposal for ${selectedChallenge?.title || 'Challenge'}`}
        maxWidth="2xl"
      >
        {activeStartup && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-sky-700 block font-bold">
                    Startup Candidate ID: {activeStartup.startupId}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{activeStartup.startupName}</h4>
                  <span className="text-xs text-slate-600">{activeStartup.domain} • Stage: {activeStartup.stage}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Match Score</span>
                  <span className="text-lg font-mono font-bold text-emerald-700">{activeStartup.overallScore}%</span>
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            <div className="space-y-3">
              <div>
                <span className="font-bold text-slate-700 block text-xs mb-1">
                  Target Government Challenge & Department:
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong className="text-slate-900">{selectedChallenge?.title}</strong> ({selectedChallenge?.id})<br />
                  <span className="text-sky-700">Department: {selectedChallenge?.department}</span>
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block text-xs mb-1">
                  Technical Solution Proposal:
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {activeStartup.startupName} proposes a field-tested deep-tech architecture directly addressing {selectedChallenge?.title}. Utilizing verified {activeStartup.domain} models, edge telemetry, and automated compliance pipelines to fulfill all RFP milestones.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Pilot Timeline:</span>
                  <span className="font-bold text-slate-800">{selectedChallenge?.pilotDuration || '90 Days'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Pilot Budget Quoted:</span>
                  <span className="font-bold text-sky-700">{selectedChallenge?.budgetRange || '₹25 - 50 Lakhs'}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block text-xs mb-1">
                  Key Verified Strengths:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
                  {activeStartup.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setProposalModalOpen(false)}
                className="gov-button-secondary"
              >
                Close
              </button>

              <button
                type="button"
                id="btn-proposal-shortlist"
                onClick={async () => {
                  await handleShortlist();
                  setProposalModalOpen(false);
                }}
                disabled={isShortlisted}
                className="gov-button-primary flex items-center gap-1.5"
              >
                {isShortlisted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Already Shortlisted</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Shortlist Proposal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
