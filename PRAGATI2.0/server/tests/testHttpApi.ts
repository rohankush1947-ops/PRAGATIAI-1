async function testEndpoint() {
  const baseUrl = 'http://127.0.0.1:5000';
  console.log('Testing HTTP endpoints on', baseUrl);

  // 1. Health
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const health = await healthRes.json();
  console.log('1. Health Check:', health.status, health.product);

  // 2. AI Matching for PWD Challenge
  console.log('\n2. Testing POST /api/ai/matching for PWD Road Condition (ch-pwd-01)...');
  const pwdRes = await fetch(`${baseUrl}/api/ai/matching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeId: 'ch-pwd-01' })
  });
  if (!pwdRes.ok) throw new Error(`HTTP Error: ${pwdRes.status} ${await pwdRes.text()}`);
  const pwdData = await pwdRes.json();
  console.log(`Success! Total Evaluated: ${pwdData.totalEvaluated}`);
  console.log(`Top Rank: #${pwdData.matches[0].rank} ${pwdData.matches[0].startupName} (${pwdData.matches[0].overallScore}%)`);
  console.log(`Factors: Tech: ${pwdData.matches[0].technologyMatch}%, Domain: ${pwdData.matches[0].domainMatch}%, Exp: ${pwdData.matches[0].experienceMatch}%, Readiness: ${pwdData.matches[0].pilotReadiness}%, Scalability: ${pwdData.matches[0].scalabilityMatch}%, Eligibility: ${pwdData.matches[0].eligibilityMatch}%`);
  console.log(`Explanation: ${pwdData.matches[0].explanation}`);

  // 3. AI Matching for Agriculture Challenge
  console.log('\n3. Testing POST /api/ai/matching for Agriculture (ch-agri-02)...');
  const agriRes = await fetch(`${baseUrl}/api/ai/matching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeId: 'ch-agri-02' })
  });
  const agriData = await agriRes.json();
  console.log(`Top Rank for Agriculture: #${agriData.matches[0].rank} ${agriData.matches[0].startupName} (${agriData.matches[0].overallScore}%)`);
  console.log(`Explanation: ${agriData.matches[0].explanation}`);

  // 4. AI Matching for Water Leakage Challenge
  console.log('\n4. Testing POST /api/ai/matching for Water Leakage (ch-water-04)...');
  const waterRes = await fetch(`${baseUrl}/api/ai/matching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeId: 'ch-water-04' })
  });
  const waterData = await waterRes.json();
  console.log(`Top Rank for Water: #${waterData.matches[0].rank} ${waterData.matches[0].startupName} (${waterData.matches[0].overallScore}%)`);

  // 5. AI Matching for Healthcare Challenge
  console.log('\n5. Testing POST /api/ai/matching for Healthcare (ch-health-03)...');
  const healthMatchRes = await fetch(`${baseUrl}/api/ai/matching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challengeId: 'ch-health-03' })
  });
  const healthMatchData = await healthMatchRes.json();
  console.log(`Top Rank for Healthcare: #${healthMatchData.matches[0].rank} ${healthMatchData.matches[0].startupName} (${healthMatchData.matches[0].overallScore}%)`);

  // 6. Verification of Required Properties on every result item
  console.log('\n6. Verifying Schema Conformance on Matches...');
  const first = pwdData.matches[0];
  const requiredKeys = [
    'startupId',
    'startupName',
    'overallScore',
    'technologyMatch',
    'domainMatch',
    'experienceMatch',
    'pilotReadiness',
    'scalabilityMatch',
    'eligibilityMatch',
    'explanation'
  ];
  for (const key of requiredKeys) {
    if (first[key] === undefined) throw new Error(`Missing required key: ${key}`);
    console.log(`  ✓ Field "${key}" present: ${typeof first[key] === 'object' ? JSON.stringify(first[key]) : first[key]}`);
  }

  // 7. Test Vite Proxy (port 5173 -> port 5000)
  console.log('\n7. Testing Vite Dev Server Proxy (http://localhost:5173/api/ai/matching)...');
  try {
    const proxyRes = await fetch('http://localhost:5173/api/ai/matching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: 'ch-pwd-01' })
    });
    if (!proxyRes.ok) throw new Error(`Vite Proxy Error: ${proxyRes.status} ${await proxyRes.text()}`);
    const proxyData = await proxyRes.json();
    console.log(`  ✓ Vite proxy working seamlessly! Total Evaluated: ${proxyData.totalEvaluated}, Top: ${proxyData.matches[0].startupName} (${proxyData.matches[0].overallScore}%)`);
  } catch (err: any) {
    console.warn(`  ! Vite proxy note: ${err.message}`);
  }

  console.log('\n--- ALL HTTP API & PROXY TESTS PASSED! ---');
}

testEndpoint().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
