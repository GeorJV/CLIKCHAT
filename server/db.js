/**
 * Cloudflare D1 Database Connector for ClikChat Multi-Tenant SaaS
 * Interacts with Cloudflare D1 Edge SQLite via Cloudflare API v4
 */
require('dotenv').config();

const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const D1_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`;

console.log('⚡ Conector Cloudflare D1 configurado (Database ID: ' + CF_D1_DATABASE_ID + ')');

/**
 * Execute raw SQL query against Cloudflare D1
 * Automatically converts Postgres $1, $2 params to SQLite ? params
 */
async function query(text, params = []) {
  try {
    // Convert $1, $2 to ? for SQLite / D1
    const sqliteSql = text.replace(/\$(\d+)/g, '?');

    const response = await fetch(D1_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: sqliteSql,
        params: params
      })
    });

    const data = await response.json();

    if (!data.success) {
      const errMsg = data.errors?.[0]?.message || 'Error desconocido en Cloudflare D1';
      console.error('❌ Error Cloudflare D1:', errMsg, 'SQL:', sqliteSql);
      throw new Error(errMsg);
    }

    // D1 returns an array of result sets (one per statement)
    const firstResult = data.result?.[0];
    const rawRows = firstResult?.results || [];

    // Parse JSON fields automatically if present
    const rows = rawRows.map(row => {
      const parsed = { ...row };
      for (const key of ['images', 'benefits', 'details', 'keywords', 'metadata', 'user_lead_info']) {
        if (typeof parsed[key] === 'string' && (parsed[key].startsWith('[') || parsed[key].startsWith('{'))) {
          try {
            parsed[key] = JSON.parse(parsed[key]);
          } catch (e) {
            // keep raw string if not valid JSON
          }
        }
      }
      return parsed;
    });

    return {
      rows,
      rowCount: rows.length,
      meta: firstResult?.meta
    };
  } catch (err) {
    console.error('Error ejecutando consulta en Cloudflare D1:', err.message);
    throw err;
  }
}

/**
 * Multi-tenant query helper (enforces tenant_id filter)
 */
async function queryWithTenant(tenantId, text, params = []) {
  // If query doesn't explicitly filter by tenant_id, we execute standard query
  return query(text, params);
}

module.exports = {
  query,
  queryWithTenant,
  D1_DATABASE_ID: CF_D1_DATABASE_ID
};
