import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { 
  INITIAL_CHALLENGES, 
  MOCK_STARTUPS, 
  INITIAL_APPLICATIONS, 
  INITIAL_EVALUATIONS, 
  INITIAL_PILOTS, 
  INITIAL_PROCUREMENT, 
  INITIAL_SCALE_UP, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../../src/data/mockData.ts';
import { persistToSupabase, loadFromSupabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'pragati_database.json');

let inMemoryDb: DatabaseSchema | null = null;
let supabaseSyncInitiated = false;

export interface DatabaseSchema {
  challenges: any[];
  startups: any[];
  applications: any[];
  evaluations: any[];
  pilots: any[];
  procurementContracts: any[];
  scaleUpPlan: any;
  auditLogs: any[];
  notifications: any[];
}

const getInitialData = (): DatabaseSchema => ({
  challenges: JSON.parse(JSON.stringify(INITIAL_CHALLENGES)),
  startups: JSON.parse(JSON.stringify(MOCK_STARTUPS)),
  applications: JSON.parse(JSON.stringify(INITIAL_APPLICATIONS)),
  evaluations: JSON.parse(JSON.stringify(INITIAL_EVALUATIONS)),
  pilots: JSON.parse(JSON.stringify(INITIAL_PILOTS)),
  procurementContracts: JSON.parse(JSON.stringify(INITIAL_PROCUREMENT)),
  scaleUpPlan: JSON.parse(JSON.stringify(INITIAL_SCALE_UP)),
  auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
  notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS))
});

export const initDb = (): DatabaseSchema => {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData = getInitialData();
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('Could not write database file, operating with in-memory store:', writeErr);
      }
      inMemoryDb = initialData;
      return initialData;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryDb = JSON.parse(raw);
    if (inMemoryDb && inMemoryDb.startups) {
      let updated = false;
      for (const st of MOCK_STARTUPS) {
        if (!inMemoryDb.startups.some((existing: any) => existing.id === st.id)) {
          inMemoryDb.startups.unshift(st);
          updated = true;
        }
      }
      if (updated) {
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
        } catch (_) {}
      }
    }
    // Background asynchronous sync with Supabase Cloud if available
    if (!supabaseSyncInitiated) {
      supabaseSyncInitiated = true;
      loadFromSupabase()
        .then(remoteData => {
          if (remoteData && inMemoryDb) {
            Object.assign(inMemoryDb, remoteData);
            try {
              fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
            } catch (_) {}
            console.log('⚡ Pragati database synchronized with Supabase Cloud');
          }
        })
        .catch(err => {
          console.warn('Initial Supabase sync check:', err.message);
        });
    }

    return inMemoryDb!;
  } catch (err) {
    console.error('Error reading database file, reinitializing with seed data:', err);
    const initialData = getInitialData();
    inMemoryDb = initialData;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      // In-memory fallback
    }
    return initialData;
  }
};

export const getDb = (): DatabaseSchema => {
  return initDb();
};

export const saveDb = (data: DatabaseSchema) => {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist database to disk, preserved in memory:', err);
  }

  // Asynchronously mirror changes to Supabase Cloud
  persistToSupabase(data).catch(() => {});
};

export const resetDb = (): DatabaseSchema => {
  const initialData = getInitialData();
  saveDb(initialData);
  return initialData;
};

export const addAuditLog = (action: string, details: string, userRole = 'System', userName = 'Authorized Official', status = 'Completed') => {
  const db = getDb();
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} IST`;
  const logEntry = {
    id: `log-${Date.now()}`,
    timestamp,
    userRole,
    userName,
    action,
    details,
    status
  };
  db.auditLogs.unshift(logEntry);
  saveDb(db);
  return logEntry;
};
