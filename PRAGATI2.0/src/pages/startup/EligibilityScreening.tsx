import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Award, 
  Building2,
  HelpCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EligibilityScreening: React.FC = () => {
  // 5 Prompt-specified checklist items:
  // Startup Registration, Technology Requirement, Turnover Requirement, Experience Requirement, Required Documents
  const [checklist, setChecklist] = useState([
    {
      id: 'reg',
      title: 'Startup Registration',
      passed: true,
      requirement: 'DPIIT recognized startup under 10 years of incorporation.',
      actual: 'Incorporated in 2023 (Age: 3 years). DPIIT Registration #DIPP89234 verified via API.',
      mandatory: true
    },
    {
      id: 'tech',
      title: 'Technology Requirement',
      passed: true,
      requirement: 'Proprietary computer vision model with real-time edge inference capabilities.',
      actual: 'YOLOv10 custom model verified with on-device TensorRT acceleration benchmarks.',
      mandatory: true
    },
    {
      id: 'turnover',
      title: 'Turnover Requirement',
      passed: true,
      requirement: 'Exempt from prior turnover threshold under GFR Rule 173(i) for DPIIT startups.',
      actual: 'Audited turnover of ₹3.2 Cr (FY25-26) with zero statutory default history.',
      mandatory: true
    },
    {
      id: 'exp',
      title: 'Experience Requirement',
      passed: true,
      requirement: 'Demonstrated proof of concept or field pilot with public agency.',
      actual: 'Completed pilots with BBMP Smart City (62 km) and NHAI (expressway scanner).',
      mandatory: true
    },
    {
      id: 'docs',
      title: 'Required Documents',
      passed: true,
      requirement: 'DPIIT Certificate, Audited Financials, GST registration, and ISO certification.',
      actual: 'All 5 statutory documents verified against MCA21 and GSTN registries.',
      mandatory: true
    }
  ]);

  const allPassed = checklist.every(c => c.passed);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, passed: !item.passed } : item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Automated Statutory Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Eligibility Screening Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Objective rule-based verification ensuring compliance with DPIIT and General Financial Rules (GFR).
        </p>
      </div>

      {/* OVERALL STATUS BANNER (PROMPT SPECIFIED) */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all ${
        allPassed
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            allPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            {allPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${allPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
              Screening Outcome for RoadVision AI
            </span>
            <h2 className={`text-xl sm:text-2xl font-extrabold ${allPassed ? 'text-emerald-900' : 'text-rose-900'}`}>
              {allPassed ? 'Eligible for Evaluation' : 'Ineligible — Criteria Unmet'}
            </h2>
            <p className={`text-xs mt-0.5 ${allPassed ? 'text-emerald-800' : 'text-rose-800'}`}>
              {allPassed
                ? 'All mandatory eligibility benchmarks satisfied. Proposal forwarded to Dr. Arvind Swaminathan for scoring.'
                : 'One or more mandatory statutory criteria failed. Remediation or appeal required.'}
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider self-start sm:self-auto ${
          allPassed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
        }`}>
          {allPassed ? 'Screening Passed' : 'Action Required'}
        </span>
      </div>

      {/* CHECKLIST SECTION (PROMPT SPECIFIED) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Mandatory Eligibility Verification Checklist
          </h3>
          <span className="text-xs text-slate-500">Click any checkmark to test fail conditions</span>
        </div>

        <div className="space-y-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all text-xs ${
                item.passed
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.passed 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {item.passed ? '✓ PASSED' : '✕ FAILED'}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs">
                    <strong className="text-slate-700">Requirement:</strong> {item.requirement}
                  </p>
                  <p className={`text-xs font-medium ${item.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                    <strong>Verified Evidence:</strong> {item.actual}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  title="Toggle pass/fail state for interactive testing"
                  className={`p-2 rounded-lg border transition-colors shrink-0 ${
                    item.passed
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  {item.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </button>
              </div>

              {!item.passed && (
                <div className="mt-3 pt-3 border-t border-rose-200 text-[11px] text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Failure Explanation:</strong> The submitted credentials do not fulfill the mandated threshold under the PWD procurement guidelines. Please upload updated compliance certificates.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
