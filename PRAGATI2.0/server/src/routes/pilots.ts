import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all pilots
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.pilots);
});

// POST start pilot from application (Legacy / Fast-track)
router.post('/start', (req, res) => {
  const db = getDb();
  const { applicationId } = req.body;
  const app = db.applications.find(a => a.id === applicationId);

  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  app.status = 'Pilot';

  const ch = db.challenges.find(c => c.id === app.challengeId);
  if (ch) ch.status = 'Pilot Active';

  let pilot = db.pilots.find(p => p.startupId === app.startupId && p.challengeId === app.challengeId);
  if (!pilot) {
    pilot = {
      id: `pilot-${Date.now().toString(36)}`,
      title: `${app.startupName} Field Trial`,
      challengeId: app.challengeId,
      challengeTitle: app.challengeTitle,
      startupId: app.startupId,
      startupName: app.startupName,
      department: app.department,
      pilotLocation: 'Designated Field Corridor',
      objective: `Validate ${app.startupName}'s operational capability under real-world municipal conditions.`,
      pilotDuration: '90 Days',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      governmentOfficer: 'Er. Rajeshwar Rao, Chief Engineer',
      expectedOutcomes: 'Verified accuracy, latency, and uptime compliance.',
      budget: app.budgetQuoted || '₹35,00,000',
      status: 'Planning',
      progressPercent: 0,
      validationStatus: 'Pending',
      milestones: [
        { id: 'm1', title: 'Pilot Approved & Agreement Signed', date: 'Day 1', status: 'Completed', deliverables: 'Legal framework executed' },
        { id: 'm2', title: 'Deployment & Sensor Mounting', date: 'Day 15', status: 'In Progress', deliverables: 'Hardware configuration' },
        { id: 'm3', title: 'Corridor Data Collection', date: 'Day 35', status: 'Upcoming', deliverables: 'Initial baseline dataset' },
        { id: 'm4', title: 'Live Stress Testing', date: 'Day 55', status: 'Upcoming', deliverables: 'Field testing' },
        { id: 'm5', title: 'KPI Benchmarking', date: 'Day 75', status: 'Upcoming', deliverables: 'Field verification' },
        { id: 'm6', title: 'Validation & Committee Review', date: 'Day 90', status: 'Upcoming', deliverables: 'Final outcome report' }
      ],
      kpis: [
        { name: 'Detection Accuracy', target: '≥ 90%', actual: '92.5%', unit: '%', status: 'On Track', targetNum: 90, actualNum: 92.5, isUserEntered: false },
        { name: 'False Positive Rate', target: '≤ 10%', actual: '7.8%', unit: '%', status: 'On Track', targetNum: 10, actualNum: 7.8, isUserEntered: false },
        { name: 'Average Detection Time', target: '≤ 5.0 sec', actual: '3.6 sec', unit: 's', status: 'On Track', targetNum: 5.0, actualNum: 3.6, isUserEntered: false },
        { name: 'Road Coverage', target: '≥ 80%', actual: '82.0%', unit: '%', status: 'On Track', targetNum: 80, actualNum: 82.0, isUserEntered: false }
      ]
    };
    db.pilots.unshift(pilot);
  }

  addAuditLog('Pilot Commenced', `90-day pilot project sanctioned for ${app.startupName} under ${app.challengeTitle}`);
  
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Pilot Project Created',
    message: `Controlled pilot project sanctioned for ${app.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'pilot'
  });

  saveDb(db);
  res.json(pilot);
});

// POST create pilot project with custom full specification
router.post('/create', (req, res) => {
  const db = getDb();
  const {
    title,
    challengeId,
    challengeTitle,
    startupId,
    startupName,
    department,
    pilotLocation,
    objective,
    startDate,
    endDate,
    pilotDuration,
    governmentOfficer,
    expectedOutcomes,
    budget,
    notes,
    kpis,
    status
  } = req.body;

  if (!startupName || !challengeTitle) {
    return res.status(400).json({ error: 'startupName and challengeTitle are required' });
  }

  const newPilot = {
    id: `pilot-${Date.now().toString(36)}`,
    title: title || `${startupName} Field Pilot`,
    challengeId: challengeId || 'ch-custom',
    challengeTitle: challengeTitle,
    startupId: startupId || `startup-${Date.now().toString(36)}`,
    startupName: startupName,
    department: department || 'Public Works Department',
    pilotLocation: pilotLocation || 'Bengaluru Urban Corridor',
    objective: objective || 'Evaluate operational capability and contract KPI compliance under real operating conditions.',
    pilotDuration: pilotDuration || '90 Days',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    governmentOfficer: governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    expectedOutcomes: expectedOutcomes || 'Validated target KPI benchmarks and deployment feasibility.',
    budget: budget || '₹35,00,000',
    notes: notes || '',
    status: status || 'Planning',
    progressPercent: status === 'Active' ? 10 : 0,
    validationStatus: 'Pending',
    milestones: [
      { id: 'm1', title: 'Pilot Agreement & Legal Clearance', date: 'Day 1', status: status === 'Active' ? 'Completed' : 'In Progress', deliverables: 'Tripartite legal agreement signed' },
      { id: 'm2', title: 'Sensor Deployment & Site Preparation', date: 'Day 15', status: 'Upcoming', deliverables: 'Field hardware ready' },
      { id: 'm3', title: 'Data Ingestion & Baseline Calibration', date: 'Day 35', status: 'Upcoming', deliverables: 'Baseline metric datasets established' },
      { id: 'm4', title: 'Operational Stress Testing', date: 'Day 60', status: 'Upcoming', deliverables: 'Full-load performance verification' },
      { id: 'm5', title: 'Independent KPI Auditing', date: 'Day 75', status: 'Upcoming', deliverables: 'Third-party engineer sign-off' },
      { id: 'm6', title: 'Outcome Report & Validation Gateway', date: 'Day 90', status: 'Upcoming', deliverables: 'Final outcome validation dossier' }
    ],
    kpis: Array.isArray(kpis) && kpis.length > 0 ? kpis : [
      { name: 'Detection Accuracy', description: 'Accuracy in field operations', baseline: '80%', baselineNum: 80, target: '≥ 90%', actual: '0%', unit: '%', status: 'On Track', targetNum: 90, actualNum: 0, isUserEntered: false },
      { name: 'Inference Latency', description: 'Max edge computation response time', baseline: '500ms', baselineNum: 500, target: '≤ 200ms', actual: '0ms', unit: 'ms', status: 'On Track', targetNum: 200, actualNum: 0, isUserEntered: false },
      { name: 'System Uptime', description: 'Continuous uninterrupted operation', baseline: '95%', baselineNum: 95, target: '≥ 99%', actual: '0%', unit: '%', status: 'On Track', targetNum: 99, actualNum: 0, isUserEntered: false },
      { name: 'Road Coverage', description: 'Corridor coverage percentage', baseline: '50%', baselineNum: 50, target: '≥ 80%', actual: '0%', unit: '%', status: 'On Track', targetNum: 80, actualNum: 0, isUserEntered: false }
    ]
  };

  db.pilots.unshift(newPilot);

  // Update application status if matching application exists
  const app = db.applications.find(a => (a.startupId === newPilot.startupId || a.startupName === newPilot.startupName) && (a.challengeId === newPilot.challengeId || a.challengeTitle === newPilot.challengeTitle));
  if (app) {
    app.status = 'Pilot';
  }

  // Update challenge status
  const ch = db.challenges.find(c => c.id === newPilot.challengeId || c.title === newPilot.challengeTitle);
  if (ch) {
    ch.status = 'Pilot Active';
  }

  // Notifications
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Pilot Project Created',
    message: `Pilot project "${newPilot.title || newPilot.challengeTitle}" created for ${newPilot.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'pilot'
  });

  // Audit Log
  addAuditLog(
    'Pilot Created',
    `Pilot project created for ${newPilot.startupName} under ${newPilot.challengeTitle}. Duration: ${newPilot.pilotDuration}`,
    'Government Officer',
    newPilot.governmentOfficer
  );

  saveDb(db);
  res.status(201).json(newPilot);
});

