import express from 'express';
import { getDb, saveDb, addAuditLog } from '../db.js';

export function calculateImpactMetrics(baseline: number, current: number, target: number) {
  const b = Number(baseline) || 0;
  const c = Number(current) || 0;
  const t = Number(target) || 0;

  const absoluteChange = c - b;

  let percentageChange = 0;
  if (b !== 0) {
    percentageChange = ((c - b) / Math.abs(b)) * 100;
  } else if (c !== 0) {
    percentageChange = c > 0 ? 100 : -100;
  }

  let targetAchievement = 0;
  const targetDiff = t - b;
  const currentDiff = c - b;

  if (targetDiff === 0) {
    targetAchievement = c >= t ? 100 : 0;
  } else if (targetDiff > 0) {
    targetAchievement = (currentDiff / targetDiff) * 100;
  } else {
    targetAchievement = (currentDiff / targetDiff) * 100;
  }

  return {
    absoluteChange: Number(absoluteChange.toFixed(2)),
    percentageChange: Number(percentageChange.toFixed(1)),
    targetAchievement: Number(Math.max(0, targetAchievement).toFixed(1))
  };
}

const router = express.Router();

/**
 * Statutory 6-Point Eligibility Check for Impact Monitoring:
 * 1. Government selected startup
 * 2. Pilot completed
 * 3. Outcome Validation completed
 * 4. Outcome Validation decision = "Scale"
 * 5. Procurement completed/active
 * 6. Scale-Up approved or active
 */
export function checkImpactEligibility(scaleUpPlanId: string, db: any) {
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const scaleUp = plans.find((p: any) => p.id === scaleUpPlanId);

  if (!scaleUp) {
    return {
      isEligible: false,
      reason: 'Impact Monitoring unavailable: Scale-Up plan not found.',
      checks: {
        isGovtSelected: false,
        hasPilot: false,
        isPilotCompleted: false,
        isValidationCompleted: false,
        isDecisionScale: false,
        hasProcurement: false,
        isProcurementApprovedOrActive: false,
        isScaleUpApprovedOrActive: false
      }
    };
  }

  // 1. Government selected the startup
  const app = (db.applications || []).find((a: any) => 
    a.startupId === scaleUp.startupId || 
    (a.challengeId === scaleUp.challengeId && a.startupName === scaleUp.startupName)
  );
  const isGovtSelected = !app || app.status === 'Pilot' || app.status === 'Shortlisted' || app.status === 'Validated';

  // 2. Pilot exists & reached completed/evaluated status
  const pilot = (db.pilots || []).find((p: any) => p.id === scaleUp.pilotId || p.startupName === scaleUp.startupName);
  const hasPilot = Boolean(pilot);
  const isPilotCompleted = pilot && (
    ['Under Evaluation', 'Completed', 'Validated', 'Scale Approved'].includes(pilot.status) ||
    (pilot.status === 'In Progress' && Boolean(pilot.validationDecision))
  );

  // 3. KPI/Outcome validation completed
  const isValidationCompleted = pilot && (Boolean(pilot.validationDecision) || pilot.validationStatus === 'Validated');

  // 4. Outcome validation decision = "Scale"
  const isDecisionScale = pilot && (pilot.validationDecision === 'Scale');

  // 5. Procurement contract exists & approved/active
  const contracts = db.procurementContracts || [];
  const contract = contracts.find((c: any) => 
    c.id === scaleUp.procurementId || 
    c.startupId === scaleUp.startupId || 
    c.startupName === scaleUp.startupName
  );
  const hasProcurement = Boolean(contract);
  const isProcurementApprovedOrActive = contract && ['Approved', 'Active', 'Completed'].includes(contract.contractStatus);

  // 6. Scale-Up plan approved or active
  const isScaleUpApprovedOrActive = ['Approved', 'Active', 'Completed'].includes(scaleUp.status);

  const isEligible = Boolean(
    isGovtSelected &&
    hasPilot &&
    isPilotCompleted &&
    isValidationCompleted &&
    isDecisionScale &&
    hasProcurement &&
    isProcurementApprovedOrActive &&
    isScaleUpApprovedOrActive
  );

  let reason = '';
  if (!isGovtSelected) reason = 'Impact Monitoring unavailable: Startup must be selected by Government first.';
  else if (!hasPilot) reason = 'Impact Monitoring unavailable: Controlled Pilot project does not exist.';
  else if (!isPilotCompleted) reason = 'Impact Monitoring unavailable: Pilot project has not reached completed/evaluated status.';
  else if (!isValidationCompleted) reason = 'Impact Monitoring unavailable: KPI & Outcome Validation must be completed first.';
  else if (!isDecisionScale) reason = 'Impact Monitoring unavailable: Outcome Validation must approve scaling first (decision was not "Scale").';
  else if (!hasProcurement || !isProcurementApprovedOrActive) reason = 'Impact Monitoring unavailable: Procurement Contract must be Approved or Active before impact monitoring.';
  else if (!isScaleUpApprovedOrActive) reason = `Impact Monitoring unavailable: Scale-Up plan must be Approved or Active (current status: ${scaleUp.status}).`;

  return {
    isEligible,
    reason,
    scaleUp,
    contract,
    pilot,
    app,
    checks: {
      isGovtSelected: Boolean(isGovtSelected),
      hasPilot: Boolean(hasPilot),
      isPilotCompleted: Boolean(isPilotCompleted),
      isValidationCompleted: Boolean(isValidationCompleted),
      isDecisionScale: Boolean(isDecisionScale),
      hasProcurement: Boolean(hasProcurement),
      isProcurementApprovedOrActive: Boolean(isProcurementApprovedOrActive),
      isScaleUpApprovedOrActive: Boolean(isScaleUpApprovedOrActive)
    }
  };
}

