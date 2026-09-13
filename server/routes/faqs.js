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

    const result = await query(
      `INSERT INTO faqs (tenant_id, question, answer, category, confidence_threshold, source)
       VALUES ($1, $2, $3, $4, $5, 'manual') RETURNING *`,
      [tenant_id, question, answer, category || 'general', confidence_threshold || 0.82]
    );

    return res.status(201).json({ success: true, faq: result.rows[0] });
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
