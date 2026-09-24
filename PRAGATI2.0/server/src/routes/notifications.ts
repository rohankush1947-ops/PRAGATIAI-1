import { Router } from 'express';
import { getDb, saveDb } from '../db.js';

const router = Router();

// GET all notifications
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.notifications);
});

// POST create notification
router.post('/', (req, res) => {
  const db = getDb();
  const { title, message, type } = req.body;
  const newNotif = {
    id: `notif-${Date.now()}`,
    title: title || 'System Notification',
    message: message || '',
    time: 'Just now',
    read: false,
    type: type || 'system'
  };
  db.notifications = db.notifications || [];
  db.notifications.unshift(newNotif);
  saveDb(db);
  res.status(201).json(newNotif);
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
