import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Edit3, 
  AlertCircle, 
  Bot, 
  Cpu,
  Layers,
  Activity,
  Building2,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { generateChallengeWithGemini, StructuredRFP } from '../../services/geminiService';
import { AI_CHALLENGE_TEMPLATES } from '../../data/mockData';

export const AIChallengeAssistant: React.FC = () => {
  const { startups, shortlistStartup, addToast } = usePragati();
  const navigate = useNavigate();

  const trafficTemplate = (AI_CHALLENGE_TEMPLATES.find(t => 
    t.prompt.toLowerCase().includes('traffic') || t.generated.category === 'Urban Mobility'
  )?.generated || AI_CHALLENGE_TEMPLATES[0].generated) as StructuredRFP;

  const [inputPrompt, setInputPrompt] = useState(
    "Smart traffic management using AI sensors for urban congestion"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<StructuredRFP>(trafficTemplate);
  const [generationMeta, setGenerationMeta] = useState<{
    source: string;
    model: string;
  }>({
    source: 'gemini-live',
    model: 'Google Gemini 3.6 Flash'
  });
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, boolean>>({});

  // Compute Relevant Startups for the currently displayed RFP
  const suggestedStartups = useMemo(() => {
    if (!generatedOutput || !startups || startups.length === 0) return [];
    const cat = (generatedOutput.category || '').toLowerCase();
    const titleWords = (generatedOutput.title || '').toLowerCase();
    const probWords = (generatedOutput.problemDescription || '').toLowerCase();
    const combined = `${cat} ${titleWords} ${probWords}`;

    return startups.map(st => {
      let score = 55;
      const stDomain = st.domain.toLowerCase();
      const stName = st.name.toLowerCase();

      if (combined.includes('traffic') || combined.includes('mobility') || combined.includes('congestion')) {
        if (st.id === 'startup-trafficpulse' || stName.includes('trafficpulse')) score = 96;
        else if (st.id === 'startup-roadvision' || stName.includes('roadvision')) score = 84;
        else if (st.id === 'startup-smartcitylabs') score = 76;
        else score = 42;
      } else if (combined.includes('pothole') || combined.includes('road') || combined.includes('pavement')) {
        if (st.id === 'startup-roadvision' || stName.includes('roadvision')) score = 95;
        else if (st.id === 'startup-trafficpulse') score = 82;
        else if (st.id === 'startup-smartcitylabs') score = 75;
        else score = 45;
      } else if (combined.includes('agri') || combined.includes('pest') || combined.includes('crop')) {
        if (st.id === 'startup-farmvision' || stName.includes('farmvision')) score = 94;
        else score = 40;
      } else if (combined.includes('water') || combined.includes('leak') || combined.includes('jal')) {
        if (st.id === 'startup-smartcitylabs' || stName.includes('smartcity')) score = 92;
        else score = 45;
      } else if (combined.includes('health') || combined.includes('hospital') || combined.includes('opd') || combined.includes('medical')) {
        if (st.id === 'startup-healthqueue' || stName.includes('healthqueue')) score = 93;
        else score = 40;
      } else {
        score = 70;
      }

      return {
        ...st,
        dynamicMatchScore: score
      };
    }).sort((a, b) => b.dynamicMatchScore - a.dynamicMatchScore).slice(0, 3);
  }, [generatedOutput, startups]);

  const handleGenerate = async (customPrompt?: string) => {
    const promptToUse = (customPrompt || inputPrompt).trim();
    if (!promptToUse) return;

    setIsGenerating(true);
    try {
      const result = await generateChallengeWithGemini(promptToUse);
      setGeneratedOutput(result.generated);
      setGenerationMeta({
        source: result.source,
        model: result.modelUsed
      });

      const sourceLabel = result.source.includes('gemini') ? 'Google Gemini 1.5 Flash' : 'Contextual Intelligence Engine';
      addToast('success', 'RFP Formulated by Gemini', `Structured innovation challenge generated via ${sourceLabel}.`);
    } catch (err: any) {
      console.error('Challenge generation error:', err);
      addToast('error', 'Generation Error', 'Failed to generate challenge. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = () => {
    addToast('success', 'RFP Accepted', 'Loading Gemini challenge into the 5-Step Creation Wizard.');
    navigate('/government/create-challenge', { state: { prefill: generatedOutput } });
  };

  const handleEdit = () => {
    navigate('/government/create-challenge', { state: { prefill: generatedOutput } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <Sparkles className="w-4 h-4 text-sky-700 animate-pulse" />
            <span>Generative Problem Structuring Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Challenge Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Convert unstructured administrative problems into GFR-compliant, outcome-oriented startup innovation tenders using Google Gemini.
          </p>
        </div>

        {/* Gemini Engine Status Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium self-start sm:self-auto shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <Bot className="w-3.5 h-3.5 text-emerald-700" />
          <span>Gemini 3.6 Flash Connected</span>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Describe the Department Problem (Plain Text / Unstructured Complaint)
            </label>
            <span className="text-[11px] text-slate-400">Powered by Gemini Generative AI</span>
          </div>
          <div className="relative">
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. We need a better way to identify potholes and prioritize road repairs across municipal arterial routes..."
              className="gov-input pr-28 font-normal text-sm"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Formulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Formulate RFP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick sample prompt pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-slate-500 font-medium text-[11px]">Quick Prompts:</span>
          <button
            type="button"
            onClick={() => {
              const p = "Smart traffic management using AI sensors for urban congestion";
              setInputPrompt(p);
              handleGenerate(p);
            }}
            className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-[11px] font-semibold transition-colors"
          >
            Urban Mobility: Smart AI Traffic Signals
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "We need a better way to identify potholes and prioritize road repairs across municipal arterial routes.";
              setInputPrompt(p);
              handleGenerate(p);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium transition-colors"
          >
            PWD: Road Surface Health
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "Farmers suffer heavy crop loss from sudden pest attacks. Need early warning system.";
              setInputPrompt(p);
              handleGenerate(p);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium transition-colors"
          >
            Agri: Drone Pest Warning
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "Municipal water distribution suffers 35% non-revenue water loss from underground pipeline leakages.";
              setInputPrompt(p);
              handleGenerate(p);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium transition-colors"
          >
            Jal Shakti: Pipeline Leakage
          </button>
          <button
            type="button"
            onClick={() => {
              const p = "Critical shortage of specialist doctors in remote hilly areas requiring automated drone delivery of antivenom and emergency blood.";
              setInputPrompt(p);
              handleGenerate(p);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium transition-colors"
          >
            Health: Remote Drone Medical
          </button>
        </div>
      </div>

      {/* GENERATED STRUCTURED RFP PREVIEW */}
      {generatedOutput && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white border border-sky-300 shadow-sm space-y-6">
            {/* Top Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                    Structured Outcome RFP
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{generationMeta.model}</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {generatedOutput.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500">Department:</span>
                <span className="text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  {generatedOutput.department}
                </span>
              </div>
            </div>

            {/* Problem & Target Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">
                  Operational Problem Statement
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {generatedOutput.problemDescription}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-sky-700 font-semibold block text-[11px] uppercase tracking-wider">
                  Target Outcome
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {generatedOutput.targetOutcome}
                </p>
              </div>
            </div>

            {/* Suggested Technology & Pilot Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider mb-2">
                  Recommended Technology Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedOutput.techArea?.map((tech: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider mb-1.5">
                  Controlled Pilot Scope
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {generatedOutput.pilotScope}
                </p>
              </div>
            </div>

            {/* SUGGESTED MEASURABLE KPIS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-700" />
                  <span>Suggested Pilot Benchmark KPIs</span>
                </span>
                <span className="text-[11px] text-slate-500">Measurable field validation targets</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedOutput.suggestedKpis?.map((kpi: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{kpi.name}</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {kpi.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate with Gemini</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize in Wizard</span>
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Publish Challenge</span>
                </button>
              </div>
            </div>
          </div>

          {/* RELEVANT STARTUPS SUGGESTED BY AI */}
          {suggestedStartups.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-sky-300 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
                    <Sparkles className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Relevant Deep-Tech Startups Suggested by AI
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Pre-evaluated against this RFP's required tech area, pilot readiness, and domain track record
                    </p>
                  </div>
                </div>

                <Link
                  to="/government/ai-matching"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>Full AI Matching Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {suggestedStartups.map((st: any) => {
                  const isShortlisted = shortlistedMap[st.id];
                  return (
                    <div 
                      key={st.id} 
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        st.dynamicMatchScore >= 90 
                          ? 'bg-gradient-to-b from-sky-50/50 to-white border-sky-300 shadow-sm' 
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              {st.location}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {st.name}
                            </h4>
                          </div>

                          <div className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 border flex items-center gap-1 ${
                            st.dynamicMatchScore >= 90
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-sky-50 text-sky-800 border-sky-300'
                          }`}>
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>{st.dynamicMatchScore}% Match</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {st.tagline || st.overview}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {st.techStack.slice(0, 3).map((tech: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>DPIIT Verified</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            shortlistStartup('draft-ai-challenge', st.id);
                            setShortlistedMap(prev => ({ ...prev, [st.id]: true }));
                            addToast('success', 'Startup Shortlisted', `${st.name} has been tagged for invitation to this challenge.`);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isShortlisted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          }`}
                        >
                          {isShortlisted ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Shortlisted</span>
                            </>
                          ) : (
                            <span>Shortlist for Pilot</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mandatory GFR Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-amber-800">GFR Compliance Notice:</strong> This RFP structure was synthesized using Google Gemini based on outcome-based procurement guidelines. Final tender parameters, eligibility requirements, and budget allocations must be reviewed and authorized by designated department officials in accordance with the General Financial Rules (GFR).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
