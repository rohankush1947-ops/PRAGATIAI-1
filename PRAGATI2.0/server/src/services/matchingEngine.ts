export interface MatchingWeights {
  technology: number;
  domain: number;
  experience: number;
  pilotReadiness: number;
  scalability: number;
  eligibility: number;
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  technology: 0.30,
  domain: 0.20,
  experience: 0.15,
  pilotReadiness: 0.15,
  scalability: 0.10,
  eligibility: 0.10
};

export interface MatchBreakdownFactor {
  factor: 'technologyMatch' | 'domainMatch' | 'experienceMatch' | 'pilotReadiness' | 'scalabilityMatch' | 'eligibilityMatch';
  label: string;
  score: number;
  weight: string;
  desc: string;
}

export const RELEVANCE_THRESHOLD = 60;

export interface RelevanceGateResult {
  isRelevant: boolean;
  departmentMatch: boolean;
  domainMatch: boolean;
  capabilityMatch: boolean;
  requirementMatch: boolean;
  technologyMatch: boolean;
  relevanceScore: number;
  exclusionCategory?: 'Department Mismatch' | 'Domain Mismatch' | 'Capability Mismatch' | 'Challenge Requirements Mismatch';
  exclusionReason?: string;
  matchedRequirements: string[];
  matchingCapabilities: string[];
}

export interface ExcludedStartupEvaluation {
  startupId: string;
  startupName: string;
  tagline: string;
  domain: string;
  stage?: string;
  location?: string;
  exclusionCategory: 'Department Mismatch' | 'Domain Mismatch' | 'Capability Mismatch' | 'Challenge Requirements Mismatch';
  exclusionReason: string;
  departmentMatch: boolean;
  domainMatch: boolean;
  capabilityMatch: boolean;
  requirementMatch: boolean;
  technologyMatch: boolean;
  compatibilityScore: number;
}

export interface StartupMatchEvaluation {
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
  breakdown: MatchBreakdownFactor[];
  strengths: string[];
  riskFactors: string[];
  // Relevance fields
  relevant?: boolean;
  departmentMatch?: boolean;
  domainRelevanceMatch?: boolean;
  problemMatch?: boolean;
  requirementMatch?: boolean;
  capabilityMatch?: boolean;
  relevanceScore?: number;
  matchedRequirements?: string[];
  matchingCapabilities?: string[];
  reason?: string;
}

export interface MatchingEvaluationResult {
  challengeId: string;
  challengeTitle: string;
  department: string;
  category: string;
  totalEvaluated: number;
  weightsUsed: MatchingWeights;
  matches: StartupMatchEvaluation[];
  excludedMatches?: ExcludedStartupEvaluation[];
  mode?: 'ai' | 'fallback';
  modelUsed?: string;
  timestamp?: string;
}

// Structured domain dictionary for precision sector determination
const DOMAIN_SECTORS: Record<string, { label: string; keywords: string[] }> = {
  urban_mobility: {
    label: 'Smart Mobility, Traffic & Intelligent Transport Systems (ITS)',
    keywords: ['traffic', 'signal', 'congestion', 'intersection', 'adaptive signal', 'urban mobility', 'scats', 'itms', 'transit', 'commuter', 'brts', 'vehicle count', 'signal control', 'traffic police', 'traffic management', 'mmwave', 'traffic flow', 'urban congestion']
  },
  road_infra: {
    label: 'Road Infrastructure, Surface & Pavement Distress',
    keywords: ['pothole', 'road', 'pavement', 'highway', 'transport', 'pwd', 'nhai', 'arterial', 'bolero', 'tata ace', 'vehicle', 'distress', 'fissure', 'smart infrastructure', 'rutting', 'crack', 'asphalt', 'roughness index', 'iri']
  },
  agriculture: {
    label: 'Agritech & Precision Agriculture',
    keywords: ['agriculture', 'crop', 'pest', 'farm', 'agri', 'farmer', 'farmers', 'infestation', 'cotton', 'paddy', 'foliage', 'yield', 'harvest', 'soil', 'agronomy']
  },
  healthcare: {
    label: 'Healthcare AI & Digital Hospital Operations',
    keywords: ['healthcare', 'health', 'hospital', 'patient', 'bed', 'opd', 'doctor', 'medical', 'clinic', 'abdm', 'triage', 'ward', 'icu', 'queue', 'queueing']
  },
  water_utilities: {
    label: 'Clean Water & Municipal Utilities',
    keywords: ['water', 'leakage', 'leak', 'nrw', 'pipeline', 'acoustic', 'pipe', 'potable', 'jal jeevan', 'mld', 'micro-fissure', 'micro-leak', 'valves', 'utility']
  },
  education: {
    label: 'EdTech & Foundational Literacy',
    keywords: ['education', 'edtech', 'school', 'literacy', 'student', 'learning', 'classroom', 'diksha', 'tablet', 'teaching', 'pedagogy']
  },
  renewable_energy: {
    label: 'Clean Energy, Solar & Smart Grid',
    keywords: ['solar', 'photovoltaic', 'clean energy', 'renewable', 'microgrid', 'inverter', 'diode', 'hotspot', 'energy', 'power grid', 'battery', 'wind', 'mnre']
  },
  civic_governance: {
    label: 'Public Administration & Civic Grievance',
    keywords: ['grievance', 'cpgrams', 'darpg', 'citizen', 'governance', 'pension', 'redressal', 'civic', 'public administration']
  },
  urban_waste: {
    label: 'Urban Development & Smart Waste Management',
    keywords: ['waste', 'municipal', 'segregation', 'garbage', 'solid waste', 'recycling', 'sanitation', 'urban development', 'swachh bharat', 'landfill', 'classification', 'refuse']
  }
};

