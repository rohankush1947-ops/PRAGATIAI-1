async function verifyIntegration() {
  console.log('Testing PRAGATI Backend Supabase Status Endpoint...');
  try {
    const res = await fetch('http://127.0.0.1:5000/api/supabase/status');
    console.log('Status endpoint HTTP status:', res.status);
    const data = await res.json();
    console.log('Supabase status response:', JSON.stringify(data, null, 2));

    // Test Schema endpoint
    const schemaRes = await fetch('http://127.0.0.1:5000/api/supabase/schema');
    console.log('Schema endpoint HTTP status:', schemaRes.status);
    const schemaText = await schemaRes.text();
    console.log('Schema length:', schemaText.length, 'bytes');

    // Test Push Sync endpoint
    const syncRes = await fetch('http://127.0.0.1:5000/api/supabase/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction: 'push' })
    });
    console.log('Sync endpoint HTTP status:', syncRes.status);
    const syncData = await syncRes.json();
    console.log('Sync response:', JSON.stringify(syncData, null, 2));
  } catch (err: any) {
    console.error('Verification error:', err.message);
  }
}

verifyIntegration();
