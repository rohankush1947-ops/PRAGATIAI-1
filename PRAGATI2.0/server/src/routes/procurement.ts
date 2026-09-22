import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all procurement contracts
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.procurementContracts);
});

// POST release milestone payout
router.post('/:id/milestones/:num/release', (req, res) => {
  const db = getDb();
  const contract = db.procurementContracts.find(c => c.id === req.params.id);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  const milestoneNum = parseInt(req.params.num, 10);
  const milestone = contract.milestones.find((m: any) => m.milestoneNumber === milestoneNum);

  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  milestone.status = 'Released';

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Procurement Milestone Payment Released',
    message: `Milestone ${milestoneNum} payment disbursed to ${contract.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'procurement'
  });

  saveDb(db);

  addAuditLog(
    'Procurement Milestone Released',
    `Milestone ${milestoneNum} payment authorized for ${contract.startupName}`,
    'Procurement Officer',
    'Finance & Accounts Division'
  );

  res.json(contract);
});

export default router;
