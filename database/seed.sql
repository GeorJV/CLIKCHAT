-- ==============================================================================
-- CLIKCHAT SEED DATA (Demo Tenant, Products with Multi-Photos, FAQs, HITL Demo)
-- ==============================================================================

-- 1. Insert Default Tenants
INSERT INTO tenants (
    id, slug, name, owner_email, owner_name, bot_name, avatar_url,
    welcome_message, system_prompt, primary_color, cta_text, cta_url, plan, monthly_price, status
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'demo-store',
    'ClikChat Boutique & Tech',
    'tienda@clikchat.com',
    'Carlos Mendoza',
    'Sofía - Asesora VIP',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    '¡Hola! Te doy la bienvenida a ClikChat Boutique. Soy Sofía, tu asistente de ventas personal. ¿Te gustaría conocer nuestras promociones del día o detalles de algún producto?',
    'Eres Sofía, una asesora comercial de alto nivel de ClikChat Boutique. Tu tono es sofisticado, persuasivo y muy servicial. Cuando hables de productos, destaca sus beneficios clave y llama al usuario a comprarlos o consultarlos de inmediato.',
    '#6366f1',
    'Comprar con Descuento',
    'https://wa.me/50688888888?text=Hola%20Sofía,%20deseo%20comprar%20desde%20ClikChat',
    'pro',
    79.00,
    'active'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'moda-urbana',
    'Urban Trend Fashion',
    'contacto@urbantrend.com',
    'Valeria Gómez',
    'Leo - Stylist Bot',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    '¡Qué tal! Soy Leo, tu personal shopper inteligente. ¿Qué estilo o prenda estás buscando hoy?',
    'Eres Leo, un estilista urbano digital. Hablas con entusiasmo y recomiendas combinaciones modernas.',
    '#ec4899',
    'Ver Colección',
    'https://wa.me/50677777777?text=Quiero%20asesoría%20de%20moda',
    'enterprise',
    199.00,
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Users
INSERT INTO users (id, tenant_id, email, password_hash, name, role) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    NULL,
    'admin@clikchat.com',
    'pbkdf2_admin_clikchat_2026',
    'Super Administrador ClikChat',
    'superadmin'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'carlos@clikchat.com',
    'pbkdf2_owner_carlos_2026',
    'Carlos Mendoza',
    'tenant_owner'
)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Products (Feeds Level 3 RAG) - Valid Hex UUIDs
INSERT INTO products (
    id, tenant_id, name, slug, price, currency, short_description, full_description,
    images, benefits, details, cta_label, cta_url
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Cronógrafo Suizo Royal Black',
    'cronografo-suizo-royal-black',
    249.00,
    'USD',
    'Reloj automático sumergible de acero quirúrgico 316L con cristal de zafiro irrayable.',
    'El Cronógrafo Suizo Royal Black representa la cúspide de la ingeniería de precisión. Con maquinaria automática de 24 rubíes, reserva de marcha de 48 horas, cristal de zafiro antirreflejo y resistencia al agua de 10 ATM (100 metros). Ideal para ejecutivos y amantes de la elegancia perdurable.',
    '[
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80"
    ]'::jsonb,
    '[
        "Cristal de Zafiro ultra resistente a impactos y arañazos",
        "Maquinaria automática suiza con 48h de reserva de marcha",
        "Resistencia 10 ATM para natación y deportes náuticos",
        "Garantía oficial internacional de 3 años"
    ]'::jsonb,
    '{
        "Material": "Acero Quirúrgico 316L ionizado en negro mate",
        "Diámetro de caja": "42 mm",
        "Grosor": "11.5 mm",
        "Correa": "Cuero italiano genuino con cierre mariposa deployante",
        "Resistencia al Agua": "10 ATM / 100 Metros",
        "Calibre": "Automático 28800 vph"
    }'::jsonb,
    'Comprar Reloj ($249)',
    'https://wa.me/50688888888?text=Hola,%20deseo%20comprar%20el%20Cronografo%20Suizo%20Royal%20Black'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Audífonos Titanium Noise-Cancelling Max',
    'audifonos-titanium-noise-cancelling-max',
    189.00,
    'USD',
    'Auriculares inalámbricos de alta fidelidad con cancelación activa de ruido híbrida de 45dB.',
    'Experimenta un audio inmersivo con controladores de neodimio de 40mm y cancelación activa de ruido de hasta 45dB. Batería de 60 horas continuas, almohadillas viscoelásticas transpirables y conectividad Bluetooth 5.4 multipunto para conectar laptop y teléfono simultáneamente.',
    '[
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ]'::jsonb,
    '[
        "Cancelación de ruido activa híbrida inteligente (-45dB)",
        "Hasta 60 horas de batería con carga rápida USB-C (10 min = 5 hrs)",
        "Códec LDAC y audio de alta resolución certificado",
        "Micrófonos con reducción de ruido ambiental por IA para llamadas nítidas"
    ]'::jsonb,
    '{
        "Tipo": "Over-Ear Circumauriculares",
        "Peso": "250 gramos ultra livianos",
        "Conectividad": "Bluetooth 5.4 + Cable jack 3.5mm libre de oxígeno",
        "Batería": "800 mAh Li-Po con 60h de autonomía",
        "Control": "Superficie táctil capacitiva y botón de transparencia"
    }'::jsonb,
    'Adquirir Audífonos ($189)',
    'https://wa.me/50688888888?text=Hola,%20deseo%20comprar%20los%20Audifonos%20Titanium'
),
(
    'd0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Gafas Polarizadas Carbon Aviator',
    'gafas-polarizadas-carbon-aviator',
    95.00,
    'USD',
    'Gafas de sol ultraligeras de fibra de carbono aeroespacial con lentes polarizadas UV400.',
    'Diseñadas para la máxima comodidad y protección ocular. Armazón fabricado en fibra de carbono auténtica de grado aeroespacial que pesa solo 19 gramos. Lentes TAC de 7 capas con filtro polarizador anti-reflejo y protección 100% contra rayos UVA y UVB.',
    '[
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
    ]'::jsonb,
    '[
        "Peso pluma de 19g para uso prolongado sin marcas en la nariz",
        "Lentes Polarizadas de 7 capas con máxima nitidez de contraste",
        "Bisagras de titanio flexibles con memoria de forma",
        "Incluye estuche rígido de cuero y paño de microfibra de regalo"
    ]'::jsonb,
    '{
        "Material de Armazón": "Fibra de carbono aeroespacial 3K",
        "Protección": "UV400 Categoría 3 (99.9% bloqueo solar)",
        "Dimensiones": "Lente 58mm - Puente 14mm - Varilla 140mm",
        "Color": "Negro mate con cristales degradados gris humo"
    }'::jsonb,
    'Comprar Gafas ($95)',
    'https://wa.me/50688888888?text=Hola,%20deseo%20comprar%20las%20Gafas%20Carbon%20Aviator'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert FAQs (Feeds Level 2 RAG - Strict stopping rules)
