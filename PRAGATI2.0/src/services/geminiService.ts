import { AI_CHALLENGE_TEMPLATES } from '../data/mockData';

export interface StructuredRFP {
  title: string;
  department: string;
  category: string;
  techArea: string[];
  budgetRange: string;
  pilotDuration: string;
  currentSituation: string;
  problemDescription: string;
  targetOutcome: string;
  suggestedKpis: Array<{ name: string; target: string; unit?: string }>;
  pilotScope: string;
  eligibilityRequirements: string[];
  evaluationCriteria: Array<{ name: string; weight: number; maxScore?: number; description?: string }>;
}

export interface GeminiGenerationResult {
  generated: StructuredRFP;
  source: 'gemini-live' | 'gemini-server' | 'contextual-fallback';
  modelUsed: string;
}

const GEMINI_SYSTEM_PROMPT = `You are an expert Government Innovation & Procurement Advisor for India's National PRAGATI Portal (Public Realm Action for GFR-compliant Acceleration of Technological Innovation).
Your role is to translate unstructured, informal government department complaints or problem descriptions into structured, outcome-oriented Requests for Proposals (RFPs) tailored for Indian deep-tech startups.

Given an unstructured problem statement, output ONLY a valid JSON object strictly matching this schema:
{
  "title": "Clear, formal, outcome-focused challenge title",
  "department": "Appropriate Indian Department/Ministry (e.g., Public Works Department (PWD), Department of Agriculture, Ministry of Health & Family Welfare, Municipal Corporation, Ministry of Power, Jal Shakti)",
  "category": "Domain Category (e.g., Smart Infrastructure, Agritech & Food Security, Healthcare, Clean Energy, Urban Mobility, Water Management, Cyber Security)",
  "techArea": ["Array", "of", "3-5", "deep-tech", "keywords", "e.g., Computer Vision, Edge AI, GIS Mapping, IoT, Robotics"],
  "budgetRange": "Realistic pilot budget in INR (e.g., ₹35 - 50 Lakhs)",
  "pilotDuration": "Pilot duration (e.g., 90 Days or 120 Days)",
  "currentSituation": "Detailed description of the current manual or deficient situation and operational bottleneck",
  "problemDescription": "Technical problem framing focusing on the core challenge to be solved",
  "targetOutcome": "Specific, measurable, outcome-based objective across operations",
  "suggestedKpis": [
    { "name": "KPI Name", "target": "e.g., ≥ 90%", "unit": "%" },
    { "name": "KPI Name", "target": "e.g., ≤ 5 seconds", "unit": "sec" },
    { "name": "KPI Name", "target": "e.g., ≥ 80%", "unit": "%" }
  ],
  "pilotScope": "Concise definition of a controlled 90-day sandbox pilot testing scope with specific equipment and geographic bounds",
  "eligibilityRequirements": [
    "DPIIT Registered Startup (Age < 7 years)",
    "Proprietary deep-tech IP or demonstrable capability",
    "Field testing feasibility in target Indian operating conditions"
  ],
  "evaluationCriteria": [
    { "name": "Technical Capability & Core Innovation", "weight": 25 },
    { "name": "Field Feasibility & Indian Operating Robustness", "weight": 20 },
    { "name": "Scalability & State IT/GIS Integration", "weight": 20 },
    { "name": "Cost Effectiveness per Unit Outcome", "weight": 15 },
    { "name": "Public Impact & Citizen Benefit", "weight": 20 }
  ]
}`;

function cleanJsonText(raw: string): string {
  let text = raw.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return text.trim();
}

/**
 * Call Google Gemini Generative Language REST API directly
 */
