import { getDb, saveDb } from '../src/db.js';
import { evaluateChallengeMatches } from '../src/services/matchingEngine.js';

console.log('================================================================');
console.log('PRAGATIAI: GOVERNMENT CHALLENGE REGISTRATION & MATCHING TEST');
console.log('================================================================\n');

// 1. Initial State
const dbInitial = getDb();
const initialCount = dbInitial.challenges.length;
console.log(`[Step 1] Initial challenges in database: ${initialCount}`);

// Helper: Canonical ID generator matching server/src/routes/challenges.ts
function generateUniqueChallengeId(existingChallenges: any[]): string {
  let maxNum = 0;
  for (const c of existingChallenges) {
    if (!c || !c.id) continue;
    const matches = String(c.id).match(/\d+/g);
    if (matches) {
      for (const m of matches) {
        const val = parseInt(m, 10);
        if (val > maxNum && val < 10000) maxNum = val;
      }
    }
  }

  let next = maxNum + 1;
  while (true) {
    const candidateId = `CH-${String(next).padStart(3, '0')}`;
    const exists = existingChallenges.some(
      c => c && c.id && c.id.toUpperCase() === candidateId.toUpperCase()
    );
    if (!exists) {
      return candidateId;
    }
    next++;
  }
}

// 2. Register Challenge 1: AI-Based Municipal Waste Classification
const id1 = generateUniqueChallengeId(dbInitial.challenges);
const challenge1 = {
  id: id1,
  title: 'AI-Based Municipal Waste Classification',
  department: 'Municipal Corporation',
  category: 'Urban Development',
  sector: 'Urban Development',
  problemDescription: 'Develop an AI system that automatically classifies municipal waste using computer vision and supports efficient waste segregation.',
  problemStatement: 'Develop an AI system that automatically classifies municipal waste using computer vision and supports efficient waste segregation.',
  techArea: ['Computer Vision', 'Deep Learning', 'Image Classification'],
  requiredTechnologies: ['Computer Vision', 'Deep Learning', 'Image Classification'],
  budgetRange: '₹25 Lakhs',
  budget: '₹25 Lakhs',
  pilotDuration: '90 Days',
  timeline: '90 Days',
  status: 'Published' as const,
  createdAt: new Date().toISOString().split('T')[0],
  applicationsCount: 0,
  kpis: [
    { name: 'Segregation Accuracy', target: '≥ 92%', unit: '%' },
    { name: 'Classification Speed', target: '≤ 2 seconds', unit: 'sec' }
  ],
  constraints: [
    'Must handle mixed wet and dry municipal waste streams in open conveyor environments'
  ]
};

console.log(`\n[Step 2] Registering Challenge 1: "${challenge1.title}"...`);
dbInitial.challenges.unshift(challenge1);
saveDb(dbInitial);

// 3. Register Challenge 2: AI-Based Hospital OPD Queue Optimization
const dbAfter1 = getDb();
const id2 = generateUniqueChallengeId(dbAfter1.challenges);
const challenge2 = {
  id: id2,
  title: 'AI-Based Hospital OPD Queue Optimization',
  department: 'Health & Family Welfare',
  category: 'Healthcare',
  sector: 'Healthcare',
  problemDescription: 'Develop an AI-powered OPD queue orchestration and predictive triage engine for government district hospitals.',
  problemStatement: 'Develop an AI-powered OPD queue orchestration and predictive triage engine for government district hospitals.',
  techArea: ['Machine Learning', 'Optimization', 'Healthcare Analytics', 'ABDM'],
  requiredTechnologies: ['Machine Learning', 'Optimization', 'Healthcare Analytics'],
  budgetRange: '₹30 Lakhs',
  budget: '₹30 Lakhs',
  pilotDuration: '60 Days',
  timeline: '60 Days',
  status: 'Published' as const,
  createdAt: new Date().toISOString().split('T')[0],
  applicationsCount: 0,
  kpis: [
    { name: 'Patient Wait Time Reduction', target: '≥ 45%', unit: '%' },
    { name: 'Doctor Consultation Load Balancing', target: '≥ 90%', unit: '%' }
  ],
  constraints: [
    'Seamless interoperability with Ayushman Bharat Digital Mission (ABDM) and FHIR standards'
  ]
};

console.log(`[Step 3] Registering Challenge 2: "${challenge2.title}"...`);
dbAfter1.challenges.unshift(challenge2);
saveDb(dbAfter1);

// 4. Verify Disk Persistence & Unique IDs
const dbPersisted = getDb();
console.log(`\n[Step 4] Verifying Persistence from Disk:`);
console.log(`   - Total challenges in DB: ${dbPersisted.challenges.length} (Expected: ${initialCount + 2})`);
console.log(`   - Challenge 1 ID: ${challenge1.id}`);
console.log(`   - Challenge 2 ID: ${challenge2.id}`);

