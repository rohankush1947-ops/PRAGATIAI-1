import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET scale-up plan
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.scaleUpPlan);
});

// POST advance scale-up phase
router.post('/advance', (req, res) => {
  const db = getDb();
  const { phase } = req.body;

  const targetPhase = db.scaleUpPlan.scalePhases.find((p: any) => p.phase === phase);
  if (!targetPhase) {
    return res.status(404).json({ error: 'Phase not found' });
  }

  targetPhase.status = 'Active';
  saveDb(db);

  addAuditLog(
    'Scale-Up Phase Advanced',
    `Activated rollout phase ${phase} across targeted districts`,
    'Government Officer',
    'State IT & Infrastructure Mission'
  );

  res.json(db.scaleUpPlan);
});

export default router;
