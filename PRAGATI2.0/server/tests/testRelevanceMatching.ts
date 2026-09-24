import { initDb } from '../src/db.js';
import { evaluateChallengeMatches, checkStartupRelevance } from '../src/services/matchingEngine.js';

console.log('====================================================');
console.log('PRAGATIAI: TESTING AI MATCHING HARD RELEVANCE GATING');
console.log('====================================================\n');

const db = initDb();
const startups = db.startups;
const challenges = db.challenges;

console.log(`Loaded ${startups.length} startups and ${challenges.length} challenges from DB.\n`);

let passedTests = 0;
let totalTests = 5;

// CASE 1: Urban Development + Urban Traffic Management
console.log('--- TEST CASE 1: Urban Development + Urban Traffic Management ---');
const trafficChallenge = challenges.find((c: any) => 
  c.id === 'ch-traffic-05' || c.title.toLowerCase().includes('traffic')
);

if (!trafficChallenge) {
  console.error('FAIL: Could not find Urban Traffic challenge in database.');
} else {
  console.log(`Evaluating Challenge: "${trafficChallenge.title}" (${trafficChallenge.department})`);
  const result1 = evaluateChallengeMatches(trafficChallenge, startups);
  
  const recommendedNames = result1.matches.map(m => m.startupName);
  const excludedNames = (result1.excludedMatches || []).map(m => m.startupName);

  console.log('Recommended Startups:', recommendedNames);
  console.log('Excluded Startups:', excludedNames);

  const hasTrafficPulse = recommendedNames.includes('TrafficPulse AI');
  const hasSmartMobility = recommendedNames.includes('Smart Mobility AI');
  const hidesFarmVision = !recommendedNames.includes('FarmVision Technologies');
  const hidesHealthQueue = !recommendedNames.includes('HealthQueue AI');
  const hidesEduTech = !recommendedNames.includes('EduTech Innovations');

  if (hasTrafficPulse && (hasSmartMobility || recommendedNames.includes('RoadVision AI')) && hidesFarmVision && hidesHealthQueue && hidesEduTech) {
    console.log('✓ PASS: Case 1 passed! Traffic startups SHOW, Agriculture/Healthcare/Education HIDE.');
    passedTests++;
  } else {
    console.error('✗ FAIL: Case 1 expectations not met.');
    console.log({ hasTrafficPulse, hasSmartMobility, hidesFarmVision, hidesHealthQueue, hidesEduTech });
  }
}

// CASE 2: Agriculture Department + Crop Disease / Pest Infestation
console.log('\n--- TEST CASE 2: Agriculture Department + Crop Disease Detection ---');
const agriChallenge = challenges.find((c: any) => 
  c.id === 'ch-agri-02' || c.department.toLowerCase().includes('agriculture')
);

if (!agriChallenge) {
  console.error('FAIL: Could not find Agriculture challenge in database.');
} else {
  console.log(`Evaluating Challenge: "${agriChallenge.title}" (${agriChallenge.department})`);
  const result2 = evaluateChallengeMatches(agriChallenge, startups);

  const recommendedNames = result2.matches.map(m => m.startupName);
  const excludedNames = (result2.excludedMatches || []).map(m => m.startupName);

  console.log('Recommended Startups:', recommendedNames);
  console.log('Excluded Startups:', excludedNames);

  const hasFarmVision = recommendedNames.includes('FarmVision Technologies');
  const hidesTraffic = !recommendedNames.includes('TrafficPulse AI');
  const hidesHealth = !recommendedNames.includes('HealthQueue AI');
  const hidesEduTech = !recommendedNames.includes('EduTech Innovations');

  if (hasFarmVision && hidesTraffic && hidesHealth && hidesEduTech) {
    console.log('✓ PASS: Case 2 passed! Agritech SHOW, Traffic/Healthcare/Education HIDE.');
    passedTests++;
  } else {
    console.error('✗ FAIL: Case 2 expectations not met.');
  }
}

// CASE 3: Health Department + Hospital Queue Optimization
console.log('\n--- TEST CASE 3: Health Department + Hospital Queue Optimization ---');
const healthChallenge = challenges.find((c: any) => 
  c.id === 'ch-health-03' || c.department.toLowerCase().includes('health')
);

