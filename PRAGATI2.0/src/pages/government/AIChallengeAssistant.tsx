import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Check, 
  Edit3, 
  ArrowRight, 
  AlertCircle, 
  Lightbulb, 
  Bot, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AI_CHALLENGE_TEMPLATES } from '../../data/mockData';

export const AIChallengeAssistant: React.FC = () => {
  const { addToast } = usePragati();
  const navigate = useNavigate();

  const [inputPrompt, setInputPrompt] = useState(
    "We need a better way to identify potholes and prioritize road repairs."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(AI_CHALLENGE_TEMPLATES[0].generated);

  const handleGenerate = () => {
    if (!inputPrompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Find matching template or generate customized output
      const matched = AI_CHALLENGE_TEMPLATES.find(t => 
        inputPrompt.toLowerCase().includes('pest') || inputPrompt.toLowerCase().includes('crop')
      );
      if (matched) {
        setGeneratedOutput(matched.generated);
      } else {
        setGeneratedOutput(AI_CHALLENGE_TEMPLATES[0].generated);
      }
      setIsGenerating(false);
      addToast('success', 'AI Challenge Formulated', 'Outcome-based problem structure generated.');
    }, 900);
  };

  const handleAccept = () => {
    addToast('success', 'RFP Accepted', 'Loading AI challenge into the 5-Step Creation Wizard.');
    navigate('/government/create-challenge', { state: { prefill: generatedOutput } });
  };

  const handleEdit = () => {
    navigate('/government/create-challenge', { state: { prefill: generatedOutput } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
          <Sparkles className="w-4 h-4 text-sky-700" />
          <span>Generative Problem Structuring Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          AI Challenge Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Convert an unstructured government problem into a clear, outcome-based innovation challenge.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Describe the Department Problem (Plain Text / Unstructured)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. We need a better way to identify potholes and prioritize road repairs across municipal arterial routes..."
              className="gov-input pr-24 font-normal text-sm"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
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
              setInputPrompt("We need a better way to identify potholes and prioritize road repairs.");
              setTimeout(() => handleGenerate(), 100);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium"
          >
            PWD: Pothole & Road Health
          </button>
          <button
            type="button"
            onClick={() => {
              setInputPrompt("Farmers suffer heavy crop loss from sudden pest attacks. Need early warning system.");
              setTimeout(() => handleGenerate(), 100);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-[11px] font-medium"
          >
            Agri: Drone Pest Warning
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                  Structured Outcome RFP
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
                  {generatedOutput.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Suggested Pilot Benchmark KPIs
                </span>
                <span className="text-[11px] text-slate-500">Target metrics for field validation</span>
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
                onClick={handleGenerate}
                className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate RFP</span>
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

          {/* Mandatory Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-amber-800">Advisory Notice:</strong> AI-generated recommendations are advisory and require review by authorized officials before tender publication under applicable General Financial Rules (GFR).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