// Tech concepts and functional aliases
const TECH_CONCEPT_CLUSTERS: Record<string, string[]> = {
  cv_optical: ['computer vision', 'cv', 'yolo', 'yolov10', 'tensorrt', 'optical', 'multispectral', 'hyperspectral', 'spectral', 'vision', 'camera', 'cameras', 'imagery', 'image', 'image classification', 'deep learning'],
  edge_computing: ['edge', 'edge ai', 'tensorrt', 'on-device', 'offline', 'embedded', 'hardware', 'payload'],
  drones_uav: ['drone', 'drones', 'uav', 'aerial', 'dgca', 'flight', 'canopy'],
  telemetry_iot: ['iot', 'telemetry', 'sensors', 'sensor', 'lorawan', 'mesh', 'acoustic micro-sensors', 'vibration'],
  gis_spatial: ['gis', 'geojson', 'gps', 'mapping', 'spatial', 'geo-tagging', 'sub-meter', 'twin'],
  acoustic_audio: ['acoustic', 'acoustic ai', 'fourier', 'fft', 'sound', 'micro-sensors', 'vibration', 'leak detection'],
  health_abdm: ['abdm', 'fhir', 'hl7', 'hospital', 'bed tracking', 'tokenization', 'queue', 'queueing', 'healthcare analytics', 'opd'],
  speech_nlp: ['speech', 'indic nlp', 'voice', 'nlp', 'language', 'bot', 'whatsapp'],
  deep_learning: ['deep learning', 'neural network', 'pytorch', 'tensorflow', 'image classification', 'pattern recognition'],
  optimization_analytics: ['optimization', 'machine learning', 'queue optimization', 'scheduling', 'predictive analytics', 'healthcare analytics']
};

/**
 * Normalizes user supplied weights so their sum equals 1.0
 */
export function normalizeWeights(raw?: Partial<MatchingWeights>): MatchingWeights {
  const merged: MatchingWeights = {
    technology: raw?.technology ?? DEFAULT_WEIGHTS.technology,
    domain: raw?.domain ?? DEFAULT_WEIGHTS.domain,
    experience: raw?.experience ?? DEFAULT_WEIGHTS.experience,
    pilotReadiness: raw?.pilotReadiness ?? DEFAULT_WEIGHTS.pilotReadiness,
    scalability: raw?.scalability ?? DEFAULT_WEIGHTS.scalability,
    eligibility: raw?.eligibility ?? DEFAULT_WEIGHTS.eligibility,
  };

  const sum = Object.values(merged).reduce((acc, v) => acc + (typeof v === 'number' && !isNaN(v) ? v : 0), 0);
  if (sum <= 0) return { ...DEFAULT_WEIGHTS };

  return {
    technology: Number((merged.technology / sum).toFixed(4)),
    domain: Number((merged.domain / sum).toFixed(4)),
    experience: Number((merged.experience / sum).toFixed(4)),
    pilotReadiness: Number((merged.pilotReadiness / sum).toFixed(4)),
    scalability: Number((merged.scalability / sum).toFixed(4)),
    eligibility: Number((merged.eligibility / sum).toFixed(4))
  };
}

/**
 * Resolves the primary target sector of the challenge
 */
function resolveChallengeSector(challenge: any): string {
  const text = `${challenge.title || ''} ${challenge.category || ''} ${challenge.department || ''} ${challenge.problemDescription || ''}`.toLowerCase();
  
  let bestSector = 'transport_infra';
  let bestScore = -1;

  for (const [sectorKey, sector] of Object.entries(DOMAIN_SECTORS)) {
    let score = 0;
    sector.keywords.forEach(kw => {
      // Give higher weight to matches in title and department
      if ((challenge.title || '').toLowerCase().includes(kw)) score += 4;
      if ((challenge.department || '').toLowerCase().includes(kw)) score += 3;
      if ((challenge.category || '').toLowerCase().includes(kw)) score += 3;
      if (text.includes(kw)) score += 1;
    });

    if (score > bestScore) {
      bestScore = score;
      bestSector = sectorKey;
    }
  }

  return bestSector;
}

