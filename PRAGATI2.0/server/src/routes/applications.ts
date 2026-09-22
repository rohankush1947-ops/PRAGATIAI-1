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

export default router;