// PUT update pilot lifecycle status (Planning → Approved → Active → Under Evaluation → Completed)
router.put('/:id/status', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const { status, notes, authorizedOfficial } = req.body;
  const previousStatus = pilot.status;
  pilot.status = status;
  if (notes) pilot.notes = notes;
  if (authorizedOfficial) pilot.authorizedOfficial = authorizedOfficial;

  // Specific lifecycle actions
  let auditAction = 'Pilot Status Updated';
  let notifTitle = 'Pilot Status Updated';
  let notifMessage = `Pilot "${pilot.title || pilot.challengeTitle}" is now ${status}.`;

  if (status === 'Approved') {
    auditAction = 'Pilot Approved';
    notifTitle = 'Pilot Approved';
    notifMessage = `Pilot project for ${pilot.startupName} has been officially approved.`;
    if (pilot.progressPercent < 10) pilot.progressPercent = 10;
  } else if (status === 'Active') {
    auditAction = 'Pilot Activated';
    notifTitle = 'Pilot Activated';
    notifMessage = `Pilot field trials are now ACTIVE for ${pilot.startupName}. Live telemetry collection enabled.`;
    if (pilot.progressPercent < 25) pilot.progressPercent = 25;
  } else if (status === 'Under Evaluation') {
    auditAction = 'Pilot Completed';
    notifTitle = 'Pilot Under Evaluation';
    notifMessage = `Pilot field execution has completed. Solution by ${pilot.startupName} is now UNDER EVALUATION for outcome validation.`;
    pilot.progressPercent = 100;
    pilot.validationStatus = 'Under Review';
  } else if (status === 'Completed') {
    auditAction = 'Pilot Completed';
    notifTitle = 'Pilot Concluded';
    notifMessage = `Pilot trials officially marked as COMPLETED for ${pilot.startupName}.`;
    pilot.progressPercent = 100;
  }

  addAuditLog(
    auditAction,
    `Status transitioned from "${previousStatus}" to "${status}" for ${pilot.startupName}.`,
    'Government Officer',
    pilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
  );

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: notifTitle,
    message: notifMessage,
    time: 'Just now',
    read: false,
    type: 'pilot'
  });

  saveDb(db);
  res.json(pilot);
});

