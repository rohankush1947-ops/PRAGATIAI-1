export interface ChallengeInput {
  id: string;
  title: string;
  department: string;
  category: string;
  description?: string;
  techArea?: string[];
  requiredCapabilities?: string[];
  eligibility?: {
    minStage?: string;
    dpiitRequired?: boolean;
    priorPilots?: number;
    requiredCertifications?: string[];
  };
  constraints?: string[];
}

export interface StartupInput {
  id: string;
  name: string;
  tagline?: string;
  domain: string;
  stage?: string;
  location?: string;
  description?: string;
  techStack?: string[];
  coreCapabilities?: string[];
  patents?: string[];
  certifications?: string[];
  pilotReadiness?: 'High' | 'Medium' | 'Low';
  completedPilotsCount?: number;
  dpiitRegistered?: boolean;
}

export interface AISemanticEvaluation {
  startupId: string;
  semanticRelevanceScore: number;       // 0 - 100
  technologyCompatibilityScore: number; // 0 - 100
  domainCompatibilityScore: number;     // 0 - 100
  requirementCoverageScore: number;     // 0 - 100
  scalabilityScore: number;             // 0 - 100
  confidenceScore: number;              // 0.50 - 0.99
  strengths: string[];
  gaps: string[];
  explanation: string;
}

export interface AIParsedResponse {
  evaluations: AISemanticEvaluation[];
  summary?: string;
}

export interface AIProviderConfig {
  provider: 'gemini' | 'openai' | 'groq' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface IAIProvider {
  name: string;
  model: string;
  generateStructuredCompletion<T>(prompt: string, systemInstruction?: string): Promise<T>;
  isConfigured(): boolean;
}
