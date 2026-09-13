/**
 * Database Initializer for ClikChat
 * Validates Cloudflare D1 Database connectivity and schema
 */
require('dotenv').config();
const { query, D1_DATABASE_ID } = require('../server/db');

async function runMigration() {
  console.log('🚀 Verificando Base de Datos Cloudflare D1 para Clikchat...');
  try {
    const res = await query('SELECT count(*) as count FROM sqlite_master WHERE type="table"');
    const tableCount = res.rows[0]?.count || 0;
    console.log(`✅ Base de Datos Cloudflare D1 conectada y activa. Tablas existentes: ${tableCount} (D1 ID: ${D1_DATABASE_ID})`);
  } catch (err) {
    console.error('❌ Error conectando con Cloudflare D1:', err.message);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
