import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all challenges
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.challenges);
});

// GET challenge by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  res.json(challenge);
});

// Helper: Generate unique canonical challenge ID (e.g. CH-006, CH-007)
function generateUniqueChallengeId(existingChallenges: any[]): string {
  let maxNum = 0;
  for (const c of existingChallenges) {
    if (!c || !c.id) continue;
    const matches = String(c.id).match(/\d+/g);
    if (matches) {
      for (const m of matches) {
        const val = parseInt(m, 10);
        if (val > maxNum && val < 10000) maxNum = val;
      }
    }
  }

  let next = maxNum + 1;
  while (true) {
    const candidateId = `CH-${String(next).padStart(3, '0')}`;
    const exists = existingChallenges.some(
      c => c && c.id && c.id.toUpperCase() === candidateId.toUpperCase()
    );
    if (!exists) {
      return candidateId;
    }
    next++;
  }
}

// POST create challenge
router.post('/', (req, res) => {
  const title = (req.body.title || '').trim();
  const problemDescription = (req.body.problemDescription || req.body.problemStatement || '').trim();
  const department = (req.body.department || 'General Administration').trim();
  const category = (req.body.category || req.body.sector || 'Public Sector Innovation').trim();
  const location = (req.body.location || 'India').trim();
  const budgetRange = (req.body.budgetRange || req.body.budget || '₹25 - 50 Lakhs').trim();
  const pilotDuration = (req.body.pilotDuration || req.body.timeline || '90 Days').trim();
  const targetOutcome = (req.body.targetOutcome || req.body.expectedOutcome || req.body.expectedSolution || '').trim();

  // 1. Validation
  if (!title) {
    return res.status(400).json({ 
      error: 'Please enter a challenge title.',
      field: 'title'
    });
  }

  if (!problemDescription) {
    return res.status(400).json({ 
      error: 'Please provide a problem statement describing the challenge.',
      field: 'problemDescription'
    });
  }

  if (!department) {
    return res.status(400).json({ 
      error: 'Please specify the governing department.',
      field: 'department'
    });
  }

  const db = getDb();

  // 2. Duplicate Protection
  const isDuplicate = db.challenges.some((c: any) => 
    c.title.toLowerCase().trim() === title.toLowerCase() &&
    c.department.toLowerCase().trim() === department.toLowerCase()
  );

  if (isDuplicate && !req.body.allowDuplicate) {
    return res.status(409).json({ 
      error: `A challenge titled "${title}" is already registered under ${department}.` 
    });
  }

  // 3. Technical Areas / Required Technologies normalization
  let techArea: string[] = [];
  if (Array.isArray(req.body.techArea) && req.body.techArea.length > 0) {
    techArea = req.body.techArea;
  } else if (Array.isArray(req.body.requiredTechnologies) && req.body.requiredTechnologies.length > 0) {
    techArea = req.body.requiredTechnologies;
  } else if (typeof req.body.techArea === 'string' && req.body.techArea.trim()) {
    techArea = req.body.techArea.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else if (typeof req.body.requiredTechnologies === 'string' && req.body.requiredTechnologies.trim()) {
    techArea = req.body.requiredTechnologies.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else {
    techArea = ['Artificial Intelligence', 'Data Analytics'];
  }

  // 4. Generate Unique Canonical ID (e.g. CH-006, CH-007)
  const challengeId = (req.body.id && !req.body.id.startsWith('temp-') && !req.body.id.startsWith('draft-'))
    ? req.body.id
    : generateUniqueChallengeId(db.challenges);

  const newChallenge = {
    ...req.body,
    id: challengeId,
    title,
    department,
    category,
    location,
    problemDescription,
    targetOutcome,
    budgetRange,
    pilotDuration,
    techArea,
    requiredCapabilities: Array.isArray(req.body.requiredCapabilities) ? req.body.requiredCapabilities : [],
    kpis: Array.isArray(req.body.kpis) ? req.body.kpis : [
      { name: 'Detection / Solution Accuracy', target: '≥ 90%', unit: '%' },
      { name: 'Processing / Response Time', target: '≤ 10 seconds', unit: 'sec' },
      { name: 'Operational Coverage', target: '≥ 85%', unit: '%' }
    ],
    constraints: Array.isArray(req.body.constraints) ? req.body.constraints : [
      'Field deployment reliability under local municipal conditions',
      'Data security compliance with CERT-In standards'
    ],
    eligibility: req.body.eligibility || {
      startupAgeYears: 10,
      turnover: 'Up to ₹25 Cr (DPIIT Recognized)',
      minExperienceYears: 1,
      techRequirements: techArea.slice(0, 2),
      certifications: ['DPIIT Startup Certificate']
    },
    evaluationCriteria: Array.isArray(req.body.evaluationCriteria) && req.body.evaluationCriteria.length > 0
      ? req.body.evaluationCriteria
      : [
          { name: 'Technical Viability & Accuracy', weight: 35, maxScore: 35, description: 'Evaluation of model precision and software reliability' },
          { name: 'Domain Experience & Field Track Record', weight: 25, maxScore: 25, description: 'Past deployments and demonstrated capability' },
          { name: 'Pilot Readiness & Hardware Integration', weight: 20, maxScore: 20, description: 'Readiness for immediate field trials' },
          { name: 'Cost Competitiveness & Value for Money', weight: 20, maxScore: 20, description: 'Pilot quote alignment with department budget' }
        ],
    status: req.body.status || 'Published',
    createdAt: new Date().toISOString().split('T')[0],
    deadline: req.body.deadline || '2026-12-31',
    applicationsCount: 0
  };

  db.challenges.unshift(newChallenge);
  saveDb(db);

  addAuditLog(
    'Challenge Created via API',
    `Registered challenge ${newChallenge.id}: "${newChallenge.title}" under ${newChallenge.department}`,
    'Government Officer',
    req.body.author || 'Officer In-Charge'
  );

  console.log(`[Challenges API] Created new challenge ${newChallenge.id} ("${newChallenge.title}"). Total challenges in DB: ${db.challenges.length}`);

  return res.status(201).json(newChallenge);
});

// PUT update full challenge
router.put('/:id', (req, res) => {
  const db = getDb();
  const index = db.challenges.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  db.challenges[index] = {
    ...db.challenges[index],
    ...req.body,
    id: req.params.id // Prevent overriding primary ID
  };

  saveDb(db);
  addAuditLog('Challenge Updated', `Updated challenge: "${db.challenges[index].title}"`);
  res.json(db.challenges[index]);
});

// PUT update status
router.put('/:id/status', (req, res) => {
  const db = getDb();
  const { status } = req.body;
  const challenge = db.challenges.find(c => c.id === req.params.id);

  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  challenge.status = status;
  saveDb(db);

  addAuditLog('Challenge Status Updated', `Status changed to ${status} for ${challenge.title}`);
  res.json(challenge);
});

// DELETE challenge
router.delete('/:id', (req, res) => {
  const db = getDb();
  const index = db.challenges.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  const removed = db.challenges.splice(index, 1)[0];
  saveDb(db);

  addAuditLog('Challenge Deleted', `Removed challenge: "${removed.title}"`);
  res.json({ success: true, message: `Challenge ${req.params.id} deleted successfully.` });
});

export default router;
