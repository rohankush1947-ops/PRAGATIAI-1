import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'PRAGATI2.0/.env') });

import { getDb } from '../src/db.js';
import { executeAIMatching } from '../src/services/ai/matchingAI.js';

async function test() {
  const db = getDb();
  const challenge = {
    id: 'ch-traffic-01',
    title: 'Smart traffic management using AI sensors for urban congestion',
    description: 'Real-time adaptive traffic signal control and vehicle queue monitoring using edge AI cameras, LiDAR/radar sensors, and SCATS/ITMS integration.',
    department: 'Urban Development & Traffic Police',
    category: 'urban_mobility',
    requiredCapabilities: [
      'Traffic signal automation',
      'Vehicle queue length estimation',
      'SCATS/ITMS protocol integration',
      'Edge vision sensors'
    ],
    technicalConstraints: [
      'Real-time latency under 100ms',
      'Integration with legacy traffic lights'
    ]
  };

  console.log('Testing live executeAIMatching for:', challenge.title);
  const result = await executeAIMatching(challenge as any, db.startups);
  if (!result) {
    console.log('Result is null (fell back or unconfigured)');
    return;
  }

  console.log('\n================ MATCHING RESULTS ================');
  console.log('Mode:', (result as any).mode);
  console.log('Model Used:', (result as any).modelUsed);
  console.log('Total Evaluated:', result.totalEvaluated);
  console.log('\nRanked Startups:');
  for (const m of result.matches) {
    console.log(`\n#${m.rank} [${m.overallScore}%] [${m.confidenceTier}] - ${m.startupName} (Domain: ${m.domain})`);
    console.log(`   Domain: ${m.domainMatch}% | Tech: ${m.technologyMatch}% | Pilot Readiness: ${m.pilotReadiness}% | Eligibility: ${m.eligibilityMatch}%`);
    console.log(`   Explanation: ${m.explanation}`);
    console.log(`   Risks/Gaps: ${m.riskFactors.join('; ')}`);
  }
}

test().catch(console.error);
