export type UserRole = 'government' | 'startup' | 'expert' | 'admin';

export interface Challenge {
  id: string;
  title: string;
  department: string;
  category: string;
  sector?: string;
  location?: string;
  status: 'Draft' | 'Published' | 'Applications Open' | 'Under Review' | 'Pilot Active' | 'Validated' | 'Procured' | 'Scaled' | string;
  createdAt: string;
  deadline: string;
  budgetRange: string;
  budget?: string;
  pilotDuration: string;
  timeline?: string;
  currentSituation?: string;
  problemDescription: string;
  problemStatement?: string;
  targetOutcome?: string;
  expectedOutcome?: string;
  expectedSolution?: string;
  techArea: string[];
  requiredTechnologies?: string[];
  requiredCapabilities: string[];
  kpis?: Array<{ name: string; target: string; unit?: string }>;
  constraints?: string[];
  eligibility?: {
    startupAgeYears?: number;
    turnover?: string;
    minExperienceYears?: number;
    techRequirements?: string[];
    certifications?: string[];
    minStage?: string;
    dpiitRequired?: boolean;
    minPilotsCompleted?: number;
  };
  evaluationCriteria?: Array<{
    name: string;
    weight: number;
    maxScore: number;
    description: string;
  }>;
  applicationsCount: number;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  techStack: string[];
  location: string;
  stage: string;
  foundedYear: number;
  pilotReadiness: 'High' | 'Medium' | 'Low';
  eligibilityStatus: 'Eligible' | 'Under Review' | 'Ineligible';
  teamSize: number;
  revenueRange: string;
  completedPilotsCount: number;
  certifications: string[];
  matchScore?: number;
  matchBreakdown?: {
    techMatch: number;
    domainExperience: number;
    pilotReadiness: number;
    scalability: number;
    eligibility: number;
  };
  overview: string;
  pastProjects: Array<{
    name: string;
    client: string;
    impact: string;
  }>;
}

export interface Application {
  id: string;
  challengeId: string;
  challengeTitle: string;
  department: string;
  startupId: string;
  startupName: string;
  submissionDate: string;
  status: 'Applied' | 'Under Review' | 'Expert Evaluation' | 'Shortlisted' | 'Pilot' | 'Validated' | 'Procured' | 'Rejected';
  technicalProposal: string;
  implementationPlan: string;
  expectedImpact: string;
  budgetQuoted: string;
  pilotPlan: string;
  documents: string[];
  expertScore?: number;
  expertRecommendation?: string;
}

export interface EvaluationScore {
  technicalCapability: number; // Max 25
  innovation: number;          // Max 20
  scalability: number;         // Max 20
  costEffectiveness: number;   // Max 15
  impact: number;              // Max 20
}

export interface ExpertEvaluation {
  id: string;
  applicationId: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  evaluatorName: string;
  evaluatorSpecialization: string;
  date: string;
  scores: EvaluationScore;
  totalScore: number;
  recommendation: 'Shortlist for Pilot' | 'Request Clarification' | 'Reject';
  remarks: string;
  isSubmitted: boolean;
}

export interface PilotMilestone {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  deliverables: string;
}

export type PilotKPIStatus = 
  | 'On Track' 
  | 'At Risk' 
  | 'Achieved' 
  | 'Not Achieved' 
  | 'Exceeded' 
  | 'Met' 
  | 'Pending';

export interface PilotKPI {
  name: string;
  description?: string;
  baseline?: string;
  baselineNum?: number;
  target: string;
  actual: string;
  unit: string;
  status: PilotKPIStatus;
  targetNum: number;
  actualNum: number;
  measurementDate?: string;
  evidenceNotes?: string;
  isUserEntered?: boolean;
}

export type PilotLifecycleStatus = 
  | 'Planning' 
  | 'Approved' 
  | 'Active' 
  | 'Under Evaluation' 
  | 'Completed' 
  | 'In Progress' 
  | 'Under Validation' 
  | 'Validated' 
  | 'Scale Approved';

export type PilotValidationDecision = 
  | 'Scale' 
  | 'Re-pilot' 
  | 'Close' 
  | 'Modify' 
  | 'Stop' 
  | 'Continue Pilot';

export type PilotValidationStatus = 
  | 'Pending' 
  | 'Under Review' 
  | 'Validated';

export interface PilotProject {
  id: string;
  applicationId?: string;
  title?: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  department: string;
  pilotLocation?: string;
  objective?: string;
  pilotDuration: string;
  startDate: string;
  endDate: string;
  governmentOfficer?: string;
  expectedOutcomes?: string;
  budget?: string;
  notes?: string;
  status: PilotLifecycleStatus;
  progressPercent: number;
  milestones: PilotMilestone[];
  kpis: PilotKPI[];
  validationStatus?: PilotValidationStatus;
  validationDecision?: PilotValidationDecision;
  validationScore?: number;
  validationRemarks?: string;
  officialObservations?: string;
  evidenceNotes?: string;
  decisionDate?: string;
  authorizedOfficial?: string;
}

export type ProcurementContractStatus = 
  | 'Draft' 
  | 'Drafted' 
  | 'Under Review' 
  | 'Approved' 
  | 'Active' 
  | 'Completed';

export interface ProcurementMilestone {
  milestoneNumber: number;
  title: string;
  payout: string;
  status: 'Released' | 'Pending Verification' | 'Upcoming';
  deliverable: string;
  dueDate?: string;
  releasedDate?: string;
}