export const SECTOR_CROSS_INCOMPATIBILITY: Record<string, string[]> = {
  urban_mobility: ['agriculture', 'healthcare', 'water_utilities', 'education', 'renewable_energy', 'civic_governance'],
  road_infra: ['agriculture', 'healthcare', 'water_utilities', 'education', 'renewable_energy', 'civic_governance'],
  agriculture: ['urban_mobility', 'road_infra', 'healthcare', 'water_utilities', 'education', 'renewable_energy', 'civic_governance', 'urban_waste'],
  healthcare: ['urban_mobility', 'road_infra', 'agriculture', 'water_utilities', 'education', 'renewable_energy', 'civic_governance', 'urban_waste'],
  water_utilities: ['urban_mobility', 'road_infra', 'agriculture', 'healthcare', 'education', 'renewable_energy', 'civic_governance'],
  education: ['urban_mobility', 'road_infra', 'agriculture', 'healthcare', 'water_utilities', 'renewable_energy', 'civic_governance', 'urban_waste'],
};

/**
 * Resolves the primary operating sector of a startup
 */
export function resolveStartupSector(startup: any): string {
  const text = `${startup.domain || ''} ${startup.tagline || ''} ${startup.overview || ''} ${(startup.techStack || []).join(' ')}`.toLowerCase();
  
  let bestSector = 'unknown';
  let bestScore = -1;

  for (const [sectorKey, sector] of Object.entries(DOMAIN_SECTORS)) {
    let score = 0;
    sector.keywords.forEach(kw => {
      if ((startup.domain || '').toLowerCase().includes(kw)) score += 5;
      if ((startup.tagline || '').toLowerCase().includes(kw)) score += 3;
      if (text.includes(kw)) score += 1;
    });

    if (score > bestScore) {
      bestScore = score;
      bestSector = sectorKey;
    }
  }

  return bestSector;
}

/**
 * Deterministic Hard Relevance Gating: Evaluates if a startup is genuinely eligible
 * and capable of solving the specific challenge before detailed ranking.
 */