if (!healthChallenge) {
  console.error('FAIL: Could not find Health challenge in database.');
} else {
  console.log(`Evaluating Challenge: "${healthChallenge.title}" (${healthChallenge.department})`);
  const result3 = evaluateChallengeMatches(healthChallenge, startups);

  const recommendedNames = result3.matches.map(m => m.startupName);
  const excludedNames = (result3.excludedMatches || []).map(m => m.startupName);

  console.log('Recommended Startups:', recommendedNames);
  console.log('Excluded Startups:', excludedNames);

  const hasHealthQueue = recommendedNames.includes('HealthQueue AI');
  const hidesAgri = !recommendedNames.includes('FarmVision Technologies');
  const hidesTraffic = !recommendedNames.includes('TrafficPulse AI');
  const hidesEduTech = !recommendedNames.includes('EduTech Innovations');

  if (hasHealthQueue && hidesAgri && hidesTraffic && hidesEduTech) {
    console.log('✓ PASS: Case 3 passed! Healthcare SHOW, Agriculture/Traffic/Education HIDE.');
    passedTests++;
  } else {
    console.error('✗ FAIL: Case 3 expectations not met.');
  }
}

// CASE 4: Urban Mobility + Road Infrastructure
console.log('\n--- TEST CASE 4: Public Works Department + Road Infrastructure ---');
const pwdChallenge = challenges.find((c: any) => 
  c.id === 'ch-pwd-01' || c.department.toLowerCase().includes('public works')
);

if (!pwdChallenge) {
  console.error('FAIL: Could not find PWD challenge in database.');
} else {
  console.log(`Evaluating Challenge: "${pwdChallenge.title}" (${pwdChallenge.department})`);
  const result4 = evaluateChallengeMatches(pwdChallenge, startups);

  const recommendedNames = result4.matches.map(m => m.startupName);
  const excludedNames = (result4.excludedMatches || []).map(m => m.startupName);

  console.log('Recommended Startups:', recommendedNames);
  console.log('Excluded Startups:', excludedNames);

  const hasRoadVision = recommendedNames.includes('RoadVision AI');
  const hidesHealth = !recommendedNames.includes('HealthQueue AI');
  const hidesAgri = !recommendedNames.includes('FarmVision Technologies');
  const hidesEduTech = !recommendedNames.includes('EduTech Innovations');

  if (hasRoadVision && hidesHealth && hidesAgri && hidesEduTech) {
    console.log('✓ PASS: Case 4 passed! Road infrastructure SHOW, Healthcare/Agri/Education HIDE.');
    passedTests++;
  } else {
    console.error('✗ FAIL: Case 4 expectations not met.');
  }
}

// CASE 5: Generic AI startup in unrelated domain
console.log('\n--- TEST CASE 5: Generic AI Startup in Unrelated Domain ---');
// EduTech Innovations has Speech NLP and On-Device Edge AI, tested against Traffic Challenge
const eduStartup = startups.find((s: any) => s.id === 'startup-edutechinnovations');
if (trafficChallenge && eduStartup) {
  const relevance = checkStartupRelevance(eduStartup, trafficChallenge);
  console.log('EduTech on Traffic Challenge Relevance Gate:');
  console.log(`  isRelevant: ${relevance.isRelevant}`);
  console.log(`  departmentMatch: ${relevance.departmentMatch}`);
  console.log(`  domainMatch: ${relevance.domainMatch}`);
  console.log(`  capabilityMatch: ${relevance.capabilityMatch}`);
  console.log(`  exclusionCategory: ${relevance.exclusionCategory}`);
  console.log(`  exclusionReason: ${relevance.exclusionReason}`);

  if (!relevance.isRelevant && relevance.exclusionCategory) {
    console.log('✓ PASS: Case 5 passed! Generic AI startup in unrelated domain correctly gated out.');
    passedTests++;
  } else {
    console.error('✗ FAIL: Case 5 failed. Startup was not gated out.');
  }
}

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} TEST CASES PASSED`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
