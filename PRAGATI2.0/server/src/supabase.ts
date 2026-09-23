import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

let clientInstance: SupabaseClient | null = null;
let tablesAvailable: { [key: string]: boolean } = {};
let lastHealthCheck = 0;

export const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL || '';
  const secretKey = process.env.SUPABASE_SECRET_KEY || '';
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
  const jwksUrl = process.env.SUPABASE_JWKS_URL || (url ? `${url}/auth/v1/.well-known/jwks.json` : '');

  return {
    url,
    secretKey,
    publishableKey,
    jwksUrl,
    isConfigured: Boolean(url && (secretKey || publishableKey))
  };
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (clientInstance) {
    return clientInstance;
  }

  const { url, secretKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return null;
  }

  try {
    clientInstance = createClient(url, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

/**
 * Checks connection to Supabase and tests which tables exist
 */
export const checkSupabaseHealth = async (): Promise<{
  connected: boolean;
  url: string;
  tables: { [key: string]: boolean };
  error?: string;
}> => {
  const supabase = getSupabaseClient();
  const { url } = getSupabaseConfig();

  if (!supabase) {
    return {
      connected: false,
      url,
      tables: {},
      error: 'Supabase client is not initialized or missing credentials'
    };
  }

  const tableNames = [
    'challenges',
    'startups',
    'applications',
    'evaluations',
    'pilots',
    'procurement_contracts',
    'audit_logs',
    'notifications',
    'pragati_state'
  ];

  const results: { [key: string]: boolean } = {};
  let anySuccess = false;

  for (const table of tableNames) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (!error) {
        results[table] = true;
        anySuccess = true;
      } else if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        // Table does not exist in schema cache
        results[table] = false;
      } else {
        // Other error (e.g. RLS policy violation or permission error, but table exists)
        results[table] = false;
      }
    } catch {
      results[table] = false;
    }
  }

  tablesAvailable = results;
  lastHealthCheck = Date.now();

  return {
    connected: true,
    url,
    tables: results
  };
};

/**
 * Pull all data from Supabase if tables exist
 */
export const loadFromSupabase = async (): Promise<any | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    // 1. Try pragati_state first (unified snapshot table)
    const { data: stateRows, error: stateErr } = await supabase
      .from('pragati_state')
      .select('*');

    if (!stateErr && stateRows && stateRows.length > 0) {
      console.log('⚡ Loaded Pragati state from Supabase pragati_state table');
      const loaded: any = {};
      for (const row of stateRows) {
        loaded[row.key] = row.data;
      }
      return loaded;
    }

    // 2. Try relational tables if challenges table exists
    const { data: challenges, error: chErr } = await supabase.from('challenges').select('*');
    if (!chErr && challenges && challenges.length > 0) {
      console.log(`⚡ Loaded ${challenges.length} challenges from Supabase challenges table`);
      
      const { data: startups } = await supabase.from('startups').select('*');
      const { data: applications } = await supabase.from('applications').select('*');
      const { data: evaluations } = await supabase.from('evaluations').select('*');
      const { data: pilots } = await supabase.from('pilots').select('*');
      const { data: procurement } = await supabase.from('procurement_contracts').select('*');
      const { data: auditLogs } = await supabase.from('audit_logs').select('*');
      const { data: notifications } = await supabase.from('notifications').select('*');

      return {
        challenges: challenges.map(r => r.data || r),
        startups: (startups || []).map(r => r.data || r),
        applications: (applications || []).map(r => r.data || r),
        evaluations: (evaluations || []).map(r => r.data || r),
        pilots: (pilots || []).map(r => r.data || r),
        procurementContracts: (procurement || []).map(r => r.data || r),
        auditLogs: (auditLogs || []).map(r => r.data || r),
        notifications: (notifications || []).map(r => r.data || r)
      };
    }
  } catch (err: any) {
    console.warn('Could not load data from Supabase, falling back to local storage:', err.message);
  }

  return null;
};

/**
 * Asynchronously sync an updated dataset or snapshot to Supabase
 */
export const persistToSupabase = async (db: any): Promise<void> => {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  // Run in background without blocking local response
  (async () => {
    try {
      // 1. If pragati_state table exists, save snapshots
      const keys = [
        'challenges',
        'startups',
        'applications',
        'evaluations',
        'pilots',
        'procurementContracts',
        'scaleUpPlan',
        'auditLogs',
        'notifications'
      ];

      for (const key of keys) {
        if (db[key] !== undefined) {
          await supabase.from('pragati_state').upsert(
            {
              key,
              data: db[key],
              updated_at: new Date().toISOString()
            },
            { onConflict: 'key' }
          );
        }
      }

      // 2. Also sync to individual tables if they exist
      if (Array.isArray(db.challenges) && db.challenges.length > 0) {
        const rows = db.challenges.map((c: any) => ({
          id: c.id,
          title: c.title,
          department: c.department,
          category: c.category,
          status: c.status,
          budget_range: c.budgetRange,
          pilot_duration: c.pilotDuration,
          deadline: c.deadline,
          problem_description: c.problemDescription,
          data: c,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('challenges').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.startups) && db.startups.length > 0) {
        const rows = db.startups.map((s: any) => ({
          id: s.id,
          name: s.name,
          sector: s.sector,
          domain: s.domain,
          stage: s.stage,
          trl: s.trl,
          data: s,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('startups').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.applications) && db.applications.length > 0) {
        const rows = db.applications.map((a: any) => ({
          id: a.id,
          challenge_id: a.challengeId,
          startup_id: a.startupId,
          status: a.status,
          data: a,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('applications').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.evaluations) && db.evaluations.length > 0) {
        const rows = db.evaluations.map((e: any) => ({
          id: e.id,
          application_id: e.applicationId,
          challenge_id: e.challengeId,
          evaluator_name: e.evaluatorName,
          status: e.status,
          overall_score: e.overallScore,
          data: e,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('evaluations').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.pilots) && db.pilots.length > 0) {
        const rows = db.pilots.map((p: any) => ({
          id: p.id,
          application_id: p.applicationId,
          challenge_id: p.challengeId,
          startup_id: p.startupId,
          title: p.title,
          status: p.status,
          data: p,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('pilots').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.procurementContracts) && db.procurementContracts.length > 0) {
        const rows = db.procurementContracts.map((c: any) => ({
          id: c.id,
          pilot_id: c.pilotId,
          challenge_id: c.challengeId,
          startup_id: c.startupId,
          contract_title: c.contractTitle,
          status: c.status,
          gem_contract_id: c.gemContractId,
          contract_value: c.contractValue,
          data: c,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('procurement_contracts').upsert(rows, { onConflict: 'id' });
      }

      if (Array.isArray(db.auditLogs) && db.auditLogs.length > 0) {
        // Sync top 50 recent audit logs
        const recentLogs = db.auditLogs.slice(0, 50).map((l: any) => ({
          id: l.id,
          timestamp: l.timestamp,
          user_role: l.userRole,
          user_name: l.userName,
          action: l.action,
          details: l.details,
          status: l.status,
          data: l
        }));
        await supabase.from('audit_logs').upsert(recentLogs, { onConflict: 'id' });
      }
    } catch (err: any) {
      // Non-fatal background sync warning
      console.warn('Supabase background sync notification:', err.message);
    }
  })();
};