// POST record or add KPI measurement
router.post('/:id/kpi', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const {
    name,
    description,
    baseline,
    baselineNum,
    target,
    actual,
    unit,
    status,
    targetNum,
    actualNum,
    measurementDate,
    evidenceNotes
  } = req.body;

  if (!name || !target || !actual) {
    return res.status(400).json({ error: 'KPI name, target, and actual value are required.' });
  }

  const parsedTargetNum = typeof targetNum === 'number' ? targetNum : (parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0);
  const parsedActualNum = typeof actualNum === 'number' ? actualNum : (parseFloat(String(actual).replace(/[^0-9.]/g, '')) || 0);
  const parsedBaselineNum = typeof baselineNum === 'number' ? baselineNum : (baseline ? (parseFloat(String(baseline).replace(/[^0-9.]/g, '')) || 0) : undefined);

  const kpiEntry = {
    name,
    description: description || '',
    baseline: baseline || '',
    baselineNum: parsedBaselineNum,
    target,
    actual,
    unit: unit || '',
    status: status || 'On Track',
    targetNum: parsedTargetNum,
    actualNum: parsedActualNum,
    measurementDate: measurementDate || new Date().toISOString().split('T')[0],
    evidenceNotes: evidenceNotes || '',
    isUserEntered: true
  };

  if (!Array.isArray(pilot.kpis)) {
    pilot.kpis = [];
  }

  const existingIdx = pilot.kpis.findIndex(k => k.name.trim().toLowerCase() === name.trim().toLowerCase());
  let isUpdate = false;
  if (existingIdx >= 0) {
    pilot.kpis[existingIdx] = kpiEntry;
    isUpdate = true;
  } else {
    pilot.kpis.push(kpiEntry);
  }

  const auditAction = isUpdate ? 'KPI Updated' : 'KPI Recorded';
  addAuditLog(
    auditAction,
    `${auditAction}: "${name}" -> Actual: ${actual} (Target: ${target}, Unit: ${unit}, Status: ${status}) for ${pilot.startupName}`,
    'Government Officer',
    pilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
  );

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: isUpdate ? 'KPI Updated' : 'KPI Recorded',
    message: `Telemetry metric "${name}" recorded at ${actual} (${status}) for ${pilot.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'pilot'
  });

  saveDb(db);
  res.json(pilot);
});

// PUT update KPI measurement by index
router.put('/:id/kpi/:kpiIndex', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const idx = parseInt(req.params.kpiIndex, 10);
  if (isNaN(idx) || !pilot.kpis || !pilot.kpis[idx]) {
    return res.status(404).json({ error: 'KPI index not found' });
  }

  const updatedKpi = {
    ...pilot.kpis[idx],
    ...req.body,
    isUserEntered: true,
    measurementDate: req.body.measurementDate || new Date().toISOString().split('T')[0]
  };

  pilot.kpis[idx] = updatedKpi;

  addAuditLog(
    'KPI Updated',
    `KPI "${updatedKpi.name}" updated to Actual: ${updatedKpi.actual} (${updatedKpi.status}) for ${pilot.startupName}`,
    'Government Officer',
    pilot.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD'
  );

  saveDb(db);
  res.json(pilot);
});

// POST record validation decision & outcome report
router.post('/:id/validation', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const {
    decision,
    remarks,
    officialObservations,
    evidenceNotes,
    validationStatus,
    authorizedOfficial,
    validationScore
  } = req.body;

  pilot.validationDecision = decision;
  pilot.validationRemarks = remarks || officialObservations || '';
  pilot.officialObservations = officialObservations || remarks || '';
  pilot.evidenceNotes = evidenceNotes || '';
  pilot.validationStatus = validationStatus || 'Validated';
  pilot.decisionDate = new Date().toISOString().split('T')[0];
  pilot.authorizedOfficial = authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD';
  if (typeof validationScore === 'number') {
    pilot.validationScore = validationScore;
  }

  // Lifecycle status mapping based on decision
  if (decision === 'Scale') {
    pilot.status = 'Scale Approved';
    const ch = db.challenges.find(c => c.id === pilot.challengeId);
    if (ch) ch.status = 'Scaled';

    const app = db.applications.find(a => a.startupId === pilot.startupId && a.challengeId === pilot.challengeId);
    if (app) app.status = 'Validated';
  } else if (decision === 'Re-pilot' || decision === 'Continue Pilot') {
    pilot.status = 'Active';
    pilot.validationStatus = 'Under Review';
  } else if (decision === 'Close' || decision === 'Stop') {
    pilot.status = 'Completed';
  } else {
    pilot.status = 'Validated';
  }

  addAuditLog(
    'Outcome Validation Submitted',
    `Outcome validation report finalized for ${pilot.startupName} under ${pilot.challengeTitle}.`,
    'Government Officer',
    pilot.authorizedOfficial
  );

  addAuditLog(
    'Validation Decision Recorded',
    `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${pilot.validationRemarks}`,
    'Government Officer',
    pilot.authorizedOfficial
  );

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Pilot Validation Decision Recorded',
    message: `Official decision: ${decision.toUpperCase()} recorded for ${pilot.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'validation'
  });

  saveDb(db);
  res.json(pilot);
});

// GET pilot by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id || p.challengeId === req.params.id);
  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }
  res.json(pilot);
});

// PUT update pilot progress/milestone
router.put('/:id/progress', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);
  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const { progressPercent, milestones, kpis } = req.body;
  if (typeof progressPercent === 'number') pilot.progressPercent = progressPercent;
  if (Array.isArray(milestones)) pilot.milestones = milestones;
  if (Array.isArray(kpis)) pilot.kpis = kpis;

  saveDb(db);
  res.json(pilot);
});

export default router;
