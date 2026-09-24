import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// Helper: 7-Point Scale-Up Eligibility Guard
export function checkScaleUpEligibility(procurementId: string, db: any) {
  const contract = (db.procurementContracts || []).find((c: any) => c.id === procurementId);
  if (!contract) {
    return {
      isEligible: false,
      reason: 'Scale-Up unavailable: Procurement contract not found.',
      checks: {
        isGovtSelected: false,
        hasPilot: false,
        isPilotCompleted: false,
        isValidationCompleted: false,
        isDecisionScale: false,
        hasProcurement: false,
        isProcurementApprovedOrActive: false
      }
    };
  }

  // 1. Government selected the startup
  const app = (db.applications || []).find((a: any) => 
    a.startupId === contract.startupId || 
    (a.challengeId === contract.challengeId && a.startupName === contract.startupName)
  );
  const isGovtSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

  // 2. Pilot exists
  const pilot = (db.pilots || []).find((p: any) => p.id === contract.pilotId || p.startupName === contract.startupName);
  const hasPilot = Boolean(pilot);

  // 3. Pilot reached completed / evaluated state
  const isPilotCompleted = pilot && (
    ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
    (pilot.status === 'In Progress' && Boolean(pilot.validationDecision))
  );

  // 4. KPI/Outcome Validation is completed
  const isValidationCompleted = pilot && (Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated');

  // 5. Outcome Validation decision = "Scale"
  const isDecisionScale = pilot && (pilot.validationDecision === 'Scale');

  // 6. Procurement exists
  const hasProcurement = true;

  // 7. Procurement reached approved / active state
  const isProcurementApprovedOrActive = ['Approved', 'Active', 'Completed'].includes(contract.contractStatus);

  const isEligible = Boolean(
    isGovtSelected &&
    hasPilot &&
    isPilotCompleted &&
    isValidationCompleted &&
    isDecisionScale &&
    hasProcurement &&
    isProcurementApprovedOrActive
  );

  let reason = '';
  if (!isGovtSelected) reason = 'Scale-Up unavailable: Startup must be selected by Government first.';
  else if (!hasPilot) reason = 'Scale-Up unavailable: Controlled Pilot project does not exist.';
  else if (!isPilotCompleted) reason = 'Scale-Up unavailable: Pilot project has not reached completed/evaluated status.';
  else if (!isValidationCompleted) reason = 'Scale-Up unavailable: KPI & Outcome Validation must be completed first.';
  else if (!isDecisionScale) reason = 'Scale-Up unavailable: Outcome Validation must approve scaling first (decision was not "Scale").';
  else if (!isProcurementApprovedOrActive) reason = 'Scale-Up unavailable: Procurement Contract must be Approved or Active before scaling.';

  return {
    isEligible,
    reason,
    contract,
    pilot,
    app,
    checks: {
      isGovtSelected: Boolean(isGovtSelected),
      hasPilot: Boolean(hasPilot),
      isPilotCompleted: Boolean(isPilotCompleted),
      isValidationCompleted: Boolean(isValidationCompleted),
      isDecisionScale: Boolean(isDecisionScale),
      hasProcurement: true,
      isProcurementApprovedOrActive: Boolean(isProcurementApprovedOrActive)
    }
  };
}

// GET active/primary scale-up plan (for backward compatibility)
router.get('/', (req, res) => {
  const db = getDb();
  if (req.query.all === 'true') {
    return res.json(db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []));
  }
  res.json(db.scaleUpPlan || (db.scaleUpPlans && db.scaleUpPlans[0]) || null);
});

// GET all scale-up plans
router.get('/all', (req, res) => {
  const db = getDb();
  res.json(db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []));
});

// GET eligible procurements for scale-up
router.get('/eligible-procurements', (req, res) => {
  const db = getDb();
  const eligible = (db.procurementContracts || []).filter((c: any) => {
    return checkScaleUpEligibility(c.id, db).isEligible;
  });
  res.json(eligible);
});

// GET scale-up plan by id
router.get('/:id', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id);
  if (!plan) {
    if (db.scaleUpPlan && db.scaleUpPlan.id === req.params.id) {
      return res.json(db.scaleUpPlan);
    }
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }
  res.json(plan);
});

