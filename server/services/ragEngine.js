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
  // NIVEL 1 & 4: Memoria Episódica y Memoria Histórica del Cliente
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

  // 4. Memoria Histórica Multi-Sesión (Si el cliente tiene teléfono/email previo)
  let crossSessionMemoryText = '';
  if (leadInfo?.phone || leadInfo?.email) {
    try {
      const priorRes = await query(
        `SELECT m.sender, m.message, m.created_at
         FROM chat_messages m
         JOIN chat_sessions s ON m.session_id = s.id
         WHERE s.tenant_id = $1 AND s.id != $2 AND (s.user_phone = $3 OR s.user_email = $4)
         ORDER BY m.created_at DESC LIMIT 5`,
        [actualTenantId, sessionId, leadInfo.phone || '', leadInfo.email || '']
      );
      if (priorRes.rows.length > 0) {
        crossSessionMemoryText = priorRes.rows.reverse().map(r => `${r.sender}: ${r.message}`).join('\n');
      }
    } catch (e) {
      // ignore
    }
  }

  // -------------------------------------------------------------
  // BLOQUE 1: RAG Caché Semántico (Score >= 0.88 -> $0 Costo / Sin LLM)
  // -------------------------------------------------------------
  if (faqs && faqs.length > 0) {
    const faqMatches = rankBySimilarity(
      userMessage,
      faqs,
      (f) => `${f.question} ${f.category || ''} ${(f.keywords || []).join(' ')}`
    );

    if (faqMatches.length > 0) {
      const topFaq = faqMatches[0];
      const strictCacheScore = 0.88;
      const standardThreshold = parseFloat(topFaq.item.confidence_threshold) || 0.65;

      // 1. RAG Caché Semántico Estricto (>= 0.88)
      if (topFaq.score >= strictCacheScore) {
        console.log(`⚡ [1. RAG CACHÉ SEMÁNTICO] Hit exacto (Score: ${topFaq.score.toFixed(3)} >= 0.88). Respuesta instantánea $0.`);
        await saveChatMessage(actualTenantId, sessionId, userMessage, topFaq.item.answer, 'semantic_cache', {
          faqId: topFaq.item.id,
          score: topFaq.score,
          zeroCost: true
        });

        return {
          level: 'semantic_cache',
          levelLabel: '1. RAG Caché Semántico: $0 (Sin consumo de LLM)',
          confidence: topFaq.score,
          answer: topFaq.item.answer,
          matchedItem: topFaq.item,
          stoppedEarly: true,
          zeroCost: true
        };
      }

      // Early stopping estándar de FAQ (0.65 - 0.87)
      if (topFaq.score >= standardThreshold) {
        console.log(`🎯 [RAG NIVEL 2] Coincidencia FAQ encontrada (Score: ${topFaq.score.toFixed(3)} >= ${standardThreshold}).`);
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
          stoppedEarly: true,
          zeroCost: true
        };
      }
    }
  }

  // -------------------------------------------------------------
  // BLOQUE 2 & 3: RAG No Estructurado (Manuales) + Estructurado (D1 Catálogo)
  // -------------------------------------------------------------
  const { searchDocumentChunks } = require('./documentRAG');
  const docChunks = await searchDocumentChunks(actualTenantId, userMessage, 2);

  let matchedProducts = [];
  if (products && products.length > 0) {
    const cleanUser = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const productMatches = rankBySimilarity(
      userMessage,
      products,
      (p) => `${p.name} ${p.name} ${p.short_description || ''} ${p.full_description || ''} ${(p.benefits || []).join(' ')}`
    ).map(res => {
      const pNameClean = res.item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const nameWords = pNameClean.split(/\s+/).filter(w => w.length > 2);
      const matchesName = nameWords.some(w => cleanUser.includes(w));
      const finalScore = matchesName ? Math.max(res.score, 0.70) : res.score;
      return { item: res.item, score: finalScore };
    }).sort((a, b) => b.score - a.score);

    matchedProducts = productMatches.filter(p => p.score >= 0.35).map(p => p.item);
  }

  // Si encontramos productos O fragmentos de manuales O memoria de cliente
  if (matchedProducts.length > 0 || docChunks.length > 0 || crossSessionMemoryText || episodicHistory.length > 0) {
    let combinedContext = '';

    if (matchedProducts.length > 0) {
      combinedContext += '\n--- 3. DATOS ESTRUCTURADOS DE PRODUCTO (Cloudflare D1) ---\n' +
        matchedProducts.slice(0, 3).map(p => `
PRODUCTO: ${p.name}
PRECIO: $${p.price} ${p.currency || 'USD'}
DESCRIPCIÓN: ${p.full_description || p.short_description}
BENEFICIOS: ${(p.benefits || []).join('; ')}
DETALLES TÉCNICOS: ${JSON.stringify(p.details || {})}
ENLACE COMPRA: ${p.cta_url || ''}
        `.trim()).join('\n---\n');
    }

    if (docChunks.length > 0) {
      combinedContext += '\n--- 2. MANUALES Y DOCUMENTOS NO ESTRUCTURADOS (Workers AI) ---\n' +
        docChunks.map(c => `DOCUMENTO: "${c.docTitle}"\nCONTENIDO OFICIAL: ${c.content}`).join('\n---\n');
    }

    if (crossSessionMemoryText) {
      combinedContext += `\n--- 4. MEMORIA HISTÓRICA DE SESIONES PREVIAS DEL CLIENTE ---\n${crossSessionMemoryText}\n`;
    }

    const systemPrompt = tenant?.system_prompt || 'Eres el asesor comercial de la tienda. Tu objetivo es asesorar persuasivamente guiando al usuario a comprar sin inventar información no verificada. Si el usuario pregunta por conversaciones pasadas, usa la memoria histórica proporcionada.';

    const completion = await generateCompletion({
      systemPrompt,
      userMessage,
      history: episodicHistory,
      context: combinedContext,
      tenantCustomKey: tenant?.custom_llm_key || tenantCustomKey
    });

    let finalLevel = 'level_3_catalog';
    let finalLabel = '3. RAG Estructurado Determinista (Catálogo y Precios Oficiales D1)';

    if (crossSessionMemoryText && matchedProducts.length === 0 && docChunks.length === 0) {
      finalLevel = 'customer_memory';
      finalLabel = '4. RAG de Memoria Histórica Continua (Multi-Sesión)';
    } else if (docChunks.length > 0 && matchedProducts.length === 0) {
      finalLevel = 'unstructured_docs';
      finalLabel = '2. RAG No Estructurado (Manuales y Políticas Oficiales)';
    }

    await saveChatMessage(actualTenantId, sessionId, userMessage, completion.text, finalLevel, {
      productsCount: matchedProducts.length,
      chunksCount: docChunks.length,
      hasCrossMemory: !!crossSessionMemoryText
    });

    return {
      level: finalLevel,
      levelLabel: finalLabel,
      confidence: matchedProducts[0]?.score || docChunks[0]?.score || 0.85,
      answer: completion.text,
      products: matchedProducts.slice(0, 2),
      docChunks,
      hasCrossSessionMemory: !!crossSessionMemoryText,
      stoppedEarly: false
    };
  }

  // -------------------------------------------------------------
  // FALLBACK: Human-in-the-Loop (Anti-Alucinaciones Estricto)
  // Si ningún nivel tiene alta confianza, la IA NO DEBE INVENTAR.
  // -------------------------------------------------------------
  console.log(`⚠️ [RAG FALLBACK] Pregunta fuera del catálogo/FAQs. Activando Human-in-the-Loop.`);

  let unresolvedId = require('uuid').v4();
  try {
    // Ensure chat session exists before inserting unresolved query for foreign key integrity
    await query(
      'INSERT OR IGNORE INTO chat_sessions (id, tenant_id) VALUES ($1, $2)',
      [sessionId, actualTenantId]
    );

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
  const { v4: uuidv4 } = require('uuid');
  const faqId = uuidv4();

  // Extract keywords to guarantee strong vector/similarity matches for future queries
  const stopWords = new Set(['que', 'como', 'cuando', 'donde', 'por', 'para', 'con', 'los', 'las', 'una', 'uno', 'del', 'cual', 'cuanto', 'tiene', 'tienen', 'hacen']);
  const keywords = question
    .toLowerCase()
    .replace(/[^a-záéíóúñ0-9\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  try {
    await query(
      `INSERT INTO faqs (id, tenant_id, question, answer, keywords, confidence_threshold, category, source)
       VALUES ($1, $2, $3, $4, $5, 0.65, $6, 'hitl_audit')`,
      [faqId, tenantId, question, answer, JSON.stringify(keywords), category]
    );
    console.log(`💡 [AUTO-LEARN] Pregunta agregada exitosamente a FAQs Nivel 2 en Cloudflare D1: "${question}"`);
    return { id: faqId, tenantId, question, answer, keywords, category };
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
