import { getAIProvider } from './provider.js';
import { 
  ChallengeInput, 
  StartupInput, 
  AIParsedResponse, 
  AISemanticEvaluation 
} from './types.js';
import { 
  MatchingWeights, 
  DEFAULT_WEIGHTS, 
  StartupMatchEvaluation, 
  MatchingEvaluationResult,
  MatchBreakdownFactor
} from '../matchingEngine.js';

export interface HybridMatchingWeights {
  semantic: number;
  technology: number;
  domain: number;
  requirements: number;
  eligibility: number;
  readiness: number;
  scalability: number;
}

export const DEFAULT_HYBRID_WEIGHTS: HybridMatchingWeights = {
  semantic: 0.30,
  technology: 0.20,
  domain: 0.15,
  requirements: 0.15,
  eligibility: 0.10,
  readiness: 0.05,
  scalability: 0.05
};

function normalizeHybridWeights(weights?: Partial<HybridMatchingWeights>): HybridMatchingWeights {
  if (!weights) return { ...DEFAULT_HYBRID_WEIGHTS };
  const raw = {
    semantic: typeof weights.semantic === 'number' ? weights.semantic : DEFAULT_HYBRID_WEIGHTS.semantic,
    technology: typeof weights.technology === 'number' ? weights.technology : DEFAULT_HYBRID_WEIGHTS.technology,
    domain: typeof weights.domain === 'number' ? weights.domain : DEFAULT_HYBRID_WEIGHTS.domain,
    requirements: typeof weights.requirements === 'number' ? weights.requirements : DEFAULT_HYBRID_WEIGHTS.requirements,
    eligibility: typeof weights.eligibility === 'number' ? weights.eligibility : DEFAULT_HYBRID_WEIGHTS.eligibility,
    readiness: typeof weights.readiness === 'number' ? weights.readiness : DEFAULT_HYBRID_WEIGHTS.readiness,
    scalability: typeof weights.scalability === 'number' ? weights.scalability : DEFAULT_HYBRID_WEIGHTS.scalability
  };

  const total = Object.values(raw).reduce((sum, v) => sum + v, 0);
  if (total <= 0) return { ...DEFAULT_HYBRID_WEIGHTS };

  return {
    semantic: raw.semantic / total,
    technology: raw.technology / total,
    domain: raw.domain / total,
    requirements: raw.requirements / total,
    eligibility: raw.eligibility / total,
    readiness: raw.readiness / total,
    scalability: raw.scalability / total
  };
}

/**
 * Constructs prompt for external AI provider
 */
