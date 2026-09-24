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
  MatchBreakdownFactor,
  ExcludedStartupEvaluation,
  checkStartupRelevance,
  RELEVANCE_THRESHOLD
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
Your duty is to conduct an objective, grounded, explainable evaluation of startup capabilities against a specific government RFP challenge.

MANDATORY EVALUATION RULES:
1. HARD RELEVANCE GATING:
   - Carefully inspect the Challenge Department, Category, and specific Problem Statement.
   - A startup is "relevant: true" ONLY if its core sector, capabilities, and solutions genuinely solve THIS specific government challenge.
   - Do NOT treat "startup uses AI or deep learning" as sufficient relevance! A generic AI startup operating in an unrelated domain (e.g. EdTech or Healthcare for Traffic, or Agriculture for Hospitals) MUST be marked "relevant: false".
   - If there is a department mismatch, domain mismatch, or capability mismatch:
     * "relevant": false
     * "departmentMatch": false
     * "domainMatch": false
     * "problemMatch": false
     * "requirementMatch": false
     * "capabilityMatch": false
     * "compatibilityScore": must be < 20 (e.g. 5-15)
     * "domainCompatibilityScore": must be < 20
     * "semanticRelevanceScore": must be < 20
     * "reason": Explicit sentence stating why this startup is irrelevant (e.g. "Startup specializes in agricultural computer vision and does not address the selected urban mobility challenge.")
     * "gaps": ["Domain Mismatch: Operates in [Domain], which does not address [Challenge Category]"]
2. DIRECT & ADJACENT DOMAIN MATCHES:
   - For startups that genuinely operate in the challenge's sector and have matching capabilities:
     * "relevant": true
     * "departmentMatch": true
     * "domainMatch": true
     * "problemMatch": true
     * "requirementMatch": true
     * "capabilityMatch": true
     * "technologyMatch": true
     * "compatibilityScore": realistic high score (75-98)
     * "reason": Clear sentence stating why it matches the challenge requirements.
     * "matchedRequirements": Array of challenge requirements that the startup directly satisfies.
     * "matchingCapabilities": Array of specific startup technical capabilities addressing the problem.
