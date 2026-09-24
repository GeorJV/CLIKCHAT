const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { callGoogleAIStudio } = require('../services/llmRouter');

// Financial & SaaS Metrics
router.get('/metrics', async (req, res) => {
  try {
    const tenantsRes = await query('SELECT id, name, slug, plan, monthly_price, status, created_at FROM tenants');
    const messagesCountRes = await query('SELECT count(*) FROM chat_messages');
    const unresolvedCountRes = await query('SELECT count(*) FROM unresolved_queries WHERE status = $1', ['pending']);

    const tenants = tenantsRes.rows;
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.status === 'active');
    
    // MRR Calculation
    const mrr = activeTenants.reduce((acc, t) => acc + (parseFloat(t.monthly_price) || 0), 0);
    const arr = mrr * 12;

    return res.json({
      metrics: {
        totalTenants,
        activeTenantsCount: activeTenants.length,
        mrr: mrr.toFixed(2),
        arr: arr.toFixed(2),
        totalMessagesProcessed: parseInt(messagesCountRes.rows[0]?.count || '0', 10),
        pendingUnresolvedQueries: parseInt(unresolvedCountRes.rows[0]?.count || '0', 10)
      },
      tenants
    });
  } catch (err) {
    console.error('Error calculando métricas:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Create new tenant (Super Admin)
router.post('/tenants', async (req, res) => {
  try {
    const {
      name, slug, owner_name, owner_email, plan = 'pro',
      monthly_price = 79.00, bot_name = 'Asistente ClikChat',
      welcome_message, system_prompt
    } = req.body;

    if (!name || !owner_email) {
      return res.status(400).json({ error: 'Nombre del tenant y email son obligatorios' });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await query(
      `INSERT INTO tenants (
        name, slug, owner_name, owner_email, plan, monthly_price, bot_name, welcome_message, system_prompt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        name, cleanSlug, owner_name || name, owner_email,
        plan, monthly_price, bot_name,
        welcome_message || '¡Hola! ¿En qué puedo colaborarte hoy?',
        system_prompt || 'Eres el asesor comercial de la tienda.'
      ]
    );

    return res.status(201).json({ success: true, tenant: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Super Admin Google AI Studio Playground
router.post('/playground', async (req, res) => {
  try {
    const { prompt, systemPrompt, model = 'gemini-2.0-flash', apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt es requerido' });
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\nPregunta / Instrucción: ${prompt}` : prompt;

    const reply = await callGoogleAIStudio(fullPrompt, {
      apiKey: apiKey || process.env.GOOGLE_AI_STUDIO_KEY,
      model
    });

    return res.json({
      success: true,
      model,
      output: reply
    });
  } catch (err) {
    console.error('Error en Google AI Studio Playground:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
