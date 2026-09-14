const express = require('express');
const router = express.Router();
const { query } = require('../db');

// List all active tenants (for multi-tenant selector and switcher)
router.get('/', async (req, res) => {
  try {
    const tenantsRes = await query(
      'SELECT id, slug, name, owner_name, owner_email, bot_name, business_hours, status, plan FROM tenants WHERE status = $1 ORDER BY name ASC',
      ['active']
    );
    return res.json({ tenants: tenantsRes.rows });
  } catch (err) {
    console.error('Error listando tenants:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get tenant public profile by slug (for chat widget)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let tenantRes = await query('SELECT * FROM tenants WHERE slug = $1', [slug]);

    if (tenantRes.rows.length === 0) {
      tenantRes = await query('SELECT * FROM tenants LIMIT 1');
    }

    if (tenantRes.rows.length === 0) {
      return res.status(404).json({ error: 'Inquilino (Tenant) no encontrado' });
    }

    const tenant = tenantRes.rows[0];

    // Fetch active products for this tenant
    const productsRes = await query(
      'SELECT * FROM products WHERE tenant_id = $1 AND is_active = true ORDER BY created_at ASC',
      [tenant.id]
    );

    // Fetch active FAQs
    const faqsRes = await query(
      'SELECT id, question, answer, category FROM faqs WHERE tenant_id = $1 AND is_active = true ORDER BY created_at ASC',
      [tenant.id]
    );

    // Omit sensitive data like custom_llm_key from public endpoint
    const { custom_llm_key, ...safeTenant } = tenant;

    return res.json({
      tenant: safeTenant,
      products: productsRes.rows,
      faqs: faqsRes.rows
    });
  } catch (err) {
    console.error('Error obteniendo tenant:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update tenant settings (Client Panel)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, bot_name, avatar_url, welcome_message, system_prompt,
      primary_color, custom_llm_key, cta_text, cta_url, business_hours
    } = req.body;

    await query(
      `UPDATE tenants SET
        name = COALESCE($1, name),
        bot_name = COALESCE($2, bot_name),
        avatar_url = COALESCE($3, avatar_url),
        welcome_message = COALESCE($4, welcome_message),
        system_prompt = COALESCE($5, system_prompt),
        primary_color = COALESCE($6, primary_color),
        custom_llm_key = COALESCE($7, custom_llm_key),
        cta_text = COALESCE($8, cta_text),
        cta_url = COALESCE($9, cta_url),
        business_hours = COALESCE($10, business_hours),
        updated_at = datetime('now')
       WHERE id = $11`,
      [name, bot_name, avatar_url, welcome_message, system_prompt, primary_color, custom_llm_key, cta_text, cta_url, business_hours, id]
    );

    const updatedRes = await query('SELECT * FROM tenants WHERE id = $1', [id]);
    if (updatedRes.rows.length === 0) {
      return res.status(404).json({ error: 'Inquilino no encontrado' });
    }

    return res.json({ success: true, tenant: updatedRes.rows[0] });
  } catch (err) {
    console.error('Error actualizando tenant:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
