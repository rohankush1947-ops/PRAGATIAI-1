import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  ArrowRight, 
  Send, 
  Sliders, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExpertEvaluation: React.FC = () => {
  const { applicationId } = useParams();
  const { evaluations, challenges, applications, submitEvaluation, addToast } = usePragati();
  const navigate = useNavigate();

  // Find matching evaluation, challenge, or application
  const matchedEval = evaluations.find(
    e => e.id === applicationId || e.applicationId === applicationId || e.challengeId === applicationId
  );

  const matchedChallenge = challenges.find(
    c => c.id === applicationId || (matchedEval && c.id === matchedEval.challengeId)
  );

  const matchedApp = applications.find(
    a => a.id === applicationId || a.challengeId === applicationId
  );

  const evalItem = matchedEval || {
    id: `eval-${applicationId || 'dynamic'}`,
    applicationId: matchedApp?.id || `app-${applicationId || 'review'}`,
    challengeId: matchedChallenge?.id || applicationId || 'CH-001',
    challengeTitle: matchedChallenge?.title || 'Outcome-Based Government Challenge',
    startupId: matchedApp?.startupId || 'startup-candidate',
    startupName: matchedApp?.startupName || 'Deep-Tech Solution Candidate',
    evaluatorName: 'Dr. Arvind Swaminathan',
    evaluatorSpecialization: 'IIT Madras AI & Infrastructure Panel',
    date: new Date().toISOString().split('T')[0],
    scores: {
      technicalCapability: 23,
      innovation: 18,
      scalability: 18,
      costEffectiveness: 14,
      impact: 18
    },
    totalScore: 91,
    recommendation: 'Shortlist for Pilot' as const,
    remarks: matchedChallenge 
      ? `The technical proposal directly addresses ${matchedChallenge.title}. The proposed deep-tech architecture meets all RFP milestone requirements.` 
      : "The proprietary deep-tech architecture demonstrated strong operational performance meeting statutory RFP criteria.",
    isSubmitted: false
  };

  // Interactive scores with slider bounds
  const [scores, setScores] = useState({
    technicalCapability: evalItem.scores?.technicalCapability ?? 23,
    innovation: evalItem.scores?.innovation ?? 18,
    scalability: evalItem.scores?.scalability ?? 18,
    costEffectiveness: evalItem.scores?.costEffectiveness ?? 14,
    impact: evalItem.scores?.impact ?? 18
  });

  const [recommendation, setRecommendation] = useState<
    'Shortlist for Pilot' | 'Request Clarification' | 'Reject'
  >(evalItem.recommendation || 'Shortlist for Pilot');

  const [remarks, setRemarks] = useState(evalItem.remarks);

  // Sync state if applicationId or evalItem changes
  useEffect(() => {
    if (evalItem) {
      setScores({
        technicalCapability: evalItem.scores?.technicalCapability ?? 23,
        innovation: evalItem.scores?.innovation ?? 18,
        scalability: evalItem.scores?.scalability ?? 18,
        costEffectiveness: evalItem.scores?.costEffectiveness ?? 14,
        impact: evalItem.scores?.impact ?? 18
      });
      setRecommendation(evalItem.recommendation || 'Shortlist for Pilot');
      setRemarks(evalItem.remarks);
    }
  }, [evalItem.id, evalItem.challengeId]);

  // Calculate live total
  const totalScore = 
    scores.technicalCapability + 
    scores.innovation + 
    scores.scalability + 
    scores.costEffectiveness + 
    scores.impact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (recommendation === 'Shortlist for Pilot') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    submitEvaluation(evalItem.id, scores, recommendation, remarks);
    addToast('success', 'Evaluation Recorded', `Scored ${totalScore}/100 on ${evalItem.challengeTitle}`);
    navigate('/expert/dashboard');
  };

  const handleRequestClarification = () => {
    addToast('info', 'Clarification Request Dispatched', `Formal query sent to ${evalItem.startupName} technical team.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
          <Award className="w-4 h-4 text-purple-600" />
          <span>Transparent Multi-Factor Peer Review</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Expert Proposal Evaluation Rubric
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Score technical capability, innovation novelty, scalability, and impact on a weighted 100-point scale.
        </p>
      </div>

      {/* Proposal Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 uppercase">
            Challenge: {evalItem.challengeTitle}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">
            Applicant: {evalItem.startupName}
          </h2>
          <span className="text-xs text-slate-600">
            Assigned Evaluator: <strong className="text-slate-900">{evalItem.evaluatorName}</strong> ({evalItem.evaluatorSpecialization})
          </span>
        </div>

        {/* Live Total Score Pill */}
        <div className="sm:text-right shrink-0">
          <span className="text-xs text-slate-500 block">Current Cumulative Score</span>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {totalScore}/100
          </div>
          <span className="text-[11px] text-emerald-700 font-bold">
            {totalScore >= 80 ? 'Exceeds Pilot Threshold' : 'Below Pilot Threshold'}
          </span>
        </div>
      </div>

      {/* 5 WEIGHTED CRITERIA SLIDERS (PROMPT SPECIFIED) */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Weighted Evaluation Sliders
          </h3>
          <span className="text-xs text-slate-500">Drag sliders to adjust points</span>
        </div>

        {/* Criterion 1: Technical Capability — 25% */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">1. Technical Capability</span>
              <span className="text-sky-700 text-xs ml-2 font-bold">(Weight: 25%)</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {scores.technicalCapability} / 25 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Model accuracy, edge latency, hardware durability on inspection vehicles, and sub-meter GPS tagging precision.
          </p>
          <input
            type="range"
            min={0}
            max={25}
            value={scores.technicalCapability}
            onChange={(e) => setScores({ ...scores, technicalCapability: parseInt(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Criterion 2: Innovation — 20% */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">2. Innovation & Novelty</span>
              <span className="text-sky-700 text-xs ml-2 font-bold">(Weight: 20%)</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {scores.innovation} / 20 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Proprietary edge AI pipeline, IP filings, dynamic handling of rainy weather, night-time low-light road scanning.
          </p>
          <input
            type="range"
            min={0}
            max={20}
            value={scores.innovation}
            onChange={(e) => setScores({ ...scores, innovation: parseInt(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Criterion 3: Scalability — 20% */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">3. Scalability & System Integration</span>
              <span className="text-sky-700 text-xs ml-2 font-bold">(Weight: 20%)</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {scores.scalability} / 20 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            API throughput, compatibility with state PWD enterprise GIS databases, ease of retrofitting onto diverse vehicle fleets.
          </p>
          <input
            type="range"
            min={0}
            max={20}
            value={scores.scalability}
            onChange={(e) => setScores({ ...scores, scalability: parseInt(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Criterion 4: Cost Effectiveness — 15% */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">4. Cost Effectiveness</span>
              <span className="text-sky-700 text-xs ml-2 font-bold">(Weight: 15%)</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {scores.costEffectiveness} / 15 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Unit cost per road kilometer audited compared to conventional manual survey tenders (₹38.5L quoted).
          </p>
          <input
            type="range"
            min={0}
            max={15}
            value={scores.costEffectiveness}
            onChange={(e) => setScores({ ...scores, costEffectiveness: parseInt(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* Criterion 5: Impact — 20% */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">5. Public Safety & Departmental Impact</span>
              <span className="text-sky-700 text-xs ml-2 font-bold">(Weight: 20%)</span>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {scores.impact} / 20 pts
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            Anticipated reduction in pothole accidents, acceleration of municipal repair ticket resolution from weeks to 48 hours.
          </p>
          <input
            type="range"
            min={0}
            max={20}
            value={scores.impact}
            onChange={(e) => setScores({ ...scores, impact: parseInt(e.target.value) })}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
        </div>

        {/* RECOMMENDATION SELECTION (PROMPT SPECIFIED) */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Official Evaluator Recommendation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Shortlist for Pilot' as const, desc: 'Candidate meets all technical criteria for 90-day deployment.' },
              { id: 'Request Clarification' as const, desc: 'Technical queries regarding camera weather seals require response.' },
              { id: 'Reject' as const, desc: 'Fails to satisfy performance thresholds.' }
            ].map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => setRecommendation(rec.id)}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs ${
                  recommendation === rec.id
                    ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className={`font-bold text-xs ${recommendation === rec.id ? 'text-purple-900' : 'text-slate-900'}`}>{rec.id}</div>
                <div className={`text-[11px] font-normal mt-1 ${recommendation === rec.id ? 'text-purple-700' : 'text-slate-500'}`}>{rec.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Evaluator Technical Rationale & Audit Remarks *
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="gov-input text-xs"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRequestClarification}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="text-white font-semibold">Request Clarification</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-950/20 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Submit Final Evaluation ({totalScore}/100)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
