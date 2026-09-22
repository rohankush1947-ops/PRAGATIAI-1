import app from '../src/index.js';
import { getDb, saveDb } from '../src/db.js';
import http from 'http';

console.log('================================================================');
console.log('PRAGATIAI: END-TO-END HTTP CHALLENGE REGISTRATION & MATCH TEST');
console.log('================================================================\n');

async function runHttpTest() {
  const testPort = 5055;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => {
      console.log(`[HTTP Test Server] Running on http://127.0.0.1:${testPort}`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${testPort}`;

  try {
    // 1. Snapshot baseline
    const db = getDb();
    const baselineCount = db.challenges.length;
    console.log(`[Step 1] Baseline challenge count: ${baselineCount}`);

    // 2. HTTP POST Register Challenge 1: AI-Based Municipal Waste Classification
    console.log(`\n[Step 2] HTTP POST /api/challenges (AI-Based Municipal Waste Classification)...`);
    const payload1 = {
      title: 'AI-Based Municipal Waste Classification',
      problemStatement: 'Develop an AI-based computer vision system for automatic classification of municipal waste to improve segregation efficiency.',
      department: 'Municipal Corporation',
      sector: 'Urban Development',
      requiredTechnologies: ['Computer Vision', 'Deep Learning', 'Image Classification'],
      budget: '₹25 Lakhs',
      timeline: '90 Days'
    };

    const res1 = await fetch(`${baseUrl}/api/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload1)
    });

    if (res1.status !== 201) {
      throw new Error(`Expected HTTP 201 for challenge 1, received ${res1.status}: ${await res1.text()}`);
    }

    const createdCh1 = await res1.json();
    console.log(`   ✔ Status: 201 Created`);
    console.log(`   ✔ Generated ID: ${createdCh1.id}`);
    console.log(`   ✔ Title: "${createdCh1.title}"`);
    console.log(`   ✔ Department: ${createdCh1.department}`);
    console.log(`   ✔ Technologies: ${createdCh1.techArea.join(', ')}`);

    if (!createdCh1.id.startsWith('CH-')) {
      throw new Error(`Expected canonical ID prefix CH-, received: ${createdCh1.id}`);
    }

    // 3. HTTP POST Register Challenge 2: AI-Based Hospital OPD Queue Optimization
    console.log(`\n[Step 3] HTTP POST /api/challenges (AI-Based Hospital OPD Queue Optimization)...`);
    const payload2 = {
      title: 'AI-Based Hospital OPD Queue Optimization',
      problemStatement: 'Develop an AI-powered OPD queue orchestration and predictive triage engine for government district hospitals.',
      department: 'Health & Family Welfare',
      sector: 'Healthcare',
      requiredTechnologies: ['Machine Learning', 'Optimization', 'Healthcare Analytics']
    };

    const res2 = await fetch(`${baseUrl}/api/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload2)
    });

    if (res2.status !== 201) {
      throw new Error(`Expected HTTP 201 for challenge 2, received ${res2.status}: ${await res2.text()}`);
    }

    const createdCh2 = await res2.json();
    console.log(`   ✔ Status: 201 Created`);
    console.log(`   ✔ Generated ID: ${createdCh2.id}`);
    console.log(`   ✔ Title: "${createdCh2.title}"`);

    if (createdCh1.id === createdCh2.id) {
      throw new Error('Challenge IDs must be unique!');
    }

    // 4. HTTP GET /api/challenges (Verify persistence and presence of both challenges)
    console.log(`\n[Step 4] HTTP GET /api/challenges (Verifying persistence)...`);
    const listRes = await fetch(`${baseUrl}/api/challenges`);
    if (!listRes.ok) throw new Error(`GET /api/challenges failed: ${listRes.status}`);
    const challengesList = await listRes.json();
    console.log(`   ✔ Total challenges returned by API: ${challengesList.length} (Expected: ${baselineCount + 2})`);

    const hasCh1 = challengesList.some((c: any) => c.id === createdCh1.id);
    const hasCh2 = challengesList.some((c: any) => c.id === createdCh2.id);

    if (!hasCh1 || !hasCh2) {
      throw new Error('Newly created challenges not returned in GET /api/challenges!');
    }
    console.log('   ✔ PASS: Both challenges successfully persisted and retrieved via API.');

    // 5. HTTP POST /api/ai/matching for Challenge 1 (Waste Classification)
    console.log(`\n[Step 5] HTTP POST /api/ai/matching for Challenge 1 (${createdCh1.id})...`);
    const matchRes1 = await fetch(`${baseUrl}/api/ai/matching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: createdCh1.id })
    });
    if (!matchRes1.ok) throw new Error(`Matching failed: ${await matchRes1.text()}`);
    const matchData1 = await matchRes1.json();

    console.log(`   Matches evaluated: ${matchData1.matches.length}`);
    console.log(`   Top match: #${matchData1.matches[0].rank} ${matchData1.matches[0].startupName} (${matchData1.matches[0].overallScore}%)`);
    if (matchData1.challengeId !== createdCh1.id) {
      throw new Error(`Expected matching for ${createdCh1.id}, got ${matchData1.challengeId}`);
    }
    console.log('   ✔ PASS: AI Matching evaluated specific Challenge 1 without defaulting.');

    // 6. HTTP POST /api/ai/matching for Challenge 2 (Hospital OPD Queue Optimization)
    console.log(`\n[Step 6] HTTP POST /api/ai/matching for Challenge 2 (${createdCh2.id})...`);
    const matchRes2 = await fetch(`${baseUrl}/api/ai/matching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: createdCh2.id })
    });
    if (!matchRes2.ok) throw new Error(`Matching failed: ${await matchRes2.text()}`);
    const matchData2 = await matchRes2.json();

    console.log(`   Matches evaluated: ${matchData2.matches.length}`);
    console.log(`   Top match: #${matchData2.matches[0].rank} ${matchData2.matches[0].startupName} (${matchData2.matches[0].overallScore}%)`);
    if (matchData2.matches[0].startupId !== 'startup-healthqueue') {
      throw new Error(`Expected HealthQueue AI to win Hospital OPD challenge, got: ${matchData2.matches[0].startupName}`);
    }
    console.log('   ✔ PASS: HealthQueue AI correctly ranked #1 for Hospital OPD challenge!');

    // 7. Clean up
    console.log(`\n[Step 7] Cleaning up transient challenges from database...`);
    const cleanDb = getDb();
    cleanDb.challenges = cleanDb.challenges.filter(
      c => c.id !== createdCh1.id && c.id !== createdCh2.id
    );
    saveDb(cleanDb);

    const finalDb = getDb();
    console.log(`   - Challenges in DB after cleanup: ${finalDb.challenges.length} (Clean baseline: ${finalDb.challenges.length === baselineCount})`);

    console.log('\n================================================================');
    console.log('🎉 ALL HTTP CHALLENGE REGISTRATION & MATCH TESTS PASSED 100%!');
    console.log('================================================================\n');

  } finally {
    server.close();
    process.exit(0);
  }
}

runHttpTest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
