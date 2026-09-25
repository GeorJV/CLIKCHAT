-- ==============================================================================
-- CLIKCHAT SUPABASE & POSTGRESQL MULTI-TENANT ARCHITECTURE
-- Includes: pgvector (1536-dim), RLS Policies, Vector Matching RPCs, Stripe Subscriptions
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. TENANTS TABLE (Business Inquilinos)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    owner_email TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    bot_name TEXT DEFAULT 'Sofía - Asesora ClikChat',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    welcome_message TEXT DEFAULT '¡Hola! Bienvenido a nuestra tienda. ¿En qué puedo asesorarte hoy?',
    system_prompt TEXT DEFAULT 'Eres el asesor comercial de la tienda. Tu objetivo es resaltar los beneficios de los productos y guiar al usuario a comprar sin inventar información no verificada.',
    primary_color TEXT DEFAULT '#6366f1',
    custom_llm_key TEXT DEFAULT NULL,
    cta_text TEXT DEFAULT 'Realizar Compra',
    cta_url TEXT DEFAULT 'https://wa.me/50688888888?text=Hola,%20deseo%20comprar',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT DEFAULT 'pro', -- 'starter', 'pro', 'enterprise'
    monthly_price NUMERIC(10, 2) DEFAULT 79.00,
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    token_limit INTEGER DEFAULT 100000,
    tokens_used INTEGER DEFAULT 0,
    operational_rules TEXT DEFAULT '',
    business_type TEXT DEFAULT 'tienda',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS / PROFILES (Integrates with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'tenant_owner', -- 'superadmin', 'tenant_owner', 'agent'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS (Feeds RAG Level 3 - Catalog & Specific Knowledge)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    short_description TEXT,
    full_description TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Max 3 images for mobile carousel
    benefits JSONB DEFAULT '[]'::jsonb,
    details JSONB DEFAULT '{}'::jsonb,
    cta_label TEXT DEFAULT 'Realizar Compra',
    cta_url TEXT,
    stock INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    embedding vector(1536), -- 1536-dim OpenAI / OpenRouter embedding
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FAQS & STRICT RULES (Feeds RAG Level 2 - Stop Immediately on Match)
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'general',
    confidence_threshold NUMERIC(3, 2) DEFAULT 0.65,
    source TEXT DEFAULT 'manual', -- 'manual', 'hitl_audit', 'auto_learned'
    is_active BOOLEAN DEFAULT TRUE,
    embedding vector(1536), -- 1536-dim embedding for semantic similarity
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHAT SESSIONS & PWA PUSH REGISTRATIONS
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_fingerprint TEXT NOT NULL,
    lead_name TEXT,
    lead_phone TEXT,
    lead_email TEXT,
    pwa_push_subscription JSONB DEFAULT NULL, -- Stored PushSubscription object for Web Push
    pwa_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHAT MESSAGES (Feeds RAG Level 1 - Episodic Memory)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user', 'assistant', 'system'
    message TEXT NOT NULL,
    rag_level_used TEXT, -- 'level_1', 'level_2_faq', 'level_3_catalog', 'fallback_hitl'
    context_used JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. UNRESOLVED QUERIES (Human-in-the-Loop Fallback Inbox)
CREATE TABLE IF NOT EXISTS unresolved_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
    user_question TEXT NOT NULL,
    user_lead_info JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
    resolution_answer TEXT,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    auto_injected_to_faq BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STRIPE SUBSCRIPTION & BILLING AUDIT LOGS
CREATE TABLE IF NOT EXISTS billing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_event_id TEXT,
    event_type TEXT,
    amount NUMERIC(10, 2),
    currency TEXT DEFAULT 'usd',
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES & VECTOR OPTIMIZATIONS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_faqs_tenant ON faqs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_unresolved_queries_pending ON unresolved_queries(tenant_id, status);

-- Vector indexes for sub-millisecond semantic search
CREATE INDEX IF NOT EXISTS idx_products_embedding ON products 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_faqs_embedding ON faqs 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ==============================================================================
-- VECTOR SEARCH RPC FUNCTIONS (Supabase RPC)
-- ==============================================================================

-- 1. Match FAQs (Level 2 RAG)
CREATE OR REPLACE FUNCTION match_faqs(
    query_embedding vector(1536),
    filter_tenant uuid,
    match_threshold float DEFAULT 0.65,
    match_count int DEFAULT 3
)
RETURNS TABLE (
    id uuid,
    question text,
    answer text,
    confidence_threshold numeric,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.question,
        f.answer,
        f.confidence_threshold,
        1 - (f.embedding <=> query_embedding) AS similarity
    FROM faqs f
    WHERE f.tenant_id = filter_tenant
      AND f.is_active = TRUE
      AND f.embedding IS NOT NULL
      AND 1 - (f.embedding <=> query_embedding) >= match_threshold
    ORDER BY f.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;

-- 2. Match Products (Level 3 RAG)
CREATE OR REPLACE FUNCTION match_products(
    query_embedding vector(1536),
    filter_tenant uuid,
    match_threshold float DEFAULT 0.35,
    match_count int DEFAULT 3
)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    price numeric,
    currency text,
    short_description text,
    full_description text,
    images jsonb,
    benefits jsonb,
    details jsonb,
    cta_label text,
    cta_url text,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.slug,
        p.price,
        p.currency,
        p.short_description,
        p.full_description,
        p.images,
        p.benefits,
        p.details,
        p.cta_label,
        p.cta_url,
        1 - (p.embedding <=> query_embedding) AS similarity
    FROM products p
    WHERE p.tenant_id = filter_tenant
      AND p.is_active = TRUE
      AND p.embedding IS NOT NULL
      AND 1 - (p.embedding <=> query_embedding) >= match_threshold
    ORDER BY p.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE unresolved_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users see own profile or Super Admin sees all
CREATE POLICY "Users can access own profile" ON profiles
    FOR ALL USING (
        auth.uid() = id
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- Products Policy: Public can read active products; owners can edit
CREATE POLICY "Public read active products" ON products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Tenant owners manage own products" ON products
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- FAQs Policy: Public can read; owners can edit
CREATE POLICY "Public read active faqs" ON faqs
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Tenant owners manage faqs" ON faqs
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- Unresolved Queries: Only tenant owners and superadmin can view and resolve
CREATE POLICY "Tenant owners view unresolved" ON unresolved_queries
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
        OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    order_items TEXT DEFAULT '[]',
    total_amount NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'CRC',
    status TEXT DEFAULT 'confirmed_pending_payment',
    payment_method TEXT DEFAULT 'sinpe',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

