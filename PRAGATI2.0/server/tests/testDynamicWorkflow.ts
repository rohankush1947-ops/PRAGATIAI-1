import { getDb, saveDb } from '../src/db.js';
import { evaluateChallengeMatches } from '../src/services/matchingEngine.js';

console.log('===============================================================');
console.log('PRAGATIAI: END-TO-END DYNAMIC WORKFLOW & PERSISTENCE VALIDATION');
console.log('===============================================================\n');

// 1. Initial State Snapshot
const initialDb = getDb();
const initialChallengeCount = initialDb.challenges.length;
const initialStartupCount = initialDb.startups.length;
console.log(`[Step 1] Baseline Database State:`);
console.log(`   - Challenges in DB: ${initialChallengeCount}`);
console.log(`   - Startups in DB:   ${initialStartupCount}`);

// 2. Dynamically Create New Challenge
const newChallenge = {
  id: 'ch-test-solar-007',
  title: 'Solar Photovoltaic Defect & Hotspot Detection via UAV Drone AI',
  department: 'Ministry of New and Renewable Energy',
  category: 'Clean Energy & Smart Grid',
  problemStatement: 'Manual solar farm inspection across 500MW plants takes weeks. Need autonomous UAV drone inspections with radiometric thermal imaging and edge AI to detect micro-cracks, hotspots, and bypass diode failures in real time.',
  techArea: ['Computer Vision', 'Thermal Imaging', 'Edge AI', 'Drone Telemetry', 'PyTorch'],
  requiredCapabilities: [
    'UAV aerial inspection',
    'Photovoltaic hotspot classification',
    'Real-time telemetry stream',
    'Automated IEC 62446 compliance reporting'
  ],
  budget: '₹45,00,000',
  deadline: '2026-11-30',
  status: 'Open' as const,
  eligibility: {
    minStage: 'Early Stage',
    dpiitRequired: true,
    minPilotsCompleted: 1
  }
};

// 3. Dynamically Create New Specialized Startup
const newStartup = {
  id: 'startup-test-helioscan',
  name: 'HelioScan Energy AI',
  tagline: 'Autonomous UAV Thermography and Predictive Diagnostics for Solar Utility Farms',
  domain: 'Clean Energy & Smart Grid',
  techStack: ['Computer Vision', 'Thermal Imaging', 'Edge AI', 'Drone Telemetry', 'PyTorch', 'NVIDIA Jetson'],
  coreCapabilities: [
    'UAV aerial inspection',
    'Photovoltaic hotspot classification',
    'Real-time telemetry stream',
    'Automated IEC 62446 compliance reporting',
    'Thermal anomaly segmentation'
  ],
  stage: 'Growth',
  pilotReadiness: 'High' as const,
  completedPilotsCount: 4,
  dpiitRegistered: true,
  incorporationYear: 2022,
  teamSize: 18,
  website: 'https://helioscan-test.ai',
  contactEmail: 'founders@helioscan-test.ai',
  location: 'Hyderabad, Telangana'
};

console.log(`\n[Step 2] Dynamically injecting new Challenge: "${newChallenge.title}"...`);
initialDb.challenges.push(newChallenge);

console.log(`[Step 3] Dynamically registering new Startup: "${newStartup.name}"...`);
initialDb.startups.push(newStartup as any);

// Save to disk to verify persistence
saveDb(initialDb);

// Re-read from disk to confirm persistent storage
const refreshedDb = getDb();
console.log(`[Step 4] Verified Disk Persistence:`);
console.log(`   - Challenges after insert: ${refreshedDb.challenges.length} (Expected: ${initialChallengeCount + 1})`);
console.log(`   - Startups after insert:   ${refreshedDb.startups.length} (Expected: ${initialStartupCount + 1})`);

if (refreshedDb.challenges.length !== initialChallengeCount + 1 || refreshedDb.startups.length !== initialStartupCount + 1) {
  throw new Error('Persistence validation failed: Item counts do not match expected increments.');
}

// 5. Run Dynamic Matching Engine
console.log(`\n[Step 5] Running Dynamic Matching Engine for "${newChallenge.title}"...`);
const targetChallenge = refreshedDb.challenges.find(c => c.id === newChallenge.id)!;
const evaluation = evaluateChallengeMatches(targetChallenge, refreshedDb.startups as any);

