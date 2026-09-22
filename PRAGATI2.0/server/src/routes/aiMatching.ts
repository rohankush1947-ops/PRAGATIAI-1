import { Router } from 'express';
import { getDb } from '../db.js';
import { evaluateChallengeMatches } from '../services/matchingEngine.js';
import { executeAIMatching } from '../services/ai/matchingAI.js';

const router = Router();

// POST /api/ai/matching
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { challengeId, challenge: customChallenge, weights, filters } = req.body || {};

    let targetChallenge = null;

    if (challengeId) {
      const cleanId = String(challengeId).trim().toUpperCase();
      targetChallenge = db.challenges.find((c: any) => 
        c && c.id && String(c.id).trim().toUpperCase() === cleanId
      );
      if (!targetChallenge) {
        return res.status(404).json({
          error: `Challenge with ID "${challengeId}" not found in system repository.`
        });
      }
    } else if (customChallenge && customChallenge.title) {
      targetChallenge = {
        id: customChallenge.id || `custom-${Date.now()}`,
        title: customChallenge.title,
        department: customChallenge.department || 'Government Department',
        category: customChallenge.category || 'General Innovation',
        techArea: customChallenge.techArea || [],
        requiredCapabilities: customChallenge.requiredCapabilities || [],
        eligibility: customChallenge.eligibility || {},
        constraints: customChallenge.constraints || []
      };
    } else {
      // Default to first challenge if none specified
      targetChallenge = db.challenges[0];
      if (!targetChallenge) {
        return res.status(400).json({
          error: 'No challenge provided and no challenges exist in database.'
        });
      }
    }

    const availableStartups = db.startups || [];
    if (availableStartups.length === 0) {
      return res.status(200).json({
        challengeId: targetChallenge.id,
        challengeTitle: targetChallenge.title,
        department: targetChallenge.department,
        category: targetChallenge.category,
        totalEvaluated: 0,
        weightsUsed: weights || {},
        matches: [],
        mode: 'fallback',
        modelUsed: 'None (No startups available)'
      });
    }

    // Step 1: Attempt Real AI-Assisted Matching
    let result = await executeAIMatching(targetChallenge, availableStartups, weights, filters);

    // Step 2: Graceful Fallback to Deterministic Engine if AI is unconfigured or unavailable
    if (!result) {
      const fallbackResult = evaluateChallengeMatches(targetChallenge, availableStartups, weights, filters);
      result = {
        ...fallbackResult,
        mode: 'fallback',
        modelUsed: 'Rule-Based Deterministic Engine (Statutory Compliance Fallback)',
        timestamp: new Date().toISOString()
      } as any;
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error executing AI Matching engine:', err);
    return res.status(500).json({
      error: 'Failed to evaluate challenge matches',
      details: err?.message || String(err)
    });
  }
});

// GET /api/ai/matching (Convenience endpoint for testing & direct queries)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const challengeId = req.query.challengeId as string | undefined;

    let targetChallenge = null;
    if (challengeId) {
      const cleanId = String(challengeId).trim().toUpperCase();
      targetChallenge = db.challenges.find((c: any) => 
        c && c.id && String(c.id).trim().toUpperCase() === cleanId
      );
      if (!targetChallenge) {
        return res.status(404).json({
          error: `Challenge with ID "${challengeId}" not found.`
        });
      }
    } else {
      targetChallenge = db.challenges[0];
    }

    if (!targetChallenge) {
      return res.status(400).json({ error: 'No challenges found.' });
    }

    const availableStartups = db.startups || [];
    let result = await executeAIMatching(targetChallenge, availableStartups);

    if (!result) {
      const fallbackResult = evaluateChallengeMatches(targetChallenge, availableStartups);
      result = {
        ...fallbackResult,
        mode: 'fallback',
        modelUsed: 'Rule-Based Deterministic Engine (Statutory Compliance Fallback)',
        timestamp: new Date().toISOString()
      } as any;
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error executing AI Matching engine:', err);
    return res.status(500).json({
      error: 'Failed to evaluate challenge matches',
      details: err?.message || String(err)
    });
  }
});

export default router;

