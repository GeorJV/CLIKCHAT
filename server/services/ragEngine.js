/**
 * 3-LEVEL RAG ENGINE (Anti-Hallucination) with Human-in-the-Loop Fallback
 * Level 1: Episodic Session Memory
 * Level 2: Strict Vector Search on FAQs & Rules (Immediate stopping on high confidence)
 * Level 3: General Catalog & Product Knowledge
 * Fallback: Human-in-the-Loop (Lead capture, PWA push invitation, owner inbox, auto-learning)
 */

const { rankBySimilarity } = require('./embeddings');
const { generateCompletion } = require('./llmRouter');
const { queryWithTenant, query } = require('../db');

// In-memory cache for tenants, faqs, products, sessions when DB is syncing
const localStore = {
  faqs: new Map(), // tenantId -> [faqs]
  products: new Map(), // tenantId -> [products]
  messages: new Map(), // sessionId -> [messages]
  unresolved: []
};

// Sync tenant catalog and FAQs from DB or fallback
async function getTenantKnowledge(tenantId) {
  let faqs = [];
  let products = [];
  let tenant = null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId);
    const tenantRes = await query(
      isUuid ? 'SELECT * FROM tenants WHERE id = $1' : 'SELECT * FROM tenants WHERE slug = $1',
      [tenantId]
    );
    tenant = tenantRes.rows[0];

    const actualId = tenant ? tenant.id : (isUuid ? tenantId : 'a0000000-0000-0000-0000-000000000001');

    const faqsRes = await queryWithTenant(actualId, 'SELECT * FROM faqs WHERE is_active = true');
    faqs = faqsRes.rows;

    const productsRes = await queryWithTenant(actualId, 'SELECT * FROM products WHERE is_active = true');
    products = productsRes.rows;
  } catch (err) {
    console.warn('⚠️ Error en getTenantKnowledge:', err.message);
    // If DB has error, pull from memory cache
    faqs = localStore.faqs.get(tenantId) || [];
    products = localStore.products.get(tenantId) || [];
  }

  return { tenant, faqs, products };
}

/**
 * Main 3-Level RAG Execution Function
 */