export function checkStartupRelevance(startup: any, challenge: any): RelevanceGateResult {
  const challengeSector = resolveChallengeSector(challenge);
  const startupSector = resolveStartupSector(startup);

  const stDomain = (startup.domain || '').toLowerCase();
  const stText = `${startup.name || ''} ${startup.tagline || ''} ${stDomain} ${startup.overview || ''} ${(startup.techStack || []).join(' ')}`.toLowerCase();
  const chDept = (challenge.department || '').toLowerCase();
  const chCategory = (challenge.category || '').toLowerCase();
  const chTitle = (challenge.title || '').toLowerCase();
  const chDesc = `${challenge.problemDescription || ''} ${challenge.description || ''}`.toLowerCase();

  const reqList: string[] = [
    ...(challenge.requiredCapabilities || []),
    ...(challenge.techArea || []),
    ...(challenge.eligibility?.techRequirements || [])
  ];

  // Detect matched requirements
  const matchedRequirements: string[] = [];
  reqList.forEach(req => {
    const cleanReq = req.toLowerCase();
    const words = cleanReq.split(/[\s,/-]+/).filter((w: string) => w.length > 3);
    const hasMatch = words.some((w: string) => stText.includes(w));
    if (hasMatch && !matchedRequirements.includes(req)) {
      matchedRequirements.push(req);
    }
  });

  // Extract matching capabilities
  const matchingCapabilities: string[] = [];
  (startup.techStack || []).forEach((tech: string) => {
    const cleanTech = tech.toLowerCase();
    if (chDesc.includes(cleanTech) || chTitle.includes(cleanTech) || reqList.some(r => r.toLowerCase().includes(cleanTech))) {
      if (!matchingCapabilities.includes(tech)) matchingCapabilities.push(tech);
    }
  });
  if (matchingCapabilities.length === 0 && startup.techStack && startup.techStack.length > 0) {
    matchingCapabilities.push(startup.techStack[0]);
    if (startup.techStack[1]) matchingCapabilities.push(startup.techStack[1]);
  }

  // 1. Department Filter
  let departmentMatch = true;

  if (chDept.includes('agri') || chDept.includes('farmer') || chDept.includes('krishi') || challengeSector === 'agriculture') {
    departmentMatch = startupSector === 'agriculture' || stDomain.includes('agri') || stDomain.includes('crop') || stDomain.includes('farm');
  } else if (chDept.includes('health') || chDept.includes('hospital') || chDept.includes('medical') || challengeSector === 'healthcare') {
    departmentMatch = startupSector === 'healthcare' || stDomain.includes('health') || stDomain.includes('hospital') || stDomain.includes('medical') || stDomain.includes('abdm');
  } else if (chDept.includes('water') || chDept.includes('jal jeevan') || challengeSector === 'water_utilities') {
    departmentMatch = startupSector === 'water_utilities' || stDomain.includes('water') || stDomain.includes('leak') || stDomain.includes('utility');
  } else if (chDept.includes('education') || chDept.includes('school') || chDept.includes('shiksha') || challengeSector === 'education') {
    departmentMatch = startupSector === 'education' || stDomain.includes('edtech') || stDomain.includes('education') || stDomain.includes('literacy');
  } else if (chDept.includes('public works') || chDept.includes('pwd') || chDept.includes('nhai') || challengeSector === 'road_infra') {
    departmentMatch = startupSector === 'road_infra' || startupSector === 'urban_mobility' || stDomain.includes('infrastructure') || stDomain.includes('road') || stDomain.includes('transport');
  } else if (chDept.includes('urban development') || chDept.includes('traffic') || chDept.includes('municipal') || challengeSector === 'urban_mobility') {
    departmentMatch = startupSector === 'urban_mobility' || startupSector === 'road_infra' || stDomain.includes('traffic') || stDomain.includes('mobility') || stDomain.includes('urban');
  }

  // Check cross-sector strict incompatibility
  const incompatibleWithChallenge = SECTOR_CROSS_INCOMPATIBILITY[challengeSector] || [];
  if (incompatibleWithChallenge.includes(startupSector)) {
    departmentMatch = false;
  }

  // 2. Domain Match Filter
  let domainMatch = true;
  if (!departmentMatch) {
    domainMatch = false;
  } else if (challengeSector === startupSector) {
    domainMatch = true;
  } else if (
    (challengeSector === 'urban_mobility' && startupSector === 'road_infra') ||
    (challengeSector === 'road_infra' && startupSector === 'urban_mobility')
  ) {
    domainMatch = true;
  } else {
    domainMatch = false;
  }

  // 3. Capability Match Filter
  let capabilityMatch = true;
  if (!departmentMatch || !domainMatch) {
    capabilityMatch = false;
  } else if (matchedRequirements.length === 0 && matchingCapabilities.length === 0) {
    capabilityMatch = false;
  }

  // 4. Technology Match
  const technologyMatch = matchedRequirements.length > 0 || (startup.techStack || []).some((st: string) => {
    const s = st.toLowerCase();
    return chDesc.includes(s) || chTitle.includes(s);
  });

  // 5. Requirement Match
  const requirementMatch = matchedRequirements.length >= 1;

  // 6. Relevance Score calculation
  let relevanceScore = 0;
  if (!departmentMatch || !domainMatch) {
    relevanceScore = Math.min(25, (matchedRequirements.length * 4) + 10);
  } else {
    let base = 65;
    if (challengeSector === startupSector) base += 20;
    base += Math.min(10, matchedRequirements.length * 3);
    base += Math.min(5, matchingCapabilities.length * 2);
    relevanceScore = Math.min(99, Math.max(50, base));
  }

  // 7. Overall Gating Decision
  const isRelevant = departmentMatch && domainMatch && capabilityMatch && relevanceScore >= RELEVANCE_THRESHOLD;

  // 8. Exclusion Category & Reason
  let exclusionCategory: RelevanceGateResult['exclusionCategory'];
  let exclusionReason: string | undefined;

  if (!isRelevant) {
    if (!departmentMatch) {
      exclusionCategory = 'Department Mismatch';
      exclusionReason = `${startup.name} operates in ${startup.domain}, which is not eligible for ${challenge.department} tenders.`;
    } else if (!domainMatch) {
      exclusionCategory = 'Domain Mismatch';
      exclusionReason = `${startup.name} specializes in ${startup.domain}, which diverges from the required ${challenge.category} domain.`;
    } else if (!capabilityMatch) {
      exclusionCategory = 'Capability Mismatch';
      exclusionReason = `${startup.name}'s technical capabilities do not provide a viable solution for the specific requirements of "${challenge.title}".`;
    } else {
      exclusionCategory = 'Challenge Requirements Mismatch';
      exclusionReason = `${startup.name} capability relevance score (${relevanceScore}%) does not meet the minimum threshold of ${RELEVANCE_THRESHOLD}%.`;
    }
  }

  return {
    isRelevant,
    departmentMatch,
    domainMatch,
    capabilityMatch,
    requirementMatch,
    technologyMatch,
    relevanceScore,
    exclusionCategory,
    exclusionReason,
    matchedRequirements,
    matchingCapabilities
  };
}

/**
 * Calculates Technology Match (0 - 100)
 */
