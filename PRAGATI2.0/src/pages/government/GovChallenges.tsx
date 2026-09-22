import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Flag, 
  PlusCircle, 
  Sparkles, 
  Search, 
  Calendar, 
  Users, 
  ArrowRight, 
  Clock, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const GovChallenges: React.FC = () => {
  const { challenges, createChallenge, addToast } = usePragati();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Register Challenge Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successChallenge, setSuccessChallenge] = useState<{ id: string; title: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: 'Municipal Corporation',
    category: 'Urban Development',
    location: 'India',
    problemStatement: '',
    requiredTechnologies: 'Computer Vision, Deep Learning, Image Classification',
    requiredCapabilities: 'Automated municipal waste classification, edge inference, real-time segregation telemetry',
    budget: '₹25 Lakhs',
    timeline: '90 Days',
    expectedOutcome: 'Automated waste classification and segregation efficiency improvement > 85%',
    minStage: 'Early Stage',
    dpiitRequired: true,
    status: 'Published'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      department: 'Municipal Corporation',
      category: 'Urban Development',
      location: 'India',
      problemStatement: '',
      requiredTechnologies: 'Computer Vision, Deep Learning, Image Classification',
      requiredCapabilities: 'Automated municipal waste classification, edge inference, real-time segregation telemetry',
      budget: '₹25 Lakhs',
      timeline: '90 Days',
      expectedOutcome: 'Automated waste classification and segregation efficiency improvement > 85%',
      minStage: 'Early Stage',
      dpiitRequired: true,
      status: 'Published'
    });
    setErrorMsg(null);
    setSuccessChallenge(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Validation
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a challenge title.');
      return;
    }
    if (!formData.problemStatement.trim()) {
      setErrorMsg('Please enter a problem statement describing the challenge.');
      return;
    }
    if (!formData.department.trim()) {
      setErrorMsg('Please specify the governing government department.');
      return;
    }

    const techArray = formData.requiredTechnologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (techArray.length === 0) {
      setErrorMsg('Please enter at least one required technology.');
      return;
    }

    const capabilitiesArray = formData.requiredCapabilities
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      const createdId = await createChallenge({
        title: formData.title.trim(),
        department: formData.department.trim(),
        category: formData.category.trim(),
        sector: formData.category.trim(),
        location: formData.location.trim(),
        problemDescription: formData.problemStatement.trim(),
        problemStatement: formData.problemStatement.trim(),
        targetOutcome: formData.expectedOutcome.trim(),
        expectedOutcome: formData.expectedOutcome.trim(),
        budgetRange: formData.budget.trim(),
        budget: formData.budget.trim(),
        pilotDuration: formData.timeline.trim(),
        timeline: formData.timeline.trim(),
        techArea: techArray,
        requiredTechnologies: techArray,
        requiredCapabilities: capabilitiesArray,
        deadline: '2026-12-31',
        kpis: [
          { name: 'Model / Solution Accuracy', target: '≥ 90%', unit: '%' },
          { name: 'Turnaround / Classification Speed', target: '≤ 5 seconds', unit: 'sec' },
          { name: 'Operational Field Uptime', target: '≥ 95%', unit: '%' }
        ],
        constraints: [
          'Field deployment reliability under local municipal operating conditions',
          'Data security and compliance with Indian CERT-In standards'
        ],
        eligibility: {
          startupAgeYears: 10,
          turnover: 'Up to ₹25 Cr (DPIIT Recognized)',
          minExperienceYears: 1,
          techRequirements: techArray.slice(0, 2),
          certifications: ['DPIIT Startup Certificate'],
          minStage: formData.minStage,
          dpiitRequired: formData.dpiitRequired
        },
        evaluationCriteria: [
          { name: 'Technical Viability & Accuracy', weight: 35, maxScore: 35, description: 'Evaluation of model precision and software reliability' },
          { name: 'Domain Experience & Field Track Record', weight: 25, maxScore: 25, description: 'Past deployments and demonstrated capability' },
          { name: 'Pilot Readiness & Hardware Integration', weight: 20, maxScore: 20, description: 'Readiness for immediate field trials' },
          { name: 'Cost Competitiveness & Value for Money', weight: 20, maxScore: 20, description: 'Pilot quote alignment with department budget' }
        ],
        status: formData.status,
        allowDuplicate: true
      } as any);

      setSuccessChallenge({
        id: createdId,
        title: formData.title.trim()
      });
      addToast('success', 'Challenge Registered', `Challenge ${createdId} registered and saved to database.`);
    } catch (err: any) {
      console.error('Error registering challenge:', err);
      setErrorMsg(err?.message || 'Failed to register challenge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = challenges.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Flag className="w-4 h-4" />
            <span>Problem Statements & RFPs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Government Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Explore, manage, and register outcome-based challenges across public departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/government/ai-assistant"
            className="px-3.5 py-2 rounded-xl bg-[#0F1C36] hover:bg-slate-800 border border-sky-500/40 text-xs font-semibold text-sky-400 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </Link>
          
          <button
            id="btn-register-new-challenge"
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Register New Challenge</span>
          </button>

          <Link
            to="/government/create-challenge"
            className="px-3 py-2 rounded-xl bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Wizard</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-[#0B1528] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Pilot', 'Open', 'Review', 'Published'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === tab
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-[#070E1E] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab === 'All' ? 'All Challenges' : tab}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, department, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gov-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(ch => (
          <div
            key={ch.id}
            className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-sky-300 bg-sky-950/90 border border-sky-800/60 px-2 py-0.5 rounded">
                    {ch.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">
                    {ch.department}
                  </span>
                </div>
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
                  <span className="text-slate-400 block">Pilot Budget:</span>
                  <span className="font-bold text-slate-200">{ch.budgetRange || ch.budget || '₹25 - 50 Lakhs'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pilot Duration:</span>
                  <span className="font-bold text-slate-200">{ch.pilotDuration || ch.timeline || '90 Days'}</span>
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
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>{ch.applicationsCount || 0} Proposals</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  id={`match-${ch.id}`}
                  to={`/government/ai-matching?challengeId=${ch.id}`}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  <span>AI Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER NEW CHALLENGE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Register New Government Challenge"
        subtitle="Formulate an outcome-based challenge to trigger real-time AI startup matching."
        maxWidth="2xl"
      >
        {successChallenge ? (
          <div className="py-6 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/90 border-2 border-emerald-500/80 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-block text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-600/60 px-3.5 py-1 rounded-full">
                Challenge ID: {successChallenge.id}
              </span>
              <h3 className="text-xl font-black text-white">
                Challenge Registered Successfully
              </h3>
              <p className="text-xs text-slate-300">
                "{successChallenge.title}"
              </p>
              <p className="text-xs text-emerald-400 font-medium">
                Your challenge is now saved to the backend database and available for AI startup matching.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                id="btn-modal-find-matches"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate(`/government/ai-matching?challengeId=${successChallenge.id}`);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find AI Matches</span>
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View in Challenges Grid</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                + Register Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-3 bg-[#070E1E] p-4 rounded-xl border border-slate-800/80">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Basic Information</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Based Municipal Waste Classification"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="gov-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal Corporation"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="gov-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Sector / Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Urban Development"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="gov-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pan-India or State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="gov-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Problem Statement *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the operational challenge, field bottlenecks, and required technological intervention..."
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  className="gov-input"
                />
              </div>
            </div>

            {/* Technical & Implementation Requirements */}
            <div className="space-y-3 bg-[#070E1E] p-4 rounded-xl border border-slate-800/80">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Technical & Implementation Requirements</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Required Technologies * (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Vision, Deep Learning, Image Classification, Edge AI"
                  value={formData.requiredTechnologies}
                  onChange={(e) => setFormData({ ...formData, requiredTechnologies: e.target.value })}
                  className="gov-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Required Capabilities
                </label>
                <input
                  type="text"
                  placeholder="e.g. UAV drone inspection, real-time telemetry, automated anomaly segmentation"
                  value={formData.requiredCapabilities}
                  onChange={(e) => setFormData({ ...formData, requiredCapabilities: e.target.value })}
                  className="gov-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Pilot Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25 Lakhs"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="gov-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Timeline / Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 90 Days"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="gov-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Expected Outcome / Solution
                </label>
                <input
                  type="text"
                  placeholder="e.g. Automated waste classification and segregation efficiency improvement > 85%"
                  value={formData.expectedOutcome}
                  onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                  className="gov-input"
                />
              </div>
            </div>

            {/* Eligibility & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#070E1E] p-4 rounded-xl border border-slate-800/80">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Startup Stage
                </label>
                <select
                  value={formData.minStage}
                  onChange={(e) => setFormData({ ...formData, minStage: e.target.value })}
                  className="gov-input bg-[#0B1528]"
                >
                  <option value="Early Stage">Early Stage (TRL 5+)</option>
                  <option value="Growth">Growth (TRL 7+)</option>
                  <option value="Scale">Scale (TRL 8+)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="gov-input bg-[#0B1528]"
                >
                  <option value="Published">Published (Open for Matching)</option>
                  <option value="Applications Open">Applications Open</option>
                  <option value="Draft">Draft (Internal Review)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="gov-button-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="btn-submit-challenge-modal"
                disabled={isSubmitting}
                className="gov-button-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Registering Challenge...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Challenge</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