console.log(`\n----------------- DYNAMIC MATCHING RESULTS -----------------`);
evaluation.matches.forEach(m => {
  console.log(`Rank #${m.rank}: ${m.startupName.padEnd(25)} | Score: ${m.overallScore}% | Tech: ${m.technologyMatch}% | Domain: ${m.domainMatch}% | Tier: ${m.confidenceTier}`);
});
console.log(`------------------------------------------------------------\n`);

// 6. Assertions
console.log(`[Step 6] Verifying Matching Authenticity Assertions:`);
const topMatch = evaluation.matches[0];
console.log(`   1. Top Rank Winner: "${topMatch.startupName}" (Score: ${topMatch.overallScore}%)`);
if (topMatch.startupId !== 'startup-test-helioscan') {
  throw new Error(`Expected HelioScan Energy AI to be Rank #1, but got ${topMatch.startupName}`);
}
console.log('      ✔ ASSERTION PASSED: HelioScan dynamically won Rank #1 for Solar Challenge!');

if (topMatch.overallScore < 85) {
  throw new Error(`Expected top match score >= 85%, received ${topMatch.overallScore}%`);
}
console.log(`      ✔ ASSERTION PASSED: Overall Match Score is ${topMatch.overallScore}% (High Quality)`);

if (topMatch.technologyMatch < 90 || topMatch.domainMatch < 90) {
  throw new Error(`Expected high tech and domain match scores, got Tech: ${topMatch.technologyMatch}%, Domain: ${topMatch.domainMatch}%`);
}
console.log(`      ✔ ASSERTION PASSED: Domain (${topMatch.domainMatch}%) & Tech (${topMatch.technologyMatch}%) alignment correctly identified`);

// Verify other non-solar startups are ranked lower
const farmVision = evaluation.matches.find(m => m.startupId === 'startup-farmvision');
const healthQueue = evaluation.matches.find(m => m.startupId === 'startup-healthqueue');
console.log(`   2. Non-Solar Startups Correctly Demoted:`);
console.log(`      - FarmVision: ${farmVision?.overallScore}% (Rank #${farmVision?.rank})`);
console.log(`      - HealthQueue: ${healthQueue?.overallScore}% (Rank #${healthQueue?.rank})`);
if (!farmVision || !healthQueue || topMatch.overallScore <= farmVision.overallScore || topMatch.overallScore <= healthQueue.overallScore) {
  throw new Error('Ranking separation failure between relevant and non-relevant startups');
}
console.log('      ✔ ASSERTION PASSED: Strict score separation between relevant and unrelated sectors!');

// 7. Test Shortlisting Flow
console.log(`\n[Step 7] Simulating Government Shortlisting Action:`);
const newApplication = {
  id: `app-test-${Date.now()}`,
  challengeId: newChallenge.id,
  startupId: topMatch.startupId,
  startupName: topMatch.startupName,
  appliedDate: new Date().toISOString().split('T')[0],
  status: 'Shortlisted',
  matchScore: topMatch.overallScore,
  stage: 'Pilot Pending',
  shortlistedAt: new Date().toISOString()
};

if (!refreshedDb.applications) {
  refreshedDb.applications = [];
}
refreshedDb.applications.push(newApplication as any);
saveDb(refreshedDb);
console.log(`   ✔ Shortlisted "${topMatch.startupName}" for Challenge "${newChallenge.title}" with application ID ${newApplication.id}`);

// 8. Clean up Test Records
console.log(`\n[Step 8] Cleaning up transient test records from database...`);
const cleanDb = getDb();
cleanDb.challenges = cleanDb.challenges.filter(c => c.id !== newChallenge.id);
cleanDb.startups = cleanDb.startups.filter(s => s.id !== newStartup.id);
if (cleanDb.applications) {
  cleanDb.applications = cleanDb.applications.filter((a: any) => a.id !== newApplication.id);
}
saveDb(cleanDb);

const finalDb = getDb();
console.log(`   - Challenges in DB after cleanup: ${finalDb.challenges.length} (Restored: ${finalDb.challenges.length === initialChallengeCount})`);
console.log(`   - Startups in DB after cleanup:   ${finalDb.startups.length} (Restored: ${finalDb.startups.length === initialStartupCount})`);

console.log('\n===============================================================');
console.log('🎉 ALL END-TO-END DYNAMIC WORKFLOW TESTS PASSED PERFECTLY!');
console.log('===============================================================\n');
