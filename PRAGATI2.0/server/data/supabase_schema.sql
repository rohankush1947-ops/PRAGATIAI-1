-- ============================================================================
-- PRAGATI 2.0 AI Governance Platform - Supabase PostgreSQL Schema
-- Project URL: https://tgafziyclcjzoykazuvd.supabase.co
-- ============================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Challenges Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    category TEXT,
    status TEXT DEFAULT 'Draft',
    budget_range TEXT,
    pilot_duration TEXT,
    deadline TEXT,
    problem_description TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Startups Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.startups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sector TEXT,
    domain TEXT,
    stage TEXT,
    trl INTEGER,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Applications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
    startup_id TEXT REFERENCES public.startups(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Submitted',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. Evaluations Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluations (
    id TEXT PRIMARY KEY,
    application_id TEXT,
    challenge_id TEXT,
    evaluator_name TEXT,
    status TEXT DEFAULT 'Draft',
    overall_score NUMERIC,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. Pilots Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pilots (
    id TEXT PRIMARY KEY,
    application_id TEXT,
    challenge_id TEXT,
    startup_id TEXT,
    title TEXT,
    status TEXT DEFAULT 'Deploying',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. Procurement Contracts Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.procurement_contracts (
    id TEXT PRIMARY KEY,
    pilot_id TEXT,
    challenge_id TEXT,
    startup_id TEXT,
    contract_title TEXT,
    status TEXT DEFAULT 'Draft',
    gem_contract_id TEXT,
    contract_value TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. Audit Logs Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    user_role TEXT,
    user_name TEXT,
    action TEXT,
    details TEXT,
    status TEXT DEFAULT 'Completed',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. Notifications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    type TEXT,
    recipient_role TEXT,
    read BOOLEAN DEFAULT FALSE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. Pragati Unified Key-Value Store (Snapshot & Cache Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pragati_state (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Indexes for High Performance Querying
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_startups_sector ON public.startups(sector);
CREATE INDEX IF NOT EXISTS idx_applications_challenge ON public.applications(challenge_id);
CREATE INDEX IF NOT EXISTS idx_applications_startup ON public.applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_app ON public.evaluations(application_id);
CREATE INDEX IF NOT EXISTS idx_pilots_challenge ON public.pilots(challenge_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- Note: Service Role (used by our Express backend) bypasses RLS by default.
-- Enable RLS and grant public read access for read-only transparent access.
-- ----------------------------------------------------------------------------
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pragati_state ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for dashboards / mobile / frontend queries)
CREATE POLICY "Allow public read access on challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Allow public read access on startups" ON public.startups FOR SELECT USING (true);
CREATE POLICY "Allow public read access on applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public read access on evaluations" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pilots" ON public.pilots FOR SELECT USING (true);
CREATE POLICY "Allow public read access on procurement_contracts" ON public.procurement_contracts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pragati_state" ON public.pragati_state FOR SELECT USING (true);

-- Allow service role full access (Insert, Update, Delete)
CREATE POLICY "Allow full access for service_role on challenges" ON public.challenges FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on startups" ON public.startups FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on applications" ON public.applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on evaluations" ON public.evaluations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on pilots" ON public.pilots FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on procurement_contracts" ON public.procurement_contracts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on audit_logs" ON public.audit_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on notifications" ON public.notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role on pragati_state" ON public.pragati_state FOR ALL USING (auth.role() = 'service_role');
