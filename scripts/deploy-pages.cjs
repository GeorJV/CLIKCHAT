/**
 * Script de despliegue directo a Cloudflare Pages
 * Las credenciales se leen exclusivamente desde .env
 */
const { execSync } = require('child_process');
require('dotenv').config();

const token = process.env.CF_PAGES_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CF_PAGES_ACCOUNT_ID || '2a67b9374597924117a6a21ea3de3305';

if (!token) {
  console.error('❌ Error: CF_PAGES_API_TOKEN no está definido en .env');
  process.exit(1);
}

console.log('🚀 Iniciando despliegue en Cloudflare Pages (clikchat)...');

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: token,
  CLOUDFLARE_ACCOUNT_ID: accountId
};

try {
  execSync('npx wrangler pages deploy dist --project-name clikchat --commit-dirty=true', {
    env,
    stdio: 'inherit'
  });
  console.log('✅ Despliegue completado con éxito.');
} catch (e) {
  console.error('❌ Error en el despliegue:', e.message);
  process.exit(1);
}
