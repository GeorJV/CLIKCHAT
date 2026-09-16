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
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

let currentEnv = {};

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
      const { name, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url, is_active } = body;
      await executeD1(
        'UPDATE products SET name = COALESCE(?1, name), price = COALESCE(?2, price), currency = COALESCE(?3, currency), short_description = COALESCE(?4, short_description), full_description = COALESCE(?5, full_description), images = COALESCE(?6, images), benefits = COALESCE(?7, benefits), details = COALESCE(?8, details), cta_label = COALESCE(?9, cta_label), cta_url = COALESCE(?10, cta_url), is_active = COALESCE(?11, is_active), updated_at = datetime(\'now\') WHERE id = ?12',
        [
          name ?? null, price ?? null, currency ?? null, short_description ?? null, full_description ?? null,
          images ? JSON.stringify(images) : null, benefits ? JSON.stringify(benefits) : null,
          details ? JSON.stringify(details) : null, cta_label ?? null, cta_url ?? null,
          is_active === undefined ? null : (is_active ? 1 : 0), id
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
      const { name, bot_name, avatar_url, welcome_message, primary_color, cta_text, cta_url, business_hours, system_prompt, slug, logo_url, tone_of_voice } = body;

      await executeD1(
        'UPDATE tenants SET name = COALESCE(?1, name), bot_name = COALESCE(?2, bot_name), avatar_url = COALESCE(?3, avatar_url), welcome_message = COALESCE(?4, welcome_message), primary_color = COALESCE(?5, primary_color), cta_text = COALESCE(?6, cta_text), cta_url = COALESCE(?7, cta_url), business_hours = COALESCE(?8, business_hours), system_prompt = COALESCE(?9, system_prompt), slug = COALESCE(?10, slug), logo_url = COALESCE(?11, logo_url), tone_of_voice = COALESCE(?12, tone_of_voice), updated_at = datetime(\'now\') WHERE id = ?13',
        [name, bot_name, avatar_url, welcome_message, primary_color, cta_text, cta_url, business_hours, system_prompt, slug, logo_url, tone_of_voice, id]
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
      const { answer, question, category } = body;
      await executeD1(
        'UPDATE faqs SET answer = COALESCE(?1, answer), question = COALESCE(?2, question), category = COALESCE(?3, category), updated_at = datetime(\'now\') WHERE id = ?4',
        [answer ?? null, question ?? null, category ?? null, id]
      );
      return jsonResponse({ success: true });
    }

    // CHAT: GET /api/chat/tenant-conversations/:tenantId
    if (segments[0] === 'chat' && segments[1] === 'tenant-conversations' && segments.length === 3 && request.method === 'GET') {
      const tenantId = segments[2];
      const rows = await executeD1(
        `SELECT s.id, s.user_name, s.user_phone, s.created_at,
                (SELECT message FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT rag_level_used FROM chat_messages WHERE session_id = s.id AND sender = 'assistant' ORDER BY created_at DESC LIMIT 1) as last_rag_level,
                (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as total_messages
         FROM chat_sessions s
         WHERE s.tenant_id = ?1
         ORDER BY s.created_at DESC
         LIMIT 30`,
        [tenantId]
      );
      return jsonResponse({ conversations: rows });
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

    return jsonResponse({ message: 'Ruta no encontrada' }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