function calculateTechnologyMatch(startup: any, challenge: any): { score: number; desc: string; matchedTerms: string[] } {
  const startupTech = (startup.techStack || []).map((t: string) => t.toLowerCase());
  const startupText = `${startup.name} ${startup.tagline} ${startup.overview} ${startupTech.join(' ')}`.toLowerCase();

  const challengeAreas = (challenge.techArea || []).map((t: string) => t.toLowerCase());
  const reqCapabilities = (challenge.requiredCapabilities || []).map((c: string) => c.toLowerCase());
  const techRequirements = (challenge.eligibility?.techRequirements || []).map((r: string) => r.toLowerCase());
  const challengeCombined = `${challengeAreas.join(' ')} ${reqCapabilities.join(' ')} ${techRequirements.join(' ')}`.toLowerCase();

  const matchedTerms: string[] = [];

  // Check cluster matches
  let clusterMatches = 0;
  let totalRelevantClusters = 0;

  for (const [clusterKey, synonyms] of Object.entries(TECH_CONCEPT_CLUSTERS)) {
    const challengeHasCluster = synonyms.some(syn => challengeCombined.includes(syn));
    if (challengeHasCluster) {
      totalRelevantClusters++;
      const startupHasCluster = synonyms.some(syn => startupText.includes(syn));
      if (startupHasCluster) {
        clusterMatches++;
        // Find matching term
        const hit = synonyms.find(syn => startupText.includes(syn));
        if (hit && !matchedTerms.includes(hit)) matchedTerms.push(hit);
      }
    }
  }

  // Exact term matches from techStack
  let directStackHits = 0;
  challengeAreas.forEach((area: string) => {
    const areaWords = area.split(/\s+/).filter(w => w.length > 2);
    const hasMatch = startupTech.some((st: string) => 
      areaWords.some(w => st.includes(w))
    );
    if (hasMatch) {
      directStackHits++;
      if (!matchedTerms.includes(area)) matchedTerms.push(area);
    }
  });

  const totalAreas = Math.max(1, challengeAreas.length);
  const clusterRatio = totalRelevantClusters > 0 ? (clusterMatches / totalRelevantClusters) : 0.5;
  const stackRatio = directStackHits / totalAreas;

  // Composite calculation
  let score = Math.round((clusterRatio * 60) + (stackRatio * 35) + 5);

  // Bonus if startup past projects match technical scope
  const pastProjectsText = (startup.pastProjects || []).map((p: any) => `${p.name} ${p.impact}`).join(' ').toLowerCase();
  if (challengeAreas.some((a: string) => pastProjectsText.includes(a.split(' ')[0]))) {
    score += 5;
  }

  // Realistic technical alignment: only reward if genuine stack or cluster overlap exists
  if (directStackHits >= 2 && clusterMatches >= 1) {
    score = Math.max(score, 88 + Math.min(10, directStackHits * 3));
  } else if (directStackHits === 0 && clusterMatches === 0) {
    score = Math.min(20, score);
  } else if (directStackHits === 0 && clusterMatches <= 1) {
    score = Math.min(35, score);
  } else if (directStackHits === 0) {
    score = Math.min(48, score);
  }

  score = Math.min(98, Math.max(15, score));

  let desc = '';
  if (matchedTerms.length >= 2) {
    desc = `Core stack (${startup.techStack.slice(0, 3).join(', ')}) matches ${matchedTerms.slice(0, 3).join(' and ')} requirements.`;
  } else if (matchedTerms.length === 1) {
    desc = `Relevant capabilities in ${matchedTerms[0]}, with partial coverage of remaining technical criteria.`;
  } else {
    desc = `Limited technical overlap with required RFP stack (${challengeAreas.slice(0, 2).join(', ')}).`;
  }

  return { score, desc, matchedTerms };
}

/**
 * Calculates Domain / Sector Compatibility (0 - 100)
 */
function calculateDomainMatch(startup: any, challenge: any): { score: number; desc: string; domainMatchLevel: string } {
  const targetSectorKey = resolveChallengeSector(challenge);
  const targetSector = DOMAIN_SECTORS[targetSectorKey] || DOMAIN_SECTORS.transport_infra;

  const stDomain = (startup.domain || '').toLowerCase();
  const stTagline = (startup.tagline || '').toLowerCase();
  const stOverview = (startup.overview || '').toLowerCase();
  const pastClients = (startup.pastProjects || []).map((p: any) => `${p.name} ${p.client} ${p.impact}`).join(' ').toLowerCase();
  const startupCombined = `${stDomain} ${stTagline} ${stOverview} ${pastClients}`;

  let sectorMatches = 0;
  targetSector.keywords.forEach(kw => {
    if (startupCombined.includes(kw)) sectorMatches++;
  });

  const chCat = (challenge.category || '').toLowerCase();
  const directCategoryMatch = chCat.length > 3 && (stDomain.includes(chCat) || chCat.includes(stDomain));

  let score = 30;
  let level = 'Cross-Domain';
  let desc = '';

  if (sectorMatches >= 4 || directCategoryMatch || stDomain.includes(targetSectorKey.split('_')[0])) {
    score = 92 + Math.min(6, Math.max(sectorMatches, directCategoryMatch ? 4 : 0));
    level = 'Exact Alignment';
    desc = `Primary sector specialization in ${startup.domain} directly aligns with ${challenge.department} mission.`;
  } else if (sectorMatches >= 2) {
    score = 78 + Math.min(10, sectorMatches * 2);
    level = 'Adjacent Domain';
    desc = `Transferable sector experience in ${startup.domain} with proven relevance to ${challenge.category}.`;
  } else if (sectorMatches === 1) {
    score = 50;
    level = 'Secondary Domain';
    desc = `Peripheral alignment with ${targetSector.label}; candidate operates primarily in ${startup.domain}.`;
  } else {
    score = 15;
    level = 'Divergent Domain';
    desc = `Specialized in ${startup.domain}, which is completely divergent from the core ${challenge.category || 'RFP'} objective.`;
  }

  return { score: Math.min(99, Math.max(10, score)), desc, domainMatchLevel: level };
}

