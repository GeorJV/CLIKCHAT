const express = require('express');
const router = express.Router();
const { queryWithTenant, query } = require('../db');

// List products for a tenant with real metrics from D1
router.get('/', async (req, res) => {
  try {
    const { tenantId } = req.query;
    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId es requerido' });
    }

    const result = await query(
      `SELECT p.*,
        COALESCE(m.views, 0) as m_views,
        COALESCE(m.buy_clicks, 0) as m_buy_clicks,
        COALESCE(m.benefit_views, 0) as m_benefit_views,
        COALESCE(m.cold_leads, 0) as m_cold_leads,
        COALESCE(m.warm_leads, 0) as m_warm_leads,
        COALESCE(m.hot_leads, 0) as m_hot_leads
      FROM products p
      LEFT JOIN product_metrics m ON p.id = m.product_id
      WHERE p.tenant_id = $1
      ORDER BY p.created_at DESC`,
      [tenantId]
    );

    const products = result.rows.map(row => ({
      ...row,
      metrics: {
        views: Number(row.m_views) || 0,
        buyClicks: Number(row.m_buy_clicks) || 0,
        benefitViews: Number(row.m_benefit_views) || 0,
        coldLeads: Number(row.m_cold_leads) || 0,
        warmLeads: Number(row.m_warm_leads) || 0,
        hotLeads: Number(row.m_hot_leads) || 0
      }
    }));

    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create product (metrics initialized strictly at 0 in D1)
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
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    await query(
      `INSERT INTO products (
        id, tenant_id, name, slug, price, currency, short_description,
        full_description, images, benefits, details, cta_label, cta_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id, tenant_id, name, slug, price, currency || 'USD',
        short_description || '', full_description || short_description || '',
        JSON.stringify(images || []), JSON.stringify(benefits || []),
        JSON.stringify(details || {}), cta_label || 'Comprar', cta_url || ''
      ]
    );

    // Initialize metrics in D1 strictly at 0
    await query(
      `INSERT INTO product_metrics (
        product_id, tenant_id, views, buy_clicks, benefit_views, cold_leads, warm_leads, hot_leads
      ) VALUES ($1, $2, 0, 0, 0, 0, 0, 0)`,
      [id, tenant_id]
    );

    const createdProduct = {
      id, tenant_id, name, slug, price, currency: currency || 'USD',
      short_description: short_description || '', full_description: full_description || short_description || '',
      images: images || [], benefits: benefits || [], details: details || {},
      cta_label: cta_label || 'Comprar', cta_url: cta_url || '', is_active: true,
      metrics: {
        views: 0,
        buyClicks: 0,
        benefitViews: 0,
        coldLeads: 0,
        warmLeads: 0,
        hotLeads: 0
      }
    };

    console.log(`📦 [PRODUCT CREATED] Producto "${name}" guardado con métricas en 0 en D1`);
    return res.status(201).json({ success: true, product: createdProduct });
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
      full_description, images, benefits, details, cta_label, cta_url, is_active, embedding_text
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
        embedding_text = COALESCE($12, embedding_text),
        updated_at = NOW()
       WHERE id = $13 RETURNING *`,
      [
        name, price, currency, short_description, full_description,
        images ? JSON.stringify(images) : null,
        benefits ? JSON.stringify(benefits) : null,
        details ? JSON.stringify(details) : null,
        cta_label, cta_url, is_active, embedding_text !== undefined ? embedding_text : null, id
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
    const id = decodeURIComponent(req.params.id);
    await query('DELETE FROM product_metrics WHERE product_id = $1 OR product_id IN (SELECT id FROM products WHERE slug = $1)', [id]);
    await query('DELETE FROM products WHERE id = $1 OR slug = $1', [id]);
    return res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get single product with real metrics (for QLinks / direct share)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.*,
        COALESCE(m.views, 0) as m_views,
        COALESCE(m.buy_clicks, 0) as m_buy_clicks,
        COALESCE(m.benefit_views, 0) as m_benefit_views,
        COALESCE(m.cold_leads, 0) as m_cold_leads,
        COALESCE(m.warm_leads, 0) as m_warm_leads,
        COALESCE(m.hot_leads, 0) as m_hot_leads
      FROM products p
      LEFT JOIN product_metrics m ON p.id = m.product_id
      WHERE p.id = $1 OR p.slug = $1
      LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const row = result.rows[0];
    const product = {
      ...row,
      metrics: {
        views: Number(row.m_views) || 0,
        buyClicks: Number(row.m_buy_clicks) || 0,
        benefitViews: Number(row.m_benefit_views) || 0,
        coldLeads: Number(row.m_cold_leads) || 0,
        warmLeads: Number(row.m_warm_leads) || 0,
        hotLeads: Number(row.m_hot_leads) || 0
      }
    };

    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Track real online metric events
router.post('/:id/track', async (req, res) => {
  try {
    const { id } = req.params;
    const { event, temperature } = req.body || {};

    // 1. Resolve real product ID and tenant ID
    const pResult = await query(
      'SELECT id, tenant_id FROM products WHERE id = $1 OR slug = $1 LIMIT 1',
      [id]
    );

    let targetId = id;
    let targetTenant = 'a0000000-0000-0000-0000-000000000001';
    if (pResult.rows.length > 0) {
      targetId = pResult.rows[0].id;
      targetTenant = pResult.rows[0].tenant_id || targetTenant;
    }

    // 2. Ensure metric row exists in D1
    await query(
      `INSERT INTO product_metrics (product_id, tenant_id, views, buy_clicks, benefit_views, cold_leads, warm_leads, hot_leads)
       VALUES ($1, $2, 0, 0, 0, 0, 0, 0)
       ON CONFLICT(product_id) DO NOTHING`,
      [targetId, targetTenant]
    );

    // Evitar doble conteo si el view llegó hace menos de 2 segundos
    if (event === 'view') {
      const recent = await query(
        `SELECT (strftime('%s', 'now') - strftime('%s', updated_at)) as diff_sec FROM product_metrics WHERE product_id = $1`,
        [targetId]
      );
      const diff = recent.rows?.[0]?.diff_sec;
      if (diff !== null && diff !== undefined && Number(diff) < 2) {
        const current = await query('SELECT * FROM product_metrics WHERE product_id = $1', [targetId]);
        return res.json({ success: true, event: 'view_debounced', productId: targetId, metrics: current.rows?.[0] });
      }
    }

    let updateSql = `UPDATE product_metrics SET views = views + 1, updated_at = datetime('now') WHERE product_id = $1`;
    if (event === 'buy_click') {
      updateSql = `UPDATE product_metrics SET buy_clicks = buy_clicks + 1, hot_leads = hot_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
    } else if (event === 'benefit_view') {
      updateSql = `UPDATE product_metrics SET benefit_views = benefit_views + 1, warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
    } else if (event === 'detail_view' || event === 'spec_view' || event === 'fullscreen_view') {
      updateSql = `UPDATE product_metrics SET views = views + 1, cold_leads = cold_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
    } else if (event === 'chat_message' || event === 'message_sent') {
      updateSql = `UPDATE product_metrics SET warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
    } else if (event === 'lead') {
      if (temperature === 'hot') {
        updateSql = `UPDATE product_metrics SET hot_leads = hot_leads + 1, buy_clicks = buy_clicks + 1, updated_at = datetime('now') WHERE product_id = $1`;
      } else if (temperature === 'warm') {
        updateSql = `UPDATE product_metrics SET warm_leads = warm_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
      } else {
        updateSql = `UPDATE product_metrics SET cold_leads = cold_leads + 1, updated_at = datetime('now') WHERE product_id = $1`;
      }
    }

    await query(updateSql, [targetId]);
    const updated = await query('SELECT * FROM product_metrics WHERE product_id = $1', [targetId]);
    return res.json({ success: true, event, productId: targetId, metrics: updated.rows[0] });
  } catch (err) {
    console.error('Error registrando métrica en D1:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
