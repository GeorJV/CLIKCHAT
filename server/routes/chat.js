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

module.exports = router;
