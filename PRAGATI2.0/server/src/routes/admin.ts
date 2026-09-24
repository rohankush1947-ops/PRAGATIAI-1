import { Router } from 'express';
import { getDb, resetDb, addAuditLog } from '../db.js';

const router = Router();

// GET admin system telemetry stats
router.get('/stats', (req, res) => {
  const db = getDb();
  res.json({
    totalDepartments: 18,
    totalStartups: db.startups.length,
    totalExperts: 48,
    activeChallenges: db.challenges.length,
    activePilots: db.pilots.length,
    validatedSolutions: 14,
    scaledSolutions: 6,
    totalAuditLogs: db.auditLogs.length
  });
});

// POST reset demo data
router.post('/reset-demo', (req, res) => {
  const resetData = resetDb();
  addAuditLog('System Reset', 'Platform data reinitialized to system default state', 'Platform Admin', 'Admin System');
  res.json({ success: true, message: 'Database reset to default seed state' });
});

export default router;
