const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { ingestDocument } = require('../services/documentRAG');

// List documents for tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) return res.status(400).json({ error: 'tenantId requerido' });

    const docsRes = await query(
      `SELECT kd.id, kd.title, kd.category, kd.file_type, kd.created_at,
              COUNT(dc.id) as chunks_count
       FROM knowledge_documents kd
       LEFT JOIN document_chunks dc ON kd.id = dc.document_id
       WHERE kd.tenant_id = $1
       GROUP BY kd.id
       ORDER BY kd.created_at DESC`,
      [tenantId]
    );

    return res.json({ documents: docsRes.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create and chunk document
router.post('/', async (req, res) => {
  try {
    const { tenant_id, title, content, category } = req.body;
    if (!tenant_id || !title || !content) {
      return res.status(400).json({ error: 'Campos requeridos faltantes (tenant_id, title, content)' });
    }

    const doc = await ingestDocument(tenant_id, title.trim(), content.trim(), category || 'manuales');
    return res.status(201).json({ success: true, document: doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM knowledge_documents WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Documento eliminado' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
