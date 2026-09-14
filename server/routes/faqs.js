const express = require('express');
const router = express.Router();
const { query } = require('../db');

// List FAQs for a tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId requerido' });
    }

    const result = await query(
      'SELECT * FROM faqs WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId]
    );

    return res.json({ faqs: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create FAQ (feeds RAG Level 2)
router.post('/', async (req, res) => {
  try {
    const { tenant_id, question, answer, category, confidence_threshold } = req.body;
    if (!tenant_id || !question || !answer) {
      return res.status(400).json({ error: 'Campos requeridos faltantes (tenant_id, question, answer)' });
    }

    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    const stopWords = new Set(['que', 'como', 'cuando', 'donde', 'por', 'para', 'con', 'los', 'las', 'una', 'uno', 'del', 'cual', 'cuanto', 'tiene', 'tienen', 'hacen']);
    const keywords = question
      .toLowerCase()
      .replace(/[^a-záéíóúñ0-9\s]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    await query(
      `INSERT INTO faqs (id, tenant_id, question, answer, keywords, category, confidence_threshold, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'manual')`,
      [id, tenant_id, question, answer, JSON.stringify(keywords), category || 'general', confidence_threshold || 0.65]
    );

    const createdFaq = {
      id, tenant_id, question, answer, keywords, category: category || 'general',
      confidence_threshold: confidence_threshold || 0.65, source: 'manual'
    };

    return res.status(201).json({ success: true, faq: createdFaq });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete FAQ
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM faqs WHERE id = $1', [id]);
    return res.json({ success: true, message: 'FAQ eliminada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
