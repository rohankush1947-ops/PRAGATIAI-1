import dotenv from 'dotenv';
dotenv.config();

import { getDb } from '../src/db.js';
import { persistToSupabase, getSupabaseClient } from '../src/supabase.js';

async function seed() {
  console.log('Fetching local database state...');
  const db = getDb();
  console.log('Local entities count:', {
    challenges: db.challenges?.length,
    startups: db.startups?.length,
    applications: db.applications?.length,
    evaluations: db.evaluations?.length,
    pilots: db.pilots?.length,
    procurementContracts: db.procurementContracts?.length,
    auditLogs: db.auditLogs?.length
  });

  console.log('Pushing to Supabase Cloud...');
  await persistToSupabase(db);

  // Wait 3 seconds for background push to complete
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Verify Supabase records
  const supabase = getSupabaseClient();
  if (supabase) {
    const { count: chCount, error: chErr } = await supabase.from('challenges').select('*', { count: 'exact', head: true });
    const { count: stCount, error: stErr } = await supabase.from('startups').select('*', { count: 'exact', head: true });
    const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });
    const { count: pilotCount } = await supabase.from('pilots').select('*', { count: 'exact', head: true });
    const { count: logCount } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true });

    console.log('Supabase Cloud Records Verified:');
    console.log('Challenges in Supabase:', chCount, chErr ? `(Error: ${chErr.message})` : '✓');
    console.log('Startups in Supabase:', stCount, stErr ? `(Error: ${stErr.message})` : '✓');
    console.log('Applications in Supabase:', appCount, '✓');
    console.log('Pilots in Supabase:', pilotCount, '✓');
    console.log('Audit Logs in Supabase:', logCount, '✓');
  }
}

seed().catch(console.error);
