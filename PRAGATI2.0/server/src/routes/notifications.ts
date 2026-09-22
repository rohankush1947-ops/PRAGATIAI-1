import { Router } from 'express';
import { getDb, saveDb } from '../db.js';

const router = Router();

// GET all notifications
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.notifications);
});

// POST mark as read
router.post('/:id/read', (req, res) => {
  const db = getDb();
  const notif = db.notifications.find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    saveDb(db);
  }
  res.json({ success: true });
});

// POST mark all read
router.post('/read-all', (req, res) => {
  const db = getDb();
  db.notifications.forEach(n => { n.read = true; });
  saveDb(db);
  res.json({ success: true });
});

export default router;
