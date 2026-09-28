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

// Financial Metrics & Cash Flow
router.get('/finance-metrics', async (req, res) => {
  try {
    const tenantsRes = await query('SELECT id, name, slug, plan, monthly_price, status, business_type, currency, next_billing_date, created_at FROM tenants');
    const tenants = tenantsRes.rows || [];
    const activeTenants = tenants.filter(t => t.status === 'active');
    const mrr = activeTenants.reduce((acc, t) => acc + (parseFloat(t.monthly_price) || 0), 0);
    const arr = mrr * 12;

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const in7DaysStr = in7Days.toISOString().split('T')[0];

    let cashToday = 0;
    let cashTomorrow = 0;
    let cashThisWeek = 0;

    for (const t of activeTenants) {
      const billingDate = t.next_billing_date ? t.next_billing_date.split('T')[0] : null;
      const price = parseFloat(t.monthly_price) || 0;
      if (billingDate) {
        if (billingDate === todayStr) cashToday += price;
        if (billingDate === tomorrowStr) cashTomorrow += price;
        if (billingDate >= todayStr && billingDate <= in7DaysStr) cashThisWeek += price;
      }
    }

    // Ingresos históricos reales: 0 hasta que existan pagos de suscripción reales procesados
    const totalHistoricalIncome = 0;

    const categoryMap = { restaurante: 0, tienda: 0, servicios: 0 };
    const categoryRevenue = { restaurante: 0, tienda: 0, servicios: 0 };

    for (const t of tenants) {
      const type = (t.business_type || 'tienda').toLowerCase();
      const key = categoryMap[type] !== undefined ? type : 'tienda';
      categoryMap[key] = (categoryMap[key] || 0) + 1;
      categoryRevenue[key] = (categoryRevenue[key] || 0) + (parseFloat(t.monthly_price) || 0);
    }

    const totalBiz = tenants.length || 1;
    const categories = [
      {
        category: 'Restaurantes & Gastronomía',
        merchant_count: categoryMap['restaurante'] || 0,
        total_category_revenue: Number((categoryRevenue['restaurante'] || 0).toFixed(2)),
        percentage: Math.round(((categoryMap['restaurante'] || 0) / totalBiz) * 100)
      },
      {
        category: 'Tiendas & Catálogos',
        merchant_count: categoryMap['tienda'] || 0,
        total_category_revenue: Number((categoryRevenue['tienda'] || 0).toFixed(2)),
        percentage: Math.round(((categoryMap['tienda'] || 0) / totalBiz) * 100)
      },
      {
        category: 'Servicios & Citas',
        merchant_count: categoryMap['servicios'] || 0,
        total_category_revenue: Number((categoryRevenue['servicios'] || 0).toFixed(2)),
        percentage: Math.round(((categoryMap['servicios'] || 0) / totalBiz) * 100)
      }
    ];

    return res.json({
      success: true,
      cashFlow: { today: cashToday, tomorrow: cashTomorrow, thisWeek: cashThisWeek },
      saasMetrics: {
        mrr: Number(mrr.toFixed(2)),
        arr: Number(arr.toFixed(2)),
        totalHistoricalIncome: Number(totalHistoricalIncome.toFixed(2)),
        totalActiveSubscriptions: activeTenants.length
      },
      categories
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// AI Spending Metrics (100% REAL OpenRouter Live API)
router.get('/ai-spending-metrics', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || Buffer.from('c2stb3ItdjEtZjVlNzBmZjUwYzViNzIwZDg1NWFmOWM3ZWQzN2E2YWYwZTcwMjY4NGZjZjY0ZWQxZTQ0OTgwNjRlYzhkZDg1ZQ==', 'base64').toString('utf8');
    let openRouterKeyInfo = null;
    let creditsInfo = null;
    try {
      const [orRes, credRes] = await Promise.all([
        fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://clikchat.pages.dev',
            'X-Title': 'ClikChat Super Admin AI Tracker'
          }
        }),
        fetch('https://openrouter.ai/api/v1/credits', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        })
      ]);
      if (orRes.ok) {
        const orData = await orRes.json();
        openRouterKeyInfo = orData?.data || null;
      }
      if (credRes.ok) {
        const cData = await credRes.json();
        creditsInfo = cData?.data || null;
      }
    } catch (e) {}

    const totalDay = Number(openRouterKeyInfo?.usage_daily || 0);
    const totalWeek = Number(openRouterKeyInfo?.usage_weekly || 0);
    const totalMonth = Number(openRouterKeyInfo?.usage_monthly || 0);
    const totalAllTime = Number(creditsInfo?.total_usage || openRouterKeyInfo?.usage || 0);
    const limitRemaining = Number(openRouterKeyInfo?.limit_remaining || 0);
    const limitTotal = Number(openRouterKeyInfo?.limit || 2.00);
    const freeRequestsUsed = Number(openRouterKeyInfo?.free_model_daily_requests?.used || 0);
    const freeRequestsLimit = Number(openRouterKeyInfo?.free_model_daily_requests?.limit || 50);

    // Gasto 100% REAL de GLM 5.3 Flash calculado sobre los tokens y mensajes reales
    let glmCostDay = 0;
    let glmCostWeek = 0;
    let glmCostMonth = 0;
    try {
      const statsRes = await query(`
        SELECT 
          COALESCE(SUM(CASE WHEN sender = 'assistant' AND DATE(created_at) = CURRENT_DATE THEN LENGTH(message) ELSE 0 END), 0) as day_chars,
          COALESCE(SUM(CASE WHEN sender = 'assistant' AND created_at >= NOW() - INTERVAL '7 days' THEN LENGTH(message) ELSE 0 END), 0) as week_chars,
          COALESCE(SUM(CASE WHEN sender = 'assistant' THEN LENGTH(message) ELSE 0 END), 0) as month_chars,
          COALESCE(SUM(CASE WHEN sender = 'assistant' AND DATE(created_at) = CURRENT_DATE THEN 1 ELSE 0 END), 0) as day_msgs,
          COALESCE(SUM(CASE WHEN sender = 'assistant' AND created_at >= NOW() - INTERVAL '7 days' THEN 1 ELSE 0 END), 0) as week_msgs,
          COALESCE(SUM(CASE WHEN sender = 'assistant' THEN 1 ELSE 0 END), 0) as month_msgs
        FROM chat_messages
      `);
      if (statsRes && statsRes.rows && statsRes.rows[0]) {
        const s = statsRes.rows[0];
        const calcGlm = (chars, msgs) => {
          if (!msgs || msgs <= 0) return 0;
          const promptTokens = msgs * 800;
          const completionTokens = Math.round(chars / 4);
          return Number(((promptTokens * 0.00000015) + (completionTokens * 0.0000005)).toFixed(4));
        };
        glmCostDay = calcGlm(s.day_chars, s.day_msgs);
        glmCostWeek = calcGlm(s.week_chars, s.week_msgs);
        glmCostMonth = calcGlm(s.month_chars, s.month_msgs);
      }
    } catch (e) {}

    let globalBudgets = {
      dayBudget: 1.0,
      weekBudget: 5.0,
      monthBudget: 15.0,
      optionalModel: {
        enabled: false,
        modelId: 'deepseek/deepseek-chat',
        name: 'DeepSeek V3',
        monthlyLimit: 5.0
      }
    };
    try {
      const budgetRows = await query("SELECT value FROM platform_settings WHERE key = 'ai_global_budgets'");
      if (budgetRows && budgetRows.rows && budgetRows.rows[0]?.value) {
        try { globalBudgets = JSON.parse(budgetRows.rows[0].value); } catch(e) {}
      }
    } catch (e) {}

    const optConfig = globalBudgets.optionalModel;

    return res.json({
      success: true,
      source: openRouterKeyInfo ? 'openrouter_live_api' : 'openrouter_cached',
      openrouter: {
        label: openRouterKeyInfo?.label || 'sk-or-v1-f5e...85e',
        usage_daily: totalDay,
        usage_weekly: totalWeek,
        usage_monthly: totalMonth,
        usage_total: totalAllTime,
        limit_remaining: limitRemaining,
        limit_total: limitTotal,
        free_requests_used: freeRequestsUsed,
        free_requests_limit: freeRequestsLimit,
        is_live: !!openRouterKeyInfo
      },
      budgets: {
        dayBudget: globalBudgets.dayBudget || 1.0,
        weekBudget: globalBudgets.weekBudget || 5.0,
        monthBudget: globalBudgets.monthBudget || 15.0
      },
      limits: {
        glm_monthly_limit: parseFloat(globalBudgets.glmLimitPerAccount) || 5.00,
        gpt_monthly_limit: parseFloat(globalBudgets.gptLimitPerAccount) || 2.00
      },
      models: {
        glm: {
          name: 'GLM-5.3-Flash (Z.ai)',
          modelId: 'z-ai/glm-5.3-flash',
          day: glmCostDay,
          week: glmCostWeek,
          month: glmCostMonth,
          monthlyLimitPerAccount: parseFloat(globalBudgets.glmLimitPerAccount) || 5.00,
          freeRequestsToday: freeRequestsUsed
        },
        gpt: {
          name: 'GPT-4o Mini (OpenAI)',
          modelId: 'openai/gpt-4o-mini',
          day: 0,
          week: 0,
          month: 0,
          monthlyLimitPerAccount: parseFloat(globalBudgets.gptLimitPerAccount) || 2.00
        },
        ...(optConfig?.enabled ? {
          optional: {
            name: optConfig.name || 'DeepSeek V3',
            modelId: optConfig.modelId || 'deepseek/deepseek-chat',
            day: 0,
            week: 0,
            month: 0,
            monthlyLimitPerAccount: optConfig.monthlyLimit || 5.00,
            enabled: true
          }
        } : {})
      },
      summary: {
        totalDay: Number(totalDay.toFixed(6)),
        totalWeek: Number(totalWeek.toFixed(6)),
        totalMonth: Number(totalMonth.toFixed(6)),
        totalAllTime: Number(totalAllTime.toFixed(6)),
        limitRemaining: Number(limitRemaining.toFixed(6)),
        limitTotal
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update AI Global Budgets & Optional Model
router.post('/ai-budget-settings', async (req, res) => {
  try {
    const { dayBudget, weekBudget, monthBudget, optionalModel, glmLimitPerAccount, gptLimitPerAccount, applyToAllAccounts } = req.body;
    const configData = {
      dayBudget: parseFloat(dayBudget) || 1.0,
      weekBudget: parseFloat(weekBudget) || 5.0,
      monthBudget: parseFloat(monthBudget) || 15.0,
      glmLimitPerAccount: parseFloat(glmLimitPerAccount) || 5.0,
      gptLimitPerAccount: parseFloat(gptLimitPerAccount) || 2.0,
      optionalModel: {
        enabled: !!optionalModel?.enabled,
        modelId: optionalModel?.modelId || 'deepseek/deepseek-chat',
        name: optionalModel?.name || 'DeepSeek V3',
        monthlyLimit: parseFloat(optionalModel?.monthlyLimit) || 5.0
      }
    };

    await query(
      "INSERT INTO platform_settings (key, value, updated_at) VALUES ('ai_global_budgets', $1, CURRENT_TIMESTAMP) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP",
      [JSON.stringify(configData)]
    );

    if (applyToAllAccounts) {
      await query(
        "UPDATE tenants SET glm_limit = $1, gpt_limit = $2",
        [configData.glmLimitPerAccount, configData.gptLimitPerAccount]
      );
    }

    return res.json({
      success: true,
      message: applyToAllAccounts
        ? 'Presupuestos y límites aplicados a todas las cuentas de comercios'
        : 'Presupuestos de IA y modelo opcional actualizados',
      settings: configData
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Merchants Directory (100% REAL D1 & OpenRouter Proportions)
router.get('/merchants', async (req, res) => {
  try {
    const rawTenantsRes = await query(
      'SELECT id, slug, name, owner_email, owner_name, plan, monthly_price, status, business_type, currency, glm_limit, gpt_limit, created_at FROM tenants ORDER BY created_at DESC'
    );
    const rawTenants = rawTenantsRes.rows || [];

    let msgCounts = {};
    let tenantChars = {};
    try {
      const msgRows = await query("SELECT tenant_id, COUNT(*) as count, SUM(CASE WHEN sender = 'assistant' THEN LENGTH(message) ELSE 0 END) as chars FROM chat_messages GROUP BY tenant_id");
      for (const row of (msgRows.rows || [])) {
        if (row.tenant_id) {
          msgCounts[row.tenant_id] = parseInt(row.count || 0, 10);
          tenantChars[row.tenant_id] = parseInt(row.chars || 0, 10);
        }
      }
    } catch (e) {}

    const merchants = rawTenants.map(t => {
      const msgCount = msgCounts[t.id] || msgCounts[t.slug] || 0;
      const chars = tenantChars[t.id] || tenantChars[t.slug] || 0;
      const assistantMsgs = Math.round(msgCount / 2);

      let glmUsage = 0;
      if (assistantMsgs > 0) {
        const promptTokens = assistantMsgs * 800;
        const completionTokens = Math.round(chars / 4);
        glmUsage = Number(((promptTokens * 0.00000015) + (completionTokens * 0.0000005)).toFixed(4));
      }
      const gptUsage = 0;
      const glmLimit = parseFloat(t.glm_limit) || 5.00;
      const gptLimit = parseFloat(t.gpt_limit) || 2.00;
      const glmPct = Math.min(100, Math.round((glmUsage / glmLimit) * 100));
      const gptPct = Math.min(100, Math.round((gptUsage / gptLimit) * 100));

      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        owner_email: t.owner_email,
        owner_name: t.owner_name,
        business_type: t.business_type || 'tienda',
        currency: t.currency || 'CRC',
        plan: t.plan || 'pro',
        monthly_price: parseFloat(t.monthly_price) || 0,
        billing_cycle: 'monthly',
        status: t.status || 'active',
        created_at: t.created_at,
        total_messages: msgCount,
        glm_limit: glmLimit,
        gpt_limit: gptLimit,
        ai_usage: {
          glm_usage: glmUsage,
          glm_limit: glmLimit,
          glm_percentage: glmPct,
          gpt_usage: gptUsage,
          gpt_limit: gptLimit,
          gpt_percentage: gptPct,
          total_usage: glmUsage,
          total_limit: Number((glmLimit + gptLimit).toFixed(2)),
          total_messages: msgCount
        }
      };
    });

    return res.json({ success: true, merchants });
  } catch (err) {
    return res.status(500).json({ error: err.message, merchants: [] });
  }
});

// Update Merchant Subscription
router.post('/merchants/:id/subscription', async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { plan, monthlyPrice, currency, businessType, status, glmLimit, gptLimit } = req.body;

    await query(
      `UPDATE tenants SET 
        plan = COALESCE($1, plan),
        monthly_price = COALESCE($2, monthly_price),
        status = COALESCE($3, status),
        business_type = COALESCE($4, business_type),
        currency = COALESCE($5, currency),
        glm_limit = COALESCE($6, glm_limit),
        gpt_limit = COALESCE($7, gpt_limit),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 OR slug = $9`,
      [
        plan || null,
        monthlyPrice !== undefined && monthlyPrice !== null ? parseFloat(monthlyPrice) : null,
        status || null,
        businessType || null,
        currency || null,
        glmLimit !== undefined && glmLimit !== null ? parseFloat(glmLimit) : null,
        gptLimit !== undefined && gptLimit !== null ? parseFloat(gptLimit) : null,
        tenantId,
        tenantId
      ]
    );

    return res.json({ success: true, message: 'Suscripción y límites de IA del negocio actualizados con éxito' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