async function processRAGQuery({
  tenantId,
  sessionId,
  userMessage,
  leadInfo = {},
  tenantCustomKey = null
}) {
  const { tenant, faqs, products } = await getTenantKnowledge(tenantId);
  const actualTenantId = tenant?.id || tenantId;

  // -------------------------------------------------------------
  // NIVEL 1: Memoria Episódica (Contexto de conversación del usuario)
  // -------------------------------------------------------------
  let episodicHistory = [];
  try {
    const historyRes = await queryWithTenant(
      actualTenantId,
      'SELECT sender, message, rag_level_used, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 10',
      [sessionId]
    );
    episodicHistory = historyRes.rows;
  } catch (err) {
    episodicHistory = localStore.messages.get(sessionId) || [];
  }

  // -------------------------------------------------------------
  // NIVEL 2: FAQs y Reglas Estrictas (Detención Inmediata)
  // -------------------------------------------------------------
  if (faqs && faqs.length > 0) {
    const faqMatches = rankBySimilarity(
      userMessage,
      faqs,
      (f) => `${f.question} ${f.category || ''} ${(f.keywords || []).join(' ')}`
    );

    if (faqMatches.length > 0) {
      const topFaq = faqMatches[0];
      const threshold = parseFloat(topFaq.item.confidence_threshold) || 0.68;

      if (topFaq.score >= threshold) {
        console.log(`🎯 [RAG NIVEL 2] Coincidencia exacta FAQ encontrada (Score: ${topFaq.score.toFixed(3)} >= ${threshold}). Deteniendo búsqueda.`);
        
        // Save message to episodic memory
        await saveChatMessage(actualTenantId, sessionId, userMessage, topFaq.item.answer, 'level_2_faq', {
          faqId: topFaq.item.id,
          score: topFaq.score
        });

        return {
          level: 'level_2_faq',
          levelLabel: 'Nivel 2: FAQs & Reglas Estrictas (Respuesta Verificada)',
          confidence: topFaq.score,
          answer: topFaq.item.answer,
          matchedItem: topFaq.item,
          stoppedEarly: true
        };
      }
    }
  }

  // -------------------------------------------------------------
  // NIVEL 3: Catálogo General y Documentos de Negocio
  // -------------------------------------------------------------
  let matchedProducts = [];
  if (products && products.length > 0) {
    const cleanUser = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const productMatches = rankBySimilarity(
      userMessage,
      products,
      (p) => `${p.name} ${p.name} ${p.short_description || ''} ${p.full_description || ''} ${(p.benefits || []).join(' ')}`
    ).map(res => {
      // Add boost if product name is explicitly mentioned in query
      const pNameClean = res.item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const nameWords = pNameClean.split(/\s+/).filter(w => w.length > 2);
      const matchesName = nameWords.some(w => cleanUser.includes(w));
      const finalScore = matchesName ? Math.max(res.score, 0.70) : res.score;
      return { item: res.item, score: finalScore };
    }).sort((a, b) => b.score - a.score);

    // If similarity is solid (>= 0.35 or name boost), use product knowledge
    matchedProducts = productMatches.filter(p => p.score >= 0.35).map(p => p.item);

    if (matchedProducts.length > 0) {
      const bestProduct = matchedProducts[0];
      console.log(`📦 [RAG NIVEL 3] Información de catálogo encontrada para '${bestProduct.name}'.`);

      // Prepare context verified strictly from product specs
      const productContext = matchedProducts.slice(0, 3).map(p => `
PRODUCTO: ${p.name}
PRECIO: $${p.price} ${p.currency || 'USD'}
DESCRIPCIÓN: ${p.full_description || p.short_description}
BENEFICIOS CLAVE: ${(p.benefits || []).join('; ')}
DETALLES TÉCNICOS: ${JSON.stringify(p.details || {})}
ENLACE DE COMPRA: ${p.cta_url || ''}
      `.trim()).join('\n---\n');

      const systemPrompt = tenant?.system_prompt || 'Eres el asesor comercial de la tienda. Tu respuesta debe ser persuasiva, resaltar beneficios y guiar al usuario a comprar.';

      const completion = await generateCompletion({
        systemPrompt,
        userMessage,
        history: episodicHistory,
        context: productContext,
        tenantCustomKey: tenant?.custom_llm_key || tenantCustomKey
      });

      // Save message to episodic memory
      await saveChatMessage(actualTenantId, sessionId, userMessage, completion.text, 'level_3_catalog', {
        productsCount: matchedProducts.length,
        primaryProduct: bestProduct.id
      });

      return {
        level: 'level_3_catalog',
        levelLabel: 'Nivel 3: Catálogo y Especificaciones Oficiales',
        confidence: productMatches[0].score,
        answer: completion.text,
        products: matchedProducts.slice(0, 2),
        stoppedEarly: false
      };
    }
  }

  // -------------------------------------------------------------
  // FALLBACK: Human-in-the-Loop (Anti-Alucinaciones Estricto)
  // Si ningún nivel tiene alta confianza, la IA NO DEBE INVENTAR.
  // -------------------------------------------------------------
  console.log(`⚠️ [RAG FALLBACK] Pregunta fuera del catálogo/FAQs. Activando Human-in-the-Loop.`);

  let unresolvedId = require('uuid').v4();
  try {
    await query(
      `INSERT INTO unresolved_queries (id, tenant_id, session_id, user_question, user_lead_info, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [unresolvedId, actualTenantId, sessionId, userMessage, JSON.stringify(leadInfo)]
    );
  } catch (err) {
    unresolvedId = 'mem_' + Date.now();
    localStore.unresolved.push({
      id: unresolvedId,
      tenantId: actualTenantId,
      sessionId,
      user_question: userMessage,
      user_lead_info: leadInfo,
      status: 'pending',
      created_at: new Date()
    });
  }

  const fallbackResponse = `Esa es una consulta muy puntual y no quiero darte información inexacta. 
He registrado tu duda para que nuestro equipo comercial te responda con todos los detalles. 
Déjanos tu nombre o WhatsApp, o activa las notificaciones de la App para avisarte al instante en cuanto el asesor te responda.`;

  await saveChatMessage(actualTenantId, sessionId, userMessage, fallbackResponse, 'fallback_hitl', {
    unresolvedId
  });

  return {
    level: 'fallback_hitl',
    levelLabel: 'Fallback: Human-in-the-Loop (Consulta Enviada al Dueño)',
    confidence: 0.0,
    answer: fallbackResponse,
    unresolvedQueryId: unresolvedId,
    requiresLeadInfo: true,
    isFallback: true
  };
}

// Helper to save messages
async function saveChatMessage(tenantId, sessionId, userMsg, botMsg, level, context = {}) {
  const { v4: uuidv4 } = require('uuid');
  try {
    // 0. Ensure session exists
    await query(
      'INSERT INTO chat_sessions (id, tenant_id) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
      [sessionId, tenantId]
    );
    // 1. Save user message
    await query(
      'INSERT INTO chat_messages (id, tenant_id, session_id, sender, message, rag_level_used) VALUES ($1, $2, $3, $4, $5, $6)',
      [uuidv4(), tenantId, sessionId, 'user', userMsg, level]
    );
    // 2. Save assistant response
    await query(
      'INSERT INTO chat_messages (id, tenant_id, session_id, sender, message, rag_level_used, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [uuidv4(), tenantId, sessionId, 'assistant', botMsg, level, JSON.stringify(context)]
    );
  } catch (err) {
    // Local memory fallback
    if (!localStore.messages.has(sessionId)) {
      localStore.messages.set(sessionId, []);
    }
    const list = localStore.messages.get(sessionId);
    list.push({ sender: 'user', message: userMsg, rag_level_used: level, created_at: new Date() });
    list.push({ sender: 'assistant', message: botMsg, rag_level_used: level, created_at: new Date() });
  }
}

// Auto-inject answered query into Level 2 FAQs (Self-learning loop)
async function injectAnswerIntoFaq(tenantId, question, answer, category = 'general') {
  try {
    const res = await query(
      `INSERT INTO faqs (tenant_id, question, answer, confidence_threshold, category, source)
       VALUES ($1, $2, $3, 0.65, $4, 'hitl_audit') RETURNING *`,
      [tenantId, question, answer, category]
    );
    console.log(`💡 [AUTO-LEARN] Pregunta agregada exitosamente a FAQs Nivel 2: "${question}"`);
    return res.rows[0];
  } catch (err) {
    console.error('Error auto-inyectando FAQ:', err.message);
    throw err;
  }
}

module.exports = {
  processRAGQuery,
  injectAnswerIntoFaq,
  localStore
};
