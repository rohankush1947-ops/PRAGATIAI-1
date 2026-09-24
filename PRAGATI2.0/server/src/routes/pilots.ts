import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all pilots
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.pilots);
});

// POST start pilot from application
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
      challengeId: app.challengeId,
      challengeTitle: app.challengeTitle,
      startupId: app.startupId,
      startupName: app.startupName,
      department: app.department,
      pilotDuration: '90 Days',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'In Progress',
      progressPercent: 15,
      milestones: [
        { id: 'm1', title: 'Pilot Approved & Agreement Signed', date: 'Day 1', status: 'Completed', deliverables: 'Legal framework executed' },
        { id: 'm2', title: 'Deployment & Sensor Mounting', date: 'Day 15', status: 'In Progress', deliverables: 'Hardware configuration' },
        { id: 'm3', title: 'Corridor Data Collection', date: 'Day 35', status: 'Upcoming', deliverables: 'Initial baseline dataset' },
        { id: 'm4', title: 'Live Stress Testing', date: 'Day 55', status: 'Upcoming', deliverables: 'Field testing' },
        { id: 'm5', title: 'KPI Benchmarking', date: 'Day 75', status: 'Upcoming', deliverables: 'Field verification' },
        { id: 'm6', title: 'Validation & Committee Review', date: 'Day 90', status: 'Upcoming', deliverables: 'Final outcome report' }
      ],
      kpis: [
        { name: 'Detection Accuracy', target: '≥ 90%', actual: '92.5%', unit: '%', status: 'Met', targetNum: 90, actualNum: 92.5 },
        { name: 'False Positive Rate', target: '≤ 10%', actual: '7.8%', unit: '%', status: 'Met', targetNum: 10, actualNum: 7.8 },
        { name: 'Average Detection Time', target: '≤ 5.0 sec', actual: '3.6 sec', unit: 's', status: 'Met', targetNum: 5.0, actualNum: 3.6 },
        { name: 'Road Coverage', target: '≥ 80%', actual: '82.0%', unit: '%', status: 'Met', targetNum: 80, actualNum: 82.0 }
      ]
    };
    db.pilots.unshift(pilot);
  }

  addAuditLog('Pilot Commenced', `90-day pilot project sanctioned for ${app.startupName} under ${app.challengeTitle}`);
  saveDb(db);
  res.json(pilot);
});

// POST record validation decision
router.post('/:id/validation', (req, res) => {
  const db = getDb();
  const pilot = db.pilots.find(p => p.id === req.params.id);

  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }

  const { decision, remarks, authorizedOfficial } = req.body;
  pilot.validationDecision = decision;
  pilot.validationRemarks = remarks;
  pilot.status = decision === 'Scale' ? 'Scale Approved' : 'Validated';
  pilot.decisionDate = new Date().toISOString().split('T')[0];
  pilot.authorizedOfficial = authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD';

  if (decision === 'Scale') {
    const ch = db.challenges.find(c => c.id === pilot.challengeId);
    if (ch) ch.status = 'Scaled';

    const app = db.applications.find(a => a.startupId === pilot.startupId && a.challengeId === pilot.challengeId);
    if (app) app.status = 'Validated';
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Pilot Validation Decision Recorded',
    message: `Official decision: ${decision.toUpperCase()} recorded for ${pilot.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'validation'
  });

  saveDb(db);

  addAuditLog(
    'Pilot Validation Decision Logged',
    `Decision "${decision.toUpperCase()}" authorized for ${pilot.startupName}. Remarks: ${remarks}`,
    'Government Officer',
    pilot.authorizedOfficial
  );

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
