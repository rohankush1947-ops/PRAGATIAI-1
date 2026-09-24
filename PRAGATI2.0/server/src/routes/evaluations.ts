import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all evaluations
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.evaluations);
});

// GET evaluation by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const evalItem = db.evaluations.find(e => e.id === req.params.id || e.applicationId === req.params.id || e.challengeId === req.params.id);
  if (!evalItem) {
    return res.status(404).json({ error: 'Evaluation not found' });
  }
  res.json(evalItem);
});

// POST submit evaluation
router.post('/:id', (req, res) => {
  const db = getDb();
  let evalItem = db.evaluations.find(e => e.id === req.params.id || e.challengeId === req.params.id || e.applicationId === req.params.id);

  if (!evalItem) {
    const challenge = db.challenges.find((c: any) => c.id === req.params.id);
    const app = db.applications.find((a: any) => a.id === req.params.id || a.challengeId === req.params.id);

    evalItem = {
      id: req.params.id.startsWith('eval-') ? req.params.id : `eval-${req.params.id}`,
      applicationId: app?.id || `app-${req.params.id}`,
      challengeId: challenge?.id || app?.challengeId || req.params.id,
      challengeTitle: challenge?.title || app?.challengeTitle || 'Outcome-Based Challenge',
      startupId: app?.startupId || 'startup-candidate',
      startupName: app?.startupName || 'Deep-Tech Startup Candidate',
      evaluatorName: 'Dr. Arvind Swaminathan',
      evaluatorSpecialization: 'Deep-Tech Technical Evaluation Board',
      date: new Date().toISOString().split('T')[0],
      scores: {
        technicalCapability: 20,
        innovation: 18,
        scalability: 18,
        costEffectiveness: 14,
        impact: 18
      },
      totalScore: 88,
      recommendation: 'Shortlist for Pilot',
      remarks: '',
      isSubmitted: false
    };
    db.evaluations.push(evalItem);
  }

  const { scores, recommendation, remarks } = req.body;
  const total = (scores.technicalCapability || 0) + (scores.innovation || 0) + (scores.scalability || 0) + (scores.costEffectiveness || 0) + (scores.impact || 0);

  evalItem.scores = scores;
  evalItem.totalScore = total;
  evalItem.recommendation = recommendation;
  evalItem.remarks = remarks;
  evalItem.isSubmitted = true;

  // Update application if exists
  const app = db.applications.find(a => a.id === evalItem.applicationId || a.challengeId === evalItem.challengeId);
  if (app) {
    app.expertScore = total;
    app.expertRecommendation = recommendation;
    app.status = recommendation === 'Shortlist for Pilot' ? 'Shortlisted' : 'Under Review';
  }

  // Create notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Expert Evaluation Logged',
    message: `Score ${total}/100 recorded for ${evalItem.startupName} on ${evalItem.challengeTitle} (${evalItem.challengeId})`,
    time: 'Just now',
    read: false,
    type: 'evaluation'
  });

  saveDb(db);

  addAuditLog(
    'Expert Evaluation Completed',
    `Scored ${total}/100 with recommendation "${recommendation}" for ${evalItem.startupName} on ${evalItem.challengeId}`,
    'Expert Evaluator',
    evalItem.evaluatorName,
    'Verified'
  );

  res.json(evalItem);
});

export default router;
