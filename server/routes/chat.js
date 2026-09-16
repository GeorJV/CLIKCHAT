const express = require('express');
const router = express.Router();
const { processRAGQuery } = require('../services/ragEngine');
const { query } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Send message to RAG Chatbot
router.post('/message', async (req, res) => {
  try {
    const { tenantSlug, tenantId, sessionId, message, leadInfo } = req.body;

    if (!message || (!tenantSlug && !tenantId)) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos (mensaje y tenant)' });
    }

    // Resolve tenant ID if slug is provided
    let targetTenantId = tenantId;
    if (tenantSlug && !targetTenantId) {
      const tRes = await query('SELECT id FROM tenants WHERE slug = $1', [tenantSlug]);
      if (tRes.rows.length > 0) {
        targetTenantId = tRes.rows[0].id;
      } else {
        // Fallback demo tenant
        targetTenantId = 'a0000000-0000-0000-0000-000000000001';
      }
    }

    const currentSessionId = sessionId || uuidv4();

    // Ensure session exists in DB
    try {
      await query(
        `INSERT INTO chat_sessions (id, tenant_id, user_fingerprint)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [currentSessionId, targetTenantId, req.ip || 'anonymous']
      );
    } catch (e) {
      // ignore conflict
    }

    // Process with 3-Level RAG Engine
    const ragResult = await processRAGQuery({
      tenantId: targetTenantId,
      sessionId: currentSessionId,
      userMessage: message,
      leadInfo: leadInfo || {}
    });

    return res.json({
      sessionId: currentSessionId,
      ...ragResult
    });
  } catch (err) {
    console.error('Error procesando mensaje RAG:', err);
    return res.status(500).json({
      error: 'Error interno en el motor conversacional',
      details: err.message
    });
  }
});

// Register Web Push subscription for PWA
router.post('/push-subscribe', async (req, res) => {
  try {
    const { sessionId, subscription } = req.body;
    if (!sessionId || !subscription) {
      return res.status(400).json({ error: 'sessionId y subscription requeridos' });
    }

    await query(
      `UPDATE chat_sessions 
       SET pwa_push_subscription = $1,
           pwa_subscribed = true,
           updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(subscription), sessionId]
    );

    return res.json({ success: true, message: 'Suscripción Web Push registrada con éxito' });
  } catch (err) {
    console.error('Error guardando push subscription:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update Lead Info / PWA Push Subscription
router.post('/lead', async (req, res) => {
  try {
    const { sessionId, tenantId, name, phone, email, pwaPushToken } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId requerido' });
    }

    await query(
      `UPDATE chat_sessions 
       SET lead_name = COALESCE($1, lead_name),
           lead_phone = COALESCE($2, lead_phone),
           lead_email = COALESCE($3, lead_email),
           pwa_push_token = COALESCE($4, pwa_push_token),
           pwa_subscribed = CASE WHEN $4 IS NOT NULL THEN true ELSE pwa_subscribed END,
           updated_at = NOW()
       WHERE id = $5`,
      [name, phone, email, pwaPushToken, sessionId]
    );

    return res.json({ success: true, message: 'Datos de contacto y notificación registrados correctamente' });
  } catch (err) {
    console.error('Error guardando lead:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get session messages
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await query(
      `SELECT sender, message, rag_level_used, created_at 
       FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [sessionId]
    );
    return res.json({ history: history.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get recent conversations for tenant (Owner Portal audit)
router.get('/tenant-conversations/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const sessions = await query(
      `SELECT s.id, s.user_name, s.user_phone, s.created_at,
              (SELECT message FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT rag_level_used FROM chat_messages WHERE session_id = s.id AND sender = 'assistant' ORDER BY created_at DESC LIMIT 1) as last_rag_level,
              (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as total_messages
       FROM chat_sessions s
       WHERE s.tenant_id = $1
       ORDER BY s.created_at DESC
       LIMIT 30`,
      [tenantId]
    );
    return res.json({ conversations: sessions.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get real customer leads captured by the bot (Clients Tab)
router.get('/tenant-clients/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const clients = await query(
      `SELECT s.id,
              COALESCE(s.user_name, 'Visitante Web') as name,
              COALESCE(s.user_phone, '') as phone,
              COALESCE(s.user_email, '') as email,
              'Web ClikChat' as channel,
              'cliente' as status,
              s.updated_at as lastSeen,
              (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as ordersCount
       FROM chat_sessions s
       WHERE s.tenant_id = $1 AND (s.user_name IS NOT NULL OR s.user_phone IS NOT NULL OR s.user_email IS NOT NULL)
       ORDER BY s.updated_at DESC
       LIMIT 50`,
      [tenantId]
    );
    return res.json({ clients: clients.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get exact reporting metrics for tenant (Dashboard Principal - Suma total consolidada)
router.get('/tenant-metrics/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const sessionsRes = await query('SELECT COUNT(*) as count FROM chat_sessions WHERE tenant_id = $1', [tenantId]);
    const pMetricsRes = await query('SELECT COALESCE(SUM(views), 0) as views, COALESCE(SUM(buy_clicks), 0) as buy_clicks, COALESCE(SUM(warm_leads), 0) as warm_leads FROM product_metrics WHERE tenant_id = $1', [tenantId]);
    const answersRes = await query("SELECT COUNT(*) as count FROM chat_messages WHERE tenant_id = $1 AND sender = 'assistant'", [tenantId]);
    const objectionsRes = await query("SELECT COUNT(*) as count FROM chat_messages WHERE tenant_id = $1 AND sender = 'assistant' AND (message LIKE '%precio%' OR message LIKE '%garant%' OR message LIKE '%duda%' OR message LIKE '%cost%' OR message LIKE '%beneficio%' OR message LIKE '%tranquil%')", [tenantId]);

    const baseSessions = parseInt(sessionsRes.rows[0]?.count || '0', 10);
    const totalProdViews = parseInt(pMetricsRes.rows[0]?.views || '0', 10);
    const totalProdBuyClicks = parseInt(pMetricsRes.rows[0]?.buy_clicks || '0', 10);
    const totalProdWarm = parseInt(pMetricsRes.rows[0]?.warm_leads || '0', 10);

    const chatOpens = baseSessions + totalProdViews;
    const questionsAnswered = parseInt(answersRes.rows[0]?.count || '0', 10);
    // Solo objeciones reales resueltas por el bot
    const objectionsResolved = parseInt(objectionsRes.rows[0]?.count || '0', 10);
    const appointmentsCount = totalProdBuyClicks;

    return res.json({
      metrics: {
        chatOpens,
        questionsAnswered,
        objectionsResolved,
        appointmentsCount
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Transcribe voice audio with Cloudflare Workers AI Whisper & Anti-Looping filter
router.post('/audio', express.raw({ type: ['audio/*', 'application/octet-stream'], limit: '25mb' }), async (req, res) => {
  try {
    const { cleanWhisperLooping } = require('../utils/audioCleaner');
    let audioBuffer;
    if (req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
      audioBuffer = req.body;
    } else if (req.body && req.body.audioBase64) {
      audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'No se recibió audio válido' });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '01514e27c0cdd221efd91900be83fb16';
    const token = process.env.CLOUDFLARE_API_TOKEN;

    let transcribedText = '';
    try {
      const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/openai/whisper`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/octet-stream'
        },
        body: audioBuffer
      });
      if (cfRes.ok) {
        const cfData = await cfRes.json();
        transcribedText = cfData.result?.text || '';
      }
    } catch (e) {
      console.warn('Error en Cloudflare AI Whisper REST:', e.message);
    }

    const cleanText = cleanWhisperLooping(transcribedText);
    return res.json({
      success: true,
      text: cleanText,
      rawText: transcribedText,
      provider: 'cloudflare_workers_ai'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
