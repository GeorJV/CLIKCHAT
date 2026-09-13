const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function runMigration() {
  console.log('🚀 Iniciando inicialización de Base de Datos para Clikchat...');
  
  if (!connectionString) {
    console.warn('⚠️ No se encontró DATABASE_URL en .env. Saltando migración directa.');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Conexión establecida con Neon PostgreSQL.');

    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('⏳ Ejecutando schema.sql (Tablas, RLS, Índices)...');
    await client.query(schemaSql);
    console.log('✅ Tablas y políticas RLS creadas exitosamente.');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    console.log('⏳ Insertando datos semilla (seed.sql)...');
    await client.query(seedSql);
    console.log('✅ Datos semilla inicializados exitosamente.');

    client.release();
  } catch (err) {
    console.error('❌ Error durante la migración de base de datos:', err.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
