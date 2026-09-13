const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let pool = null;
let isConnected = false;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle Neon PostgreSQL client:', err);
    });

    // Test initial connection
    pool.query('SELECT 1').then(() => {
      isConnected = true;
      console.log('✅ Conexión activa con Neon PostgreSQL (Multi-tenant RLS listo).');
    }).catch(err => {
      console.warn('⚠️ Neon PostgreSQL no respondió inmediatamente, modo fallback activo:', err.message);
    });
  } catch (err) {
    console.warn('⚠️ Error instanciando Pool de Neon Postgres:', err.message);
  }
}

// Helper to execute query with Row-Level Security (RLS) tenant isolation
async function queryWithTenant(tenantId, text, params = []) {
  if (!pool) {
    throw new Error('Database pool not configured');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (tenantId) {
      await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);
    } else {
      await client.query("SELECT set_config('app.is_superadmin', 'true', true)");
    }
    const res = await client.query(text, params);
    await client.query('COMMIT');
    return res;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Simple direct query (e.g. for tenant lookup before context is set)
async function query(text, params = []) {
  if (!pool) {
    throw new Error('Database connection string not configured');
  }
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
  queryWithTenant,
  isDbConnected: () => isConnected
};
