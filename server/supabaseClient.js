const { createClient } = require('@supabase/supabase-js');
const webPush = require('web-push');
const { query } = require('./db');
const { rankBySimilarity } = require('./services/embeddings');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

let supabase = null;

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });
  console.log('⚡ Cliente Supabase inicializado.');
} catch (err) {
  console.warn('⚠️ Cliente Supabase no configurado con URL real, usando capa de pooling PostgreSQL.');
}

// Configure VAPID Keys for Web Push Notifications
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'UUxI4HgX1M3YfCgD0bB5oX4J8nE1uL7k2qS9vR3wZ0A';

try {
  webPush.setVapidDetails(
    'mailto:soporte@clikchat.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} catch (e) {
  // ignore
}

/**
 * 1. Búsqueda Vectorial de FAQs (Nivel 2)
 */
async function searchFaqsVector({ tenantId, queryText, queryVector = null, threshold = 0.65, limit = 3 }) {
  // Intento 1: Supabase RPC match_faqs si está conectado y queryVector disponible
  if (supabase && queryVector && process.env.SUPABASE_URL) {
    try {
      const { data, error } = await supabase.rpc('match_faqs', {
        query_embedding: queryVector,
        filter_tenant: tenantId,
        match_threshold: threshold,
        match_count: limit
      });
      if (!error && data && data.length > 0) {
        return data.map(d => ({ item: d, score: d.similarity }));
      }
    } catch (rpcErr) {
      console.warn('RPC match_faqs falló, recurriendo a búsqueda local:', rpcErr.message);
    }
  }

  // Intento 2: Búsqueda sobre Neon PostgreSQL con rankBySimilarity
  const faqsRes = await query('SELECT * FROM faqs WHERE tenant_id = $1 AND is_active = true', [tenantId]);
  return rankBySimilarity(
    queryText,
    faqsRes.rows,
    f => `${f.question} ${f.category || ''} ${(f.keywords || []).join(' ')}`,
    threshold
  );
}

/**
 * 2. Búsqueda Vectorial de Catálogo y Productos (Nivel 3)
 */
async function searchProductsVector({ tenantId, queryText, queryVector = null, threshold = 0.35, limit = 3 }) {
  // Intento 1: Supabase RPC match_products si está configurado
  if (supabase && queryVector && process.env.SUPABASE_URL) {
    try {
      const { data, error } = await supabase.rpc('match_products', {
        query_embedding: queryVector,
        filter_tenant: tenantId,
        match_threshold: threshold,
        match_count: limit
      });
      if (!error && data && data.length > 0) {
        return data.map(d => ({ item: d, score: d.similarity }));
      }
    } catch (rpcErr) {
      console.warn('RPC match_products falló, recurriendo a búsqueda local:', rpcErr.message);
    }
  }

  // Intento 2: Búsqueda sobre Neon PostgreSQL con rankBySimilarity
  const prodRes = await query('SELECT * FROM products WHERE tenant_id = $1 AND is_active = true', [tenantId]);
  return rankBySimilarity(
    queryText,
    prodRes.rows,
    p => `${p.name} ${p.short_description || ''} ${p.full_description || ''} ${(p.benefits || []).join(' ')}`,
    threshold
  );
}

/**
 * 3. Enviar Notificación Push Web (Service Worker)
 */
async function sendPushToSession(sessionId, payload) {
  try {
    const sessionRes = await query('SELECT pwa_push_subscription FROM chat_sessions WHERE id = $1', [sessionId]);
    const sub = sessionRes.rows[0]?.pwa_push_subscription;

    if (!sub) {
      console.log(`ℹ️ La sesión ${sessionId} no tiene suscripción Push registrada.`);
      return false;
    }

    const pushData = JSON.stringify({
      title: payload.title || 'Respuesta del Asesor en ClikChat',
      body: payload.body || 'Tu consulta ha sido resuelta. Toca para ver la respuesta.',
      url: payload.url || '/',
      icon: '/icon-192.png'
    });

    await webPush.sendNotification(sub, pushData);
    console.log(`🔔 Notificación Push enviada a sesión ${sessionId}`);
    return true;
  } catch (err) {
    console.error('Error enviando notificación push:', err.message);
    return false;
  }
}

module.exports = {
  supabase,
  searchFaqsVector,
  searchProductsVector,
  sendPushToSession,
  VAPID_PUBLIC_KEY
};
