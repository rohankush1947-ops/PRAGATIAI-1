import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all applications
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.applications);
});

// POST submit application
router.post('/', (req, res) => {
  const db = getDb();
  const newApp = {
    ...req.body,
    id: `app-${Date.now().toString(36)}`,
    submissionDate: new Date().toISOString().split('T')[0],
    status: req.body.status || 'Applied'
  };

  db.applications.unshift(newApp);

  // Increment challenge counter
  const ch = db.challenges.find(c => c.id === req.body.challengeId);
  if (ch) {
    ch.applicationsCount = (ch.applicationsCount || 0) + 1;
  }

  // Create corresponding expert evaluation queue item
  if (!db.evaluations) db.evaluations = [];
  const newEval = {
    id: `eval-${newApp.id}`,
    applicationId: newApp.id,
    challengeId: newApp.challengeId,
    challengeTitle: newApp.challengeTitle,
    startupId: newApp.startupId,
    startupName: newApp.startupName,
    evaluatorName: 'Dr. Arvind Swaminathan',
    evaluatorSpecialization: 'IIT Madras AI & Infrastructure Panel',
    date: newApp.submissionDate,
    scores: {
      technicalCapability: 0,
      innovation: 0,
      scalability: 0,
      costEffectiveness: 0,
      impact: 0
    },
    totalScore: 0,
    recommendation: 'Under Review',
    remarks: 'Awaiting expert technical panel review and rubric scoring.',
    isSubmitted: false
  };
  db.evaluations.unshift(newEval);

  // Create notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Application Submitted',
    message: `${newApp.startupName} submitted a proposal for "${newApp.challengeTitle}".`,
    time: 'Just now',
    read: false,
    type: 'application'
  });

  saveDb(db);

  addAuditLog(
    'Application Submitted via API',
    `${newApp.startupName} submitted application for ${newApp.challengeTitle}`,
    'Startup',
    newApp.startupName
  );

  res.status(201).json(newApp);
});

// GET application by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(app);
});

// PUT update application
router.put('/:id', (req, res) => {
  const db = getDb();
  const idx = db.applications.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  db.applications[idx] = {
    ...db.applications[idx],
    ...req.body,
    id: req.params.id
  };

  saveDb(db);
  res.json(db.applications[idx]);
});

// PUT update application status
router.put('/:id/status', (req, res) => {
  const db = getDb();
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const { status } = req.body;
  app.status = status;

  addAuditLog(
    'Application Status Updated',
    `Application ${app.id} status updated to ${status} for ${app.startupName}`,
    'Government Officer',
    'Procurement Officer'
  );

  saveDb(db);
  res.json(app);
});

export default router;
