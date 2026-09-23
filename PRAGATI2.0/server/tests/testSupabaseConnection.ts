import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';

async function testSupabase() {
  console.log('Testing Supabase URL:', SUPABASE_URL);

  // 1. Test Auth JWKS
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
    console.log('JWKS Endpoint Status:', res.status);
    if (res.ok) {
      const jwks = await res.json();
      console.log('JWKS keys count:', jwks.keys?.length);
    }
  } catch (e: any) {
    console.log('JWKS fetch error:', e.message);
  }

  // 2. Test REST API with Secret Key
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SECRET_KEY,
        'Authorization': `Bearer ${SECRET_KEY}`
      }
    });
    console.log('REST API Root Status (Secret Key):', res.status);
    const body = await res.json();
    console.log('Existing tables/definitions:', Object.keys(body.definitions || {}));
    console.log('Existing paths:', Object.keys(body.paths || {}));
  } catch (e: any) {
    console.log('REST API fetch error:', e.message);
  }

  // 3. Test REST API with Publishable Key
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`
      }
    });
    console.log('REST API Root Status (Publishable Key):', res.status);
  } catch (e: any) {
    console.log('REST API Publishable fetch error:', e.message);
  }
}

testSupabase().catch(console.error);
