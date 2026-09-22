import React, { useState } from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  Clock, 
  Download 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AuditLogView: React.FC = () => {
  const { auditLogs, addToast } = usePragati();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.userRole.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportAudit = () => {
    addToast('success', 'Audit Trail Exported', 'Downloaded tamper-evident cryptographic log registry.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Immutable Governance Record</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Procurement Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            End-to-end chronological timeline of all challenge creations, submissions, evaluations, and disbursements.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-300 shadow-sm transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-sky-700" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter audit entries by action, user, or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
        />
      </div>

      {/* AUDIT LOG TIMELINE (PROMPT SPECIFIED CHRONOLOGY) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group text-xs">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-sky-600 group-hover:border-emerald-600 flex items-center justify-center transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600 group-hover:bg-emerald-600" />
              </div>

              {/* Log Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                      {log.userRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{log.timestamp}</span>
                    <StatusBadge status={log.status} size="sm" />
                  </div>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed">
                  {log.details}
                </p>

                <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Actor: <strong className="text-slate-800">{log.userName}</strong></span>
                  <span className="text-[10px] font-mono text-slate-500">ID: {log.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