if (challenge1.id === challenge2.id) {
  throw new Error('Challenge IDs must be unique!');
}
if (!challenge1.id.startsWith('CH-') || !challenge2.id.startsWith('CH-')) {
  throw new Error('Challenge IDs should follow canonical format (CH-xxx)');
}
console.log('   ✔ PASS: Both challenges received distinct, unique canonical IDs.');

// 5. Test AI Matching for Challenge 1 (Waste Classification)
console.log(`\n[Step 5] Testing AI Matching for Challenge 1: "${challenge1.title}" (${challenge1.id})`);
const matchResult1 = evaluateChallengeMatches(challenge1, dbPersisted.startups);
console.log(`   Top 3 Startups for "${challenge1.title}":`);
matchResult1.matches.slice(0, 3).forEach(m => {
  console.log(`   #${m.rank}: ${m.startupName.padEnd(25)} | Overall: ${m.overallScore}% | Tech: ${m.technologyMatch}% | Domain: ${m.domainMatch}% | Tier: ${m.confidenceTier}`);
});

if (matchResult1.matches.length === 0) {
  throw new Error('Matching engine returned no matches for Challenge 1');
}

// 6. Test AI Matching for Challenge 2 (Hospital OPD Queue Optimization)
console.log(`\n[Step 6] Testing AI Matching for Challenge 2: "${challenge2.title}" (${challenge2.id})`);
const matchResult2 = evaluateChallengeMatches(challenge2, dbPersisted.startups);
console.log(`   Top 3 Startups for "${challenge2.title}":`);
matchResult2.matches.slice(0, 3).forEach(m => {
  console.log(`   #${m.rank}: ${m.startupName.padEnd(25)} | Overall: ${m.overallScore}% | Tech: ${m.technologyMatch}% | Domain: ${m.domainMatch}% | Tier: ${m.confidenceTier}`);
});

const topForHealth = matchResult2.matches[0];
if (topForHealth.startupId !== 'startup-healthqueue') {
  throw new Error(`Expected HealthQueue AI to win Hospital OPD Challenge, but received ${topForHealth.startupName}`);
}
console.log(`   ✔ PASS: HealthQueue AI correctly won Rank #1 for Hospital OPD Challenge (${topForHealth.overallScore}%)!`);

// 7. Verify Non-Confusion Assertion
if (matchResult1.matches[0].startupId === matchResult2.matches[0].startupId) {
  throw new Error('System confused Waste Classification with Hospital OPD: same top startup returned!');
}
console.log('   ✔ PASS: System cleanly distinguishes between Waste Classification and Hospital OPD challenges.');

// 8. Test Shortlisting & Application Flow
console.log(`\n[Step 7] Testing Shortlisting and Application State:`);
const chosenStartup = matchResult2.matches[0]; // HealthQueue AI
const appRecord = {
  id: `app-test-${Date.now()}`,
  challengeId: challenge2.id,
  challengeTitle: challenge2.title,
  department: challenge2.department,
  startupId: chosenStartup.startupId,
  startupName: chosenStartup.startupName,
  submissionDate: new Date().toISOString().split('T')[0],
  status: 'Shortlisted' as const,
  technicalProposal: `Technical proposal submitted by ${chosenStartup.startupName} for ${challenge2.title}.`,
  budgetQuoted: challenge2.budgetRange,
  pilotPlan: `${challenge2.pilotDuration} pilot implementation.`
};

if (!dbPersisted.applications) dbPersisted.applications = [];
dbPersisted.applications.unshift(appRecord as any);
saveDb(dbPersisted);

const dbWithApp = getDb();
const foundApp = dbWithApp.applications.find((a: any) => a.id === appRecord.id);
if (!foundApp || foundApp.challengeId !== challenge2.id || foundApp.startupId !== chosenStartup.startupId) {
  throw new Error('Application does not preserve exact challengeId and startupId!');
}
console.log(`   ✔ PASS: Application successfully links Challenge ID "${foundApp.challengeId}" with Startup ID "${foundApp.startupId}" ("${foundApp.startupName}").`);

// 9. Clean up Transient Test Records
console.log(`\n[Step 8] Cleaning up transient test challenges from database...`);
const dbClean = getDb();
dbClean.challenges = dbClean.challenges.filter(c => c.id !== challenge1.id && c.id !== challenge2.id);
dbClean.applications = dbClean.applications.filter((a: any) => a.id !== appRecord.id);
saveDb(dbClean);

const dbRestored = getDb();
console.log(`   - Challenges in DB after cleanup: ${dbRestored.challenges.length} (Restored to initial: ${dbRestored.challenges.length === initialCount})`);

console.log('\n================================================================');
console.log('🎉 ALL GOVERNMENT CHALLENGE REGISTRATION & MATCH TESTS PASSED!');
console.log('================================================================\n');
