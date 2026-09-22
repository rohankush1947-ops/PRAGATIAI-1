import { getDb } from '../src/db.js';
import { evaluateChallengeMatches } from '../src/services/matchingEngine.js';

const db = getDb();
console.log('--- TESTING DATA-DRIVEN MATCHING ENGINE ---');
console.log(`Loaded ${db.challenges.length} challenges, ${db.startups.length} startups.`);

// TEST 1: Baseline Evaluation for all 4 challenges
for (const ch of db.challenges) {
  const result = evaluateChallengeMatches(ch, db.startups);
  console.log(`\n======================================================`);
  console.log(`CHALLENGE: ${ch.title}`);
  console.log(`Department: ${ch.department} | Category: ${ch.category}`);
  console.log(`------------------------------------------------------`);
  result.matches.forEach(m => {
    console.log(`Rank #${m.rank}: ${m.startupName.padEnd(25)} | Overall: ${m.overallScore}% | Tech: ${m.technologyMatch}% | Domain: ${m.domainMatch}% | Exp: ${m.experienceMatch}% | Readiness: ${m.pilotReadiness}% | Tier: ${m.confidenceTier}`);
    console.log(`   Rationale: ${m.explanation.substring(0, 110)}...`);
  });
}

// TEST 2: Sensitivity to Custom Weights
console.log(`\n======================================================`);
console.log(`TEST 2: SENSITIVITY TO CUSTOM WEIGHTS (PWD Challenge)`);
const pwdChallenge = db.challenges[0];
const heavyReadinessWeights = {
  technology: 0.10,
  domain: 0.10,
  experience: 0.10,
  pilotReadiness: 0.60,
  scalability: 0.05,
  eligibility: 0.05
};
const customWeightResult = evaluateChallengeMatches(pwdChallenge, db.startups, heavyReadinessWeights);
console.log(`Result with 60% Readiness Weight:`);
customWeightResult.matches.slice(0, 3).forEach(m => {
  console.log(`  Rank #${m.rank}: ${m.startupName} -> Overall Score: ${m.overallScore}% (Readiness: ${m.pilotReadiness}%)`);
});

// TEST 3: Dynamic Sensitivity to Data Changes (Modify Startup in-flight)
console.log(`\n======================================================`);
console.log(`TEST 3: DYNAMIC RESPONSE TO MODIFIED STARTUP DATA`);
const modifiedStartups = JSON.parse(JSON.stringify(db.startups));
const roadVision = modifiedStartups.find((s: any) => s.id === 'startup-roadvision');
console.log(`Before modification: RoadVision AI pilotReadiness = ${roadVision.pilotReadiness}, completedPilotsCount = ${roadVision.completedPilotsCount}`);

// Downgrade RoadVision
roadVision.pilotReadiness = 'Low';
roadVision.completedPilotsCount = 0;
roadVision.techStack = ['Basic Python Scripting'];

const afterModResult = evaluateChallengeMatches(pwdChallenge, modifiedStartups);
const downgradedRoadVision = afterModResult.matches.find(m => m.startupId === 'startup-roadvision');
console.log(`After downgrade:`);
console.log(`  RoadVision AI new overall score: ${downgradedRoadVision?.overallScore}% (Tech: ${downgradedRoadVision?.technologyMatch}%, Exp: ${downgradedRoadVision?.experienceMatch}%, Readiness: ${downgradedRoadVision?.pilotReadiness}%)`);
console.log(`  RoadVision AI new rank: #${downgradedRoadVision?.rank} of ${afterModResult.matches.length}`);
console.log(`  Updated Explanation: ${downgradedRoadVision?.explanation}`);

console.log(`\n--- ALL TESTS COMPLETED SUCCESSFULLY ---`);
