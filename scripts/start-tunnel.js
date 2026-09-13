const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const localtunnel = require('localtunnel');

const PORT = process.env.PORT || 4000;

async function start() {
  console.log('=====================================================');
  console.log('🚀 INICIANDO SERVIDOR Y TÚNELES CON KEEP-ALIVE ACTIVO...');
  console.log('=====================================================');

  // 1. Iniciar servidor Express/React en puerto 4000
  const server = spawn('node', ['server/index.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['inherit', 'pipe', 'pipe'],
    env: process.env,
    shell: true
  });

  server.stdout.on('data', (data) => process.stdout.write(data));
  server.stderr.on('data', (data) => process.stderr.write(data));

  // Esperar a que el servidor esté activo
  await new Promise(res => setTimeout(res, 3500));

  let publicCloudflareUrl = null;
  let publicLocaltunnelUrl = null;

  // 2. Iniciar Cloudflare Quick Tunnel con cloudflared.exe
  const cloudflaredPath = path.join(__dirname, '..', 'cloudflared.exe');
  if (fs.existsSync(cloudflaredPath)) {
    const cfTunnel = spawn(cloudflaredPath, ['tunnel', '--url', `http://localhost:${PORT}`], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const handleCfOutput = (data) => {
      const output = data.toString();
      const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && !publicCloudflareUrl) {
        publicCloudflareUrl = match[0];
        printUrls();
      }
    };

    cfTunnel.stdout.on('data', handleCfOutput);
    cfTunnel.stderr.on('data', handleCfOutput);

    cfTunnel.on('close', () => {
      console.log('⚠️ Túnel Cloudflare se cerró.');
    });
  }

  // 3. Iniciar Localtunnel simultáneamente como respaldo
  try {
    const ltSubdomain = 'clikchat-mobile-' + Math.random().toString(36).substring(2, 6);
    const lt = await localtunnel({ port: PORT, subdomain: ltSubdomain });
    publicLocaltunnelUrl = lt.url;
    printUrls();

    lt.on('close', () => {
      console.log('⚠️ Localtunnel cerrado.');
    });
  } catch (err) {
    console.warn('Localtunnel warning:', err.message);
  }

  function printUrls() {
    console.log('\n\n================================================================');
    console.log('🎉 ¡TÚNELES EN VIVO Y LISTOS PARA PRUEBA EN TU SMARTPHONE!');
    console.log('================================================================');
    if (publicCloudflareUrl) {
      console.log(`📱 OPCIÓN 1 (Recomendada - Cloudflare): ${publicCloudflareUrl}`);
    }
    if (publicLocaltunnelUrl) {
      console.log(`📱 OPCIÓN 2 (Respaldo - Localtunnel):   ${publicLocaltunnelUrl}`);
    }
    console.log('================================================================\n');

    fs.writeFileSync(
      path.join(__dirname, '..', 'CURRENT_TUNNEL_URL.txt'),
      `Cloudflare: ${publicCloudflareUrl}\nLocaltunnel: ${publicLocaltunnelUrl}\nUpdated: ${new Date().toISOString()}`,
      'utf-8'
    );
  }

  // 4. Keep-Alive Ping cada 25 segundos para evitar desconexiones por inactividad
  setInterval(async () => {
    if (publicCloudflareUrl) {
      try {
        await fetch(`${publicCloudflareUrl}/api/health`);
      } catch (e) {
        // keep-alive ping
      }
    }
  }, 25000);
}

start();
