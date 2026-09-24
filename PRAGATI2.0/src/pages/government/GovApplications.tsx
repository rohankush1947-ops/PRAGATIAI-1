import React, { useState } from 'react';
import { usePragati } from '../../context/PragatiContext';
import { Application } from '../../types';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Briefcase, 
  Award, 
  Calendar, 
  Building2 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const GovApplications: React.FC = () => {
  const { applications, startPilot, addToast } = usePragati();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleStartPilot = (app: Application) => {
    startPilot(app.id);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
          <Users className="w-4 h-4" />
          <span>Startup Inflow & Proposals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Startup Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review technical proposals, DPIIT eligibility status, and expert evaluation scores.
        </p>
      </div>

      {/* Applications Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="py-3 px-3">Startup Name</th>
                <th className="py-3 px-3">Challenge Statement</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Budget Quoted</th>
                <th className="py-3 px-3">Expert Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{app.startupName}</div>
                    <span className="text-[10px] text-slate-500">ID: {app.id}</span>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="text-slate-800 font-medium truncate">{app.challengeTitle}</div>
                    <span className="text-[10px] text-sky-700 font-semibold">{app.department}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {app.submissionDate}
                  </td>
                  <td className="py-3.5 px-3 text-slate-900 font-semibold">
                    {app.budgetQuoted}
                  </td>
                  <td className="py-3.5 px-3">
                    {app.expertScore ? (
                      <span className="font-bold font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                        {app.expertScore}/100
                      </span>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-700" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROPOSAL DETAILS MODAL */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application: ${selectedApp.startupName}`}
          subtitle={selectedApp.challengeTitle}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Department</span>
                <span className="font-semibold text-slate-900">{selectedApp.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Quoted Budget</span>
                <span className="font-bold text-sky-700">{selectedApp.budgetQuoted}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Status</span>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">Technical Solution Proposal:</span>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedApp.technicalProposal}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">Implementation & Pilot Plan:</span>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedApp.implementationPlan}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">Verified Attached Documents:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedApp.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedApp.expertScore && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-bold block">Expert Evaluation Complete</span>
                  <span className="text-slate-600 text-[11px]">
                    Recommendation: {selectedApp.expertRecommendation}
                  </span>
                </div>
                <span className="text-xl font-black text-emerald-800 font-mono">
                  {selectedApp.expertScore}/100
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium shadow-sm"
              >
                Close
              </button>
              {selectedApp.status !== 'Pilot' && selectedApp.status !== 'Validated' ? (
                <button
                  onClick={() => handleStartPilot(selectedApp)}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Sanction 90-Day Pilot</span>
                </button>
              ) : (
                <a
                  href="/government/pilots"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Open Pilot Project</span>
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
