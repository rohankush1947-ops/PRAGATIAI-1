/*
  PRAGATI 2.0 AI Governance Platform - Supabase PostgreSQL Schema
  Project: https://tgafziyclcjzoykazuvd.supabase.co
*/

-- 1. Challenges Table
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

-- 2. Startups Table
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

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
    startup_id TEXT REFERENCES public.startups(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Submitted',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Evaluations Table
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

-- 5. Pilots Table
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

-- 6. Procurement Contracts Table
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

-- 7. Audit Logs Table
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

-- 8. Notifications Table
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

-- 9. Pragati Unified Key-Value Store (Snapshot & Cache Table)
CREATE TABLE IF NOT EXISTS public.pragati_state (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_startups_sector ON public.startups(sector);
CREATE INDEX IF NOT EXISTS idx_applications_challenge ON public.applications(challenge_id);
CREATE INDEX IF NOT EXISTS idx_applications_startup ON public.applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_app ON public.evaluations(application_id);
CREATE INDEX IF NOT EXISTS idx_pilots_challenge ON public.pilots(challenge_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pragati_state ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies: Drop if existing, then recreate
DROP POLICY IF EXISTS "Public access on challenges" ON public.challenges;
CREATE POLICY "Public access on challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on startups" ON public.startups;
CREATE POLICY "Public access on startups" ON public.startups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on applications" ON public.applications;
CREATE POLICY "Public access on applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on evaluations" ON public.evaluations;
CREATE POLICY "Public access on evaluations" ON public.evaluations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on pilots" ON public.pilots;
CREATE POLICY "Public access on pilots" ON public.pilots FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on procurement_contracts" ON public.procurement_contracts;
CREATE POLICY "Public access on procurement_contracts" ON public.procurement_contracts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on audit_logs" ON public.audit_logs;
CREATE POLICY "Public access on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on notifications" ON public.notifications;
CREATE POLICY "Public access on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access on pragati_state" ON public.pragati_state;
CREATE POLICY "Public access on pragati_state" ON public.pragati_state FOR ALL USING (true) WITH CHECK (true);
