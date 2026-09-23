import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

import { checkSupabaseHealth } from '../src/supabase.js';

async function run() {
  try {
    const headRes = await supabase.from('challenges').select('id', { count: 'exact', head: true });
    console.log('head query res status:', headRes.status, 'error:', headRes.error);

    const health = await checkSupabaseHealth();
    console.log('checkSupabaseHealth output:', health);
  } catch (err: any) {
    console.error('Exception querying Supabase:', err.message);
  }
}

run();
