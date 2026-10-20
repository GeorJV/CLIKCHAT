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

console.log('🚀 Iniciando despliegue dual en Cloudflare Pages...');

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: token,
  CLOUDFLARE_ACCOUNT_ID: accountId
};

try {
  console.log('📦 1/2 Desplegando en clikchat (https://clikchat.pages.dev)...');
  execSync('npx wrangler pages deploy dist --project-name clikchat --commit-dirty=true', {
    env,
    stdio: 'inherit'
  });

  console.log('📦 2/2 Desplegando en clikchatcrm (https://clikchatcrm.pages.dev)...');
  execSync('npx wrangler pages deploy dist --project-name clikchatcrm --commit-dirty=true', {
    env,
    stdio: 'inherit'
  });

  console.log('✅ Despliegue dual completado con éxito en ambos dominios.');
} catch (e) {
  console.error('❌ Error en el despliegue:', e.message);
  process.exit(1);
}
