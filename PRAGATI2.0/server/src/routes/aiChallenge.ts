import { Router } from 'express';
import { getAIProvider } from '../services/ai/provider.js';

const router = Router();

const CHALLENGE_SYSTEM_PROMPT = `You are an expert Government Innovation & Procurement Advisor for India's National PRAGATI Portal (Public Realm Action for GFR-compliant Acceleration of Technological Innovation).
Your role is to translate unstructured, informal government department complaints or problem descriptions into structured, outcome-oriented Requests for Proposals (RFPs) tailored for Indian deep-tech startups.

Given an unstructured problem statement, output ONLY a valid JSON object strictly matching this schema:
{
  "title": "Clear, formal, outcome-focused challenge title",
  "department": "Appropriate Indian Department/Ministry (e.g., Public Works Department (PWD), Department of Agriculture, Ministry of Health & Family Welfare, Municipal Corporation, Ministry of Power)",
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

router.post('/generate', async (req, res) => {
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'A valid text prompt is required to generate a challenge RFP.' });
  }

  const provider = getAIProvider();
  if (!provider) {
    return res.status(503).json({
      error: 'AI Provider is not configured on the server. Please check AI_API_KEY.',
      mode: 'unconfigured'
    });
  }

  try {
    const userPrompt = `Formulate an official government innovation RFP for the following department problem:\n\n"${prompt.trim()}"`;
    const result = await provider.generateStructuredCompletion<any>(userPrompt, CHALLENGE_SYSTEM_PROMPT);

    return res.json({
      success: true,
      provider: provider.name,
      model: provider.model,
      generated: result
    });
  } catch (error: any) {
    console.error('[AI Challenge Route Error]:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate challenge with AI model.',
      mode: 'error'
    });
  }
});

export default router;
