-- ==========================================================
-- PAI (Personal Autonomous Intelligence) - Supabase Schema
-- Architecture: Hybrid pgvector + tsvector Full-Text Search
-- ==========================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Agent Prompts & Personality Registry
CREATE TABLE IF NOT EXISTS public.agent_prompts (
    id VARCHAR(64) PRIMARY KEY,
    persona_name VARCHAR(128) NOT NULL,
    system_instruction TEXT NOT NULL,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Hybrid Memories Table (pgvector + tsvector)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(64) NOT NULL, -- 'identity', 'workshop', 'hardware', 'projects', 'interests', 'ledger'
    sneak_key VARCHAR(128),        -- Exact token/handle for deterministic sneak lookup (e.g. 'MINGDA_1325', 'AHYEON_TM')
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(768),         -- 768-dim dense embedding for semantic similarity
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Full-Text Search tsvector Column (Auto-Generated)
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
    to_tsvector('english', 
        coalesce(sneak_key, '') || ' ' || 
        coalesce(title, '') || ' ' || 
        coalesce(category, '') || ' ' || 
        coalesce(content, '')
    )
) STORED;

-- 5. Indexes for Sub-Millisecond Retrieval
CREATE INDEX IF NOT EXISTS idx_memories_fts ON public.memories USING gin(fts);
CREATE INDEX IF NOT EXISTS idx_memories_category ON public.memories(category);
CREATE INDEX IF NOT EXISTS idx_memories_sneak_key ON public.memories(sneak_key);
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON public.memories USING hnsw (embedding vector_cosine_ops);

-- 6. Safety Boundary: Human-in-the-Loop Pending Ledger
CREATE TABLE IF NOT EXISTS public.pending_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(64) NOT NULL, -- 'MONEY_TRANSFER', 'DEVICE_SHUTDOWN', 'DELETE_FILES', 'SYSTEM_OVERRIDE'
    target VARCHAR(256) NOT NULL,
    amount NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'PKR',
    details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(32) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'REJECTED', 'EXPIRED'
    requires_biometric BOOLEAN DEFAULT TRUE,
    flag_secure BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 7. Chat History & Execution Sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL, -- 'user', 'assistant', 'system', 'tool'
    content TEXT NOT NULL,
    tool_calls JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session_id ON public.chat_sessions(session_id);

-- 8. Keepalive Heartbeat Log (Render & Supabase Activity)
CREATE TABLE IF NOT EXISTS public.keepalive_pings (
    id BIGSERIAL PRIMARY KEY,
    source VARCHAR(64) DEFAULT 'cron-job.org',
    ping_type VARCHAR(32) DEFAULT 'HEARTBEAT',
    received_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 9. Stored Procedures / RPC Functions for Hybrid Search
-- ==========================================================

-- Function: Deterministic Lexical Search (tsvector)
CREATE OR REPLACE FUNCTION match_memories_fts(
    query_text TEXT,
    match_limit INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    category VARCHAR,
    sneak_key VARCHAR,
    title TEXT,
    content TEXT,
    metadata JSONB,
    rank REAL
)
LANGUAGE sql STABLE
AS $$
    SELECT 
        m.id,
        m.category,
        m.sneak_key,
        m.title,
        m.content,
        m.metadata,
        ts_rank(m.fts, websearch_to_tsquery('english', query_text)) AS rank
    FROM public.memories m
    WHERE m.fts @@ websearch_to_tsquery('english', query_text)
       OR m.sneak_key ILIKE '%' || query_text || '%'
    ORDER BY rank DESC
    LIMIT match_limit;
$$;

-- Function: Semantic Vector Search (pgvector)
CREATE OR REPLACE FUNCTION match_memories_semantic(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_limit INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    category VARCHAR,
    sneak_key VARCHAR,
    title TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT 
        m.id,
        m.category,
        m.sneak_key,
        m.title,
        m.content,
        m.metadata,
        1 - (m.embedding <=> query_embedding) AS similarity
    FROM public.memories m
    WHERE m.embedding IS NOT NULL 
      AND 1 - (m.embedding <=> query_embedding) > match_threshold
    ORDER BY m.embedding <=> query_embedding
    LIMIT match_limit;
$$;

-- Function: Lightweight Daily Keepalive Query (Bypasses 7-Day Inactivity Pause)
CREATE OR REPLACE FUNCTION supabase_keepalive_pulse()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.keepalive_pings (source, ping_type) 
    VALUES ('cron-job.org', 'DAILY_KEEP_ALIVE');
    
    RETURN jsonb_build_object(
        'status', 'alive',
        'timestamp', NOW(),
        'database', 'active'
    );
END;
$$;