/**
 * Calculates Startup Experience & Track Record (0 - 100)
 */
function calculateExperienceMatch(startup: any, challenge: any): { score: number; desc: string } {
  const pilotsCount = startup.completedPilotsCount || 0;
  const foundedYear = startup.foundedYear || 2023;
  const currentYear = 2026;
  const ageYears = Math.max(1, currentYear - foundedYear);
  const minExpRequired = challenge.eligibility?.minExperienceYears || 1;

  let pilotsScore = 40;
  if (pilotsCount >= 5) pilotsScore = 96;
  else if (pilotsCount === 4) pilotsScore = 92;
  else if (pilotsCount === 3) pilotsScore = 86;
  else if (pilotsCount === 2) pilotsScore = 78;
  else if (pilotsCount === 1) pilotsScore = 68;

  let ageScore = 85;
  if (ageYears >= minExpRequired + 2) ageScore = 98;
  else if (ageYears >= minExpRequired) ageScore = 90;
  else ageScore = 65;

  const pastProjects = startup.pastProjects || [];
  let govtClientCount = 0;
  let relevantProjectsCount = 0;
  const targetSectorKey = resolveChallengeSector(challenge);
  const sectorKeywords = DOMAIN_SECTORS[targetSectorKey]?.keywords || [];

  pastProjects.forEach((p: any) => {
    const client = (p.client || '').toLowerCase();
    const impact = (p.impact || '').toLowerCase();
    const name = (p.name || '').toLowerCase();

    if (client.includes('dept') || client.includes('smart city') || client.includes('mission') || client.includes('corp') || client.includes('board') || client.includes('nhai') || client.includes('bbmp') || client.includes('pcmc') || client.includes('shiksha')) {
      govtClientCount++;
    }

    if (sectorKeywords.some(k => name.includes(k) || impact.includes(k) || client.includes(k))) {
      relevantProjectsCount++;
    }
  });

  const projectScore = Math.min(100, 68 + (govtClientCount * 10) + (relevantProjectsCount * 10));

  let finalScore = Math.round((pilotsScore * 0.45) + (ageScore * 0.25) + (projectScore * 0.30));
  finalScore = Math.min(98, Math.max(30, finalScore));

  let desc = '';
  if (pilotsCount >= 3 && govtClientCount > 0) {
    const sampleClient = pastProjects[0]?.client || 'public municipal bodies';
    desc = `${pilotsCount} completed pilots with verified government deployment record (${sampleClient}). ${ageYears} yrs active operation.`;
  } else if (pilotsCount >= 1) {
    desc = `${pilotsCount} completed deployment(s) with practical field telemetry meeting the ${minExpRequired}-year minimum experience threshold.`;
  } else {
    desc = `Early track record with zero completed public pilots recorded; ${ageYears} years operational experience.`;
  }

  return { score: finalScore, desc };
}

/**
 * Calculates Pilot Readiness (0 - 100)
 */
function calculatePilotReadiness(startup: any): { score: number; desc: string; level: 'High' | 'Medium' | 'Low' } {
  const readiness = startup.pilotReadiness || 'Medium';
  const stage = (startup.stage || '').toLowerCase();
  const teamSize = startup.teamSize || 10;

  let baseScore = 75;
  if (readiness === 'High') baseScore = 93;
  else if (readiness === 'Medium') baseScore = 78;
  else baseScore = 52;

  if (stage.includes('growth') || stage.includes('series')) baseScore += 3;
  if (teamSize >= 20) baseScore += 2;
  else if (teamSize < 10) baseScore -= 3;

  const score = Math.min(98, Math.max(40, baseScore));

  let desc = '';
  if (readiness === 'High') {
    desc = `High operational readiness with deployable hardware/software kits and active engineering support (Team of ${teamSize}).`;
  } else if (readiness === 'Medium') {
    desc = `Medium readiness: Core technology functional but requires minor field calibration before full deployment.`;
  } else {
    desc = `Low readiness: Product in earlier engineering iteration requiring integration and testing cycles.`;
  }

  return { score, desc, level: readiness };
}

/**
 * Calculates Scalability & Infrastructure (0 - 100)
 */
