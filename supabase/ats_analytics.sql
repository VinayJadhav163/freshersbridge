-- ==============================================================================
-- FreshersBridge ATS & AI Tailoring Analytics Tracking Table
-- Paste this script into your Supabase Dashboard -> SQL Editor and click 'Run'.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ats_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'scan' or 'tailor'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for high-speed queries on date and event type
CREATE INDEX IF NOT EXISTS idx_ats_analytics_event_date ON public.ats_analytics (event_type, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ats_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts and selects for client app tracking
DROP POLICY IF EXISTS "Allow anonymous insert on ats_analytics" ON public.ats_analytics;
CREATE POLICY "Allow anonymous insert on ats_analytics"
    ON public.ats_analytics FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous select on ats_analytics" ON public.ats_analytics;
CREATE POLICY "Allow anonymous select on ats_analytics"
    ON public.ats_analytics FOR SELECT
    TO anon, authenticated
    USING (true);
