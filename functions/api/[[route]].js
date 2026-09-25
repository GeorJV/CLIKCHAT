/**
 * Cloudflare Pages Functions API Gateway
 * Native Edge execution for ClikChat on https://clikchat.pages.dev/api/*
 */

const CF_D1_DATABASE_ID = 'e0f64033-4d16-41b9-800b-baae12787d1c';
const CLOUDFLARE_ACCOUNT_ID = '01514e27c0cdd221efd91900be83fb16';

function getD1Token(env) {
  if (env?.CLOUDFLARE_API_TOKEN) return env.CLOUDFLARE_API_TOKEN;
  if (env?.CF_API_TOKEN) return env.CF_API_TOKEN;
  try {
    return atob('Y2Z1dF9sRkl0aVBYbGZQMlo3V2dIU25JWXZuamtmYTNQTGo0UHM4cmVkWmRZYjFmN2JlM2E=');
  } catch (e) {
    return '';
  }
}

const D1_ENDPOINT = 'https://api.cloudflare.com/client/v4/accounts/' + CLOUDFLARE_ACCOUNT_ID + '/d1/database/' + CF_D1_DATABASE_ID + '/query';

async function executeD1(sql, params = []) {
  const sqliteSql = sql.replace(/\$(\d+)/g, '?');
  const token = getD1Token(currentEnv);
  const response = await fetch(D1_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: sqliteSql, params })
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'Error en D1');
  }
  const firstResult = data.result?.[0];
  const rawRows = firstResult?.results || [];
  return rawRows.map(row => {
    const parsed = { ...row };
    for (const key of ['images', 'benefits', 'details', 'keywords', 'metadata']) {
      if (typeof parsed[key] === 'string' && (parsed[key].startsWith('[') || parsed[key].startsWith('{'))) {
        try { parsed[key] = JSON.parse(parsed[key]); } catch (e) {}
      }
    }
    return parsed;
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

let currentEnv = {};

// ==============================================================================
// RAG SEMÁNTICO HÍBRIDO & MULTI-LLM EDGE ENGINE
// ==============================================================================

const STOP_WORDS = new Set([
  'de', 'la', 'los', 'las', 'el', 'en', 'por', 'para', 'con', 'y', 'a', 'que', 'del', 'al',
  'un', 'una', 'unos', 'unas', 'es', 'son', 'se', 'su', 'sus', 'lo', 'le', 'les', 'o', 'u',
  'como', 'pero', 'mas', 'si', 'no', 'mi', 'tu', 'te', 'me', 'nos', 'the', 'of', 'and', 'to',
  'tiene', 'tienen', 'tienes', 'tengo', 'tenemos', 'hay', 'hace', 'puedo', 'puede', 'quiero',
  'hola', 'buenas', 'gracias', 'este', 'esta', 'estos', 'estas',
  'dan', 'dar', 'dame', 'danos', 'quisiera', 'averiguar', 'pregunto', 'pregunta', 'preguntar',
  'saber', 'consulta', 'consultar', 'informacion'
]);

function stemSpanish(w) {
  if (!w || w.length <= 3) return w;
  return w
    .replace(/(es|s)$/i, '')
    .replace(/(ando|iendo|aron|eron|aban|abas|aba|aran|aras|ara|ado|ido|ar|er|ir|an|en|as|es|ó|o|a|e)$/i, '');
}

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .map(stemSpanish);
}

function isFuzzyTokenMatch(a, b) {
  if (a === b) return true;
  if ((a.length >= 4 && b.startsWith(a)) || (b.length >= 4 && a.startsWith(b))) return true;
  if (a.length >= 5 && b.length >= 5 && Math.abs(a.length - b.length) <= 2) {
    let diff = 0;
    const minL = Math.min(a.length, b.length);
    for (let i = 0; i < minL; i++) {
      if (a[i] !== b[i]) diff++;
      if (diff > 2) return false;
    }
    return true;
  }
  return false;
}

function computeOverlapScore(textA, textB) {
  if (!textA || !textB) return 0;
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  let matches = 0;
  for (const t of tokensA) {
    for (const b of tokensB) {
      if (isFuzzyTokenMatch(t, b)) {
        matches += 1.0;
        break;
      }
    }
  }
  const coverage = matches / tokensA.length;
  const dice = (2 * matches) / (tokensA.length + tokensB.length);
  // Para consultas cortas (< 3 tokens), el Dice simétrico previene que una sola palabra genere 100% de coincidencia
  if (tokensA.length < 3) return dice;
  return Math.max(coverage * 0.4 + dice * 0.6, dice);
}

async function callEdgeLLM({ systemPrompt, context, history, userMessage, env, customKey }) {
  let userCustomConfig = null;
  if (customKey && typeof customKey === 'string' && customKey.trim().length > 0) {
    if (customKey.trim().startsWith('{')) {
      try { userCustomConfig = JSON.parse(customKey.trim()); } catch(e) {}
    } else {
      userCustomConfig = { key: customKey.trim() };
    }
  }

  const systemContent = `${systemPrompt}

[INFORMACIÓN VERIFICADA DEL NEGOCIO / POLÍTICAS / CATÁLOGO / INVENTARIO]:
${context}

NORMAS ESTRICTAS DE ATENCIÓN Y COMPORTAMIENTO COMERCIAL:
1. PERSONALIDAD Y TONO (HUMANO, INTELIGENTE, CÁLIDO):
   - Eres una asesora comercial VIP de alto nivel: carismática, sumamente inteligente, empática, persuasiva y natural.
   - Habla como una persona real en WhatsApp, cercana, fluida y con excelente vibra. Cero respuestas secas, frías, tiesas o robóticas.
2. REGLA ESTRICTA DE BREVEDAD (CERO BIBLIAS O LISTAS GIGANTES):
   - En un chat de ventas nadie lee párrafos enormes ni respuestas interminables.
   - Responde en MÁXIMO 2 o 3 párrafos cortos (o máximo 3 viñetas breves y directas).
   - NUNCA generes listas largas de 5, 7 o 10 puntos. Si hay muchos beneficios o canales, menciona solo los 2 o 3 más potentes y relevantes, e invita a profundizar.
3. FORMATO VISUAL LIMPIO Y ELEGANTE:
   - PROHIBIDO usar encabezados de código markdown como '###' o '##'.
   - PROHIBIDO pegar URLs crudas o enlaces larguísimos.
   - Usa negrita para enfatizar conceptos clave con moderación y utiliza emojis con buen gusto (ej: ✨, 🚀, 💡, 📲).
4. PRECISIÓN, CERTEZA Y PRIORIDAD ABSOLUTA DEL CONOCIMIENTO EN TIEMPO REAL:
   - La sección '[INFORMACIÓN VERIFICADA DEL NEGOCIO / POLÍTICAS / CATÁLOGO / INVENTARIO]' representa el estado EXACTO, VIGENTE y EN TIEMPO REAL del negocio en este instante. Es tu ÚNICA y ABSOLUTA FUENTE DE VERDAD.
   - CERO ARRASTRE DE HISTORIAL OBSOLETO: Si en mensajes anteriores de esta conversación tú o el usuario hablaron sobre algún descuento (ej: VIP, cupón, rebaja, código especial), producto, precio o política que YA NO APARECE en la información verificada actual, significa que FUE ELIMINADO O MODIFICADO POR EL NEGOCIO. Queda TERMINANTEMENTE PROHIBIDO seguir repitiendo o confirmando datos o descuentos que ya no figuren en la información verificada actual. Si el usuario insiste, aclara con amabilidad que dicha condición o promoción ya no se encuentra vigente.
   - Si existen documentos, manuales o políticas activas con promociones, descuentos o cupones específicos, prevalecen con exactitud matemática (porcentajes, requisitos, vigencia).
   - Si NO existen documentos o FAQs con promociones vigentes en la información verificada actual, queda ESTRICTAMENTE PROHIBIDO inventar descuentos o códigos ficticios; remite amablemente a los precios de lista del catálogo oficial o a consultar por WhatsApp.
5. CIERRE CONVERSACIONAL NATURAL:
   - Termina siempre con una sola pregunta abierta, amable y entusiasta que invite al cliente a continuar la charla de forma fluida (ej: '¿En qué canal te gustaría automatizar primero?' o '¿Te gustaría ver una prueba con tus propios productos?').`;

  const messages = [
    { role: 'system', content: systemContent },
    ...history.slice(-6).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.message
    })),
    { role: 'user', content: userMessage }
  ];

  // CASO A: El usuario configuró su propia IA (customKey)
  if (userCustomConfig?.key) {
    const cKey = userCustomConfig.key;
    const cProvider = userCustomConfig.provider || (cKey.startsWith('AIza') || cKey.startsWith('AQ.') ? 'google' : cKey.startsWith('sk-') ? 'openai' : 'openrouter');
    const cModel = userCustomConfig.model;

    // 1. Google AI Studio Propia
    if (cProvider === 'google') {
      try {
        const historyText = history.slice(-4).map(h => `${h.sender === 'user' ? 'Cliente' : 'Asistente'}: ${h.message}`).join('\n');
        const fullPrompt = `${systemContent}\n\n${historyText ? `[HISTORIAL RECIENTE]:\n${historyText}\n\n` : ''}Cliente: ${userMessage}\nAsistente:`;
        const gUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cModel || 'gemini-2.0-flash'}:generateContent?key=${cKey}`;
        const gResp = await fetch(gUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 650 }
          })
        });
        if (gResp.ok) {
          const gData = await gResp.json();
          const gText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText && gText.trim().length > 0) return { text: gText.trim(), provider: 'custom_google_ai' };
        }
      } catch (e) {
        console.warn('Custom Google AI falló:', e.message);
      }
    }

    // 2. OpenAI Propia
    if (cProvider === 'openai') {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cKey}`
          },
          body: JSON.stringify({
            model: cModel || 'gpt-4o-mini',
            messages,
            temperature: 0.35,
            max_tokens: 650
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          const text = data.choices?.[0]?.message?.content;
          if (text && text.trim().length > 0) return { text: text.trim(), provider: 'custom_openai' };
        }
      } catch (e) {
        console.warn('Custom OpenAI falló:', e.message);
      }
    }

    // 3. OpenRouter / Otro Propio
    try {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cKey}`,
          'HTTP-Referer': 'https://clikchat.pages.dev',
          'X-Title': 'ClikChat Edge AI'
        },
        body: JSON.stringify({
          model: cModel || 'deepseek/deepseek-chat',
          messages,
          temperature: 0.35,
          max_tokens: 650
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) return { text: text.trim(), provider: 'custom_openrouter' };
      }
    } catch (e) {
      console.warn('Custom OpenRouter falló:', e.message);
    }
  }

  // CASO B: Motor Inteligente del Sistema (Gobernado por Super Admin: 90% DeepSeek / 10% GPT-4o-mini)
  const openRouterKey = env?.OPENROUTER_API_KEY || (() => {
    try { return atob('c2stb3ItdjEtZjVlNzBmZjUwYzViNzIwZDg1NWFmOWM3ZWQzN2E2YWYwZTcwMjY4NGZjZjY0ZWQxZTQ0OTgwNjRlYzhkZDg1ZQ=='); } catch(e) { return ''; }
  })();
  const googleKey = env?.GOOGLE_AI_STUDIO_KEY || (() => {
    try { return atob('QVEuQWI4Uk42SVIxRnNkTTRIdFQ4cElwLTVUd084aXFPdHh0ck9XcUlVeVRjUllKdHJXNXc='); } catch(e) { return ''; }
  })();

  // Detección heurística de consultas complejas (comparativas, cálculos, objeciones lógicas)
  const reasoningRegex = /\b(comparar|comparaci[oó]n|comparado|comparativa|diferencia|cu[aá]l es mejor|por qu[eé] deber[ií]a|descuento total|calcula|presupuesto|cotizaci[oó]n detallada|pros y contras|especificaciones t[eé]cnicas|analiza|ventajas|desventajas)\b/i;
  const isReasoning = reasoningRegex.test(userMessage);

  const primaryModel = isReasoning ? 'openai/gpt-4o-mini' : 'deepseek/deepseek-chat';
  const fallbackModel = isReasoning ? 'deepseek/deepseek-chat' : 'openai/gpt-4o-mini';

  // 1. Intento con Modelo Principal (90% DeepSeek, 10% GPT-4o-mini)
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://clikchat.pages.dev',
        'X-Title': 'ClikChat Edge AI'
      },
      body: JSON.stringify({
        model: primaryModel,
        messages,
        temperature: isReasoning ? 0.45 : 0.55,
        max_tokens: 380
      })
    });
    if (resp.ok) {
      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && text.trim().length > 0) return { text: text.trim(), provider: primaryModel };
    }
  } catch (e) {
    console.warn(`Fallo en modelo principal (${primaryModel}):`, e.message);
  }

  // 2. Respaldo Cruzado Automático (Si DeepSeek falla usa GPT, si GPT falla usa DeepSeek)
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://clikchat.pages.dev',
        'X-Title': 'ClikChat Edge AI'
      },
      body: JSON.stringify({
        model: fallbackModel,
        messages,
        temperature: 0.55,
        max_tokens: 380
      })
    });
    if (resp.ok) {
      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && text.trim().length > 0) return { text: text.trim(), provider: fallbackModel };
    }
  } catch (e) {
    console.warn(`Fallo en respaldo cruzado (${fallbackModel}):`, e.message);
  }

  // 3. Respaldo: Cloudflare Workers AI Llama 3
  if (env?.AI) {
    try {
      const cfResp = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: systemContent },
          ...history.slice(-4).map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.message })),
          { role: 'user', content: userMessage }
        ]
      });
      if (cfResp?.response) return { text: cfResp.response.trim(), provider: 'cloudflare_workers_ai' };
    } catch (e) {
      console.warn('Workers AI Llama falló en Edge:', e.message);
    }
  }

  // 5. Plantilla de contingencia
  return {
    text: `Hola, con gusto te oriento sobre nuestro catálogo disponible:\n\n${context.replace(/\[.*?\]/g, '').trim()}\n\n¿Deseas que te ayude a coordinar la compra o tienes alguna consulta puntual?`,
    provider: 'context_template'
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  currentEnv = env || {};
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');
  const segments = path.split('/').filter(Boolean);

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204);
  }

  try {
    // Health check
    if (segments[0] === 'health') {
      return jsonResponse({ status: 'ok', service: 'Clikchat Edge Functions', timestamp: new Date().toISOString() });
    }

    // TRACKING: POST /api/products/:id/track
    if (segments[0] === 'products' && segments.length >= 3 && segments[2] === 'track' && request.method === 'POST') {
      const id = segments[1];
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { event, temperature } = body;

      // 1. Resolve real product ID and tenant ID
      const pRows = await executeD1(
        'SELECT id, tenant_id FROM products WHERE id = ?1 OR slug = ?1 LIMIT 1',
        [id]
      );
      let targetId = id;
      let targetTenant = 'a0000000-0000-0000-0000-000000000001';
      if (pRows.length > 0) {
        targetId = pRows[0].id;
        targetTenant = pRows[0].tenant_id || targetTenant;
      }

      // 2. Ensure row exists in product_metrics
      await executeD1(
        'INSERT INTO product_metrics (product_id, tenant_id, views, buy_clicks, benefit_views, cold_leads, warm_leads, hot_leads) VALUES (?1, ?2, 0, 0, 0, 0, 0, 0) ON CONFLICT(product_id) DO NOTHING',
        [targetId, targetTenant]
      );

      // Si es evento 'view', evitar doble conteo si se ejecutó hace menos de 2 segundos
      if (event === 'view') {
        const recentRows = await executeD1(
          "SELECT (strftime('%s', 'now') - strftime('%s', updated_at)) as diff_sec FROM product_metrics WHERE product_id = ?1",
          [targetId]
        );
        const diffSec = recentRows[0]?.diff_sec;
        if (diffSec !== null && diffSec !== undefined && Number(diffSec) < 2) {
          const current = await executeD1('SELECT * FROM product_metrics WHERE product_id = ?1', [targetId]);
          return jsonResponse({ success: true, event: 'view_debounced', productId: targetId, metrics: current[0] });
        }
      }

      // 3. Update counter for targetId
      let updateSql = "UPDATE product_metrics SET views = views + 1, updated_at = datetime('now') WHERE product_id = ?1";
      if (event === 'buy_click') {
        updateSql = "UPDATE product_metrics SET buy_clicks = buy_clicks + 1, hot_leads = hot_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
      } else if (event === 'benefit_view') {
        updateSql = "UPDATE product_metrics SET benefit_views = benefit_views + 1, warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
      } else if (event === 'detail_view' || event === 'spec_view' || event === 'fullscreen_view') {
        updateSql = "UPDATE product_metrics SET views = views + 1, cold_leads = cold_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
      } else if (event === 'chat_message' || event === 'message_sent') {
        updateSql = "UPDATE product_metrics SET warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
      } else if (event === 'lead') {
        if (temperature === 'hot') {
          updateSql = "UPDATE product_metrics SET hot_leads = hot_leads + 1, buy_clicks = buy_clicks + 1, updated_at = datetime('now') WHERE product_id = ?1";
        } else if (temperature === 'warm') {
          updateSql = "UPDATE product_metrics SET warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
        } else {
          updateSql = "UPDATE product_metrics SET cold_leads = cold_leads + 1, updated_at = datetime('now') WHERE product_id = ?1";
        }
      }

      await executeD1(updateSql, [targetId]);
      const updated = await executeD1('SELECT * FROM product_metrics WHERE product_id = ?1', [targetId]);
      return jsonResponse({ success: true, event, productId: targetId, metrics: updated[0] });
    }

    // SINGLE PRODUCT: GET /api/products/:id
    if (segments[0] === 'products' && segments.length === 2 && request.method === 'GET') {
      const id = segments[1];
      const rows = await executeD1(
        'SELECT p.*, COALESCE(m.views, 0) as m_views, COALESCE(m.buy_clicks, 0) as m_buy_clicks, COALESCE(m.benefit_views, 0) as m_benefit_views, COALESCE(m.cold_leads, 0) as m_cold_leads, COALESCE(m.warm_leads, 0) as m_warm_leads, COALESCE(m.hot_leads, 0) as m_hot_leads FROM products p LEFT JOIN product_metrics m ON p.id = m.product_id WHERE p.id = ?1 OR p.slug = ?1 LIMIT 1',
        [id]
      );
      if (!rows.length) return jsonResponse({ error: 'Producto no encontrado' }, 404);
      const row = rows[0];
      return jsonResponse({
        product: {
          ...row,
          metrics: {
            views: Number(row.m_views) || 0,
            buyClicks: Number(row.m_buy_clicks) || 0,
            benefitViews: Number(row.m_benefit_views) || 0,
            coldLeads: Number(row.m_cold_leads) || 0,
            warmLeads: Number(row.m_warm_leads) || 0,
            hotLeads: Number(row.m_hot_leads) || 0
          }
        }
      });
    }

    // UPDATE PRODUCT: PUT /api/products/:id
    if (segments[0] === 'products' && segments.length === 2 && request.method === 'PUT') {
      const id = segments[1];
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { name, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url, is_active, embedding_text } = body;
      await executeD1(
        'UPDATE products SET name = COALESCE(?1, name), price = COALESCE(?2, price), currency = COALESCE(?3, currency), short_description = COALESCE(?4, short_description), full_description = COALESCE(?5, full_description), images = COALESCE(?6, images), benefits = COALESCE(?7, benefits), details = COALESCE(?8, details), cta_label = COALESCE(?9, cta_label), cta_url = COALESCE(?10, cta_url), is_active = COALESCE(?11, is_active), embedding_text = COALESCE(?12, embedding_text), updated_at = datetime(\'now\') WHERE id = ?13',
        [
          name ?? null, price ?? null, currency ?? null, short_description ?? null, full_description ?? null,
          images ? JSON.stringify(images) : null, benefits ? JSON.stringify(benefits) : null,
          details ? JSON.stringify(details) : null, cta_label ?? null, cta_url ?? null,
          is_active === undefined ? null : (is_active ? 1 : 0),
          embedding_text !== undefined ? embedding_text : null, id
        ]
      );
      return jsonResponse({ success: true });
    }

    // DELETE PRODUCT: DELETE /api/products/:id
    if (segments[0] === 'products' && segments.length === 2 && request.method === 'DELETE') {
      const id = decodeURIComponent(segments[1]);
      await executeD1('DELETE FROM product_metrics WHERE product_id = ?1 OR product_id IN (SELECT id FROM products WHERE slug = ?1)', [id]);
      await executeD1('DELETE FROM products WHERE id = ?1 OR slug = ?1', [id]);
      return jsonResponse({ success: true, message: 'Producto eliminado' });
    }

    // CREATE PRODUCT: POST /api/products
    if (segments[0] === 'products' && segments.length === 1 && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenant_id, name, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url } = body;
      const id = body.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
      const slug = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

      let resolvedTenantId = tenant_id;
      if (!resolvedTenantId || resolvedTenantId === 'tenant-demo') {
        const t = await executeD1('SELECT id FROM tenants LIMIT 1');
        resolvedTenantId = t[0]?.id || 'a0000000-0000-0000-0000-000000000001';
      }

      await executeD1(
        'INSERT INTO products (id, tenant_id, name, slug, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)',
        [
          id, resolvedTenantId, name, slug, price, currency || 'USD',
          short_description || '', full_description || short_description || '',
          JSON.stringify(images || []), JSON.stringify(benefits || []),
          JSON.stringify(details || {}), cta_label || 'Comprar', cta_url || ''
        ]
      );

      // Initialize metrics strictly at 0 in D1
      await executeD1(
        'INSERT INTO product_metrics (product_id, tenant_id, views, buy_clicks, benefit_views, cold_leads, warm_leads, hot_leads) VALUES (?1, ?2, 0, 0, 0, 0, 0, 0) ON CONFLICT(product_id) DO NOTHING',
        [id, resolvedTenantId]
      );

      return jsonResponse({
        success: true,
        product: {
          id, tenant_id: tenant_id || 'tenant-demo', name, slug, price, currency: currency || 'USD',
          short_description: short_description || '', full_description: full_description || short_description || '',
          images: images || [], benefits: benefits || [], details: details || {},
          cta_label: cta_label || 'Comprar', cta_url: cta_url || '', is_active: true,
          metrics: { views: 0, buyClicks: 0, benefitViews: 0, coldLeads: 0, warmLeads: 0, hotLeads: 0 }
        }
      }, 201);
    }

    // LIST PRODUCTS: GET /api/products
    if (segments[0] === 'products' && segments.length === 1 && request.method === 'GET') {
      const tenantId = url.searchParams.get('tenantId');
      let querySql = 'SELECT p.*, COALESCE(m.views, 0) as m_views, COALESCE(m.buy_clicks, 0) as m_buy_clicks, COALESCE(m.benefit_views, 0) as m_benefit_views, COALESCE(m.cold_leads, 0) as m_cold_leads, COALESCE(m.warm_leads, 0) as m_warm_leads, COALESCE(m.hot_leads, 0) as m_hot_leads FROM products p LEFT JOIN product_metrics m ON p.id = m.product_id';

      const params = [];
      if (tenantId) {
        querySql += ' WHERE p.tenant_id = ?1';
        params.push(tenantId);
      }
      querySql += ' ORDER BY p.created_at DESC';

      const rows = await executeD1(querySql, params);
      return jsonResponse({
        products: rows.map(r => ({
          ...r,
          metrics: {
            views: Number(r.m_views) || 0,
            buyClicks: Number(r.m_buy_clicks) || 0,
            benefitViews: Number(r.m_benefit_views) || 0,
            coldLeads: Number(r.m_cold_leads) || 0,
            warmLeads: Number(r.m_warm_leads) || 0,
            hotLeads: Number(r.m_hot_leads) || 0
          }
        }))
      });
    }

    // ADMIN: GET /api/admin/metrics
    if (segments[0] === 'admin' && segments[1] === 'metrics' && request.method === 'GET') {
      const tenants = await executeD1('SELECT id, name, slug, plan, monthly_price, status, created_at FROM tenants');
      const activeTenants = tenants.filter(t => t.status === 'active');
      const mrr = activeTenants.reduce((acc, t) => acc + (parseFloat(t.monthly_price) || 0), 0);
      const arr = mrr * 12;
      const msgRes = await executeD1('SELECT COUNT(*) as count FROM chat_messages');
      const unresRes = await executeD1("SELECT COUNT(*) as count FROM unresolved_queries WHERE status = 'pending'");
      return jsonResponse({
        metrics: {
          totalTenants: tenants.length,
          activeTenantsCount: activeTenants.length,
          mrr: mrr.toFixed(2),
          arr: arr.toFixed(2),
          totalMessagesProcessed: parseInt(msgRes[0]?.count || 0, 10),
          pendingUnresolvedQueries: parseInt(unresRes[0]?.count || 0, 10)
        },
        tenants
      });
    }

    // ADMIN: POST /api/admin/tenants (Crear nuevo usuario/inquilino)
    if (segments[0] === 'admin' && segments[1] === 'tenants' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { name, owner_email, owner_name, plan = 'pro', monthly_price = 79.0 } = body;
      if (!name || !owner_email) {
        return jsonResponse({ error: 'Nombre de negocio y email del dueño son obligatorios' }, 400);
      }

      const id = crypto.randomUUID();
      const baseSlug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tenant';
      let slug = baseSlug;

      const existing = await executeD1('SELECT id FROM tenants WHERE slug = ?1', [slug]);
      if (existing.length > 0) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }

      await executeD1(
        `INSERT INTO tenants (
          id, slug, name, owner_email, owner_name, plan, monthly_price, status, bot_name, welcome_message, system_prompt
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'active', 'Asesor Virtual', '¡Hola! ¿En qué puedo colaborarte hoy?', 'Eres el asesor comercial de la tienda.')`,
        [id, slug, name, owner_email, owner_name || name, plan, parseFloat(monthly_price) || 79.0]
      );

      const created = await executeD1('SELECT * FROM tenants WHERE id = ?1', [id]);
      return jsonResponse({ success: true, tenant: created[0] }, 201);
    }

    // ADMIN: DELETE /api/admin/tenants/:id (Eliminar inquilino)
    if (segments[0] === 'admin' && segments[1] === 'tenants' && segments.length >= 3 && request.method === 'DELETE') {
      const tenantId = segments[2];
      await executeD1('DELETE FROM products WHERE tenant_id = ?1', [tenantId]);
      await executeD1('DELETE FROM faqs WHERE tenant_id = ?1', [tenantId]);
      await executeD1('DELETE FROM chat_messages WHERE tenant_id = ?1', [tenantId]);
      await executeD1('DELETE FROM tenants WHERE id = ?1 OR slug = ?1', [tenantId]);
      return jsonResponse({ success: true, message: 'Tenant eliminado' });
    }

    // ADMIN: GET /api/admin/ai-config
    if (segments[0] === 'admin' && segments[1] === 'ai-config' && request.method === 'GET') {
      let config = {
        primaryModel: 'deepseek/deepseek-chat',
        reasoningModel: 'openai/gpt-4o-mini',
        splitRatio: '90/10',
        fallbackProvider: 'google_ai_studio'
      };
      try {
        await executeD1('CREATE TABLE IF NOT EXISTS platform_settings (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT DEFAULT (datetime(\'now\')))');
        const rows = await executeD1('SELECT value FROM platform_settings WHERE key = ?1', ['ai_engine_config']);
        if (rows.length > 0 && rows[0].value) {
          config = JSON.parse(rows[0].value);
        }
      } catch (e) {}
      return jsonResponse({ config });
    }

    // ADMIN: PUT /api/admin/ai-config
    if (segments[0] === 'admin' && segments[1] === 'ai-config' && request.method === 'PUT') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      try {
        await executeD1('CREATE TABLE IF NOT EXISTS platform_settings (key TEXT PRIMARY KEY, value TEXT, updated_at TEXT DEFAULT (datetime(\'now\')))');
        await executeD1(
          'INSERT INTO platform_settings (key, value, updated_at) VALUES (?1, ?2, datetime(\'now\')) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = datetime(\'now\')',
          ['ai_engine_config', JSON.stringify(body)]
        );
      } catch (e) {}
      return jsonResponse({ success: true, config: body });
    }

    // ADMIN: POST /api/admin/playground
    if (segments[0] === 'admin' && segments[1] === 'playground' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { prompt, systemPrompt, model = 'deepseek/deepseek-chat' } = body;
      if (!prompt) return jsonResponse({ error: 'Prompt requerido' }, 400);

      const openRouterKey = env?.OPENROUTER_API_KEY || (() => {
        try { return atob('c2stb3ItdjEtZjVlNzBmZjUwYzViNzIwZDg1NWFmOWM3ZWQzN2E2YWYwZTcwMjY4NGZjZjY0ZWQxZTQ0OTgwNjRlYzhkZDg1ZQ=='); } catch(e) { return ''; }
      })();
      const googleKey = env?.GOOGLE_AI_STUDIO_KEY || (() => {
        try { return atob('QVEuQWI4Uk42SVIxRnNkTTRIdFQ4cElwLTVUd084aXFPdHh0ck9XcUlVeVRjUllKdHJXNXc='); } catch(e) { return ''; }
      })();

      let output = '';
      if (model.startsWith('gemini')) {
        const fullPrompt = `${systemPrompt ? `${systemPrompt}\n\n` : ''}${prompt}`;
        const gUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`;
        const gResp = await fetch(gUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        });
        if (gResp.ok) {
          const gData = await gResp.json();
          output = gData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } else {
          return jsonResponse({ error: `Google AI status ${gResp.status}` }, 502);
        }
      } else {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://clikchat.pages.dev',
            'X-Title': 'ClikChat Playground'
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt }
            ],
            temperature: 0.35,
            max_tokens: 800
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          output = data.choices?.[0]?.message?.content || '';
        } else {
          return jsonResponse({ error: `OpenRouter status ${resp.status}` }, 502);
        }
      }
      return jsonResponse({ output, model });
    }

    // LIST TENANTS: GET /api/tenants
    if (segments[0] === 'tenants' && segments.length === 1 && request.method === 'GET') {
      const rows = await executeD1('SELECT id, slug, name, owner_name, bot_name, avatar_url, plan, status FROM tenants ORDER BY created_at DESC');
      return jsonResponse({ tenants: rows });
    }

    // GET TENANT WITH PRODUCTS & FAQS: GET /api/tenants/:slug
    if (segments[0] === 'tenants' && segments.length === 2 && request.method === 'GET') {
      const slug = segments[1];
      let tRows = await executeD1('SELECT * FROM tenants WHERE slug = ?1', [slug]);
      if (!tRows.length) tRows = await executeD1('SELECT * FROM tenants WHERE id = ?1', [slug]);
      if (!tRows.length) tRows = await executeD1('SELECT * FROM tenants LIMIT 1');
      if (!tRows.length) return jsonResponse({ error: 'Tenant no encontrado' }, 404);

      const tenant = tRows[0];
      const products = await executeD1(
        'SELECT p.*, COALESCE(m.views, 0) as m_views, COALESCE(m.buy_clicks, 0) as m_buy_clicks, COALESCE(m.benefit_views, 0) as m_benefit_views, COALESCE(m.cold_leads, 0) as m_cold_leads, COALESCE(m.warm_leads, 0) as m_warm_leads, COALESCE(m.hot_leads, 0) as m_hot_leads FROM products p LEFT JOIN product_metrics m ON p.id = m.product_id WHERE p.tenant_id = ?1 AND p.is_active = 1 ORDER BY p.created_at ASC',
        [tenant.id]
      );

      const faqs = await executeD1(
        'SELECT * FROM faqs WHERE tenant_id = ?1 ORDER BY created_at DESC',
        [tenant.id]
      );

      return jsonResponse({
        tenant,
        products: products.map(p => ({
          ...p,
          metrics: {
            views: Number(p.m_views) || 0,
            buyClicks: Number(p.m_buy_clicks) || 0,
            benefitViews: Number(p.m_benefit_views) || 0,
            coldLeads: Number(p.m_cold_leads) || 0,
            warmLeads: Number(p.m_warm_leads) || 0,
            hotLeads: Number(p.m_hot_leads) || 0
          }
        })),
        faqs
      });
    }

    // UPDATE TENANT: PUT /api/tenants/:id
    if (segments[0] === 'tenants' && segments.length === 2 && request.method === 'PUT') {
      const id = segments[1];
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { name, bot_name, avatar_url, welcome_message, primary_color, cta_text, cta_url, business_hours, system_prompt, slug, logo_url, tone_of_voice, response_delay_sec, custom_llm_key } = body;

      const hasCustomKey = custom_llm_key !== undefined;
      const keyClause = hasCustomKey ? ', custom_llm_key = ?15' : '';
      const params = [
        name, bot_name, avatar_url, welcome_message, primary_color, cta_text, cta_url,
        business_hours, system_prompt, slug, logo_url, tone_of_voice,
        response_delay_sec !== undefined ? Number(response_delay_sec) : null,
        id
      ];
      if (hasCustomKey) {
        params.push(custom_llm_key || null);
      }

      await executeD1(
        `UPDATE tenants SET name = COALESCE(?1, name), bot_name = COALESCE(?2, bot_name), avatar_url = COALESCE(?3, avatar_url), welcome_message = COALESCE(?4, welcome_message), primary_color = COALESCE(?5, primary_color), cta_text = COALESCE(?6, cta_text), cta_url = COALESCE(?7, cta_url), business_hours = COALESCE(?8, business_hours), system_prompt = COALESCE(?9, system_prompt), slug = COALESCE(?10, slug), logo_url = COALESCE(?11, logo_url), tone_of_voice = COALESCE(?12, tone_of_voice), response_delay_sec = COALESCE(?13, response_delay_sec)${keyClause}, updated_at = datetime('now') WHERE id = ?14`,
        params
      );

      const updated = await executeD1('SELECT * FROM tenants WHERE id = ?1', [id]);
      return jsonResponse({ success: true, tenant: updated[0] });
    }

    // FAQS: POST /api/faqs
    if (segments[0] === 'faqs' && segments.length === 1 && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenant_id, question, answer, category, confidence_threshold } = body;
      const id = 'faq_' + Date.now();
      await executeD1(
        'INSERT INTO faqs (id, tenant_id, question, answer, category, confidence_threshold, source) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
        [id, tenant_id || 'tenant-demo', question, answer, category || 'general', confidence_threshold || 0.65, 'manual']
      );
      return jsonResponse({ success: true, faq: { id, tenant_id, question, answer, category } }, 201);
    }

    // FAQS: PUT /api/faqs/:id
    if (segments[0] === 'faqs' && segments.length === 2 && request.method === 'PUT') {
      const id = segments[1];
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { answer, question, category, is_active } = body;
      await executeD1(
        'UPDATE faqs SET answer = COALESCE(?1, answer), question = COALESCE(?2, question), category = COALESCE(?3, category), is_active = COALESCE(?4, is_active), updated_at = datetime(\'now\') WHERE id = ?5',
        [answer ?? null, question ?? null, category ?? null, is_active !== undefined ? (is_active ? 1 : 0) : null, id]
      );
      return jsonResponse({ success: true, message: 'FAQ actualizada exitosamente' });
    }

    // FAQS: DELETE /api/faqs/:id
    if (segments[0] === 'faqs' && segments.length === 2 && request.method === 'DELETE') {
      const id = segments[1];
      await executeD1('DELETE FROM faqs WHERE id = ?1', [id]);
      return jsonResponse({ success: true, message: 'FAQ eliminada exitosamente de Cloudflare D1' });
    }

    // CHAT: GET /api/chat/messages/:sessionId
    if (segments[0] === 'chat' && segments[1] === 'messages' && segments.length === 3 && request.method === 'GET') {
      const sessionId = decodeURIComponent(segments[2]);
      const rows = await executeD1(
        'SELECT id, session_id, sender, message, rag_level_used, created_at FROM chat_messages WHERE session_id = ?1 ORDER BY created_at ASC LIMIT 100',
        [sessionId]
      );
      return jsonResponse({
        sessionId,
        messages: rows.map(r => ({
          id: r.id,
          sessionId: r.session_id,
          sender: r.sender,
          message: r.message,
          content: r.message,
          rag_level_used: r.rag_level_used,
          created_at: r.created_at,
          timestamp: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      });
    }

    // CHAT: DELETE /api/chat/messages/:sessionId
    if (segments[0] === 'chat' && segments[1] === 'messages' && segments.length === 3 && request.method === 'DELETE') {
      const sessionId = decodeURIComponent(segments[2]);
      await executeD1('DELETE FROM chat_messages WHERE session_id = ?1', [sessionId]);
      return jsonResponse({ success: true, message: 'Historial eliminado' });
    }

    // CHAT: GET /api/chat/tenant-conversations/:tenantId
    if (segments[0] === 'chat' && segments[1] === 'tenant-conversations' && segments.length === 3 && request.method === 'GET') {
      const tenantId = segments[2];
      const rows = await executeD1(
        `SELECT s.id, s.user_name, s.user_phone, s.user_email, s.status, s.created_at, s.updated_at,
                (SELECT message FROM chat_messages WHERE session_id = s.id AND sender = 'user' ORDER BY created_at ASC LIMIT 1) as first_user_message,
                (SELECT message FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT rag_level_used FROM chat_messages WHERE session_id = s.id AND sender = 'assistant' ORDER BY created_at DESC LIMIT 1) as last_rag_level,
                (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as total_messages
         FROM chat_sessions s
         WHERE s.tenant_id = ?1 AND (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) > 0
         ORDER BY s.updated_at DESC
         LIMIT 50`,
        [tenantId]
      );
      return jsonResponse({ conversations: rows });
    }

    // CHAT: POST /api/chat/status
    if (segments[0] === 'chat' && segments[1] === 'status' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { sessionId, status } = body;
      if (!sessionId || !status) return jsonResponse({ error: 'sessionId y status requeridos' }, 400);

      const dbStatus = (status === 'closed') ? 'closed' : 'active';
      await executeD1(
        'UPDATE chat_sessions SET status = ?1, updated_at = datetime(\'now\') WHERE id = ?2',
        [dbStatus, sessionId]
      );
      return jsonResponse({ success: true, status });
    }

    // CHAT: GET /api/chat/tenant-clients/:tenantId
    if (segments[0] === 'chat' && segments[1] === 'tenant-clients' && segments.length === 3 && request.method === 'GET') {
      const tenantId = segments[2];
      const rows = await executeD1(
        `SELECT s.id,
                COALESCE(s.user_name, 'Visitante Web') as name,
                COALESCE(s.user_phone, '') as phone,
                COALESCE(s.user_email, '') as email,
                'Web ClikChat' as channel,
                'cliente' as status,
                s.updated_at as lastSeen,
                (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as ordersCount
         FROM chat_sessions s
         WHERE s.tenant_id = ?1 AND (s.user_name IS NOT NULL OR s.user_phone IS NOT NULL OR s.user_email IS NOT NULL)
         ORDER BY s.updated_at DESC
         LIMIT 50`,
        [tenantId]
      );
      return jsonResponse({ clients: rows });
    }

    // CHAT: GET /api/chat/tenant-metrics/:tenantId
    if (segments[0] === 'chat' && segments[1] === 'tenant-metrics' && segments.length === 3 && request.method === 'GET') {
      const tenantId = segments[2];
      const sessions = await executeD1('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = ?1', [tenantId]);
      const pMetrics = await executeD1('SELECT COALESCE(SUM(views), 0) as views, COALESCE(SUM(buy_clicks), 0) as buy_clicks, COALESCE(SUM(warm_leads), 0) as warm_leads FROM product_metrics WHERE tenant_id = ?1', [tenantId]);
      const answers = await executeD1("SELECT COUNT(*) as count FROM chat_messages WHERE tenant_id = ?1 AND sender = 'assistant'", [tenantId]);
      const objections = await executeD1("SELECT COUNT(*) as count FROM chat_messages WHERE tenant_id = ?1 AND sender = 'assistant' AND (message LIKE '%precio%' OR message LIKE '%garant%' OR message LIKE '%duda%' OR message LIKE '%cost%' OR message LIKE '%beneficio%' OR message LIKE '%tranquil%')", [tenantId]);

      // Métricas de cuotas en tiempo real desde Cloudflare D1
      const quotaStats = await executeD1(
        `SELECT 
           COUNT(CASE WHEN created_at >= datetime('now', '-1 hour') THEN 1 END) as hourly_used,
           COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as daily_used,
           COUNT(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 END) as monthly_used
         FROM chat_messages 
         WHERE tenant_id = ?1`,
        [tenantId]
      );

      const baseSessions = Number(sessions[0]?.count) || 0;
      const totalProdViews = Number(pMetrics[0]?.views) || 0;
      const totalProdBuyClicks = Number(pMetrics[0]?.buy_clicks) || 0;
      const totalProdWarm = Number(pMetrics[0]?.warm_leads) || 0;

      // Suma total consolidada de todos los chats y productos
      const chatOpens = baseSessions + totalProdViews;
      const questionsAnswered = Number(answers[0]?.count) || 0;
      // Solo objeciones reales resueltas por el bot (sin sumar artificialmente preguntas generales)
      const objectionsResolved = Number(objections[0]?.count) || 0;
      const appointmentsCount = totalProdBuyClicks;

      const hourlyUsed = Number(quotaStats[0]?.hourly_used || 0);
      const dailyUsed = Number(quotaStats[0]?.daily_used || 0);
      const monthlyUsed = Number(quotaStats[0]?.monthly_used || 0);
      const hourlyLimit = 1000;
      const dailyLimit = 10000;
      const monthlyLimit = 100000;

      return jsonResponse({
        metrics: {
          chatOpens,
          questionsAnswered,
          objectionsResolved,
          appointmentsCount
        },
        quotas: {
          hourly: {
            limit: hourlyLimit,
            used: Math.min(hourlyUsed, hourlyLimit),
            remaining: Math.max(0, hourlyLimit - hourlyUsed),
            percentage: hourlyLimit > 0 ? Math.min(100, Math.round((hourlyUsed / hourlyLimit) * 100)) : 0
          },
          daily: {
            limit: dailyLimit,
            used: Math.min(dailyUsed, dailyLimit),
            remaining: Math.max(0, dailyLimit - dailyUsed),
            percentage: dailyLimit > 0 ? Math.min(100, Math.round((dailyUsed / dailyLimit) * 100)) : 0
          },
          monthly: {
            limit: monthlyLimit,
            used: Math.min(monthlyUsed, monthlyLimit),
            remaining: Math.max(0, monthlyLimit - monthlyUsed),
            percentage: monthlyLimit > 0 ? Math.min(100, Math.round((monthlyUsed / monthlyLimit) * 100)) : 0
          }
        }
      });
    }

    // QUOTAS: GET /api/quotas/:tenantId
    if (segments[0] === 'quotas' && segments.length === 2 && request.method === 'GET') {
      const tenantId = segments[1];
      try {
        const tenantRow = await executeD1(
          'SELECT id, name, slug, plan, token_limit FROM tenants WHERE id = ?1 OR slug = ?1',
          [tenantId]
        );
        const actualTenant = tenantRow[0] || {};
        const actualId = actualTenant.id || tenantId;

        const quotaStats = await executeD1(
          `SELECT 
             COUNT(CASE WHEN created_at >= datetime('now', '-1 hour') THEN 1 END) as hourly_used,
             COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as daily_used,
             COUNT(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 END) as monthly_used
           FROM chat_messages 
           WHERE tenant_id = ?1`,
          [actualId]
        );

        const hourlyUsed = Number(quotaStats[0]?.hourly_used || 0);
        const dailyUsed = Number(quotaStats[0]?.daily_used || 0);
        const monthlyUsed = Number(quotaStats[0]?.monthly_used || 0);

        const hourlyLimit = 1000;
        const dailyLimit = 10000;
        const monthlyLimit = Number(actualTenant.token_limit) || 100000;

        return jsonResponse({
          success: true,
          tenantId: actualId,
          tenantName: actualTenant.name || actualId,
          planTier: actualTenant.plan || 'pro',
          quotas: {
            hourly: {
              limit: hourlyLimit,
              used: Math.min(hourlyUsed, hourlyLimit),
              remaining: Math.max(0, hourlyLimit - hourlyUsed),
              percentage: hourlyLimit > 0 ? Math.min(100, Math.round((hourlyUsed / hourlyLimit) * 100)) : 0
            },
            daily: {
              limit: dailyLimit,
              used: Math.min(dailyUsed, dailyLimit),
              remaining: Math.max(0, dailyLimit - dailyUsed),
              percentage: dailyLimit > 0 ? Math.min(100, Math.round((dailyUsed / dailyLimit) * 100)) : 0
            },
            monthly: {
              limit: monthlyLimit,
              used: Math.min(monthlyUsed, monthlyLimit),
              remaining: Math.max(0, monthlyLimit - monthlyUsed),
              percentage: monthlyLimit > 0 ? Math.min(100, Math.round((monthlyUsed / monthlyLimit) * 100)) : 0
            }
          },
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        return jsonResponse({
          success: false,
          error: err.message,
          tenantId,
          quotas: {
            hourly: { limit: 1000, used: 0, remaining: 1000, percentage: 0 },
            daily: { limit: 10000, used: 0, remaining: 10000, percentage: 0 },
            monthly: { limit: 100000, used: 0, remaining: 100000, percentage: 0 }
          }
        });
      }
    }

    // CHAT: POST /api/chat/audio (Cloudflare Workers AI Whisper STT with Anti-Looping Filter)
    if (segments[0] === 'chat' && segments[1] === 'audio' && request.method === 'POST') {
      try {
        let audioBytes;
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const body = await request.json();
          if (body.audioBase64) {
            const binaryString = atob(body.audioBase64);
            const len = binaryString.length;
            audioBytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              audioBytes[i] = binaryString.charCodeAt(i);
            }
          }
        } else {
          const buffer = await request.arrayBuffer();
          audioBytes = new Uint8Array(buffer);
        }

        if (!audioBytes || audioBytes.length === 0) {
          return jsonResponse({ error: 'No se recibió archivo de audio' }, 400);
        }

        let transcribedText = '';

        // 1. Cloudflare Workers AI Native Edge Binding
        if (env?.AI) {
          try {
            const aiResponse = await env.AI.run('@cf/openai/whisper', {
              audio: [...audioBytes],
              language: 'es'
            });
            transcribedText = aiResponse?.text || '';
          } catch (aiErr) {
            console.warn('Fallo en env.AI binding:', aiErr.message);
          }
        }

        // 2. Cloudflare Workers AI REST API Fallback
        if (!transcribedText) {
          try {
            const token = getD1Token(env);
            const cfAiUrl = 'https://api.cloudflare.com/client/v4/accounts/' + CLOUDFLARE_ACCOUNT_ID + '/ai/run/@cf/openai/whisper';
            const cfAiRes = await fetch(cfAiUrl, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
              },
              body: audioBytes
            });
            if (cfAiRes.ok) {
              const cfAiData = await cfAiRes.json();
              transcribedText = cfAiData.result?.text || '';
            }
          } catch (restErr) {
            console.warn('Fallo en REST AI Cloudflare:', restErr.message);
          }
        }

        // 3. Filtro Anti-Repetición y Anti-Alucinaciones de Whisper
        let cleanText = (transcribedText || '').trim();
        const hallucinationPatterns = [
          /\[.*?\]/g, /\(.*?\)/g,
          /subt[ií]tulos\s+realizados\s+por\s+.*?(?:\.|$)/gi,
          /subt[ií]tulos\s+por\s+.*?(?:\.|$)/gi,
          /gracias\s+por\s+(?:ver|escuchar|sintonizar).*?(?:\.|$)/gi,
          /thanks\s+for\s+watching.*?(?:\.|$)/gi,
          /suscr[ií]bete.*?(?:\.|$)/gi,
          /like\s+y\s+suscr[ií]bete.*?(?:\.|$)/gi
        ];
        for (const p of hallucinationPatterns) {
          cleanText = cleanText.replace(p, ' ');
        }
        cleanText = cleanText.replace(/\b(\w+)(?:\s+\1\b)+/gi, '$1');
        cleanText = cleanText.replace(/\b((?:\w+\s+){1,4}\w+)(?:\s+\1\b)+/gi, '$1');
        cleanText = cleanText.replace(/\s+/g, ' ').replace(/[.]{2,}/g, '.').trim();

        return jsonResponse({
          success: true,
          text: cleanText,
          rawText: transcribedText,
          provider: 'cloudflare_workers_ai'
        });
      } catch (audioErr) {
        return jsonResponse({ error: audioErr.message }, 500);
      }
    }

    // ==============================================================================
    // CHAT CONVERSACIONAL RAG EN EDGE: POST /api/chat/message (Serverless 24/7)
    // ==============================================================================
    if (segments[0] === 'chat' && segments[1] === 'message' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenantSlug, tenantId, sessionId, message, leadInfo } = body;

      if (!message) {
        return jsonResponse({ error: 'Mensaje requerido' }, 400);
      }

      // 1. Resolver Tenant en Cloudflare D1
      let targetTenant = null;
      if (tenantId) {
        const tRows = await executeD1('SELECT * FROM tenants WHERE id = ?1 LIMIT 1', [tenantId]);
        if (tRows.length > 0) targetTenant = tRows[0];
      }
      if (!targetTenant && tenantSlug) {
        const tRows = await executeD1('SELECT * FROM tenants WHERE slug = ?1 LIMIT 1', [tenantSlug]);
        if (tRows.length > 0) targetTenant = tRows[0];
      }
      if (!targetTenant) {
        const tRows = await executeD1('SELECT * FROM tenants LIMIT 1');
        targetTenant = tRows[0];
      }
      if (!targetTenant) {
        return jsonResponse({ error: 'Tenant no configurado' }, 404);
      }

      const currentSessionId = sessionId || ('sess_' + Date.now().toString(36));
      const actualTenantId = targetTenant.id;

      // 2. Garantizar sesión viva en chat_sessions
      try {
        await executeD1(
          'INSERT INTO chat_sessions (id, tenant_id, user_name, user_phone, user_email, status, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, \'active\', datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET updated_at = datetime(\'now\'), status = \'active\'',
          [currentSessionId, actualTenantId, leadInfo?.name || null, leadInfo?.phone || null, leadInfo?.email || null]
        );
      } catch (sessErr) {
        console.warn('Sesión D1 warning:', sessErr.message);
      }

      // 3. Guardar mensaje del usuario en chat_messages
      const userMsgId = 'msg_' + Date.now() + '_u';
      try {
        await executeD1(
          'INSERT INTO chat_messages (id, session_id, tenant_id, sender, message) VALUES (?1, ?2, ?3, ?4, ?5)',
          [userMsgId, currentSessionId, actualTenantId, 'user', message]
        );
      } catch (msgErr) {
        console.warn('Msg D1 warning:', msgErr.message);
      }

      // 4. NIVEL 1: Memoria Episódica D1 (últimos turnos para mantener contexto)
      let sessionHistory = [];
      try {
        const historyRows = await executeD1(
          'SELECT sender, message, created_at FROM chat_messages WHERE session_id = ?1 ORDER BY created_at ASC LIMIT 30',
          [currentSessionId]
        );
        sessionHistory = historyRows.slice(0, -1);
      } catch (hErr) {
        sessionHistory = [];
      }

      // 5. Carga Paralela de Fuentes de Conocimiento (FAQs, Catálogo y Documentos RAG)
      let faqs = [];
      let products = [];
      let docChunks = [];
      let rawDocs = [];

      try {
        const [fRows, pRows, cRows, rRows] = await Promise.all([
          executeD1('SELECT * FROM faqs WHERE (tenant_id = ?1 OR tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1)) AND is_active = 1', [actualTenantId]).catch(() => []),
          executeD1('SELECT * FROM products WHERE (tenant_id = ?1 OR tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1)) AND is_active = 1 ORDER BY created_at DESC', [actualTenantId]).catch(() => []),
          executeD1(
            'SELECT dc.content, kd.title FROM document_chunks dc JOIN knowledge_documents kd ON dc.document_id = kd.id WHERE dc.tenant_id = ?1 OR kd.tenant_id = ?1 OR dc.tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1) OR kd.tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1) LIMIT 60',
            [actualTenantId]
          ).catch(() => []),
          executeD1(
            'SELECT id, title, category, raw_content FROM knowledge_documents WHERE tenant_id = ?1 OR tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1) LIMIT 20',
            [actualTenantId]
          ).catch(() => [])
        ]);
        faqs = fRows;
        products = pRows;
        docChunks = cRows;
        rawDocs = rRows;
      } catch (dataErr) {
        console.warn('Error cargando conocimiento D1:', dataErr.message);
      }

      // Si hay documentos crudos no particionados en chunks, agregarlos a la base de chunks
      for (const d of rawDocs) {
        if (d.raw_content && !docChunks.some(c => c.title === d.title)) {
          docChunks.push({ title: d.title, content: d.raw_content });
        }
      }

      // 6. Normalización y Extracción de Palabras Clave
      const cleanUserQuery = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const queryWords = cleanUserQuery.split(/\s+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));

      // Consultas que NUNCA deben detenerse en seco en Nivel 2 (deben ir a Nivel 3 RAG para buscar en documentos y LLM)
      const requiresDeepRAG = /\b(descuento|descuentos|cupon|cupones|promo|promocion|rebaja|oferta|vip|pro|codigo|porcentaje|cuanto cuesta|precio exacto|especial|manual|manuales|documento|documentos|politica|politicas|terminos|condicion|condiciones|requisito|requisitos|pasos|como funciona|garantia especifica)\b/i.test(message);

      // Si algún documento subido por el negocio contiene palabras clave de la consulta, NO interceptar en Nivel 2
      const hasDocumentMatch = queryWords.length > 0 && (
        docChunks.some(c => {
          const text = `${c.title} ${c.content}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return queryWords.some(qw => text.includes(qw));
        }) ||
        rawDocs.some(d => {
          const text = `${d.title} ${d.raw_content || ''}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return queryWords.some(qw => text.includes(qw));
        })
      );

      // Si algún producto coincide por nombre directo, tampoco interceptar con FAQ genérica
      const hasDirectProductMatch = queryWords.length > 0 && products.some(p => {
        const pName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return queryWords.some(qw => qw.length >= 4 && pName.includes(qw));
      });

      // 7. NIVEL 2: RAG de FAQs con Detención Inmediata ($0 Costo / Sin LLM)
      // Si hay documentos cargados en RAG con coincidencia o producto específico, ceder paso a Nivel 3.
      // Si NO hay documentos cargados en RAG, permitir que las FAQs oficiales respondan directamente.
      const shouldBypassFaqForRAG = (hasDocumentMatch || hasDirectProductMatch) || (requiresDeepRAG && (docChunks.length > 0 || rawDocs.length > 0));
      if (!shouldBypassFaqForRAG) {
        let topFaq = null;
        let topFaqScore = 0;
        for (const faq of faqs) {
          const targetText = `${faq.question}`;
          const score = computeOverlapScore(message, targetText);
          if (score > topFaqScore) {
            topFaqScore = score;
            topFaq = faq;
          }
        }

        // Solo detener si la pregunta del usuario es idéntica o casi idéntica a la FAQ oficial (>= 75% certeza simétrica)
        if (topFaq && topFaqScore >= 0.75) {
          const botMsgId = 'msg_' + Date.now() + '_b';
          try {
            await executeD1(
              'INSERT INTO chat_messages (id, session_id, tenant_id, sender, message, rag_level_used) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
              [botMsgId, currentSessionId, actualTenantId, 'assistant', topFaq.answer, 'level_2_faq']
            );
          } catch (e) {}

          return jsonResponse({
            sessionId: currentSessionId,
            level: 'level_2_faq',
            levelLabel: 'Nivel 2: FAQs Verificadas ($0 Costo)',
            confidence: topFaqScore,
            answer: topFaq.answer,
            matchedItem: topFaq,
            stoppedEarly: true,
            zeroCost: true
          });
        }
      }

      // 8. NIVEL 3: RAG de Catálogo (Productos & Inventario D1) y Documentos/Manuales
      // Score de productos (coincidencia con nombre, sku, descripción, categoría y stock)
      const scoredProducts = products.map(p => {
        const pText = `${p.name} ${p.name} ${p.short_description || ''} ${p.full_description || ''} ${p.details?.category || ''} ${p.details?.sku || ''}`;
        const score = computeOverlapScore(message, pText);
        const cleanName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const nameWords = cleanName.split(/\s+/).filter(w => w.length > 2);
        const hasNameMatch = nameWords.some(w => cleanUserQuery.includes(w));
        const finalScore = hasNameMatch ? Math.max(score, 0.75) : score;
        return { product: p, score: finalScore };
      }).sort((a, b) => b.score - a.score);

      const matchedProducts = scoredProducts.filter(sp => sp.score >= 0.28).map(sp => sp.product);

      // Score inteligente de fragmentos de documentos/manuales RAG
      const scoredChunks = docChunks.map(c => {
        const chunkText = `${c.title} ${c.content}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const baseScore = computeOverlapScore(message, `${c.title} ${c.content}`);
        
        let keywordHits = 0;
        for (const qw of queryWords) {
          if (chunkText.includes(qw)) keywordHits++;
        }
        const boost = queryWords.length > 0 ? (keywordHits / queryWords.length) * 0.8 : 0;
        return {
          chunk: c,
          score: Math.max(baseScore, boost)
        };
      }).sort((a, b) => b.score - a.score);

      const relevantChunks = scoredChunks.filter(sc => sc.score >= 0.12).map(sc => sc.chunk);
      const chunksToInclude = relevantChunks.length > 0 ? relevantChunks.slice(0, 6) : docChunks.slice(0, 4);

      // Garantizar que documentos crudos con alta coincidencia también se incluyan en el contexto
      for (const d of rawDocs) {
        if (!d.raw_content) continue;
        const dText = `${d.title} ${d.raw_content}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let dHits = 0;
        for (const qw of queryWords) {
          if (dText.includes(qw)) dHits++;
        }
        const dBoost = queryWords.length > 0 ? (dHits / queryWords.length) * 0.8 : 0;
        if (dBoost >= 0.35 && !chunksToInclude.some(c => c.title === d.title)) {
          chunksToInclude.push({ title: d.title, content: d.raw_content.slice(0, 1200) });
        }
      }

      const hasKnowledge = matchedProducts.length > 0 || chunksToInclude.length > 0 || products.length > 0 || faqs.length > 0;

      if (hasKnowledge) {
        let contextBlock = '';

        // 1. Información General del Negocio
        contextBlock += `--- INFORMACIÓN GENERAL DEL NEGOCIO ---\n`;
        contextBlock += `NOMBRE DE LA EMPRESA: ${targetTenant.name || 'ClikChat Store'}\n`;
        contextBlock += `HORARIO DE ATENCIÓN HUMANA EN OFICINA: ${targetTenant.business_hours || 'Lunes a Sábado de 8:00 AM a 7:00 PM'}\n`;
        contextBlock += `ATENCIÓN VIRTUAL & ASISTENTE IA: Activo las 24 horas del día, los 7 días de la semana (24/7)\n`;
        if (targetTenant.cta_url) {
          contextBlock += `CANAL OFICIAL DE CONTACTO / WHATSAPP: ${targetTenant.cta_url}\n`;
        }
        contextBlock += '\n';

        // 2. Políticas y Preguntas Frecuentes Oficiales (FAQs)
        if (faqs.length > 0) {
          contextBlock += `--- PREGUNTAS FRECUENTES Y POLÍTICAS DEL NEGOCIO (FAQS) ---\n` + faqs.map(f => {
            return `• CONSULTA: ${f.question}\n  RESPUESTA OFICIAL: ${f.answer}`;
          }).join('\n\n') + '\n\n';
        }

        // 3. Catálogo / Productos / Inventario
        const prodsToInclude = matchedProducts.length > 0 ? matchedProducts.slice(0, 3) : products.slice(0, 3);
        contextBlock += '--- PRODUCTOS & INVENTARIO DISPONIBLE ---\n' + prodsToInclude.map(p => {
          const stock = p.details?.stock !== undefined ? ` | Stock: ${p.details.stock} unidades` : '';
          const sku = p.details?.sku ? ` | SKU: ${p.details.sku}` : '';
          return `PRODUCTO: ${p.name}\nPRECIO: $${p.price} ${p.currency || 'USD'}${stock}${sku}\nDESCRIPCIÓN: ${p.full_description || p.short_description || 'Sin descripción adicional'}\nENLACE DIRECTO DE COMPRA: ${p.cta_url || (targetTenant.cta_url || '')}\n${p.embedding_text ? `MANUAL RAG ESPECÍFICO: ${p.embedding_text}\n` : ''}`;
        }).join('\n\n');

        // 4. Documentos / Manuales / Reglas RAG Subidos
        if (chunksToInclude.length > 0) {
          contextBlock += '\n\n--- DOCUMENTOS, MANUALES Y CONOCIMIENTO RAG (ACTUALIZADO EN VIVO) ---\n' + chunksToInclude.map(c => `[DOCUMENTO: ${c.title}]\n${c.content}`).join('\n\n');
        } else {
          contextBlock += '\n\n--- DOCUMENTOS RAG ---\n(No hay documentos adicionales registrados actualmente en la base de datos oficial)';
        }

        // Directiva explícita de promociones vigentes si el usuario pregunta por descuentos
        const isAskingDiscount = /\b(descuento|descuentos|cupon|cupones|promo|promocion|promociones|rebaja|rebajas|oferta|ofertas|vip|pro|codigo)\b/i.test(message);
        const hasDiscountInKnowledge = (chunksToInclude.some(c => /descuento|cupon|promo|rebaja|oferta|vip/i.test(`${c.title} ${c.content}`))) ||
          (faqs.some(f => /descuento|cupon|promo|rebaja|oferta|vip/i.test(`${f.question} ${f.answer}`)));
        if (isAskingDiscount && !hasDiscountInKnowledge) {
          contextBlock += '\n\n[ESTADO OFICIAL DE PROMOCIONES]: Actualmente NO existen descuentos especiales, cupones ni promociones VIP/PRO vigentes en la base de datos oficial. Los precios válidos son única y exclusivamente los indicados en la lista de productos del catálogo.';
        }

        const systemPrompt = targetTenant.system_prompt || 'Eres el asesor comercial oficial de la tienda. Tu objetivo es guiar al usuario a comprar amablemente y con certeza.';

        const llmResult = await callEdgeLLM({
          systemPrompt,
          context: contextBlock,
          history: sessionHistory,
          userMessage: message,
          env,
          customKey: targetTenant.custom_llm_key
        });

        const botMsgId = 'msg_' + Date.now() + '_b';
        try {
          await executeD1(
            'INSERT INTO chat_messages (id, session_id, tenant_id, sender, message, rag_level_used) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
            [botMsgId, currentSessionId, actualTenantId, 'assistant', llmResult.text, 'level_3_catalog']
          );
        } catch (e) {}

        return jsonResponse({
          sessionId: currentSessionId,
          level: 'level_3_catalog',
          levelLabel: 'Nivel 3: Asesoría de Catálogo & RAG',
          confidence: matchedProducts.length > 0 ? 0.92 : 0.70,
          answer: llmResult.text,
          products: prodsToInclude,
          provider: llmResult.provider
        });
      }

      // 7. NIVEL 4: Fallback / Anti-Alucinación / HITL
      try {
        const unresId = 'unres_' + Date.now();
        await executeD1(
          'INSERT INTO unresolved_queries (id, tenant_id, session_id, user_question, status) VALUES (?1, ?2, ?3, ?4, ?5)',
          [unresId, actualTenantId, currentSessionId, message, 'pending']
        );
      } catch (uErr) {}

      const fallbackAnswer = `No tengo ese dato exacto en el catálogo en este momento. Con mucho gusto lo consulto directamente con nuestro equipo de atención para darte información precisa.\n\n¿Me podrías indicar tu número de WhatsApp o correo electrónico para contactarte de inmediato?`;
      const botMsgId = 'msg_' + Date.now() + '_b';
      try {
        await executeD1(
          'INSERT INTO chat_messages (id, session_id, tenant_id, sender, message, rag_level_used) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
          [botMsgId, currentSessionId, actualTenantId, 'assistant', fallbackAnswer, 'fallback_hitl']
        );
      } catch (e) {}

      return jsonResponse({
        sessionId: currentSessionId,
        level: 'fallback_hitl',
        levelLabel: 'Nivel 4: Derivación a Asesor Humano',
        confidence: 0.15,
        answer: fallbackAnswer,
        isFallback: true,
        requiresLeadInfo: true
      });
    }

    // LEAD CAPTURE: POST /api/chat/lead
    if (segments[0] === 'chat' && segments[1] === 'lead' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { sessionId, name, phone, email } = body;
      if (!sessionId) return jsonResponse({ error: 'sessionId requerido' }, 400);

      await executeD1(
        'UPDATE chat_sessions SET user_name = COALESCE(?1, user_name), user_phone = COALESCE(?2, user_phone), user_email = COALESCE(?3, user_email), updated_at = datetime(\'now\') WHERE id = ?4',
        [name || null, phone || null, email || null, sessionId]
      );
      try {
        await executeD1(
          'UPDATE unresolved_queries SET user_lead_info = ?1 WHERE session_id = ?2',
          [JSON.stringify({ name, phone, email }), sessionId]
        );
      } catch (e) {}

      return jsonResponse({ success: true, message: 'Datos de contacto registrados' });
    }

    // PWA PUSH SUBSCRIBE: POST /api/chat/push-subscribe
    if (segments[0] === 'chat' && segments[1] === 'push-subscribe' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { sessionId, subscription } = body;
      if (!sessionId || !subscription) return jsonResponse({ error: 'sessionId y subscription requeridos' }, 400);

      await executeD1(
        'UPDATE chat_sessions SET pwa_push_subscription = ?1, updated_at = datetime(\'now\') WHERE id = ?2',
        [JSON.stringify(subscription), sessionId]
      );
      return jsonResponse({ success: true, message: 'Suscripción Web Push registrada con éxito' });
    }

    // INVENTORY BULK IMPORT: POST /api/products/bulk-import (From Excel .xlsx / CSV)
    if (segments[0] === 'products' && segments[1] === 'bulk-import' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenantId, products: importItems } = body;
      if (!importItems || !Array.isArray(importItems) || importItems.length === 0) {
        return jsonResponse({ error: 'Lista de productos requerida' }, 400);
      }

      let resolvedTenantId = tenantId;
      if (!resolvedTenantId || resolvedTenantId === 'tenant-demo') {
        const t = await executeD1('SELECT id FROM tenants LIMIT 1');
        resolvedTenantId = t[0]?.id || 'a0000000-0000-0000-0000-000000000001';
      }

      let importedCount = 0;
      for (const item of importItems) {
        if (!item.name) continue;
        const id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const price = parseFloat(item.price) || 0;
        const details = {
          stock: item.stock !== undefined ? parseInt(item.stock, 10) : 10,
          sku: item.sku || '',
          category: item.category || 'General'
        };

        await executeD1(
          'INSERT INTO products (id, tenant_id, name, slug, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)',
          [
            id, resolvedTenantId, item.name, slug, price, item.currency || 'USD',
            item.short_description || `Producto: ${item.name}`,
            item.full_description || item.short_description || `Producto de catálogo: ${item.name}`,
            JSON.stringify([]),
            JSON.stringify([`Stock disponible: ${details.stock} unidades`, `SKU: ${details.sku || 'N/A'}`]),
            JSON.stringify(details),
            'Comprar Ahora',
            ''
          ]
        );

        await executeD1(
          'INSERT INTO product_metrics (product_id, tenant_id, views, buy_clicks, benefit_views, cold_leads, warm_leads, hot_leads) VALUES (?1, ?2, 0, 0, 0, 0, 0, 0) ON CONFLICT(product_id) DO NOTHING',
          [id, resolvedTenantId]
        );
        importedCount++;
      }

      return jsonResponse({ success: true, count: importedCount }, 201);
    }

    // FAQS BULK: POST /api/faqs/bulk
    if (segments[0] === 'faqs' && segments[1] === 'bulk' && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenant_id, faqs: faqsList } = body;
      if (!faqsList || !Array.isArray(faqsList)) return jsonResponse({ error: 'Lista de faqs requerida' }, 400);

      for (const f of faqsList) {
        if (!f.question || !f.answer) continue;
        const id = 'faq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const keywords = tokenize(f.question).slice(0, 15);
        await executeD1(
          'INSERT INTO faqs (id, tenant_id, question, answer, keywords, category, confidence_threshold, source) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)',
          [id, tenant_id || 'tenant-demo', f.question, f.answer, JSON.stringify(keywords), f.category || 'general', f.confidence_threshold || 0.65, 'bulk_upload']
        );
      }
      return jsonResponse({ success: true, count: faqsList.length }, 201);
    }

    // DOCUMENTS: GET /api/documents
    if (segments[0] === 'documents' && segments.length === 1 && request.method === 'GET') {
      const tenantId = url.searchParams.get('tenantId');
      if (!tenantId) return jsonResponse({ error: 'tenantId requerido' }, 400);

      const rows = await executeD1(
        'SELECT kd.id, kd.title, kd.category, kd.file_type, kd.created_at, COUNT(dc.id) as chunks_count FROM knowledge_documents kd LEFT JOIN document_chunks dc ON kd.id = dc.document_id WHERE kd.tenant_id = ?1 OR kd.tenant_id IN (SELECT id FROM tenants WHERE slug = ?1 OR id = ?1) GROUP BY kd.id ORDER BY kd.created_at DESC',
        [tenantId]
      );
      return jsonResponse({ documents: rows });
    }

    // DOCUMENTS: POST /api/documents (and POST /api/documents/ingest)
    if (segments[0] === 'documents' && (segments.length === 1 || segments[1] === 'ingest') && request.method === 'POST') {
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { tenant_id, title, content, category } = body;
      if (!tenant_id || !title || !content) {
        return jsonResponse({ error: 'tenant_id, title y content requeridos' }, 400);
      }

      let actualTenantId = tenant_id;
      try {
        const tRows = await executeD1('SELECT id FROM tenants WHERE slug = ?1 OR id = ?1 LIMIT 1', [tenant_id]);
        if (tRows.length > 0) {
          actualTenantId = tRows[0].id;
        } else {
          const defT = await executeD1('SELECT id FROM tenants LIMIT 1');
          actualTenantId = defT[0]?.id || 'a0000000-0000-0000-0000-000000000001';
        }
      } catch (e) {
        actualTenantId = 'a0000000-0000-0000-0000-000000000001';
      }

      const docId = 'doc_' + Date.now();
      await executeD1(
        'INSERT INTO knowledge_documents (id, tenant_id, title, category, file_type, raw_content) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
        [docId, actualTenantId, title, category || 'manuales', 'text', content]
      );

      // Particionar en párrafos (~600 caracteres con overlap)
      const clean = content.trim();
      const chunks = [];
      let start = 0;
      while (start < clean.length) {
        let end = start + 600;
        if (end < clean.length) {
          const cut = Math.max(clean.lastIndexOf('.', end), clean.lastIndexOf('\n', end));
          if (cut > start + 150) end = cut + 1;
        }
        const chunkText = clean.slice(start, end).trim();
        if (chunkText.length > 20) chunks.push(chunkText);
        start = end - 100;
        if (start >= clean.length - 40) break;
      }

      if (chunks.length === 0 && clean.length > 0) {
        chunks.push(clean);
      }

      await Promise.all(chunks.map((chk, i) => {
        const chunkId = 'chk_' + Date.now() + '_' + i;
        const keywords = tokenize(chk).slice(0, 15);
        return executeD1(
          'INSERT INTO document_chunks (id, document_id, tenant_id, chunk_index, content, keywords) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
          [chunkId, docId, actualTenantId, i, chk, JSON.stringify(keywords)]
        );
      }));

      return jsonResponse({ success: true, document: { id: docId, title, chunksCount: chunks.length } }, 201);
    }

    // DOCUMENTS: GET /api/documents/:id (Ver contenido y chunks)
    if (segments[0] === 'documents' && segments.length === 2 && request.method === 'GET') {
      const id = segments[1];
      const docRows = await executeD1(
        'SELECT kd.id, kd.tenant_id, kd.title, kd.category, kd.file_type, kd.raw_content, kd.created_at, COUNT(dc.id) as chunks_count FROM knowledge_documents kd LEFT JOIN document_chunks dc ON kd.id = dc.document_id WHERE kd.id = ?1 GROUP BY kd.id LIMIT 1',
        [id]
      );
      if (!docRows.length) return jsonResponse({ error: 'Documento no encontrado' }, 404);
      const doc = docRows[0];
      const chunks = await executeD1(
        'SELECT id, chunk_index, content FROM document_chunks WHERE document_id = ?1 ORDER BY chunk_index ASC',
        [id]
      );
      return jsonResponse({
        document: {
          ...doc,
          chunks
        }
      });
    }

    // DOCUMENTS: PUT /api/documents/:id (Editar y re-indexar chunks)
    if (segments[0] === 'documents' && segments.length === 2 && request.method === 'PUT') {
      const id = segments[1];
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const { title, content, category } = body;
      if (!title || !content) {
        return jsonResponse({ error: 'title y content requeridos' }, 400);
      }

      await executeD1(
        'UPDATE knowledge_documents SET title = ?1, raw_content = ?2, category = COALESCE(?3, category), updated_at = datetime(\'now\') WHERE id = ?4',
        [title, content, category || null, id]
      );

      // Eliminar chunks anteriores y re-indexar
      await executeD1('DELETE FROM document_chunks WHERE document_id = ?1', [id]);

      const docRows = await executeD1('SELECT tenant_id FROM knowledge_documents WHERE id = ?1', [id]);
      const actualTenantId = docRows[0]?.tenant_id || 'a0000000-0000-0000-0000-000000000001';

      const clean = content.trim();
      const chunks = [];
      let start = 0;
      while (start < clean.length) {
        let end = start + 600;
        if (end < clean.length) {
          const cut = Math.max(clean.lastIndexOf('.', end), clean.lastIndexOf('\n', end));
          if (cut > start + 150) end = cut + 1;
        }
        const chunkText = clean.slice(start, end).trim();
        if (chunkText.length > 20) chunks.push(chunkText);
        start = end - 100;
        if (start >= clean.length - 40) break;
      }
      if (chunks.length === 0 && clean.length > 0) chunks.push(clean);

      await Promise.all(chunks.map((chk, i) => {
        const chunkId = 'chk_' + Date.now() + '_' + i;
        const keywords = tokenize(chk).slice(0, 15);
        return executeD1(
          'INSERT INTO document_chunks (id, document_id, tenant_id, chunk_index, content, keywords) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
          [chunkId, id, actualTenantId, i, chk, JSON.stringify(keywords)]
        );
      }));

      return jsonResponse({ success: true, message: 'Documento actualizado y re-indexado exitosamente', chunksCount: chunks.length });
    }

    // DOCUMENTS: DELETE /api/documents/:id
    if (segments[0] === 'documents' && segments.length === 2 && request.method === 'DELETE') {
      const id = segments[1];
      await executeD1('DELETE FROM document_chunks WHERE document_id = ?1', [id]);
      await executeD1('DELETE FROM knowledge_documents WHERE id = ?1', [id]);
      return jsonResponse({ success: true, message: 'Documento eliminado exitosamente de Cloudflare D1' });
    }

    return jsonResponse({ message: 'Ruta no encontrada' }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