// GET all eligible Scale-Ups for Impact Monitoring
router.get('/eligible-scaleups', (req, res) => {
  const db = getDb();
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  
  const results = plans.map((plan: any) => {
    const eligibility = checkImpactEligibility(plan.id, db);
    return {
      scaleUpPlan: plan,
      ...eligibility
    };
  });

  res.json({
    totalScaleUps: plans.length,
    eligibleCount: results.filter(r => r.isEligible).length,
    scaleUps: results
  });
});

// GET aggregated stats and telemetry summary
router.get('/stats/summary', (req, res) => {
  const db = getDb();
  const records = db.impactRecords || [];
  const plans = db.scaleUpPlans || (db.scaleUpPlan ? [db.scaleUpPlan] : []);
  const activeScaleUps = plans.filter((p: any) => ['Active', 'Approved'].includes(p.status));

  const verifiedRecords = records.filter((r: any) => r.verificationStatus === 'Verified');
  const pendingRecords = records.filter((r: any) => r.verificationStatus === 'Pending Verification');

  const totalBeneficiaries = records.reduce((sum: number, r: any) => sum + (Number(r.beneficiaryCount) || 0), 0);
  
  const achievements = records.map((r: any) => {
    const metrics = calculateImpactMetrics(r.baselineValue, r.currentValue, r.targetValue);
    return metrics.targetAchievement;
  });
  const avgAchievement = achievements.length > 0 
    ? Number((achievements.reduce((a, b) => a + b, 0) / achievements.length).toFixed(1)) 
    : 0;

  // Cost savings
  const costSavingsRecords = records.filter((r: any) => r.impactCategory === 'Cost Savings');
  const totalCostSavings = costSavingsRecords.reduce((sum: number, r: any) => sum + (Number(r.currentValue) || 0), 0);

  // Time savings
  const timeSavingsRecords = records.filter((r: any) => r.impactCategory === 'Time Savings');
  const totalTimeSavings = timeSavingsRecords.reduce((sum: number, r: any) => {
    const diff = Number(r.baselineValue) - Number(r.currentValue);
    return sum + (diff > 0 ? diff : 0);
  }, 0);

  // Categories count
  const categoryCounts: Record<string, number> = {};
  records.forEach((r: any) => {
    categoryCounts[r.impactCategory] = (categoryCounts[r.impactCategory] || 0) + 1;
  });

  res.json({
    totalActiveScaleUps: activeScaleUps.length,
    totalImpactRecords: records.length,
    totalVerifiedRecords: verifiedRecords.length,
    totalPendingRecords: pendingRecords.length,
    totalBeneficiariesReached: totalBeneficiaries,
    averageTargetAchievement: avgAchievement,
    totalCostSavings,
    totalTimeSavings: Number(totalTimeSavings.toFixed(1)),
    categoryBreakdown: categoryCounts
  });
});