async function callGeminiDirectly(prompt: string, apiKey: string, model = 'gemini-3.6-flash'): Promise<StructuredRFP> {
  const candidateModels = Array.from(new Set([model, 'gemini-3.6-flash', 'gemini-3.5-flash']));
  let lastError: any = null;

  for (const m of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
    
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Formulate an official government innovation RFP for the following department problem:\n\n"${prompt.trim()}"` }]
        }
      ],
      systemInstruction: {
        parts: [{ text: GEMINI_SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        topP: 0.9
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`Gemini direct API error (${m}) [${response.status}]: ${errorText.substring(0, 200)}`);
        if (response.status === 503 || response.status === 404) {
          continue;
        }
        throw lastError;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini response candidate text was empty');
      }

      const cleaned = cleanJsonText(text);
      return JSON.parse(cleaned) as StructuredRFP;
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('Direct Gemini API failed across candidate models');
}

/**
 * Main AI Challenge generation service
 * 1. Tries Backend API (/api/ai/challenges/generate)
 * 2. Tries Direct Gemini 3.6 Flash client-side API
 * 3. Contextual template fallback
 */
export async function generateChallengeWithGemini(prompt: string): Promise<GeminiGenerationResult> {
  const trimmed = prompt.trim();
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const model = (import.meta.env.VITE_AI_MODEL || 'gemini-3.6-flash').trim();

  // 1. Try Backend API first
  try {
    const res = await fetch('/api/ai/challenges/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.generated) {
        return {
          generated: json.generated,
          source: 'gemini-server',
          modelUsed: json.model || model
        };
      }
    }
  } catch (backendErr) {
    console.warn('Backend AI route unavailable, calling Gemini client-side directly:', backendErr);
  }

  // 2. Try Direct Google Gemini API
  if (apiKey && apiKey.length > 10 && !apiKey.includes('your_')) {
    try {
      const generated = await callGeminiDirectly(trimmed, apiKey, model);
      return {
        generated,
        source: 'gemini-live',
        modelUsed: model
      };
    } catch (geminiErr) {
      console.warn('Direct Gemini API call encountered error, falling back to contextual generator:', geminiErr);
    }
  }

  // 3. Intelligent Contextual Matching Engine
  const lower = trimmed.toLowerCase();
  let matched: StructuredRFP;

  if (
    lower.includes('traffic') || 
    lower.includes('signal') || 
    lower.includes('congestion') || 
    lower.includes('intersection') || 
    lower.includes('vehicle') ||
    lower.includes('urban mobility') ||
    lower.includes('transport')
  ) {
    const trafficTemplate = AI_CHALLENGE_TEMPLATES.find(t => 
      t.prompt.toLowerCase().includes('traffic') || t.generated.category === 'Urban Mobility'
    );
    matched = (trafficTemplate ? trafficTemplate.generated : AI_CHALLENGE_TEMPLATES[0].generated) as StructuredRFP;
  } else if (
    lower.includes('crop') || 
    lower.includes('pest') || 
    lower.includes('farm') || 
    lower.includes('agri') ||
    lower.includes('harvest')
  ) {
    const agriTemplate = AI_CHALLENGE_TEMPLATES.find(t => 
      t.prompt.toLowerCase().includes('pest') || t.generated.category === 'Agritech & Food Security'
    );
    matched = (agriTemplate ? agriTemplate.generated : AI_CHALLENGE_TEMPLATES[1].generated) as StructuredRFP;
  } else if (
    lower.includes('water') || 
    lower.includes('pipeline') || 
    lower.includes('leak') || 
    lower.includes('jal') ||
    lower.includes('sewage')
  ) {
    const waterTemplate = AI_CHALLENGE_TEMPLATES.find(t => 
      t.prompt.toLowerCase().includes('water') || t.generated.category === 'Water Management'
    );
    matched = (waterTemplate ? waterTemplate.generated : AI_CHALLENGE_TEMPLATES[0].generated) as StructuredRFP;
  } else if (
    lower.includes('pothole') || 
    lower.includes('road') || 
    lower.includes('highway') || 
    lower.includes('pavement') ||
    lower.includes('asphalt')
  ) {
    matched = AI_CHALLENGE_TEMPLATES[0].generated as StructuredRFP;
  } else {
    // Dynamic synthesis based on user's exact problem
    matched = {
      title: `AI-Powered Innovation Challenge: ${trimmed.slice(0, 60)}`,
      department: 'Concerned State Department / Municipal Authority',
      category: 'General Public Innovation',
      techArea: ['Edge AI', 'IoT Sensing', 'Data Analytics', 'Computer Vision'],
      budgetRange: '₹35 - 50 Lakhs',
      pilotDuration: '90 Days',
      currentSituation: `Current operations for: "${trimmed}" lack automated real-time intelligence and rely on legacy manual workflows.`,
      problemDescription: trimmed,
      targetOutcome: `Deploy a verifiable deep-tech pilot to solve: "${trimmed}" with measurable citizen impact and operational efficiency.`,
      suggestedKpis: [
        { name: 'Core Operational Success Rate', target: '≥ 90%', unit: '%' },
        { name: 'Turnaround Latency Improvement', target: '≥ 50%', unit: '%' },
        { name: 'System Accuracy', target: '≥ 92%', unit: '%' }
      ],
      pilotScope: 'Controlled 90-day sandbox pilot deployment with measurable performance benchmarks across designated municipal zones.',
      eligibilityRequirements: [
        'DPIIT Registered Startup (Age < 7 years)',
        'Demonstrable deep-tech IP or deployed proof-of-concept',
        'Field operational compliance for Indian public sector deployments'
      ],
      evaluationCriteria: [
        { name: 'Technical Capability & Core Innovation', weight: 25 },
        { name: 'Field Feasibility & Operating Robustness', weight: 20 },
        { name: 'Scalability & State IT/GIS Integration', weight: 20 },
        { name: 'Cost Effectiveness per Unit Outcome', weight: 15 },
        { name: 'Public Impact & Citizen Benefit', weight: 20 }
      ]
    };
  }

  // Customize title and problem description with user's input if not synthesizing
  const contextualized: StructuredRFP = {
    ...matched,
    problemDescription: trimmed.length > 20 ? trimmed : matched.problemDescription
  };

  return {
    generated: contextualized,
    source: 'contextual-fallback',
    modelUsed: 'Contextual Engine (Offline Fallback)'
  };
}
