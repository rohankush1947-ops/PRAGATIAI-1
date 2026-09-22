import React from 'react';
import { Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  ShoppingCart, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Building2,
  Download
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProcurementContract: React.FC = () => {
  const { procurementContracts, releaseProcurementMilestone, addToast } = usePragati();
  const contract = procurementContracts[0]; // PWD & RoadVision AI contract

  const handleDownloadContract = () => {
    addToast('info', 'Document Download Simulated', 'Procurement_Contract_PWD_RoadVision_Executed.pdf simulated download.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Fast-Track Innovation Procurement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Procurement & Milestone Contract
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Legally sanctioned, milestone-based outcome contract linked directly to verified pilot KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadContract}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Download Contract PDF</span>
          </button>
          <Link
            to="/government/scale-up"
            className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Scale-Up Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* CONTRACT SUMMARY CARD (PROMPT SPECIFIED) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 uppercase">
                Contract Reference: {contract.id}
              </span>
              <StatusBadge status={contract.contractStatus} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {contract.challengeTitle}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Awarded to: <strong className="text-sky-700">{contract.startupName}</strong> | Agency: {contract.department}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-500 block">Sanctioned Contract Value</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {contract.approvedBudget}
            </div>
            <span className="text-[11px] text-slate-500">Milestone-linked disbursement</span>
          </div>
        </div>

        {/* 4 Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Validated Solution
            </span>
            <p className="text-slate-900 font-semibold">{contract.validatedSolution}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold block">
              Procurement Method
            </span>
            <p className="text-slate-900 font-semibold">{contract.procurementMethod}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
            <span className="text-emerald-700 text-[11px] uppercase tracking-wider font-semibold block">
              Audited Pilot Performance Summary
            </span>
            <p className="text-slate-700 leading-relaxed">{contract.pilotResultsSummary}</p>
          </div>
        </div>

        {/* MILESTONE-BASED CONTRACT SECTION (PROMPT SPECIFIED) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Milestone Payout Schedule (Performance-Contingent)
            </h3>
            <span className="text-xs text-slate-500 font-medium">100% Escrow Backed</span>
          </div>

          <div className="space-y-3">
            {contract.milestones.map((m) => {
              const isReleased = m.status === 'Released';
              const isPending = m.status === 'Pending Verification';
              return (
                <div
                  key={m.milestoneNumber}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isReleased
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : isPending
                      ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-400/30'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1 flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                      <StatusBadge status={m.status} size="sm" />
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Deliverable: {m.deliverable}
                    </p>
                    <div className="text-sky-700 font-bold font-mono text-xs">
                      Payout Value: {m.payout}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isReleased ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Disbursed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => releaseProcurementMilestone(contract.id, m.milestoneNumber)}
                        className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Authorize Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