// GET all impact records (optionally filtered by startup, scale-up, or status)
router.get('/all', (req, res) => {
  const db = getDb();
  let records = db.impactRecords || [];

  if (req.query.scaleUpPlanId) {
    records = records.filter((r: any) => r.scaleUpPlanId === req.query.scaleUpPlanId);
  }
  if (req.query.startupId) {
    records = records.filter((r: any) => r.startupId === req.query.startupId);
  }
  if (req.query.status) {
    records = records.filter((r: any) => r.verificationStatus === req.query.status);
  }

  // Ensure calculations are always attached
  const augmented = records.map((r: any) => {
    const calc = calculateImpactMetrics(r.baselineValue, r.currentValue, r.targetValue);
    return { ...r, ...calc };
  });

  res.json(augmented);
});

// GET /api/impact (alias for /all)
router.get('/', (req, res) => {
  const db = getDb();
  let records = db.impactRecords || [];

  if (req.query.scaleUpPlanId) {
    records = records.filter((r: any) => r.scaleUpPlanId === req.query.scaleUpPlanId);
  }
  if (req.query.startupId) {
    records = records.filter((r: any) => r.startupId === req.query.startupId);
  }

  const augmented = records.map((r: any) => {
    const calc = calculateImpactMetrics(r.baselineValue, r.currentValue, r.targetValue);
    return { ...r, ...calc };
  });

  res.json(augmented);
});

// GET single impact record by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const record = (db.impactRecords || []).find((r: any) => r.id === req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Impact record not found' });
  }

  const calc = calculateImpactMetrics(record.baselineValue, record.currentValue, record.targetValue);
  res.json({ ...record, ...calc });
});

