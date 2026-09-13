const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { injectAnswerIntoFaq } = require('../services/ragEngine');

// List unresolved queries for tenant
router.get('/unresolved', async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId requerido' });
    }

    const result = await query(
      `SELECT * FROM unresolved_queries 
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return res.json({ unresolved: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Resolve query by owner and auto-inject into Level 2 FAQs!
router.post('/resolve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, category, autoInjectToFaq = true } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ error: 'La respuesta es requerida para resolver la consulta' });
    }

    // Get original query
    const itemRes = await query('SELECT * FROM unresolved_queries WHERE id = $1', [id]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ error: 'Consulta no encontrada' });
    }

    const item = itemRes.rows[0];

    let createdFaq = null;
    if (autoInjectToFaq) {
      createdFaq = await injectAnswerIntoFaq(
        item.tenant_id,
        item.user_question,
        answer.trim(),
        category || 'consultas_resueltas'
      );
    }

    // Update query status to resolved
    const updateRes = await query(
      `UPDATE unresolved_queries SET
        status = 'resolved',
        resolution_answer = $1,
        resolved_at = NOW(),
        auto_injected_to_faq = $2
       WHERE id = $3 RETURNING *`,
      [answer.trim(), autoInjectToFaq, id]
    );

    // Trigger Web Push Notification to user's mobile device
    if (item.session_id) {
      const { sendPushToSession } = require('../supabaseClient');
      sendPushToSession(item.session_id, {
        title: '💬 ClikChat: Respuesta de la Tienda',
        body: `El asesor respondió: "${answer.trim().substring(0, 85)}..."`,
        url: '/'
      }).catch(err => console.warn('Push error:', err.message));
    }

    console.log(`✅ [HITL RESOLVED] Consulta '${item.user_question}' resuelta por el dueño. Bot auto-entrenado.`);

    return res.json({
      success: true,
      message: 'Consulta resuelta exitosamente y auto-inyectada en FAQs (Nivel 2) del bot.',
      resolvedQuery: updateRes.rows[0],
      injectedFaq: createdFaq
    });
  } catch (err) {
    console.error('Error resolviendo consulta HITL:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
