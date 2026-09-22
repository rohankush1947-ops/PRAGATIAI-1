import { Router } from 'express';
import { getDb, addAuditLog } from '../db.js';

const router = Router();

// GET all audit logs
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.auditLogs);
});

// POST add audit log entry
router.post('/', (req, res) => {
  const { action, details, userRole, userName, status } = req.body;
  const entry = addAuditLog(action, details, userRole, userName, status);
  res.status(201).json(entry);
});

export default router;
