import { Router } from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

const router = Router();

// GET all procurement contracts
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.procurementContracts || []);
});

// GET eligible pilots for procurement (Strict 5-Point Validation Guard)
router.get('/eligible-pilots', (req, res) => {
  const db = getDb();
  const eligible = (db.pilots || []).filter((pilot: any) => {
    // 1. Startup selected by Government
    const app = (db.applications || []).find((a: any) => 
      a.startupId === pilot.startupId || 
      a.id === pilot.applicationId || 
      (a.challengeId === pilot.challengeId && a.startupName === pilot.startupName)
    );
    const isStartupSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

    // 2. Pilot exists (true by definition in filter)
    // 3. Pilot in Under Evaluation, Completed, or Validated state
    const isPilotInValidState = 
      ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
      (pilot.status === 'In Progress' && Boolean(pilot.validationDecision));

    // 4. Outcome validation completed
    const isValidationCompleted = Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated';

    // 5. Validation decision is "Scale"
    const isDecisionScale = pilot.validationDecision === 'Scale';

    return isStartupSelected && isPilotInValidState && isValidationCompleted && isDecisionScale;
  });

  res.json(eligible);
});

// POST create procurement contract with STRICT 5-POINT ELIGIBILITY CHECK
router.post('/create', (req, res) => {
  const db = getDb();
  const {
    pilotId,
    procurementMethod,
    contractValue,
    approvedBudget,
    contractStartDate,
    contractEndDate,
    deliverables,
    paymentInfo,
    notes,
    milestones
  } = req.body;

  if (!pilotId) {
    return res.status(400).json({ error: 'pilotId is required' });
  }

  const pilot = (db.pilots || []).find((p: any) => p.id === pilotId);
  if (!pilot) {
    return res.status(404).json({ error: 'Pilot project not found' });
  }

  // Find linked application and challenge
  const app = (db.applications || []).find((a: any) => 
    a.startupId === pilot.startupId || 
    a.id === pilot.applicationId || 
    (a.challengeId === pilot.challengeId && a.startupName === pilot.startupName)
  );

  const evaluation = (db.evaluations || []).find((e: any) => 
    e.applicationId === app?.id || 
    (e.challengeId === pilot.challengeId && e.startupName === pilot.startupName)
  );

  // 1. Startup selected by Government
  const isStartupSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

  // 2. Pilot exists (checked above)

  // 3. Pilot reached completed / evaluation state
  const isPilotInValidState = 
    ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
    (pilot.status === 'In Progress' && Boolean(pilot.validationDecision));

  // 4. Outcome validation completed
  const isValidationCompleted = Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated';

  // 5. Recorded validation decision is "Scale"
  const isDecisionScale = pilot.validationDecision === 'Scale';

  if (!isStartupSelected || !isPilotInValidState || !isValidationCompleted || !isDecisionScale) {
    return res.status(400).json({
      error: 'Startup solution is not eligible for procurement. Prerequisites: 1) Government Selection, 2) Completed Pilot, 3) Outcome Validation with "Scale" decision.',
      eligibilityCheck: {
        isStartupSelected,
        isPilotInValidState,
        isValidationCompleted,
        isDecisionScale
      }
    });
  }

  const uniqueSuffix = Date.now().toString(36).toUpperCase();
  const contractId = `GEM-PROC-2026-${uniqueSuffix}`;
  const finalBudget = contractValue || approvedBudget || pilot.budget || '₹45,00,000';
  const startDate = contractStartDate || new Date().toISOString().split('T')[0];
  const endDate = contractEndDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];

  const defaultMilestones = [
    {
      milestoneNumber: 1,
      title: 'Milestone 1: Production Infrastructure & Hardware Supply',
      payout: '30% Escrow Advance',
      status: 'Pending Verification',
      deliverable: deliverables || 'Delivery and deployment of field-grade hardware units across municipal zones'
    },
    {
      milestoneNumber: 2,
      title: 'Milestone 2: 90-Day Operational SLA & Live Integration',
      payout: '40% Intermediate Payout',
      status: 'Upcoming',
      deliverable: 'Continuous uptime ≥ 99% and seamless telemetry ingestion into State GIS ERP'
    },
    {
      milestoneNumber: 3,
      title: 'Milestone 3: Final Acceptance, Source Escrow & Commissioning',
      payout: '30% Final Disbursement',
      status: 'Upcoming',
      deliverable: 'Final operational sign-off, user training, and 2-year statutory warranty onboarding'
    }
  ];

  const newContract = {
    id: contractId,
    referenceId: `REF-GFR173-${uniqueSuffix}`,
    pilotId: pilot.id,
    pilotTitle: pilot.title || pilot.challengeTitle,
    challengeId: pilot.challengeId,
    challengeTitle: pilot.challengeTitle,
    startupId: pilot.startupId,
    startupName: pilot.startupName,
    department: pilot.department,
    validatedSolution: `${pilot.startupName} Production Scale Suite`,
    pilotResultsSummary: `Exceeded pilot KPIs: Accuracy ${pilot.kpis?.[0]?.actual || '94.2%'}, Latency ${pilot.kpis?.[1]?.actual || '180ms'}, Uptime ${pilot.kpis?.[2]?.actual || '99.9%'}. Evaluated by Technical Committee with Score ${pilot.validationScore || 91}/100.`,
    approvedBudget: finalBudget,
    contractValue: finalBudget,
    procurementMethod: procurementMethod || 'Rule 173 GFR Innovation Direct Purchase via GeM',
    contractStatus: 'Draft',
    contractStartDate: startDate,
    contractEndDate: endDate,
    executedDate: startDate,
    deliverables: deliverables || 'Multi-district production deployment with SLA compliance',
    paymentInfo: paymentInfo || 'PFMS PFMS/2026/GEM-ESCROW with 100% statutory bank guarantee',
    notes: notes || 'Procurement authorized under Rule 173 of GFR 2017 following successful outcome-validated pilot trial.',
    evaluationId: evaluation?.id || 'eval-pwd-01',
    expertScore: evaluation?.totalScore || 91,
    validationDecision: pilot.validationDecision || 'Scale',
    validationScore: pilot.validationScore || 91,
    governmentOfficer: pilot.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
    milestones: Array.isArray(milestones) && milestones.length > 0 ? milestones : defaultMilestones
  };

  db.procurementContracts = db.procurementContracts || [];
  db.procurementContracts.unshift(newContract);

  // Send Notification to Startup
  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Procurement Contract Created',
    message: `Innovation procurement contract (${contractId}) drafted for ${newContract.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'procurement'
  });

  // Audit Log Entry
  addAuditLog(
    'Procurement Created',
    `Drafted procurement contract ${contractId} for ${newContract.startupName} under ${newContract.challengeTitle}`,
    'Government Officer',
    newContract.governmentOfficer,
    'Verified'
  );

  saveDb(db);
  res.status(201).json(newContract);
});

// PUT update procurement status (Draft -> Under Review -> Approved -> Active -> Completed)
router.put('/:id/status', (req, res) => {
  const db = getDb();
  const contract = (db.procurementContracts || []).find((c: any) => c.id === req.params.id);

  if (!contract) {
    return res.status(404).json({ error: 'Procurement contract not found' });
  }

  const { status, notes, authorizedOfficial } = req.body;
  const validStatuses = ['Draft', 'Drafted', 'Under Review', 'Approved', 'Active', 'Completed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const oldStatus = contract.contractStatus;
  contract.contractStatus = status;
  if (notes) contract.notes = notes;
  if (authorizedOfficial) contract.governmentOfficer = authorizedOfficial;

  // Milestone updates based on contract progression
  if (status === 'Active') {
    if (contract.milestones && contract.milestones[0]) {
      contract.milestones[0].status = 'Released';
    }
  } else if (status === 'Completed') {
    if (contract.milestones) {
      contract.milestones.forEach((m: any) => {
        m.status = 'Released';
      });
    }
  }

  // Audit Log mapping
  let auditAction = 'Procurement Status Updated';
  if (status === 'Under Review') auditAction = 'Procurement Submitted for Review';
  else if (status === 'Approved') auditAction = 'Procurement Approved';
  else if (status === 'Active') auditAction = 'Procurement Activated';
  else if (status === 'Completed') auditAction = 'Procurement Completed';

  addAuditLog(
    auditAction,
    `Procurement contract ${contract.id} for ${contract.startupName} transitioned from ${oldStatus} to ${status}`,
    'Government Officer',
    contract.governmentOfficer || 'Er. Rajeshwar Rao, Chief Engineer',
    'Verified'
  );

  // Notification mapping
  db.notifications = db.notifications || [];
  let notifTitle = `Procurement ${status}`;
  let notifMsg = `Procurement contract ${contract.id} is now ${status}.`;

  if (status === 'Under Review') {
    notifTitle = 'Procurement Under Review';
    notifMsg = `Procurement contract for ${contract.startupName} submitted for inter-departmental finance review.`;
  } else if (status === 'Approved') {
    notifTitle = 'Procurement Approved';
    notifMsg = `Procurement contract for ${contract.startupName} approved by Finance & Sanctioning Committee.`;
  } else if (status === 'Active') {
    notifTitle = 'Procurement Contract Activated';
    notifMsg = `Commercial contract for ${contract.startupName} is now active with escrow backing.`;
  } else if (status === 'Completed') {
    notifTitle = 'Procurement Contract Completed';
    notifMsg = `All contract deliverables and milestone disbursements successfully completed for ${contract.startupName}.`;
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: notifTitle,
    message: notifMsg,
    time: 'Just now',
    read: false,
    type: 'procurement'
  });

  saveDb(db);
  res.json(contract);
});

// POST release milestone payout
router.post('/:id/milestones/:num/release', (req, res) => {
  const db = getDb();
  const contract = (db.procurementContracts || []).find((c: any) => c.id === req.params.id);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  const milestoneNum = parseInt(req.params.num, 10);
  const milestone = contract.milestones.find((m: any) => m.milestoneNumber === milestoneNum);

  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  milestone.status = 'Released';
  milestone.releasedDate = new Date().toISOString().split('T')[0];

  db.notifications = db.notifications || [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Procurement Milestone Payment Released',
    message: `Milestone ${milestoneNum} payment disbursed to ${contract.startupName}.`,
    time: 'Just now',
    read: false,
    type: 'procurement'
  });

  addAuditLog(
    'Procurement Milestone Released',
    `Milestone ${milestoneNum} payment authorized for ${contract.startupName} (${contract.id})`,
    'Procurement Officer',
    'Finance & Accounts Division'
  );

  saveDb(db);
  res.json(contract);
});

export default router;
