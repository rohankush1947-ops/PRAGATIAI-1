import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Loader2
} from 'lucide-react';

interface ChallengeFormData {
  department: string;
  title: string;
  category: string;
  problemDescription: string;
  currentSituation: string;
  targetOutcome: string;
  techArea: string[];
  budgetRange: string;
  pilotDuration: string;
  deadline: string;
  requiredCapabilities: string[];
  kpis: Array<{ name: string; target: string; unit?: string }>;
  constraints: string[];
  eligibility: {
    startupAgeYears: number;
    turnover: string;
    minExperienceYears: number;
    techRequirements: string[];
    certifications: string[];
  };
  evaluationCriteria: Array<{
    name: string;
    weight: number;
    maxScore: number;
    description: string;
  }>;
}

export const CreateChallengeWizard: React.FC = () => {
  const { createChallenge, addToast } = usePragati();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from AI Challenge Assistant with pre-filled state
  const prefill = location.state?.prefill;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredChallenge, setRegisteredChallenge] = useState<{
    id: string;
    title: string;
    department: string;
  } | null>(null);
  const [formData, setFormData] = useState<ChallengeFormData>({
    // Step 1: Problem Statement
    department: prefill?.department || 'Public Works Department (PWD)',
    title: prefill?.title || '',
    category: prefill?.category || 'Smart Infrastructure & Transport',
    problemDescription: prefill?.problemDescription || '',
    currentSituation: prefill?.currentSituation || '',
    targetOutcome: prefill?.targetOutcome || '',
    techArea: prefill?.techArea || ['Computer Vision', 'Edge AI', 'GIS Mapping'],
    budgetRange: prefill?.budgetRange || '₹35 - 50 Lakhs',
    pilotDuration: prefill?.pilotDuration || '90 Days',
    deadline: '2026-11-30',

    // Step 2: Expected Solution & KPIs
    requiredCapabilities: prefill?.suggestedCapabilities || [
      'Edge computer vision with 30 FPS inference speed',
      'Sub-meter GPS precision geo-tagging',
      'Continuous offline edge inference with cloud sync'
    ],
    kpis: prefill?.suggestedKpis || [
      { name: 'Detection Accuracy', target: '≥ 90%', unit: '%' },
      { name: 'False Positive Rate', target: '≤ 10%', unit: '%' },
      { name: 'Average Detection Time', target: '≤ 5 seconds', unit: 'sec' },
      { name: 'Road Coverage', target: '≥ 80%', unit: '%' }
    ],
    constraints: [
      'Must operate under dusty and monsoon road conditions',
      'Direct vehicle-mounted camera form factor',
      'Compliance with Indian CERT-In security standards'
    ],

    // Step 3: Eligibility
    eligibility: {
      startupAgeYears: 7,
      turnover: 'Up to ₹25 Cr (DPIIT Recognized)',
      minExperienceYears: 2,
      techRequirements: ['Proprietary computer vision model', 'Edge hardware prototype ready'],
      certifications: ['DPIIT Startup Certificate', 'ISO 9001 / ISO 27001']
    },

    // Step 4: Evaluation Criteria
    evaluationCriteria: [
      { name: 'Technical Capability', weight: 25, maxScore: 25, description: 'Detection accuracy, edge latency, hardware ruggedness' },
      { name: 'Innovation', weight: 20, maxScore: 20, description: 'Novelty of approach, patent filings, adaptive lighting handling' },
      { name: 'Scalability', weight: 20, maxScore: 20, description: 'API architecture, GIS compatibility, cloud throughput' },
      { name: 'Cost Effectiveness', weight: 15, maxScore: 15, description: 'Per-km monitoring cost vs manual inspection tender' },
      { name: 'Impact & Road Safety', weight: 20, maxScore: 20, description: 'Potential reduction in accidents and turnaround times' }
    ]
  });

  // Helper to add/remove array items
  const [newTech, setNewTech] = useState('');
  const [newCapability, setNewCapability] = useState('');
  const [newKpiName, setNewKpiName] = useState('');
  const [newKpiTarget, setNewKpiTarget] = useState('');

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    setFormData(prev => ({ ...prev, techArea: [...prev.techArea, newTech.trim()] }));
    setNewTech('');
  };

  const handleRemoveTech = (index: number) => {
    setFormData(prev => ({ ...prev, techArea: prev.techArea.filter((_: string, i: number) => i !== index) }));
  };

  const handleAddCapability = () => {
    if (!newCapability.trim()) return;
    setFormData(prev => ({ ...prev, requiredCapabilities: [...prev.requiredCapabilities, newCapability.trim()] }));
    setNewCapability('');
  };

  const handleRemoveCapability = (index: number) => {
    setFormData(prev => ({ ...prev, requiredCapabilities: prev.requiredCapabilities.filter((_: string, i: number) => i !== index) }));
  };

  const handleAddKpi = () => {
    if (!newKpiName.trim() || !newKpiTarget.trim()) return;
    setFormData(prev => ({
      ...prev,
      kpis: [...prev.kpis, { name: newKpiName.trim(), target: newKpiTarget.trim() }]
    }));
    setNewKpiName('');
    setNewKpiTarget('');
  };

  const handleRemoveKpi = (index: number) => {
    setFormData(prev => ({ ...prev, kpis: prev.kpis.filter((_: any, i: number) => i !== index) }));
  };

  const handlePublish = async (status: 'Published' | 'Draft') => {
    if (!formData.title.trim()) {
      addToast('error', 'Validation Failed', 'Please provide a Challenge Title.');
      setCurrentStep(1);
      return;
    }

    if (!formData.problemDescription.trim()) {
      addToast('error', 'Validation Failed', 'Please provide a Problem Statement.');
      setCurrentStep(1);
      return;
    }

    if (!formData.department.trim()) {
      addToast('error', 'Validation Failed', 'Please select or enter a Department.');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const createdId = await createChallenge({
        title: formData.title,
        department: formData.department,
        category: formData.category,
        deadline: formData.deadline,
        budgetRange: formData.budgetRange,
        pilotDuration: formData.pilotDuration,
        currentSituation: formData.currentSituation,
        problemDescription: formData.problemDescription,
        targetOutcome: formData.targetOutcome,
        techArea: formData.techArea,
        requiredCapabilities: formData.requiredCapabilities,
        kpis: formData.kpis,
        constraints: formData.constraints,
        eligibility: formData.eligibility,
        evaluationCriteria: formData.evaluationCriteria,
        status,
        allowDuplicate: true
      } as any);

      setRegisteredChallenge({
        id: createdId,
        title: formData.title,
        department: formData.department
      });
      setCurrentStep(6);
    } catch (err: any) {
      console.error('Failed to create challenge:', err);
      addToast('error', 'Registration Error', err?.message || 'Could not register challenge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Problem Statement' },
    { num: 2, title: 'Expected Solution' },
    { num: 3, title: 'Eligibility' },
    { num: 4, title: 'Evaluation Criteria' },
    { num: 5, title: 'Review & Publish' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
          <Building2 className="w-4 h-4" />
          <span>Outcome-Based Procurement Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Create Innovation Challenge
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Formulate a transparent, outcome-oriented challenge designed to attract qualified deep-tech startups.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <div 
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-sky-600 text-white ring-2 ring-sky-400/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                isCurrent ? 'text-white font-bold' : isDone ? 'text-slate-300' : 'text-slate-400'
              }`}>
                {step.title}
              </span>
              {step.num < 5 && <span className="text-slate-700 mx-1 hidden sm:inline">→</span>}
            </div>
          );
        })}
      </div>

      {/* STEP 1: PROBLEM STATEMENT */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Step 1: Problem Statement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="gov-input"
                placeholder="e.g. Public Works Department"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="gov-input"
              >
                <option>Smart Infrastructure & Transport</option>
                <option>Agritech & Food Security</option>
                <option>Healthcare & Public Delivery</option>
                <option>Clean Water & Utilities</option>
                <option>Clean Energy & Environment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="gov-input"
              placeholder="e.g. AI-Based Pothole Detection and Road Condition Monitoring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Problem Description *
            </label>
            <textarea
              rows={3}
              value={formData.problemDescription}
              onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
              className="gov-input"
              placeholder="Clearly state what needs to be solved in operational terms..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Situation (Baseline)
              </label>
              <textarea
                rows={3}
                value={formData.currentSituation}
                onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                className="gov-input"
                placeholder="How is this currently addressed? What are the failure points?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Outcome
              </label>
              <textarea
                rows={3}
                value={formData.targetOutcome}
                onChange={(e) => setFormData({ ...formData, targetOutcome: e.target.value })}
                className="gov-input"
                placeholder="What tangible improvement must be delivered after 90 days?"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilot Budget Range
              </label>
              <input
                type="text"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="gov-input"
                placeholder="e.g. ₹35 - 50 Lakhs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilot Duration
              </label>
              <input
                type="text"
                value={formData.pilotDuration}
                onChange={(e) => setFormData({ ...formData, pilotDuration: e.target.value })}
                className="gov-input"
                placeholder="e.g. 90 Days"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Submission Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="gov-input"
              />
            </div>
          </div>

          {/* Technology Area tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Technology Areas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="Add technology tag (e.g. Edge AI, Computer Vision)..."
                className="gov-input flex-1"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techArea.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#080E1C] border border-slate-700 text-xs text-sky-300"
                >
                  {tech}
                  <button onClick={() => handleRemoveTech(idx)} className="text-slate-400 hover:text-rose-400">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EXPECTED SOLUTION & KPIS */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Step 2: Expected Solution & Measurable KPIs
          </h3>

          {/* Required Capabilities */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required Technical Capabilities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                placeholder="Add essential capability (e.g. Sub-meter GPS precision)..."
                className="gov-input flex-1"
              />
              <button
                type="button"
                onClick={handleAddCapability}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.requiredCapabilities.map((cap, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#070E1E] border border-slate-800 text-xs">
                  <span className="text-slate-200">{cap}</span>
                  <button onClick={() => handleRemoveCapability(idx)} className="text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Measurable Success KPIs (Used during Pilot Validation)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={newKpiName}
                onChange={(e) => setNewKpiName(e.target.value)}
                placeholder="KPI Name (e.g. Detection Accuracy)"
                className="gov-input sm:col-span-2"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKpiTarget}
                  onChange={(e) => setNewKpiTarget(e.target.value)}
                  placeholder="Target (e.g. ≥ 90%)"
                  className="gov-input"
                />
                <button
                  type="button"
                  onClick={handleAddKpi}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white rounded-lg shrink-0"
                >
                  Add KPI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formData.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#070E1E] border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">{kpi.name}</span>
                    <span className="text-sky-400 font-mono text-[11px]">Target: {kpi.target}</span>
                  </div>
                  <button onClick={() => handleRemoveKpi(idx)} className="text-slate-400 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ELIGIBILITY */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Step 3: Startup Eligibility Rules (Automated Screening)
          </h3>
          <p className="text-xs text-slate-300">
            These rules are evaluated instantaneously by the PragatiAI screening engine upon proposal submission.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Maximum Startup Age (Years)
              </label>
              <input
                type="number"
                value={formData.eligibility.startupAgeYears}
                onChange={(e) => setFormData({
                  ...formData,
                  eligibility: { ...formData.eligibility, startupAgeYears: parseInt(e.target.value) || 7 }
                })}
                className="gov-input"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Standard DPIIT startup limit is up to 10 years</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Annual Turnover Ceiling
              </label>
              <input
                type="text"
                value={formData.eligibility.turnover}
                onChange={(e) => setFormData({
                  ...formData,
                  eligibility: { ...formData.eligibility, turnover: e.target.value }
                })}
                className="gov-input"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#080E1C] border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Default Statutory Exemptions:</span>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-sky-600 bg-slate-900" />
                <span>Exemption from Prior Turnover requirement under GFR Rule 173(i)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-sky-600 bg-slate-900" />
                <span>Exemption from Earnest Money Deposit (EMD) for DPIIT startups</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-sky-600 bg-slate-900" />
                <span>Fast-track qualification for prototypes with Technology Readiness Level (TRL) ≥ 6</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: EVALUATION CRITERIA */}
      {currentStep === 4 && (
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Step 4: Weighted Evaluation Criteria
              </h3>
              <p className="text-xs text-slate-400">Total weight must equal 100%</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              Sum: 100%
            </span>
          </div>

          <div className="space-y-3">
            {formData.evaluationCriteria.map((crit, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#070E1E] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <span className="font-bold text-slate-100">{crit.name}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{crit.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sky-400 font-bold font-mono text-sm">{crit.weight}% Weight</span>
                  <span className="text-slate-400 text-[11px]">({crit.maxScore} pts)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH */}
      {currentStep === 5 && (
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Step 5: Review & Publish Challenge
            </h3>
            <p className="text-xs text-slate-400">
              Inspect your challenge details before opening it for startup discovery.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{formData.department}</span>
              <h4 className="text-base font-bold text-white">{formData.title}</h4>
              <p className="text-slate-300 leading-relaxed">{formData.problemDescription}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Budget</span>
                <span className="font-bold text-slate-200">{formData.budgetRange}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Pilot Duration</span>
                <span className="font-bold text-slate-200">{formData.pilotDuration}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Target KPIs</span>
                <span className="font-bold text-slate-200">{formData.kpis.length} defined</span>
              </div>
              <div className="p-3 rounded-lg bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 block text-[11px]">DPIIT Startup Limit</span>
                <span className="font-bold text-slate-200">&lt; {formData.eligibility.startupAgeYears} Years</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-300 block mb-1.5">Target KPIs to be Monitored:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.kpis.map((k, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#070E1E] border border-slate-800 flex justify-between">
                    <span className="text-slate-300">{k.name}</span>
                    <span className="text-sky-400 font-bold">{k.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: REGISTRATION SUCCESS STATE */}
      {currentStep === 6 && registeredChallenge && (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0B1528] border border-emerald-500/40 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/80 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="inline-block text-xs font-mono font-bold bg-sky-950/90 text-sky-300 border border-sky-600/60 px-3.5 py-1 rounded-full">
              Challenge ID: {registeredChallenge.id}
            </span>
            <h2 className="text-2xl font-black text-white">
              Challenge Registered Successfully
            </h2>
            <p className="text-sm font-semibold text-slate-200">
              "{registeredChallenge.title}"
            </p>
            <p className="text-xs text-slate-400">
              Your challenge is now persisted in the government repository and immediately available for AI startup matching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/government/ai-matching?challengeId=${registeredChallenge.id}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Find AI Matches</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/government/challenges')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Challenges</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegisteredChallenge(null);
                setFormData({
                  department: 'Public Works Department (PWD)',
                  title: '',
                  category: 'Smart Infrastructure & Transport',
                  problemDescription: '',
                  currentSituation: '',
                  targetOutcome: '',
                  techArea: ['Computer Vision', 'Edge AI'],
                  budgetRange: '₹25 - 50 Lakhs',
                  pilotDuration: '90 Days',
                  deadline: '2026-11-30',
                  requiredCapabilities: [],
                  kpis: [
                    { name: 'Detection / Solution Accuracy', target: '≥ 90%', unit: '%' }
                  ],
                  constraints: [],
                  eligibility: {
                    startupAgeYears: 10,
                    turnover: 'Up to ₹25 Cr (DPIIT Recognized)',
                    minExperienceYears: 1,
                    techRequirements: ['Computer Vision', 'Edge AI'],
                    certifications: ['DPIIT Startup Certificate']
                  },
                  evaluationCriteria: [
                    { name: 'Technical Viability', weight: 40, maxScore: 40, description: 'Evaluation of model accuracy' },
                    { name: 'Domain Experience', weight: 30, maxScore: 30, description: 'Track record' },
                    { name: 'Pilot Readiness', weight: 30, maxScore: 30, description: 'Readiness for trials' }
                  ]
                });
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              + Register Another Challenge
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {currentStep <= 5 && (
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="gov-button-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="gov-button-primary"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePublish('Draft')}
                  className="gov-button-secondary"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePublish('Published')}
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
                      <span>Publish Challenge</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