// POST create scale-up plan with STRICT 7-POINT ELIGIBILITY CHECK
router.post('/', (req, res) => {
  const db = getDb();
  const {
    procurementId,
    title,
    description,
    targetScope,
    targetRegions,
    expectedBeneficiaries,
    estimatedBudget,
    implementationTimeline,
    responsibleGovernmentDepartment,
    risks,
    mitigation,
    milestones,
    kpis
  } = req.body;

  if (!procurementId) {
    return res.status(400).json({ error: 'procurementId is required to instantiate Scale-Up' });
  }

  // Strict 7-Point Eligibility Check
  const eligibility = checkScaleUpEligibility(procurementId, db);
  if (!eligibility.isEligible) {
    return res.status(400).json({
      error: eligibility.reason || 'Startup solution is not eligible for Scale-Up.',
      eligibilityCheck: eligibility.checks
    });
  }

  const { contract, pilot } = eligibility;
  const uniqueSuffix = Date.now().toString(36).toUpperCase();
  const scaleUpId = `SCALE-UP-2027-${uniqueSuffix}`;

  const formattedBudget = estimatedBudget || contract.contractValue || contract.approvedBudget || '₹4.25 Crores';
  const regions = Array.isArray(targetRegions) && targetRegions.length > 0
    ? targetRegions
    : ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Hubballi-Dharwad'];

  const defaultMilestones = milestones && milestones.length > 0 ? milestones : [
    {
      milestoneNumber: 1,
      title: 'Phase 1: Multi-District Hardware Deployment & Training',
      timeline: 'Months 1-4',
      deliverable: 'Deployment of production edge units across 5 primary districts and local operator training',
      status: 'Pending',
      targetDistrict: regions.slice(0, 2).join(', '),
      budgetAllocation: '₹95,00,000'
    },
    {
      milestoneNumber: 2,
      title: 'Phase 2: Departmental ERP & Field Command Center Integration',
      timeline: 'Months 5-10',
      deliverable: 'Automated work-order generation and statewide dashboard integration',
      status: 'Pending',
      targetDistrict: regions.slice(2, 4).join(', '),
      budgetAllocation: '₹1,50,00,000'
    },
    {
      milestoneNumber: 3,
      title: 'Phase 3: Statewide Network Coverage & Public Transparency Portal',
      timeline: 'Months 11-18',
      deliverable: 'Comprehensive deployment across all targeted divisions and citizen transparency API release',
      status: 'Pending',
      targetDistrict: 'Statewide Corridors',
      budgetAllocation: '₹1,80,00,000'
    }
  ];

  const defaultKpis = kpis && kpis.length > 0 ? kpis : [
    { metric: 'Road Network Coverage', baseline: '520 km', target: targetScope || '32,000 km', current: '520 km', status: 'Tracking' },
    { metric: 'Detection Accuracy SLA', baseline: '94.2%', target: '≥ 95.0%', current: '94.8%', status: 'Tracking' },
    { metric: 'Repair Work Order Dispatch', baseline: '14 Days', target: '< 48 Hours', current: '72 Hours', status: 'Tracking' },
    { metric: 'Citizen Grievance Resolution', baseline: '45%', target: '> 90%', current: '78%', status: 'Tracking' }
  ];

  const newScaleUpPlan: any = {
    id: scaleUpId,
    challengeId: contract.challengeId || pilot?.challengeId,
    challengeTitle: contract.challengeTitle || pilot?.challengeTitle || 'Municipal Infrastructure Challenge',
    startupId: contract.startupId || pilot?.startupId,
    startupName: contract.startupName || pilot?.startupName || 'Startup',
    solutionName: contract.validatedSolution || `${contract.startupName} Production Suite`,
    pilotId: contract.pilotId || pilot?.id,
    pilotTitle: contract.pilotTitle || pilot?.title || 'Controlled Field Pilot',
    procurementId: contract.id,
    procurementReferenceId: contract.referenceId || contract.id,
    title: title || `State-Wide Expansion Plan for ${contract.startupName}`,
    description: description || `Departmental scale-up rollout across targeted districts following validated pilot trial and innovation procurement award.`,
    targetScope: targetScope || '32,000 km State Road Infrastructure Network',
    targetRegions: regions,
    expectedBeneficiaries: expectedBeneficiaries || '6.4 Crore citizens & 2.1 Million daily commuters',
    estimatedBudget: formattedBudget,
    estimatedCost: formattedBudget,
    implementationTimeline: implementationTimeline || '18 Months (Q1 2027 - Q3 2028)',
    responsibleGovernmentDepartment: responsibleGovernmentDepartment || contract.department || 'Public Works Department (PWD)',
    risks: risks || 'Hardware telemetry degradation in extreme weather; edge transmission in low-bandwidth corridors',
    mitigation: mitigation || 'IP68-rated enclosures, edge-side local caching, and asynchronous data sync',
    status: 'Draft',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    authorizedOfficial: contract.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    expectedImpact: 'Annual operational savings of ₹14.8 Cr and 22% reduction in maintenance delay times.',
    currentDeployment: '520 km (Controlled Pilot Zone)',
    targetDeployment: targetScope || '32,000 km across targeted districts',
    milestones: defaultMilestones,
    kpis: defaultKpis,
    scalePhases: [
      {
        phase: 'Phase 1',
        title: 'Controlled Municipal Pilot',
        coverage: '520 km (1 Division)',
        timeline: 'Q3 2026 (Completed)',
        status: 'Completed',
        districts: [regions[0] || 'Bengaluru Urban']
      },
      {
        phase: 'Phase 2',
        title: 'Multi-District Expansion Corridor',
        coverage: '4,500 km (Key Regional Highways)',
        timeline: 'Q1 - Q2 2027',
        status: 'Active',
        districts: regions.slice(1, 4)
      },
      {
        phase: 'Phase 3',
        title: 'Comprehensive Statewide Rollout',
        coverage: targetScope || '32,000 km Network',
        timeline: 'Q3 2027 - Q4 2028',
        status: 'Planned',
        districts: ['All Targeted Districts']
      }
    ]
  };

  db.scaleUpPlans = db.scaleUpPlans || [];
  db.scaleUpPlans.unshift(newScaleUpPlan);
  db.scaleUpPlan = newScaleUpPlan;

  // Add Notification to Startup
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Scale-Up Stage Initiated',
    message: `Your solution ${newScaleUpPlan.startupName} has entered the Scale-Up stage for statewide expansion.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  // Add Notification to Government
  db.notifications.unshift({
    id: `notif-${Date.now() + 1}`,
    title: 'Scale-Up Plan Created',
    message: `Scale-up plan (${scaleUpId}) drafted for ${newScaleUpPlan.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  // Audit Log Entry
  addAuditLog(
    'Scale-Up Plan Created',
    `Drafted state-wide scale-up plan ${scaleUpId} for ${newScaleUpPlan.startupName} under ${newScaleUpPlan.challengeTitle}`,
    'Government Officer',
    newScaleUpPlan.authorizedOfficial,
    'Verified'
  );

  saveDb(db);
  res.status(201).json(newScaleUpPlan);
});

// PUT update scale-up plan
router.put('/:id', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id) || (db.scaleUpPlan?.id === req.params.id ? db.scaleUpPlan : null);

  if (!plan) {
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }

  const allowedUpdates = [
    'title', 'description', 'targetScope', 'targetRegions',
    'expectedBeneficiaries', 'estimatedBudget', 'implementationTimeline',
    'responsibleGovernmentDepartment', 'risks', 'mitigation', 'milestones', 'kpis'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      plan[field] = req.body[field];
    }
  });

  plan.updatedAt = new Date().toISOString().split('T')[0];

  addAuditLog(
    'Scale-Up Plan Updated',
    `Updated operational parameters for scale-up plan ${plan.id}`,
    'Government Officer',
    plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    'Verified'
  );

  saveDb(db);
  res.json(plan);
});

