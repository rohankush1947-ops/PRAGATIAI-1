import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all startups with optional search & domain filter
router.get('/', (req, res) => {
  const db = getDb();
  const { search, domain } = req.query;
  let list = db.startups;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(st => 
      st.name.toLowerCase().includes(q) ||
      st.domain.toLowerCase().includes(q) ||
      (Array.isArray(st.techStack) && st.techStack.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  if (domain && typeof domain === 'string' && domain !== 'All') {
    list = list.filter(st => st.domain.includes(domain));
  }

  res.json(list);
});

// GET startup by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const startup = db.startups.find(s => s.id === req.params.id);
  if (!startup) {
    return res.status(404).json({ error: 'Startup not found' });
  }
  res.json(startup);
});

// POST register/create new startup
router.post('/', (req, res) => {
  const { name, domain, techStack, overview } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Validation failed: Startup "name" is required.' });
  }

  if (!domain || typeof domain !== 'string' || !domain.trim()) {
    return res.status(400).json({ error: 'Validation failed: Startup "domain" is required.' });
  }

  const cleanName = name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const startupId = req.body.id || `startup-${slug}-${Date.now().toString(36).slice(-4)}`;

  const db = getDb();

  // Check for duplicate name
  const existing = db.startups.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: `Startup with name "${cleanName}" already registered.` });
  }

  const newStartup = {
    id: startupId,
    name: cleanName,
    tagline: req.body.tagline || `${cleanName} - Advanced Technology Solutions`,
    domain: domain.trim(),
    techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map((s: string) => s.trim()) : ['Deep Tech', 'AI']),
    location: req.body.location || 'India',
    stage: req.body.stage || 'Growth',
    foundedYear: req.body.foundedYear || new Date().getFullYear() - 2,
    pilotReadiness: req.body.pilotReadiness || 'High',
    eligibilityStatus: req.body.eligibilityStatus || 'Eligible',
    teamSize: req.body.teamSize || 15,
    revenueRange: req.body.revenueRange || '₹1 - 3 Cr',
    completedPilotsCount: typeof req.body.completedPilotsCount === 'number' ? req.body.completedPilotsCount : 2,
    certifications: Array.isArray(req.body.certifications) ? req.body.certifications : ['DPIIT Recognized', 'Make in India Certified'],
    overview: overview || `${cleanName} develops innovative solutions in ${domain.trim()} for public and commercial applications.`,
    pastProjects: Array.isArray(req.body.pastProjects) ? req.body.pastProjects : [
      { name: 'State Innovation Pilot', client: 'Public Sector Enterprise', impact: 'Successfully deployed pilot with verified KPI achievements' }
    ]
  };

  db.startups.push(newStartup);
  saveDb(db);

  addAuditLog(
    'Startup Profile Registered',
    `New startup "${newStartup.name}" enrolled into deep-tech registry under ${newStartup.domain}`,
    'Startup Representative',
    newStartup.name
  );

  res.status(201).json(newStartup);
});

// PUT update startup profile
router.put('/:id', (req, res) => {
  const db = getDb();
  const index = db.startups.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Startup not found' });
  }

  db.startups[index] = {
    ...db.startups[index],
    ...req.body,
    id: req.params.id // Prevent ID modification
  };

  saveDb(db);
  addAuditLog('Startup Profile Updated', `Updated profile data for "${db.startups[index].name}"`);
  res.json(db.startups[index]);
});

// DELETE startup
router.delete('/:id', (req, res) => {
  const db = getDb();
  const index = db.startups.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Startup not found' });
  }

  const removed = db.startups.splice(index, 1)[0];
  saveDb(db);

  addAuditLog('Startup Removed', `Deregistered startup: "${removed.name}"`);
  res.json({ success: true, message: `Startup ${req.params.id} removed successfully.` });
});

export default router;