INSERT INTO faqs (id, tenant_id, question, answer, confidence_threshold, category, source) VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '¿Cuáles son los métodos de pago aceptados?',
    'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias directas, SINPE Móvil, PayPal y pago contra entrega en ciudades principales.',
    0.80,
    'pagos',
    'manual'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '¿Cuánto tiempo tarda en llegar mi pedido y cuánto cuesta el envío?',
    'Los envíos estándar tardan entre 24 y 48 horas hábiles a todo el país. Para compras mayores a $50 el envío es 100% gratuito. Para compras inferiores, la tarifa plana de envío es de $5.00.',
    0.82,
    'envios',
    'manual'
),
(
    'f0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    '¿Tienen garantía los productos y cómo funciona la política de devoluciones?',
    'Todos nuestros productos cuentan con garantía oficial de satisfacción de 30 días con reemplazo o reembolso total directo. Además, artículos tecnológicos y relojes disponen de hasta 3 años de garantía del fabricante.',
    0.80,
    'garantia',
    'manual'
),
(
    'f0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    '¿Cómo puedo rastrear mi paquete una vez enviado?',
    'En cuanto tu paquete sea despachado, recibirás un mensaje de WhatsApp y correo electrónico con el número de guía y el enlace directo para ver la ubicación en tiempo real.',
    0.80,
    'envios',
    'manual'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Unresolved Query Demo (For HITL Panel testing) - Valid Hex UUID
INSERT INTO unresolved_queries (
    id, tenant_id, user_question, user_lead_info, status, created_at
) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '¿Hacen grabados personalizados con láser en la tapa trasera del reloj?',
    '{"name": "Mateo Rojas", "phone": "+506 8765-4321", "email": "mateo.rojas@gmail.com"}'::jsonb,
    'pending',
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;
