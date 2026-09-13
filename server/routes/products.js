const express = require('express');
const router = express.Router();
const { queryWithTenant, query } = require('../db');

// List products for a tenant
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId es requerido' });
    }

    const result = await query(
      'SELECT * FROM products WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId]
    );

    return res.json({ products: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create product (feeds RAG Level 3)
router.post('/', async (req, res) => {
  try {
    const {
      tenant_id, name, price, currency, short_description,
      full_description, images, benefits, details, cta_label, cta_url
    } = req.body;

    if (!tenant_id || !name || !price) {
      return res.status(400).json({ error: 'Campos requeridos faltantes (tenant_id, name, price)' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const result = await query(
      `INSERT INTO products (
        tenant_id, name, slug, price, currency, short_description,
        full_description, images, benefits, details, cta_label, cta_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        tenant_id, name, slug, price, currency || 'USD',
        short_description || '', full_description || short_description || '',
        JSON.stringify(images || []), JSON.stringify(benefits || []),
        JSON.stringify(details || {}), cta_label || 'Comprar', cta_url || ''
      ]
    );

    console.log(`📦 [PRODUCT CREATED] Producto "${name}" guardado y listo para RAG Nivel 3`);
    return res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err) {
    console.error('Error creando producto:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, price, currency, short_description,
      full_description, images, benefits, details, cta_label, cta_url, is_active
    } = req.body;

    const result = await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        price = COALESCE($2, price),
        currency = COALESCE($3, currency),
        short_description = COALESCE($4, short_description),
        full_description = COALESCE($5, full_description),
        images = COALESCE($6, images),
        benefits = COALESCE($7, benefits),
        details = COALESCE($8, details),
        cta_label = COALESCE($9, cta_label),
        cta_url = COALESCE($10, cta_url),
        is_active = COALESCE($11, is_active),
        updated_at = NOW()
       WHERE id = $12 RETURNING *`,
      [
        name, price, currency, short_description, full_description,
        images ? JSON.stringify(images) : null,
        benefits ? JSON.stringify(benefits) : null,
        details ? JSON.stringify(details) : null,
        cta_label, cta_url, is_active, id
      ]
    );

    return res.json({ success: true, product: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