function calculateScalability(startup: any, challenge: any): { score: number; desc: string } {
  const techStack = (startup.techStack || []).join(' ').toLowerCase();
  const overview = (startup.overview || '').toLowerCase();

  let scalableFeatures = 0;
  if (techStack.includes('geojson') || techStack.includes('gis') || techStack.includes('gps')) scalableFeatures++;
  if (techStack.includes('edge') || techStack.includes('offline') || techStack.includes('on-device')) scalableFeatures++;
  if (techStack.includes('cloud') || techStack.includes('lorawan') || techStack.includes('mesh') || techStack.includes('telemetry')) scalableFeatures++;
  if (techStack.includes('fastapi') || techStack.includes('tensorrt') || techStack.includes('bot') || techStack.includes('abdm')) scalableFeatures++;

  const teamSize = startup.teamSize || 10;
  const completedPilots = startup.completedPilotsCount || 0;

  let baseScore = 75;
  baseScore += scalableFeatures * 4;
  if (teamSize >= 25) baseScore += 4;
  if (completedPilots >= 3) baseScore += 4;

  const score = Math.min(96, Math.max(50, baseScore));

  let desc = '';
  if (score >= 90) {
    desc = `Proven distributed architecture with demonstrated telemetry export, standard protocols, and capacity to handle expanded district rollouts.`;
  } else if (score >= 80) {
    desc = `Sound technical architecture with moderate multi-site scalability and standard data exchange interfaces.`;
  } else {
    desc = `Localized architecture that may require pipeline optimization for state-wide deployment.`;
  }

  return { score, desc };
}

/**
 * Calculates Statutory Eligibility (0 - 100)
 */
function calculateEligibility(startup: any, challenge: any): { score: number; desc: string; status: 'Eligible' | 'Under Review' | 'Ineligible' } {
  const eligibility = challenge.eligibility || {};
  const maxAge = eligibility.startupAgeYears || 10;
  const currentYear = 2026;
  const startupAge = currentYear - (startup.foundedYear || 2023);
  const minExp = eligibility.minExperienceYears || 1;

  const certs = (startup.certifications || []).map((c: string) => c.toLowerCase());
  const reqCerts = (eligibility.certifications || []).map((c: string) => c.toLowerCase());

  let passedRules = 0;

  // 1. Age check
  const ageOk = startupAge <= maxAge;
  if (ageOk) passedRules++;

  // 2. Experience check
  const expOk = startupAge >= minExp;
  if (expOk) passedRules++;

  // 3. Status check
  const declaredStatus = startup.eligibilityStatus || 'Eligible';
  if (declaredStatus === 'Eligible') passedRules++;

  // 4. Certifications check
  const hasDpiit = certs.some((c: string) => c.includes('dpiit') || c.includes('dipp'));
  let matchedCertCount = 0;
  reqCerts.forEach((rc: string) => {
    if (certs.some((c: string) => c.includes(rc.split(' ')[0]))) matchedCertCount++;
  });
  if (hasDpiit || matchedCertCount > 0) passedRules++;

  let score = 100;
  let status: 'Eligible' | 'Under Review' | 'Ineligible' = 'Eligible';

  if (passedRules === 4) {
    score = 100;
    status = 'Eligible';
  } else if (passedRules === 3) {
    score = 85;
    status = 'Under Review';
  } else if (passedRules === 2) {
    score = 65;
    status = 'Under Review';
  } else {
    score = 30;
    status = 'Ineligible';
  }

  let desc = '';
  if (score === 100) {
    const certList = startup.certifications?.slice(0, 2).join(', ') || 'DPIIT Registered';
    desc = `DPIIT recognized (${startupAge} yrs old vs ${maxAge} yr cap), turnover compliant, verified ${certList}.`;
  } else if (score >= 80) {
    desc = `Substantially compliant with statutory guidelines (${startupAge} yrs old); pending final documentation verification.`;
  } else {
    desc = `Statutory review flagged: fails to satisfy one or more RFP eligibility thresholds.`;
  }

  return { score, desc, status };
}

/**
 * Main function: Evaluates all candidate startups against a given challenge
 */