// POST submit scale-up plan for review (Draft -> Under Review)
router.post('/:id/submit', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id) || (db.scaleUpPlan?.id === req.params.id ? db.scaleUpPlan : null);

  if (!plan) {
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }

  plan.status = 'Under Review';
  plan.updatedAt = new Date().toISOString().split('T')[0];
  if (req.body.notes) plan.approvalNotes = req.body.notes;

  // Audit log
  addAuditLog(
    'Scale-Up Submitted for Review',
    `Scale-up plan ${plan.id} for ${plan.startupName} submitted for inter-departmental sanction review`,
    'Government Officer',
    plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    'Verified'
  );

  // Notification
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Scale-Up Under Review',
    message: `Scale-up plan for ${plan.startupName} submitted for administrative sanction.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  saveDb(db);
  res.json(plan);
});

// POST approve scale-up plan (Under Review -> Approved)
router.post('/:id/approve', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id) || (db.scaleUpPlan?.id === req.params.id ? db.scaleUpPlan : null);

  if (!plan) {
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }

  plan.status = 'Approved';
  plan.updatedAt = new Date().toISOString().split('T')[0];
  if (req.body.notes) plan.approvalNotes = req.body.notes;
  if (req.body.official) plan.authorizedOfficial = req.body.official;

  // Audit log
  addAuditLog(
    'Scale-Up Approved',
    `Scale-up plan ${plan.id} for ${plan.startupName} officially approved by Departmental Sanction Committee`,
    'Government Officer',
    plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    'Verified'
  );

  // Notifications
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Scale-Up Plan Approved',
    message: `Scale-up plan approved for ${plan.startupName}. Multi-district rollout sanctioned.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  saveDb(db);
  res.json(plan);
});