export interface ProcurementContract {
  id: string;
  referenceId?: string;
  pilotId: string;
  pilotTitle?: string;
  challengeId?: string;
  challengeTitle: string;
  startupId?: string;
  startupName: string;
  department: string;
  validatedSolution: string;
  pilotResultsSummary: string;
  approvedBudget: string;
  contractValue?: string;
  procurementMethod: string;
  contractStatus: ProcurementContractStatus;
  contractStartDate?: string;
  contractEndDate?: string;
  executedDate: string;
  deliverables?: string;
  paymentInfo?: string;
  notes?: string;
  evaluationId?: string;
  expertScore?: number;
  validationDecision?: string;
  validationScore?: number;
  governmentOfficer?: string;
  milestones: ProcurementMilestone[];
}

export type ScaleUpStatus = 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Completed';

export interface ScaleUpMilestone {
  milestoneNumber?: number;
  title: string;
  timeline: string;
  deliverable: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  targetDistrict?: string;
  budgetAllocation?: string;
}

export interface ScaleUpKPI {
  metric: string;
  baseline: string;
  target: string;
  current?: string;
  status: 'Pending' | 'Tracking' | 'Achieved';
}

export interface ScaleUpPhase {
  phase: string;
  title: string;
  coverage: string;
  timeline: string;
  status: 'Completed' | 'Active' | 'Planned';
  districts: string[];
}

export interface ScaleUpPlan {
  id: string;
  challengeId?: string;
  challengeTitle?: string;
  startupId?: string;
  startupName: string;
  solutionName: string;
  pilotId: string;
  pilotTitle?: string;
  procurementId?: string;
  procurementReferenceId?: string;
  title?: string;
  description?: string;
  targetScope?: string;
  targetRegions?: string[];
  expectedBeneficiaries?: string;
  estimatedBudget?: string;
  estimatedCost: string;
  implementationTimeline?: string;
  milestones?: ScaleUpMilestone[];
  kpis?: ScaleUpKPI[];
  responsibleGovernmentDepartment?: string;
  risks?: string;
  mitigation?: string;
  status: ScaleUpStatus;
  createdAt?: string;
  updatedAt?: string;
  authorizedOfficial?: string;
  approvalNotes?: string;
  // Backward compatibility with existing mock & views
  currentDeployment: string;
  targetDeployment: string;
  expectedImpact: string;
  scalePhases: ScaleUpPhase[];
}

export type ImpactCategory = 
  | 'Cost Savings'
  | 'Time Savings'
  | 'Service Delivery'
  | 'Citizen Reach'
  | 'Operational Efficiency'
  | 'Environmental Impact'
  | 'Accessibility'
  | 'Revenue/Financial Impact'
  | 'Other';

export type ImpactVerificationStatus = 'Pending Verification' | 'Verified' | 'Flagged' | 'Rejected';

export interface ImpactRecord {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  startupId: string;
  startupName?: string;
  solutionName?: string;
  scaleUpPlanId: string;
  scaleUpPlanTitle?: string;
  procurementId: string;
  procurementReferenceId?: string;
  pilotId?: string;
  reportingPeriod: string;
  metricName: string;
  impactCategory: ImpactCategory;
  baselineValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;
  beneficiaryCount: number;
  geographicCoverage: string;
  implementationStatus: 'On Track' | 'Ahead' | 'Delayed' | 'Critical';
  evidence?: string;
  notes?: string;
  reportedBy: string;
  verifiedBy?: string;
  verificationStatus: ImpactVerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  absoluteChange?: number;
  percentageChange?: number;
  targetAchievement?: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: string;
  userName: string;
  action: string;
  details: string;
  status: 'Completed' | 'Verified' | 'Pending';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'challenge' | 'application' | 'pilot' | 'validation' | 'procurement' | 'evaluation' | 'scale-up' | 'impact';
}

export interface AIMatchBreakdownFactor {
  factor: 'technologyMatch' | 'domainMatch' | 'experienceMatch' | 'pilotReadiness' | 'scalabilityMatch' | 'eligibilityMatch';
  label: string;
  score: number;
  weight: string;
  desc: string;
}

export interface AIMatchResult {
  rank: number;
  startupId: string;
  startupName: string;
  tagline: string;
  domain: string;
  stage: string;
  location: string;
  overallScore: number;
  confidence: string;
  confidenceTier: 'High Conviction' | 'Moderate Match' | 'Conditional Match' | 'Low Compatibility';
  technologyMatch: number;
  domainMatch: number;
  experienceMatch: number;
  pilotReadiness: number;
  scalabilityMatch: number;
  eligibilityMatch: number;
  readinessLevel: 'High' | 'Medium' | 'Low';
  eligibilityStatus: 'Eligible' | 'Under Review' | 'Ineligible';
  explanation: string;
  breakdown: AIMatchBreakdownFactor[];
  strengths: string[];
  riskFactors: string[];
  gaps?: string[];
}

export interface AIMatchingResponse {
  challengeId: string;
  challengeTitle: string;
  department: string;
  category: string;
  totalEvaluated: number;
  weightsUsed: Record<string, number>;
  matches: AIMatchResult[];
  mode?: 'ai' | 'fallback';
  modelUsed?: string;
  timestamp?: string;
}

export interface AIMatchingRequest {
  challengeId?: string;
  challenge?: Partial<Challenge>;
  weights?: {
    technology?: number;
    domain?: number;
    experience?: number;
    pilotReadiness?: number;
    scalability?: number;
    eligibility?: number;
  };
  filters?: {
    minReadiness?: 'High' | 'Medium' | 'Low';
    eligibleOnly?: boolean;
  };
}