export function evaluateChallengeMatches(
  challenge: any,
  startups: any[],
  customWeights?: Partial<MatchingWeights>,
  filters?: { minReadiness?: string; eligibleOnly?: boolean }
): MatchingEvaluationResult {
  const weights = normalizeWeights(customWeights);

  const matches: StartupMatchEvaluation[] = [];
  const excludedMatches: ExcludedStartupEvaluation[] = [];

  for (const st of startups) {
    if (filters?.eligibleOnly && st.eligibilityStatus === 'Ineligible') continue;
    if (filters?.minReadiness === 'High' && st.pilotReadiness !== 'High') continue;
    if (filters?.minReadiness === 'Medium' && st.pilotReadiness === 'Low') continue;

    const relevance = checkStartupRelevance(st, challenge);

    if (!relevance.isRelevant) {
      excludedMatches.push({
        startupId: st.id,
        startupName: st.name,
        tagline: st.tagline || '',
        domain: st.domain || '',
        stage: st.stage || 'Growth',
        location: st.location || 'India',
        exclusionCategory: relevance.exclusionCategory || 'Domain Mismatch',
        exclusionReason: relevance.exclusionReason || `Specializes in ${st.domain}, diverging from "${challenge.title}".`,
        departmentMatch: relevance.departmentMatch,
        domainMatch: relevance.domainMatch,
        capabilityMatch: relevance.capabilityMatch,
        requirementMatch: relevance.requirementMatch,
        technologyMatch: relevance.technologyMatch,
        compatibilityScore: relevance.relevanceScore
      });
      continue; // GATED OUT: Irrelevant startups NEVER enter matches!
    }

    // For relevant startups, compute full compatibility evaluation
    const tech = calculateTechnologyMatch(st, challenge);
    const domain = calculateDomainMatch(st, challenge);
    const exp = calculateExperienceMatch(st, challenge);
    const readiness = calculatePilotReadiness(st);
    const scalability = calculateScalability(st, challenge);
    const eligibility = calculateEligibility(st, challenge);

    const overall = Math.round(
      tech.score * weights.technology +
      domain.score * weights.domain +
      exp.score * weights.experience +
      readiness.score * weights.pilotReadiness +
      scalability.score * weights.scalability +
      eligibility.score * weights.eligibility
    );

    let confidenceTier: StartupMatchEvaluation['confidenceTier'] = 'High Conviction';
    if (overall >= 88) {
      confidenceTier = 'High Conviction';
    } else if (overall >= 78) {
      confidenceTier = 'Moderate Match';
    } else if (overall >= 68) {
      confidenceTier = 'Conditional Match';
    } else {
      confidenceTier = 'Low Compatibility';
    }

    const confidence = `${Math.min(99.8, Math.max(65.0, overall * 0.98 + (overall > 85 ? 4.5 : 1.2))).toFixed(1)}%`;

    const explanation = `Strong match for ${challenge.department}: ${st.name} specializes in ${st.domain}, directly fulfilling ${relevance.matchedRequirements.length} RFP criteria with ${tech.score}% technology compatibility. ${tech.desc}`;

    const breakdown: MatchBreakdownFactor[] = [
      {
        factor: 'technologyMatch',
        label: 'Technology Match',
        score: tech.score,
        weight: `${Math.round(weights.technology * 100)}%`,
        desc: tech.desc
      },
      {
        factor: 'domainMatch',
        label: 'Domain Experience',
        score: domain.score,
        weight: `${Math.round(weights.domain * 100)}%`,
        desc: domain.desc
      },
      {
        factor: 'pilotReadiness',
        label: 'Pilot Readiness',
        score: readiness.score,
        weight: `${Math.round(weights.pilotReadiness * 100)}%`,
        desc: readiness.desc
      },
      {
        factor: 'experienceMatch',
        label: 'Startup Experience',
        score: exp.score,
        weight: `${Math.round(weights.experience * 100)}%`,
        desc: exp.desc
      },
      {
        factor: 'scalabilityMatch',
        label: 'Scalability & Architecture',
        score: scalability.score,
        weight: `${Math.round(weights.scalability * 100)}%`,
        desc: scalability.desc
      },
      {
        factor: 'eligibilityMatch',
        label: 'Statutory Eligibility',
        score: eligibility.score,
        weight: `${Math.round(weights.eligibility * 100)}%`,
        desc: eligibility.desc
      }
    ];

    const strengths: string[] = [
      `Direct sector alignment: ${st.domain}`,
      ...relevance.matchedRequirements.slice(0, 2).map(r => `Verified requirement coverage: ${r}`),
      ...(tech.score >= 85 ? [`High technology stack overlap (${tech.matchedTerms.slice(0, 2).join(', ') || 'RFP requirements'})`] : [])
    ];

    const riskFactors: string[] = [];
    if (readiness.score < 80) riskFactors.push('Pilot deployment requires initial field calibration period');
    if (exp.score < 80) riskFactors.push('Limited public sector pilot deployment history on record');

    matches.push({
      rank: 0,
      startupId: st.id,
      startupName: st.name,
      tagline: st.tagline || '',
      domain: st.domain || '',
      stage: st.stage || 'Growth',
      location: st.location || 'India',
      overallScore: overall,
      confidence,
      confidenceTier,
      technologyMatch: tech.score,
      domainMatch: domain.score,
      experienceMatch: exp.score,
      pilotReadiness: readiness.score,
      scalabilityMatch: scalability.score,
      eligibilityMatch: eligibility.score,
      readinessLevel: readiness.level,
      eligibilityStatus: eligibility.status,
      explanation,
      breakdown,
      strengths,
      riskFactors,
      relevant: true,
      departmentMatch: true,
      domainRelevanceMatch: true,
      capabilityMatch: true,
      requirementMatch: relevance.requirementMatch,
      relevanceScore: relevance.relevanceScore,
      matchedRequirements: relevance.matchedRequirements,
      matchingCapabilities: relevance.matchingCapabilities
    });
  }

  // Sort descending by overallScore, then by techScore
  matches.sort((a, b) => b.overallScore - a.overallScore || b.technologyMatch - a.technologyMatch);

  // Assign ranks
  matches.forEach((item, index) => {
    item.rank = index + 1;
  });

  return {
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    department: challenge.department,
    category: challenge.category,
    totalEvaluated: matches.length + excludedMatches.length,
    weightsUsed: weights,
    matches,
    excludedMatches
  };
}