// POST create new impact record
router.post('/', (req, res) => {
  const db = getDb();
  const {
    scaleUpPlanId,
    metricName,
    impactCategory,
    reportingPeriod,
    baselineValue,
    currentValue,
    targetValue,
    unit,
    beneficiaryCount,
    geographicCoverage,
    implementationStatus,
    evidence,
    notes,
    reportedBy,
    isPreVerified,
    verifiedBy,
    verificationNotes
  } = req.body;

  // Validation
  if (!scaleUpPlanId) {
    return res.status(400).json({ error: 'scaleUpPlanId is required to associate impact metric.' });
  }
  if (!metricName || !metricName.trim()) {
    return res.status(400).json({ error: 'metricName is mandatory.' });
  }
  if (!impactCategory) {
    return res.status(400).json({ error: 'impactCategory is mandatory.' });
  }
  if (baselineValue === undefined || baselineValue === null || isNaN(Number(baselineValue))) {
    return res.status(400).json({ error: 'baselineValue must be a valid numeric value.' });
  }
  if (targetValue === undefined || targetValue === null || isNaN(Number(targetValue))) {
    return res.status(400).json({ error: 'targetValue must be a valid numeric value.' });
  }

  // Statutory 6-Point Eligibility Check
  const eligibility = checkImpactEligibility(scaleUpPlanId, db);
  if (!eligibility.isEligible) {
    return res.status(400).json({
      error: eligibility.reason,
      checks: eligibility.checks
    });
  }

  const scaleUp = eligibility.scaleUp;
  const currentNum = currentValue !== undefined && currentValue !== null && !isNaN(Number(currentValue))
    ? Number(currentValue)
    : Number(baselineValue);

  const calc = calculateImpactMetrics(Number(baselineValue), currentNum, Number(targetValue));
  const now = new Date().toISOString();

  const newRecord = {
    id: `impact-${Date.now()}`,
    challengeId: scaleUp.challengeId || 'CH-001',
    challengeTitle: scaleUp.challengeTitle || scaleUp.title,
    startupId: scaleUp.startupId || 'startup-roadvision',
    startupName: scaleUp.startupName || 'RoadVision AI',
    solutionName: scaleUp.solutionName || 'State-Wide Intelligent Road Health Grid',
    scaleUpPlanId: scaleUp.id,
    scaleUpPlanTitle: scaleUp.title || scaleUp.solutionName,
    procurementId: scaleUp.procurementId || 'contract-pwd-0926',
    procurementReferenceId: scaleUp.procurementReferenceId || 'REF-GFR173-0926',
    pilotId: scaleUp.pilotId || 'pilot-pwd-roadvision',
    reportingPeriod: reportingPeriod || 'Q1 2027',
    metricName: metricName.trim(),
    impactCategory: impactCategory || 'Operational Efficiency',
    baselineValue: Number(baselineValue),
    currentValue: currentNum,
    targetValue: Number(targetValue),
    unit: unit || 'Units',
    beneficiaryCount: Number(beneficiaryCount) || 0,
    geographicCoverage: geographicCoverage || 'Statewide',
    implementationStatus: implementationStatus || 'On Track',
    evidence: evidence || '',
    notes: notes || '',
    reportedBy: reportedBy || 'Government Officer',
    verifiedBy: isPreVerified ? (verifiedBy || 'Er. Rajeshwar Rao, Chief Engineer, PWD') : undefined,
    verificationStatus: isPreVerified ? 'Verified' : 'Pending Verification',
    verificationNotes: isPreVerified ? (verificationNotes || 'Verified during initial metric registration.') : undefined,
    verifiedAt: isPreVerified ? now.split('T')[0] : undefined,
    createdAt: now.split('T')[0],
    updatedAt: now.split('T')[0],
    ...calc
  };

  if (!db.impactRecords) db.impactRecords = [];
  db.impactRecords.unshift(newRecord);

  // Record Audit Log
  addAuditLog(
    'IMPACT_RECORD_CREATED',
    `Registered impact metric "${newRecord.metricName}" under ${newRecord.impactCategory} for Scale-Up ${scaleUp.title}. Target: ${newRecord.targetValue} ${newRecord.unit}.`,
    'Government Officer',
    'Er. Rajeshwar Rao'
  );

  // Record Notifications
  const timestamp = `${now.split('T')[0]} ${new Date().toTimeString().split(' ')[0]} IST`;
  if (!db.notifications) db.notifications = [];
  
  db.notifications.unshift({
    id: `notif-${Date.now()}-1`,
    title: 'New Impact Metric Registered',
    message: `State impact tracking metric "${newRecord.metricName}" initialized for ${newRecord.startupName}.`,
    time: timestamp,
    read: false,
    type: 'impact'
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}-2`,
    title: 'Impact Reporting Metric Assigned',
    message: `A new impact KPI "${newRecord.metricName}" is now active for your Scale-Up project. Please record reporting telemetry.`,
    time: timestamp,
    read: false,
    type: 'impact'
  });

  saveDb(db);
  res.status(201).json(newRecord);
});

// PUT update impact record
router.put('/:id', (req, res) => {
  const db = getDb();
  const idx = (db.impactRecords || []).findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Impact record not found' });
  }

  const existing = db.impactRecords[idx];
  const updated = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  // Recalculate
  const calc = calculateImpactMetrics(updated.baselineValue, updated.currentValue, updated.targetValue);
  Object.assign(updated, calc);

  db.impactRecords[idx] = updated;

  addAuditLog(
    'IMPACT_RECORD_UPDATED',
    `Updated telemetry data for metric "${updated.metricName}". Current: ${updated.currentValue} ${updated.unit}.`,
    req.body.userRole || 'Government Officer',
    req.body.userName || 'Authorized Official'
  );

  saveDb(db);
  res.json(updated);
});

// POST submit reporting telemetry data (Startup / Field Operator)
router.post('/:id/submit', (req, res) => {
  const db = getDb();
  const idx = (db.impactRecords || []).findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Impact record not found' });
  }

  const { currentValue, evidence, notes, reportedBy, reportingPeriod } = req.body;
  if (currentValue === undefined || currentValue === null || isNaN(Number(currentValue))) {
    return res.status(400).json({ error: 'currentValue must be a valid numeric measurement.' });
  }

  const existing = db.impactRecords[idx];
  const now = new Date().toISOString();

  existing.currentValue = Number(currentValue);
  if (evidence) existing.evidence = evidence;
  if (notes) existing.notes = notes;
  if (reportedBy) existing.reportedBy = reportedBy;
  if (reportingPeriod) existing.reportingPeriod = reportingPeriod;
  existing.verificationStatus = 'Pending Verification';
  existing.updatedAt = now.split('T')[0];

  const calc = calculateImpactMetrics(existing.baselineValue, existing.currentValue, existing.targetValue);
  Object.assign(existing, calc);

  db.impactRecords[idx] = existing;

  addAuditLog(
    'IMPACT_REPORT_SUBMITTED',
    `Submitted progress telemetry for metric "${existing.metricName}" (${existing.currentValue} ${existing.unit}). Status set to Pending Verification.`,
    'Startup Founder',
    reportedBy || 'Ananya Deshmukh'
  );

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Impact Report Requires Verification',
    message: `${existing.reportedBy} has submitted impact telemetry for "${existing.metricName}" (${existing.currentValue} ${existing.unit}). Human verification required.`,
    time: `${now.split('T')[0]} ${new Date().toTimeString().split(' ')[0]} IST`,
    read: false,
    type: 'impact'
  });

  saveDb(db);
  res.json(existing);
});

// POST verify impact report (Government Human Decision)
router.post('/:id/verify', (req, res) => {
  const db = getDb();
  const idx = (db.impactRecords || []).findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Impact record not found' });
  }

  const { verifiedBy, verificationNotes } = req.body;
  const existing = db.impactRecords[idx];
  const now = new Date().toISOString();

  existing.verificationStatus = 'Verified';
  existing.verifiedBy = verifiedBy || 'Er. Rajeshwar Rao, Chief Engineer, PWD';
  existing.verificationNotes = verificationNotes || 'Verified against departmental field telemetry and vendor audit.';
  existing.verifiedAt = now.split('T')[0];
  existing.updatedAt = now.split('T')[0];

  db.impactRecords[idx] = existing;

  addAuditLog(
    'IMPACT_REPORT_VERIFIED',
    `Official statutory verification approved for impact metric "${existing.metricName}". Recorded target achievement: ${existing.targetAchievement}%. Remarks: ${existing.verificationNotes}`,
    'Government Officer',
    existing.verifiedBy
  );

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Impact Report Verified by Government',
    message: `Your impact telemetry report for "${existing.metricName}" has been officially verified by ${existing.verifiedBy}. Target achievement: ${existing.targetAchievement}%.`,
    time: `${now.split('T')[0]} ${new Date().toTimeString().split(' ')[0]} IST`,
    read: false,
    type: 'impact'
  });

  saveDb(db);
  res.json(existing);
});

// POST reject / flag impact report
router.post('/:id/reject', (req, res) => {
  const db = getDb();
  const idx = (db.impactRecords || []).findIndex((r: any) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Impact record not found' });
  }

  const { verifiedBy, reason } = req.body;
  const existing = db.impactRecords[idx];
  const now = new Date().toISOString();

  existing.verificationStatus = 'Flagged';
  existing.verifiedBy = verifiedBy || 'Authorized Official';
  existing.verificationNotes = reason || 'Discrepancy detected in field telemetry data. Requires resubmission.';
  existing.updatedAt = now.split('T')[0];

  db.impactRecords[idx] = existing;

  addAuditLog(
    'IMPACT_REPORT_FLAGGED',
    `Flagged impact telemetry for "${existing.metricName}". Reason: ${existing.verificationNotes}`,
    'Government Officer',
    existing.verifiedBy
  );

  saveDb(db);
  res.json(existing);
});

export default router;
