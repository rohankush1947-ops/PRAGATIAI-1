import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getSupabaseConfig, 
  checkSupabaseHealth, 
  persistToSupabase, 
  loadFromSupabase 
} from '../supabase.js';
import { getDb, saveDb, addAuditLog } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_FILE = path.join(__dirname, '..', '..', 'data', 'supabase_schema.sql');

const router = Router();

// GET /api/supabase/status - Supabase connectivity & schema status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const config = getSupabaseConfig();
    const health = await checkSupabaseHealth();

    res.json({
      success: true,
      configured: config.isConfigured,
      supabaseUrl: config.url,
      jwksUrl: config.jwksUrl,
      health
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/supabase/sync - Force bi-directional or push sync
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const direction = req.body?.direction || 'push'; // 'push' (local -> supabase) or 'pull' (supabase -> local)
    const db = getDb();

    if (direction === 'pull') {
      const remoteData = await loadFromSupabase();
      if (remoteData) {
        saveDb({ ...db, ...remoteData });
        addAuditLog('SUPABASE_PULL_SYNC', 'Synchronized database state from Supabase Cloud', 'System', 'Supabase Bridge');
        return res.json({
          success: true,
          message: 'Successfully pulled and synced state from Supabase',
          syncedTables: Object.keys(remoteData)
        });
      } else {
        return res.json({
          success: false,
          message: 'No remote records found in Supabase tables or tables not created yet'
        });
      }
    }

    // Default: Push local database to Supabase
    await persistToSupabase(db);
    addAuditLog('SUPABASE_PUSH_SYNC', 'Initiated background push sync of all entities to Supabase Cloud', 'System', 'Supabase Bridge');

    res.json({
      success: true,
      message: 'Push sync initiated to Supabase successfully',
      entities: {
        challenges: db.challenges?.length || 0,
        startups: db.startups?.length || 0,
        applications: db.applications?.length || 0,
        evaluations: db.evaluations?.length || 0,
        pilots: db.pilots?.length || 0,
        procurementContracts: db.procurementContracts?.length || 0,
        auditLogs: db.auditLogs?.length || 0
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/supabase/schema - Read the SQL migration file
router.get('/schema', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(SCHEMA_FILE)) {
      const sql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
      res.setHeader('Content-Type', 'text/plain');
      return res.send(sql);
    }
    res.status(404).json({ error: 'Schema file not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