// POST activate scale-up plan (Approved -> Active)
router.post('/:id/activate', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id) || (db.scaleUpPlan?.id === req.params.id ? db.scaleUpPlan : null);

  if (!plan) {
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }

  plan.status = 'Active';
  plan.updatedAt = new Date().toISOString().split('T')[0];

  // Activate primary milestone
  if (plan.milestones && plan.milestones[0]) {
    plan.milestones[0].status = 'In Progress';
  }

  // Audit log
  addAuditLog(
    'Scale-Up Activated',
    `Scale-up implementation activated for ${plan.startupName} across targeted territorial districts`,
    'Government Officer',
    plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    'Verified'
  );

  // Notifications
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Scale-Up Implementation Started',
    message: `Scale-up implementation has started for ${plan.startupName}. Field deployment initiated.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  saveDb(db);
  res.json(plan);
});

// POST complete scale-up plan (Active -> Completed)
router.post('/:id/complete', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const plan = plans.find((p: any) => p.id === req.params.id) || (db.scaleUpPlan?.id === req.params.id ? db.scaleUpPlan : null);

  if (!plan) {
    return res.status(404).json({ error: 'Scale-Up plan not found' });
  }

  plan.status = 'Completed';
  plan.updatedAt = new Date().toISOString().split('T')[0];

  // Complete all milestones
  if (plan.milestones) {
    plan.milestones.forEach((m: any) => { m.status = 'Completed'; });
  }
  if (plan.scalePhases) {
    plan.scalePhases.forEach((p: any) => { p.status = 'Completed'; });
  }

  // Audit log
  addAuditLog(
    'Scale-Up Completed',
    `Scale-up rollout successfully completed for ${plan.startupName}. Full state adoption achieved.`,
    'Government Officer',
    plan.authorizedOfficial || 'Er. Rajeshwar Rao, Chief Engineer, PWD',
    'Verified'
  );

  // Notifications
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Scale-Up Completed',
    message: `Statewide scale-up deployment successfully completed for ${plan.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'scale-up'
  });

  saveDb(db);
  res.json(plan);
});

// POST advance scale-up phase (Backward compatibility)
router.post('/advance', (req, res) => {
  const db = getDb();
  const { phase } = req.body;

  const plan = db.scaleUpPlan || (db.scaleUpPlans && db.scaleUpPlans[0]);
  if (!plan) {
    return res.status(404).json({ error: 'Scale-up plan not found' });
  }

  const targetPhase = plan.scalePhases.find((p: any) => p.phase === phase);
  if (!targetPhase) {
    return res.status(404).json({ error: 'Phase not found' });
  }

  targetPhase.status = 'Active';
  saveDb(db);

  addAuditLog(
    'Scale-Up Phase Advanced',
    `Activated rollout phase ${phase} across targeted districts`,
    'Government Officer',
    plan.authorizedOfficial || 'State IT & Infrastructure Mission'
  );

  res.json(plan);
});

export default router;
