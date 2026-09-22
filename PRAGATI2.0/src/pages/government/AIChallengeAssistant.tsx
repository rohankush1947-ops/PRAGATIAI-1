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
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Generative Problem Structuring Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Challenge Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Convert an unstructured government problem into a clear, outcome-based innovation challenge.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
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
              className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
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
          <span className="text-slate-400 font-medium text-[11px]">Quick Prompts:</span>
          <button
            type="button"
            onClick={() => {
              setInputPrompt("We need a better way to identify potholes and prioritize road repairs.");
              setTimeout(() => handleGenerate(), 100);
            }}
            className="px-2.5 py-1 rounded bg-[#070E1E] hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
          >
            PWD: Pothole & Road Health
          </button>
          <button
            type="button"
            onClick={() => {
              setInputPrompt("Farmers suffer heavy crop loss from sudden pest attacks. Need early warning system.");
              setTimeout(() => handleGenerate(), 100);
            }}
            className="px-2.5 py-1 rounded bg-[#070E1E] hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
          >
            Agri: Drone Pest Warning
          </button>
        </div>
      </div>

      {/* GENERATED STRUCTURED RFP PREVIEW */}
      {generatedOutput && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#0B1528] border border-sky-500/40 shadow-xl space-y-6">
            {/* Top Badge & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase">
                  Structured Outcome RFP
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                  {generatedOutput.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Department:</span>
                <span className="text-xs font-semibold text-slate-200 bg-[#070E1E] px-2.5 py-1 rounded border border-slate-800">
                  {generatedOutput.department}
                </span>
              </div>
            </div>

            {/* Problem & Target Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Operational Problem Statement
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {generatedOutput.problemDescription}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800 space-y-1.5">
                <span className="text-sky-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Target Outcome
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {generatedOutput.targetOutcome}
                </p>
              </div>
            </div>

            {/* Suggested Technology & Pilot Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider mb-2">
                  Recommended Technology Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {generatedOutput.techArea?.map((tech: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#0F1C36] text-sky-300 border border-slate-700 font-medium text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070E1E] border border-slate-800">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider mb-1.5">
                  Controlled Pilot Scope
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {generatedOutput.pilotScope}
                </p>
              </div>
            </div>

            {/* SUGGESTED MEASURABLE KPIS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Suggested Pilot Benchmark KPIs
                </span>
                <span className="text-[11px] text-slate-400">Target metrics for field validation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedOutput.suggestedKpis?.map((kpi: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#070E1E] border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{kpi.name}</span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      {kpi.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate RFP</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg bg-[#0F1C36] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize in Wizard</span>
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Publish Challenge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-4 rounded-xl bg-[#080E1C] border border-amber-900/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-400">Advisory Notice:</strong> AI-generated recommendations are advisory and require review by authorized officials before tender publication under applicable General Financial Rules (GFR).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
