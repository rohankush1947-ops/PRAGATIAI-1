import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  FileCheck, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  Building2, 
  AlertCircle, 
  Paperclip, 
  Check, 
  Send 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const StartupApplicationForm: React.FC = () => {
  const { challengeId } = useParams();
  const [searchParams] = useSearchParams();
  const queryStartupId = searchParams.get('startupId');
  const { challenges, startups, applyForChallenge, addToast } = usePragati();
  const navigate = useNavigate();

  const selectedChallenge = 
    challenges.find(c => c.id.toLowerCase() === challengeId?.toLowerCase()) || 
    challenges[0];

  const targetStartup = 
    (queryStartupId ? startups.find(s => s.id.toLowerCase() === queryStartupId.toLowerCase()) : null) || 
    startups[0];

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    startupName: targetStartup?.name || '',
    startupId: targetStartup?.id || '',
    technicalProposal: `Technical proposal submitted by ${targetStartup?.name || 'Startup'} tailored for ${selectedChallenge?.title || 'Challenge'}. Proposing verified edge AI and domain-specific solution meeting all tender KPIs.`,
    implementationPlan: `Phase 1: Hardware/Software retrofitting (Day 1-14). Phase 2: Pilot corridor calibration (Day 15-30). Phase 3: Daily monitoring and department dashboard integration (Day 31-75). Phase 4: Verification and KPI sign-off (Day 76-90).`,
    expectedImpact: `Direct operational fulfillment of key challenge KPIs, reducing survey and response turnaround by 75%+ and enhancing department visibility.`,
    budgetQuoted: selectedChallenge?.budgetRange || '₹35,00,000',
    pilotPlan: `${selectedChallenge?.pilotDuration || '90-Day'} controlled deployment covering target public jurisdiction.`,
    documents: [
      'Technical_Architecture_Document.pdf',
      'DPIIT_Startup_Certificate.pdf',
      'ISO_9001_Quality_Certification.pdf'
    ]
  });

  useEffect(() => {
    if (targetStartup) {
      setFormData(prev => ({
        ...prev,
        startupName: targetStartup.name,
        startupId: targetStartup.id,
        budgetQuoted: selectedChallenge?.budgetRange || prev.budgetQuoted,
        pilotPlan: `${selectedChallenge?.pilotDuration || '90-Day'} controlled deployment covering target public jurisdiction.`,
        technicalProposal: prev.technicalProposal.includes('tailored for')
          ? `Technical proposal submitted by ${targetStartup.name} tailored for ${selectedChallenge?.title || 'Challenge'}. Proposing verified ${targetStartup.domain} technology meeting all tender milestones.`
          : prev.technicalProposal
      }));
    }
  }, [targetStartup, selectedChallenge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyForChallenge({
      challengeId: selectedChallenge.id,
      challengeTitle: selectedChallenge.title,
      department: selectedChallenge.department,
      startupId: formData.startupId,
      startupName: formData.startupName,
      technicalProposal: formData.technicalProposal,
      implementationPlan: formData.implementationPlan,
      expectedImpact: formData.expectedImpact,
      budgetQuoted: formData.budgetQuoted,
      pilotPlan: formData.pilotPlan,
      documents: formData.documents
    });
    setSubmitted(true);
  };

  if (submitted) {
    const receiptRef = `APP-2026-${selectedChallenge?.id || 'CH'}-${formData.startupId ? formData.startupId.replace('startup-', '').toUpperCase() : 'SUB'}`;
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-scale-up">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
            Receipt Reference: {receiptRef}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Application Submitted Successfully
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            Your proposal from <strong>{formData.startupName}</strong> for <strong>{selectedChallenge.title}</strong> has been received by the {selectedChallenge.department} and routed for automated DPIIT eligibility verification.
          </p>
        </div>

        {/* Status Tracker */}
        <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 text-left text-xs space-y-3 max-w-md mx-auto">
          <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
            Review Stages
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span>1. Application Submission</span>
              <span className="font-bold">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between text-sky-400">
              <span>2. Automated Eligibility Screening</span>
              <span className="font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>3. Expert Evaluation Rubric</span>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/startup/applications"
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
          >
            Track My Applications
          </Link>
          <Link
            to="/startup/eligibility"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span className="text-white font-semibold">Inspect Eligibility Status</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Outcome Proposal Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Startup Solution Proposal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Submit your technical architecture, expected pilot deliverables, and commercial quote.
        </p>
      </div>

      {/* Challenge Details Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">{selectedChallenge.department}</span>
        <h3 className="text-base font-bold text-slate-900">{selectedChallenge.title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{selectedChallenge.problemDescription}</p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>Budget Range: <strong className="text-slate-900">{selectedChallenge.budgetRange}</strong></span>
          <span>•</span>
          <span>Pilot Duration: <strong className="text-slate-900">{selectedChallenge.pilotDuration}</strong></span>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Startup Name
            </label>
            <input
              type="text"
              value={formData.startupName}
              disabled
              className="gov-input opacity-80 cursor-not-allowed bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Commercial Quote for 90-Day Pilot (INR) *
            </label>
            <input
              type="text"
              value={formData.budgetQuoted}
              onChange={(e) => setFormData({ ...formData, budgetQuoted: e.target.value })}
              className="gov-input font-semibold"
              placeholder="e.g. ₹38,50,000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Technical Solution & Architecture *
          </label>
          <textarea
            rows={4}
            value={formData.technicalProposal}
            onChange={(e) => setFormData({ ...formData, technicalProposal: e.target.value })}
            className="gov-input text-xs"
            placeholder="Describe your proprietary technology and model architecture..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Implementation & Phased Rollout Plan *
            </label>
            <textarea
              rows={3}
              value={formData.implementationPlan}
              onChange={(e) => setFormData({ ...formData, implementationPlan: e.target.value })}
              className="gov-input text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expected Public Safety & Cost Impact *
            </label>
            <textarea
              rows={3}
              value={formData.expectedImpact}
              onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
              className="gov-input text-xs"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            90-Day Controlled Pilot Plan *
          </label>
          <textarea
            rows={3}
            value={formData.pilotPlan}
            onChange={(e) => setFormData({ ...formData, pilotPlan: e.target.value })}
            className="gov-input text-xs"
            required
          />
        </div>

        {/* Uploaded Documents */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Verified Attached Documents
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formData.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <Paperclip className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold shrink-0">Attached</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Compliant with GFR Rule 173(i) DPIIT Exemption Norms
          </span>

          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Application</span>
          </button>
        </div>
      </form>
    </div>
  );
};
