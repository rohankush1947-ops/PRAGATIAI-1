import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Gauge, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  BarChart2, 
  Activity, 
  Zap,
  CheckSquare,
  PlusCircle,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Database
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { PilotKPI, PilotKPIStatus } from '../../types';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const KPIMonitoring: React.FC = () => {
  const { pilots, recordKPIMeasurement } = usePragati();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPilotId = searchParams.get('pilotId');
  const [selectedPilotId, setSelectedPilotId] = useState<string>(queryPilotId || pilots[0]?.id || '');

  useEffect(() => {
    if (queryPilotId && queryPilotId !== selectedPilotId) {
      setSelectedPilotId(queryPilotId);
    }
  }, [queryPilotId]);

  const pilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  // Record KPI Measurement Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [kpiName, setKpiName] = useState('Detection Accuracy');
  const [kpiDesc, setKpiDesc] = useState('');
  const [kpiBaseline, setKpiBaseline] = useState('80%');
  const [kpiTarget, setKpiTarget] = useState('≥ 90%');
  const [kpiActual, setKpiActual] = useState('94.2%');
  const [kpiUnit, setKpiUnit] = useState('%');
  const [kpiStatus, setKpiStatus] = useState<PilotKPIStatus>('On Track');
  const [kpiDate, setKpiDate] = useState(new Date().toISOString().split('T')[0]);
  const [kpiEvidence, setKpiEvidence] = useState('Logged from 12 edge camera units over 520 km North corridor.');
  const [isSubmittingKPI, setIsSubmittingKPI] = useState(false);

  const handleSelectPilot = (id: string) => {
    setSelectedPilotId(id);
    setSearchParams({ pilotId: id });
  };

  const handleOpenRecordModal = (prefill?: Partial<PilotKPI>) => {
    if (prefill) {
      setKpiName(prefill.name || 'Detection Accuracy');
      setKpiDesc(prefill.description || '');
      setKpiBaseline(prefill.baseline || '');
      setKpiTarget(prefill.target || '≥ 90%');
      setKpiActual(prefill.actual || '');
      setKpiUnit(prefill.unit || '%');
      setKpiStatus((prefill.status as PilotKPIStatus) || 'On Track');
      setKpiEvidence(prefill.evidenceNotes || '');
    } else {
      setKpiName('Detection Accuracy');
      setKpiDesc('Field optical defect recognition accuracy on municipal roads');
      setKpiBaseline('80%');
      setKpiTarget('≥ 90%');
      setKpiActual('94.2%');
      setKpiUnit('%');
      setKpiStatus('Achieved');
      setKpiEvidence('Verified via 12 camera units with GPS tagging across corridor.');
    }
    setKpiDate(new Date().toISOString().split('T')[0]);
    setIsRecordModalOpen(true);
  };

  const handleRecordKPISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilot) return;
    setIsSubmittingKPI(true);

    const parsedTargetNum = parseFloat(String(kpiTarget).replace(/[^0-9.]/g, '')) || 0;
    const parsedActualNum = parseFloat(String(kpiActual).replace(/[^0-9.]/g, '')) || 0;
    const parsedBaselineNum = kpiBaseline ? (parseFloat(String(kpiBaseline).replace(/[^0-9.]/g, '')) || 0) : undefined;

    await recordKPIMeasurement(pilot.id, {
      name: kpiName,
      description: kpiDesc,
      baseline: kpiBaseline,
      baselineNum: parsedBaselineNum,
      target: kpiTarget,
      actual: kpiActual,
      unit: kpiUnit,
      status: kpiStatus,
      targetNum: parsedTargetNum,
      actualNum: parsedActualNum,
      measurementDate: kpiDate,
      evidenceNotes: kpiEvidence,
      isUserEntered: true
    });

    setIsSubmittingKPI(false);
    setIsRecordModalOpen(false);
  };

  if (!pilot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-sm">
          No pilot project found. Create a pilot project first.
        </p>
      </div>
    );
  }

  // Pre-fill helper for quick KPI templates
  const applyTemplate = (name: string, unit: string, base: string, target: string, actual: string, desc: string) => {
    setKpiName(name);
    setKpiUnit(unit);
    setKpiBaseline(base);
    setKpiTarget(target);
    setKpiActual(actual);
    setKpiDesc(desc);
  };

  // Weekly progression data for telemetry visualization
  const weeklyTrendData = [
    { week: 'Wk 1', accuracy: 88.5, falsePositive: 11.2, latency: 4.8, coverage: 25 },
    { week: 'Wk 2', accuracy: 89.8, falsePositive: 9.8, latency: 4.2, coverage: 40 },
    { week: 'Wk 3', accuracy: 91.2, falsePositive: 8.5, latency: 3.9, coverage: 55 },
    { week: 'Wk 4', accuracy: 92.4, falsePositive: 7.9, latency: 3.7, coverage: 68 },
    { week: 'Wk 5', accuracy: 93.1, falsePositive: 7.2, latency: 3.5, coverage: 75 },
    { week: 'Wk 6', accuracy: 93.8, falsePositive: 6.8, latency: 3.4, coverage: 82 },
    { week: 'Wk 7', accuracy: 94.2, falsePositive: 6.1, latency: 3.2, coverage: 87 }
  ];

  // Dynamically derive Target vs Actual bar chart data from the selected pilot's KPIs
  const targetVsActualData = (pilot.kpis || []).map(k => ({
    metric: k.name.length > 16 ? k.name.slice(0, 14) + '..' : k.name,
    Target: typeof k.targetNum === 'number' ? k.targetNum : (parseFloat(String(k.target).replace(/[^0-9.]/g, '')) || 0),
    Actual: typeof k.actualNum === 'number' ? k.actualNum : (parseFloat(String(k.actual).replace(/[^0-9.]/g, '')) || 0)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Field Telemetry & KPI Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            KPI Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Continuous verification of pilot performance metrics against contractually specified targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-open-record-kpi"
            onClick={() => handleOpenRecordModal()}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record KPI Measurement</span>
          </button>
          <Link
            to={`/government/validation?pilotId=${pilot.id}`}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Go to Pilot Validation</span>
          </Link>
        </div>
      </div>

      {/* Pilot Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Select Pilot Project to Monitor:</span>
          </span>
          <span className="text-[11px] text-slate-400">{pilots.length} Active / Registered Pilots</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {pilots.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPilot(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 ${
                p.id === pilot.id
                  ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                  : 'bg-[#0B1528] border-slate-800 text-slate-300 hover:bg-[#0F1C36] hover:text-white'
              }`}
            >
              <span>{p.startupName}</span>
              <span className="text-[10px] opacity-80">({p.status})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Context banner */}
      <div className="p-4 rounded-xl bg-[#0B1528] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monitoring Pilot Trial
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            {pilot.title || pilot.challengeTitle}
          </h4>
          <span className="text-slate-400 text-[11px]">
            Startup: <strong className="text-sky-400">{pilot.startupName}</strong> | Department: {pilot.department} | Duration: {pilot.pilotDuration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={pilot.status} />
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {pilot.kpis?.length || 0} Telemetry Metrics
          </span>
        </div>
      </div>

      {/* Distinction legend banner */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] font-medium">Data Provenance Legend:</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Audited Field Measurement (User-Entered)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Demo Benchmark Telemetry
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Supervised by: <strong className="text-slate-200">{pilot.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer'}</strong>
        </span>
      </div>

      {/* KPI METRIC CARDS (SHOWS TARGET VS ACTUAL, BASELINE, EVIDENCE, STATUS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pilot.kpis.map((kpi, idx) => {
          const isUser = !!kpi.isUserEntered;
          const targetNum = typeof kpi.targetNum === 'number' ? kpi.targetNum : (parseFloat(String(kpi.target).replace(/[^0-9.]/g, '')) || 0);
          const actualNum = typeof kpi.actualNum === 'number' ? kpi.actualNum : (parseFloat(String(kpi.actual).replace(/[^0-9.]/g, '')) || 0);
          const pct = targetNum > 0 ? Math.min(Math.round((actualNum / targetNum) * 100), 100) : 0;

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-slate-700 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="truncate">
                    <span className="font-bold text-xs text-white block truncate">{kpi.name}</span>
                    {kpi.description && (
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{kpi.description}</p>
                    )}
                  </div>
                  <StatusBadge status={kpi.status} size="sm" />
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {kpi.actual}
                  </div>
                  <div className="text-xs text-slate-400 font-mono text-right">
                    Target: <strong className="text-slate-200">{kpi.target}</strong>
                  </div>
                </div>

                {kpi.baseline && (
                  <div className="text-[11px] text-slate-400 mt-1">
                    Baseline: <span className="text-slate-300 font-mono">{kpi.baseline}</span>
                  </div>
                )}

                {/* Progress bar Target vs Actual */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Performance Target Fulfillment</span>
                    <span className="font-mono text-emerald-400 font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                {kpi.evidenceNotes && (
                  <p className="text-[10px] text-slate-400 italic line-clamp-2">
                    "{kpi.evidenceNotes}"
                  </p>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{kpi.measurementDate || 'Date: Day 74'}</span>
                  {isUser ? (
                    <span className="text-sky-400 font-medium bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">
                      Audited Field Data
                    </span>
                  ) : (
                    <span className="text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                      RFP Benchmark
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Progression */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Detection Accuracy & FP Rate Over Time</h3>
              <p className="text-xs text-slate-400">Weekly telemetry progression across pilot corridor</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold font-mono">94.2% Final</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="falsePositive" name="False Positive (%)" stroke="#F43F5E" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Target vs Actual Comparative Bar */}
        <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Target vs Actual Performance</h3>
              <p className="text-xs text-slate-400">Comparison of contractual targets against verified field telemetry</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold">Live Audited</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetVsActualData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="metric" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F1C36', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Target" name="Contractual Target" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" name="Verified Field Actual" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECORD KPI MEASUREMENT MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Pilot KPI Measurement"
        subtitle={`Log audited field performance telemetry for ${pilot.startupName}`}
        maxWidth="xl"
      >
        <form onSubmit={handleRecordKPISubmit} className="space-y-4 text-xs">
          {/* Quick template selector buttons */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Quick KPI Templates:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyTemplate('Detection Accuracy', '%', '80%', '≥ 90%', '94.2%', 'Deep-learning defect classification accuracy across test network.')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
              >
                Detection Accuracy
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('Inference Latency', 'ms', '500ms', '≤ 200ms', '180ms', 'Maximum edge sensor computation and detection response time.')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
              >
                Inference Latency
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('System Uptime', '%', '95%', '≥ 99.5%', '99.9%', 'Continuous operational availability without sensor crash.')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
              >
                System Uptime
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('Road Coverage', '%', '50%', '≥ 80%', '87.0%', 'Monitored municipal arterial road network coverage.')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
              >
                Road Coverage
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">KPI Name *</label>
              <input
                id="input-kpi-name"
                type="text"
                required
                value={kpiName}
                onChange={(e) => setKpiName(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. Detection Accuracy"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Measurement Unit *</label>
              <input
                id="input-kpi-unit"
                type="text"
                required
                value={kpiUnit}
                onChange={(e) => setKpiUnit(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. %, ms, s, km"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description / Benchmark Scope</label>
            <input
              type="text"
              value={kpiDesc}
              onChange={(e) => setKpiDesc(e.target.value)}
              className="gov-input text-xs"
              placeholder="e.g. Measured on wet asphalt and low-light night testing"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Baseline Value</label>
              <input
                id="input-kpi-baseline"
                type="text"
                value={kpiBaseline}
                onChange={(e) => setKpiBaseline(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. 80%"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Value *</label>
              <input
                id="input-kpi-target"
                type="text"
                required
                value={kpiTarget}
                onChange={(e) => setKpiTarget(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. ≥ 90%"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Actual Measured Value *</label>
              <input
                id="input-kpi-actual"
                type="text"
                required
                value={kpiActual}
                onChange={(e) => setKpiActual(e.target.value)}
                className="gov-input text-xs"
                placeholder="e.g. 94.2%"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">KPI Performance Status *</label>
              <select
                id="select-kpi-status"
                value={kpiStatus}
                onChange={(e) => setKpiStatus(e.target.value as PilotKPIStatus)}
                className="gov-input text-xs"
              >
                <option value="On Track">On Track</option>
                <option value="Achieved">Achieved</option>
                <option value="At Risk">At Risk</option>
                <option value="Not Achieved">Not Achieved</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Measurement Date *</label>
              <input
                id="input-kpi-date"
                type="date"
                required
                value={kpiDate}
                onChange={(e) => setKpiDate(e.target.value)}
                className="gov-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Audited Evidence & Operational Notes *</label>
            <textarea
              id="textarea-kpi-evidence"
              rows={3}
              required
              value={kpiEvidence}
              onChange={(e) => setKpiEvidence(e.target.value)}
              className="gov-input text-xs"
              placeholder="Cite telemetry log IDs, field inspection audits, or sensor datasets..."
            />
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px]">
            <strong>Audit Verification:</strong> This measurement will be stamped with the authorized officer's credentials and will form the basis of the Outcome Validation Report.
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              id="btn-submit-record-kpi"
              type="submit"
              disabled={isSubmittingKPI}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmittingKPI ? 'Recording...' : 'Record KPI Measurement'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