function buildPrompt(challenge: ChallengeInput, startups: StartupInput[]): { system: string; user: string } {
  const system = `You are the PragatiAI Senior Technical Evaluator and AI Matching Specialist for the Government of India Smart India Hackathon 2026.
Your duty is to conduct an objective, grounded, explainable evaluation of startup capabilities against a government RFP challenge.

MANDATORY EVALUATION RULES:
1. STRICT DOMAIN & SECTOR RELEVANCE:
   - Carefully check the Challenge Sector/Category, Problem Statement, and Department.
   - If a startup operates in an irrelevant or divergent domain (e.g. an EdTech or Healthcare startup for a Traffic or Road challenge, or an Agriculture startup for Hospital bed logistics):
     * domainCompatibilityScore MUST be between 0 and 20.
     * semanticRelevanceScore MUST be between 0 and 20.
     * requirementCoverageScore MUST be between 0 and 20.
     * In the "gaps" array, explicitly state: "Domain Mismatch: Operates in [Domain], which does not address [Challenge Sector]".
     * In the "explanation", explicitly state: "Irrelevant Domain: [Startup] specializes in [Domain] and cannot address this [Challenge Category] problem."
     * DO NOT award high scores merely because a startup uses generic programming languages, basic AI, or cloud infrastructure.
2. DIRECT & ADJACENT DOMAIN MATCHES:
   - For startups that genuinely operate in the challenge's sector (e.g. Smart Mobility, Traffic AI, Computer Vision, Road Infrastructure for an urban traffic/road problem):
     * Evaluate their actual technical stack, sensor deployment experience, and pilot track record with realistic high scores (75-98).
3. Base all scores strictly on the provided challenge RFP and startup capabilities. DO NOT fabricate qualifications.
4. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const challengeSummary = {
    id: challenge.id,
    title: challenge.title,
    department: challenge.department,
    category: challenge.category,
    description: challenge.description || challenge.problemDescription || 'Government public infrastructure deployment challenge.',
    techArea: challenge.techArea || [],
    requiredCapabilities: challenge.requiredCapabilities || [],
    eligibility: challenge.eligibility || {},
    constraints: challenge.constraints || []
  };

  const startupSummaries = startups.map(s => ({
    id: s.id,
    name: s.name,
    tagline: s.tagline || '',
    domain: s.domain,
    stage: s.stage || 'Growth',
    description: s.description || s.overview || '',
    techStack: s.techStack || [],
    coreCapabilities: s.coreCapabilities || [],
    patents: s.patents || [],
    certifications: s.certifications || [],
    pilotReadiness: s.pilotReadiness || 'Medium',
    completedPilotsCount: s.completedPilotsCount || 0,
    dpiitRegistered: s.dpiitRegistered !== false
  }));

  const user = `EVALUATION TASK:
Analyze the following Government Challenge and evaluate each candidate Startup.

GOVERNMENT CHALLENGE:
${JSON.stringify(challengeSummary, null, 2)}

CANDIDATE STARTUPS (${startups.length} total):
${JSON.stringify(startupSummaries, null, 2)}

INSTRUCTIONS:
Evaluate each startup on:
1. semanticRelevanceScore (0-100): Semantic understanding of how well the startup's solution addresses the challenge's core problem statement. (Must be < 25 if domain is irrelevant!)
2. technologyCompatibilityScore (0-100): Overlap and depth in the required tech stack and modern frameworks.
3. domainCompatibilityScore (0-100): Sector expertise (e.g. transport, agritech, healthcare, municipal utilities). (Must be < 20 if domain is divergent!)
4. requirementCoverageScore (0-100): Extent to which required capabilities and constraints are addressed.
5. scalabilityScore (0-100): Architectural readiness to scale across districts or state deployments.
6. confidenceScore (0.50 to 0.99): Algorithmic conviction level based on verified data points.
7. strengths: Array of 2 to 3 concise bullet points with verified technical strengths.
8. gaps: Array of 1 to 2 concise risk factors, missing capabilities, or out-of-domain notices.
9. explanation: 2 to 3 sentences explaining the technical rationale for this evaluation.

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "evaluations": [
    {
      "startupId": "string",
      "semanticRelevanceScore": number,
      "technologyCompatibilityScore": number,
      "domainCompatibilityScore": number,
      "requirementCoverageScore": number,
      "scalabilityScore": number,
      "confidenceScore": number,
      "strengths": ["string", "string"],
      "gaps": ["string"],
      "explanation": "string"
    }
  ]
}`;

  return { system, user };
}

/**
 * Deterministic statutory eligibility and readiness evaluation
 */
function evaluateStatutoryFactors(startup: StartupInput, challenge: ChallengeInput): {
  eligibilityScore: number;
  eligibilityStatus: 'Eligible' | 'Under Review' | 'Ineligible';
  eligibilityDesc: string;
  readinessScore: number;
  readinessLevel: 'High' | 'Medium' | 'Low';
  readinessDesc: string;
} {
  // Eligibility
  let eligibilityScore = 100;
  const issues: string[] = [];

  if (startup.dpiitRegistered === false) {
    eligibilityScore -= 30;
    issues.push('DPIIT startup recognition pending');
  }

  const certs = (startup.certifications || []).map(c => c.toLowerCase());
  const requiredCerts = challenge.eligibility?.requiredCertifications || [];
  for (const rc of requiredCerts) {
    if (!certs.some(c => c.includes(rc.toLowerCase()))) {
      eligibilityScore -= 20;
      issues.push(`Missing mandatory certification: ${rc}`);
    }
  }

  eligibilityScore = Math.max(0, Math.min(100, eligibilityScore));
  const eligibilityStatus: 'Eligible' | 'Under Review' | 'Ineligible' = 
    eligibilityScore >= 80 ? 'Eligible' : eligibilityScore >= 60 ? 'Under Review' : 'Ineligible';
  const eligibilityDesc = issues.length > 0 
    ? `Statutory audit flagged: ${issues.join(', ')}` 
    : 'Full statutory DPIIT registration and compliance verified.';

  // Pilot Readiness
  const readiness = startup.pilotReadiness || 'Medium';
  let readinessScore = 75;
  if (readiness === 'High') readinessScore = 95;
  else if (readiness === 'Medium') readinessScore = 78;
  else readinessScore = 55;

  const pilots = startup.completedPilotsCount || 0;
  if (pilots >= 3) readinessScore = Math.min(100, readinessScore + 5);
  else if (pilots === 0) readinessScore = Math.max(40, readinessScore - 10);

  const readinessDesc = `${readiness} field-trial readiness with ${pilots} verified prior pilot deployment${pilots === 1 ? '' : 's'}.`;

  return {
    eligibilityScore,
    eligibilityStatus,
    eligibilityDesc,
    readinessScore,
    readinessLevel: readiness,
    readinessDesc
  };
}

/**
 * Execute real AI-assisted startup matching pipeline.
 * Returns null if AI provider is unconfigured, unavailable, or encounters an error,
 * allowing the caller to trigger seamless fallback.
 */
export async function executeAIMatching(
  challenge: ChallengeInput,
  startups: StartupInput[],
  weights?: Partial<HybridMatchingWeights>,
  filters?: { minReadiness?: 'High' | 'Medium' | 'Low'; eligibleOnly?: boolean }
): Promise<MatchingEvaluationResult | null> {
  const provider = getAIProvider();
  if (!provider || !provider.isConfigured()) {
    console.log('[AI Matching] No external AI provider configured or valid API key found. Gracefully delegating to fallback engine.');
    return null;
  }

  try {
    console.log(`[AI Matching] Initiating AI evaluation using provider: ${provider.name} (${provider.model}) for challenge: "${challenge.title}"`);
    const { system, user } = buildPrompt(challenge, startups);
    
    const parsed = await provider.generateStructuredCompletion<AIParsedResponse>(user, system);

    if (!parsed || !Array.isArray(parsed.evaluations) || parsed.evaluations.length === 0) {
      console.warn('[AI Matching] External AI returned empty or invalid evaluations structure. Falling back to deterministic engine.');
      return null;
    }

    const normWeights = normalizeHybridWeights(weights);

    // Build evaluation lookup from AI response
    const aiEvalMap = new Map<string, AISemanticEvaluation>();
    for (const item of parsed.evaluations) {
      if (item && item.startupId) {
        aiEvalMap.set(item.startupId, item);
      }
    }

    // Apply filtering if requested
    let targetStartups = startups;
    if (filters?.minReadiness) {
      const rankOrder = { High: 3, Medium: 2, Low: 1 };
      const minVal = rankOrder[filters.minReadiness] || 1;
      targetStartups = targetStartups.filter(s => (rankOrder[s.pilotReadiness || 'Medium'] || 1) >= minVal);
    }

    // Merge AI semantic results with deterministic validation
    const evaluatedList: StartupMatchEvaluation[] = [];

    for (const st of targetStartups) {
      const aiEval = aiEvalMap.get(st.id);
      
      // If AI didn't return an evaluation for this startup, use safe neutral scores
      const semScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.semanticRelevanceScore))) : 70;
      const techScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.technologyCompatibilityScore))) : 70;
      const domScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.domainCompatibilityScore))) : 70;
      const reqScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.requirementCoverageScore))) : 70;
      const scaleScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.scalabilityScore))) : 70;
      const confRatio = aiEval?.confidenceScore && aiEval.confidenceScore > 0 && aiEval.confidenceScore <= 1.0 
        ? aiEval.confidenceScore 
        : 0.90;

      const statutory = evaluateStatutoryFactors(st, challenge);

      if (filters?.eligibleOnly && statutory.eligibilityStatus === 'Ineligible') {
        continue;
      }

      // Domain Incompatibility Gate: If domain or semantic relevance is low, penalize out-of-domain startups
      const isDomainIncompatible = domScore < 35 || semScore < 30;

      let overall: number;
      if (isDomainIncompatible) {
        // Severely cap score so irrelevant startups cannot score high on statutory credentials alone
        overall = Math.round(Math.min(35, domScore * 0.5 + semScore * 0.3 + techScore * 0.2));
      } else {
        overall = Math.round(
          semScore * normWeights.semantic +
          techScore * normWeights.technology +
          domScore * normWeights.domain +
          reqScore * normWeights.requirements +
          statutory.eligibilityScore * normWeights.eligibility +
          statutory.readinessScore * normWeights.readiness +
          scaleScore * normWeights.scalability
        );
      }

      // Confidence tier
      let confidenceTier: StartupMatchEvaluation['confidenceTier'] = 'High Conviction';
      if (isDomainIncompatible || overall < 45) {
        confidenceTier = 'Low Compatibility';
      } else if (overall >= 88) {
        confidenceTier = 'High Conviction';
      } else if (overall >= 75) {
        confidenceTier = 'Moderate Match';
      } else {
        confidenceTier = 'Conditional Match';
      }

      const confidence = `${(confRatio * 100).toFixed(1)}%`;

      // Breakdown factors
      const breakdown: MatchBreakdownFactor[] = [
        {
          factor: 'technologyMatch',
          label: 'Technology Compatibility',
          score: techScore,
          weight: `${Math.round(normWeights.technology * 100)}%`,
          desc: `AI-assessed technical alignment with challenge requirements.`
        },
        {
          factor: 'domainMatch',
          label: 'Domain Experience',
          score: domScore,
          weight: `${Math.round(normWeights.domain * 100)}%`,
          desc: `Sector alignment with ${st.domain} and department operations.`
        },
        {
          factor: 'pilotReadiness',
          label: 'Pilot Readiness',
          score: statutory.readinessScore,
          weight: `${Math.round(normWeights.readiness * 100)}%`,
          desc: statutory.readinessDesc
        },
        {
          factor: 'experienceMatch',
          label: 'Semantic Relevance',
          score: semScore,
          weight: `${Math.round(normWeights.semantic * 100)}%`,
          desc: `Semantic problem-solution compatibility evaluated by ${provider.model}.`
        },
        {
          factor: 'scalabilityMatch',
          label: 'Scalability & Architecture',
          score: scaleScore,
          weight: `${Math.round(normWeights.scalability * 100)}%`,
          desc: `Architecture scalability for public sector rollout.`
        },
        {
          factor: 'eligibilityMatch',
          label: 'Statutory Eligibility',
          score: statutory.eligibilityScore,
          weight: `${Math.round(normWeights.eligibility * 100)}%`,
          desc: statutory.eligibilityDesc
        }
      ];

      const strengths = isDomainIncompatible
        ? [`Verified statutory status: ${st.dpiitRegistered ? 'DPIIT Recognized' : 'Registered'}`]
        : (aiEval?.strengths && aiEval.strengths.length > 0 
          ? aiEval.strengths 
          : [`Domain alignment in ${st.domain}`, `Documented stack in ${(st.techStack || []).slice(0, 2).join(', ') || 'AI'}`]);

      const riskFactors = isDomainIncompatible
        ? [`Critical Domain Mismatch: Specializes in ${st.domain}, which diverges from the core RFP requirement (${challenge.category || 'target domain'}).`, ...(aiEval?.gaps || [])]
        : (aiEval?.gaps && aiEval.gaps.length > 0 
          ? aiEval.gaps 
          : [`Pilot execution timeline depends on hardware availability`]);

      const explanation = isDomainIncompatible
        ? `Incompatible Domain: ${st.name} specializes in ${st.domain}, which does not match the operational needs of "${challenge.title}". Not recommended for this public tender.`
        : (aiEval?.explanation || `${st.name} demonstrates a viable technical profile with ${techScore}% technology alignment and ${domScore}% sector relevance.`);

      evaluatedList.push({
        rank: 0,
        startupId: st.id,
        startupName: st.name,
        tagline: st.tagline || '',
        domain: st.domain,
        stage: st.stage || 'Growth',
        location: st.location || 'India',
        overallScore: overall,
        confidence,
        confidenceTier,
        technologyMatch: techScore,
        domainMatch: domScore,
        experienceMatch: semScore,
        pilotReadiness: statutory.readinessScore,
        scalabilityMatch: scaleScore,
        eligibilityMatch: statutory.eligibilityScore,
        readinessLevel: statutory.readinessLevel,
        eligibilityStatus: statutory.eligibilityStatus,
        explanation,
        breakdown,
        strengths,
        riskFactors
      });
    }

    // Sort descending by overallScore, then technologyMatch
    evaluatedList.sort((a, b) => b.overallScore - a.overallScore || b.technologyMatch - a.technologyMatch);

    // Assign rank
    evaluatedList.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    console.log(`[AI Matching] Successfully processed ${evaluatedList.length} startups using AI model ${provider.model}. Top match: #${evaluatedList[0]?.rank} ${evaluatedList[0]?.startupName} (${evaluatedList[0]?.overallScore}%)`);

    return {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      department: challenge.department,
      category: challenge.category,
      totalEvaluated: evaluatedList.length,
      weightsUsed: normWeights as any,
      matches: evaluatedList,
      mode: 'ai',
      modelUsed: `${provider.name} (${provider.model})`,
      timestamp: new Date().toISOString()
    } as any;

  } catch (err: any) {
    console.error(`[AI Matching] External AI provider error: ${err?.message || err}. Seamlessly initiating fallback matching engine.`);
    return null;
  }
}
