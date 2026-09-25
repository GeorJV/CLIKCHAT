-- CLIKCHAT CLOUDFLARE D1 MULTI-TENANT ARCHITECTURE
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
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
    plan TEXT DEFAULT 'pro',
    monthly_price REAL DEFAULT 79.00,
    status TEXT DEFAULT 'active',
    token_limit INTEGER DEFAULT 100000,
    tokens_used INTEGER DEFAULT 0,
    operational_rules TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    short_description TEXT,
    full_description TEXT,
    images TEXT DEFAULT '[]',
    benefits TEXT DEFAULT '[]',
    details TEXT DEFAULT '{}',
    cta_label TEXT DEFAULT 'Comprar Ahora',
    cta_url TEXT,
    is_active INTEGER DEFAULT 1,
    embedding_text TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT DEFAULT '[]',
    category TEXT DEFAULT 'general',
    confidence_threshold REAL DEFAULT 0.65,
    source TEXT DEFAULT 'manual',
    is_active INTEGER DEFAULT 1,
    embedding_text TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_fingerprint TEXT,
    user_email TEXT,
    user_phone TEXT,
    user_name TEXT,
    pwa_push_subscription TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    rag_level_used TEXT,
    metadata TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS unresolved_queries (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    user_question TEXT NOT NULL,
    user_lead_info TEXT DEFAULT '{}',
    human_answer TEXT,
    status TEXT DEFAULT 'pending',
    auto_trained_to_faq INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    tenant_id TEXT,
    actor_id TEXT,
    action TEXT NOT NULL,
    details TEXT DEFAULT '{}',
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