3. Base all evaluations strictly on the provided challenge RFP and startup capabilities. DO NOT fabricate qualifications.
4. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const challengeSummary = {
    id: challenge.id,
    title: challenge.title,
    department: challenge.department,
    category: challenge.category,
    description: challenge.description || (challenge as any).problemDescription || 'Government public infrastructure deployment challenge.',
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
    description: s.description || (s as any).overview || '',
    techStack: s.techStack || [],
    coreCapabilities: s.coreCapabilities || [],
    patents: s.patents || [],
    certifications: s.certifications || [],
    pilotReadiness: s.pilotReadiness || 'Medium',
    completedPilotsCount: s.completedPilotsCount || 0,
    dpiitRegistered: s.dpiitRegistered !== false
  }));

  const user = `EVALUATION TASK:
Analyze the following Government Challenge and evaluate each candidate Startup against its specific problem statement and technical requirements.

GOVERNMENT CHALLENGE:
${JSON.stringify(challengeSummary, null, 2)}

CANDIDATE STARTUPS (${startups.length} total):
${JSON.stringify(startupSummaries, null, 2)}

INSTRUCTIONS:
Evaluate each startup on:
1. relevant (boolean): Must this startup realistically enter the primary recommendation list? (Must be false if out-of-domain!)
2. departmentMatch (boolean): True if startup aligns with the government department mandate.
3. domainMatch (boolean): True if startup operates in the challenge's sector.
4. problemMatch (boolean): True if startup directly addresses the specific RFP problem statement.
5. requirementMatch (boolean): True if startup fulfills at least one key RFP requirement.
6. capabilityMatch (boolean): True if startup has genuine capabilities solving this challenge.
7. technologyMatch (boolean): True if startup's tech stack matches challenge technical requirements.
8. compatibilityScore (number 0-100): Overall match score (< 20 if relevant is false).
9. reason (string): Concise explainable rationale for why it is relevant or why it is excluded.
10. matchedRequirements (string[]): Challenge requirements directly addressed by the startup.
11. matchingCapabilities (string[]): Specific startup capabilities matching the challenge.
12. semanticRelevanceScore (0-100): Problem-solution semantic relevance (< 25 if irrelevant).
13. technologyCompatibilityScore (0-100): Tech stack overlap and depth.
14. domainCompatibilityScore (0-100): Sector expertise (< 20 if divergent).
15. requirementCoverageScore (0-100): Coverage of requirements and constraints.
16. scalabilityScore (0-100): Architecture scalability for public sector rollout.
17. confidenceScore (0.50 to 0.99): Algorithmic conviction level.
18. strengths (string[]): 2 to 3 bullet points with verified technical strengths.
19. gaps (string[]): 1 to 2 bullet points with risks, missing capabilities, or out-of-domain notices.
20. explanation (string): 2 to 3 sentences explaining the evaluation.

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "evaluations": [
    {
      "startupId": "string",
      "relevant": true,
      "departmentMatch": true,
      "domainMatch": true,
      "problemMatch": true,
      "requirementMatch": true,
      "capabilityMatch": true,
      "technologyMatch": true,
      "compatibilityScore": 94,
      "reason": "Startup specializes in AI-based urban traffic prediction and directly matches the challenge requirements.",
      "matchedRequirements": ["Adaptive Signal Control"],
      "matchingCapabilities": ["Edge Computer Vision"],
      "semanticRelevanceScore": 92,
      "technologyCompatibilityScore": 95,
      "domainCompatibilityScore": 94,
      "requirementCoverageScore": 90,
      "scalabilityScore": 88,
      "confidenceScore": 0.94,
      "strengths": ["Strong sensor integration", "Edge inference readiness"],
      "gaps": ["Requires initial calibration on local corridors"],
      "explanation": "High compatibility profile..."
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
    const matches: StartupMatchEvaluation[] = [];
    const excludedMatches: ExcludedStartupEvaluation[] = [];

    for (const st of targetStartups) {
      const aiEval = aiEvalMap.get(st.id);
      
      // Step 1: Rule-Based Deterministic Safety Filter
      const deterministicRelevance = checkStartupRelevance(st, challenge);

      // Step 2: AI Evaluation Relevance Check
      const aiRelevant = aiEval ? (aiEval.relevant !== false && aiEval.departmentMatch !== false && aiEval.domainMatch !== false) : true;

      // Both Rule-Based Safety Filter AND AI Evaluation must pass for a startup to be recommended
      const isCandidateRelevant = deterministicRelevance.isRelevant && aiRelevant;

      if (!isCandidateRelevant) {
        excludedMatches.push({
          startupId: st.id,
          startupName: st.name,
          tagline: st.tagline || '',
          domain: st.domain,
          stage: st.stage || 'Growth',
          location: st.location || 'India',
          exclusionCategory: deterministicRelevance.exclusionCategory || 'Domain Mismatch',
          exclusionReason: aiEval?.reason || deterministicRelevance.exclusionReason || `${st.name} is not eligible for "${challenge.title}".`,
          departmentMatch: deterministicRelevance.departmentMatch,
          domainMatch: deterministicRelevance.domainMatch,
          capabilityMatch: deterministicRelevance.capabilityMatch,
          requirementMatch: deterministicRelevance.requirementMatch,
          technologyMatch: deterministicRelevance.technologyMatch,
          compatibilityScore: Math.min(25, deterministicRelevance.relevanceScore)
        });
        continue; // HARD GATED: Irrelevant startups NEVER enter the primary recommended list!
      }

      // If AI didn't return an evaluation for this startup, use safe neutral scores
      const semScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.semanticRelevanceScore))) : 75;
      const techScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.technologyCompatibilityScore))) : 75;
      const domScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.domainCompatibilityScore))) : 80;
      const reqScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.requirementCoverageScore))) : 75;
      const scaleScore = aiEval ? Math.max(0, Math.min(100, Math.round(aiEval.scalabilityScore))) : 75;
      const confRatio = aiEval?.confidenceScore && aiEval.confidenceScore > 0 && aiEval.confidenceScore <= 1.0 
        ? aiEval.confidenceScore 
        : 0.90;

      const statutory = evaluateStatutoryFactors(st, challenge);

      if (filters?.eligibleOnly && statutory.eligibilityStatus === 'Ineligible') {
        continue;
      }

      const overall = Math.round(
        semScore * normWeights.semantic +
        techScore * normWeights.technology +
        domScore * normWeights.domain +
        reqScore * normWeights.requirements +
        statutory.eligibilityScore * normWeights.eligibility +
        statutory.readinessScore * normWeights.readiness +
        scaleScore * normWeights.scalability
      );

      // Confidence tier
      let confidenceTier: StartupMatchEvaluation['confidenceTier'] = 'High Conviction';
      if (overall >= 88) {
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

      const matchedReqs = (aiEval?.matchedRequirements && aiEval.matchedRequirements.length > 0)
        ? aiEval.matchedRequirements
        : deterministicRelevance.matchedRequirements;

      const matchingCaps = (aiEval?.matchingCapabilities && aiEval.matchingCapabilities.length > 0)
        ? aiEval.matchingCapabilities
        : deterministicRelevance.matchingCapabilities;

      const strengths = (aiEval?.strengths && aiEval.strengths.length > 0)
        ? aiEval.strengths
        : [`Direct domain alignment in ${st.domain}`, `Documented capabilities in ${(st.techStack || []).slice(0, 2).join(', ') || 'AI'}`];

      const riskFactors = (aiEval?.gaps && aiEval.gaps.length > 0)
        ? aiEval.gaps
        : [`Pilot execution timeline depends on local field setup`];

      const explanation = aiEval?.reason || aiEval?.explanation || 
        `${st.name} demonstrates a strong technical profile with ${techScore}% technology alignment and ${domScore}% sector relevance for ${challenge.department}.`;

      matches.push({
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
        riskFactors,
        relevant: true,
        departmentMatch: true,
        domainRelevanceMatch: true,
        capabilityMatch: true,
        requirementMatch: deterministicRelevance.requirementMatch,
        relevanceScore: deterministicRelevance.relevanceScore,
        matchedRequirements: matchedReqs,
        matchingCapabilities: matchingCaps,
        reason: aiEval?.reason
      });
    }

    // Sort descending by overallScore, then technologyMatch
    matches.sort((a, b) => b.overallScore - a.overallScore || b.technologyMatch - a.technologyMatch);

    // Assign rank
    matches.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    console.log(`[AI Matching] Successfully processed ${matches.length} relevant startups (${excludedMatches.length} excluded) using AI model ${provider.model}. Top match: #${matches[0]?.rank} ${matches[0]?.startupName} (${matches[0]?.overallScore}%)`);

    return {
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      department: challenge.department,
      category: challenge.category,
      totalEvaluated: matches.length + excludedMatches.length,
      weightsUsed: normWeights as any,
      matches,
      excludedMatches,
      mode: 'ai',
      modelUsed: `${provider.name} (${provider.model})`,
      timestamp: new Date().toISOString()
    } as any;

  } catch (err: any) {
    console.error(`[AI Matching] External AI provider error: ${err?.message || err}. Seamlessly initiating fallback matching engine.`);
    return null;
  }
}
