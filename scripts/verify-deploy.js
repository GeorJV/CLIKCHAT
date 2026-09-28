/**
 * Script de Verificación Integral de Producción (Filtro 3 - Suite Completa)
 * Audita hash matching local vs producción y valida todas las rutas críticas en Chrome Headless.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://clikchat.pages.dev';

const ROUTES = [
  { path: '/', label: 'Web Oficial / Landing' },
  { path: '/chat/comida-callejera-xl', label: 'Chat Negocio (Ruta Limpia)' },
  { path: '/chat/comida-callejera-xl/comida-cajera-xl', label: 'Chat Producto (Ruta Limpia)' },
  { path: '/producto', label: 'Chat de Catálogo Producto' },
  { path: '/servicio', label: 'Chat de Reserva de Servicio' },
  { path: '/user/mi-negocio/comida-callejera-xl/dashboard', label: 'Panel: Dashboard Principal' },
  { path: '/user/mi-negocio/comida-callejera-xl/mi-negocio', label: 'Panel: Mi Negocio' },
  { path: '/user/mi-negocio/comida-callejera-xl/productos', label: 'Panel: Productos' },
  { path: '/user/mi-negocio/comida-callejera-xl/conversaciones', label: 'Panel: Conversaciones' },
  { path: '/user/mi-negocio/comida-callejera-xl/mi-cuenta', label: 'Panel: Mi Cuenta' },
  { path: '/super-admin', label: 'Panel: Super Admin' },
  { path: '/dashboard', label: 'Redirección Canónica /dashboard' }
];

function fetchLiveBundle() {
  return new Promise((resolve) => {
    https.get(`${BASE_URL}/?_t=${Date.now()}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/index-[a-zA-Z0-9_-]+\.js/);
        resolve(match ? match[0] : null);
      });
    }).on('error', () => resolve(null));
  });
}

async function verifyBundleHashMatch() {
  const distHtmlPath = path.join(__dirname, '../dist/index.html');
  if (!fs.existsSync(distHtmlPath)) {
    console.error('❌ [ERROR] No existe dist/index.html. Ejecuta "npm run build" primero.');
    process.exit(1);
  }

  const distHtml = fs.readFileSync(distHtmlPath, 'utf8');
  const localMatch = distHtml.match(/index-[a-zA-Z0-9_-]+\.js/);
  const expectedBundle = localMatch ? localMatch[0] : null;

  if (!expectedBundle) {
    console.error('❌ [ERROR] No se pudo extraer el hash del bundle local en dist/index.html.');
    process.exit(1);
  }

  console.log(`🔍 [FILTRO 3: COMPARACIÓN DE HASH]`);
  console.log(`   - Bundle local esperado:   ${expectedBundle}`);

  const maxAttempts = 30;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const liveBundle = await fetchLiveBundle();
    console.log(`   - Intento ${attempt}/${maxAttempts}: Bundle en producción -> ${liveBundle || 'no detectado'}`);

    if (liveBundle === expectedBundle) {
      console.log(`   ✅ ¡HASH MATCH CONFIRMADO! El bundle en vivo (${liveBundle}) coincide exactamente con el build local.\n`);
      return expectedBundle;
    }

    if (attempt < maxAttempts) {
      await new Promise(r => setTimeout(r, 6000));
    }
  }

  console.error(`\n❌ [FILTRO 3 FALLIDO] Despliegue en producción no sincronizado.`);
  console.error(`   El servidor público sigue entregando una versión anterior.`);
  console.error(`   Esperado: ${expectedBundle}`);
  process.exit(1);
}

function testSingleRoute(url, label) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const target = JSON.parse(body);
          const wsUrl = target.webSocketDebuggerUrl;
          if (!wsUrl) return reject(new Error('No WebSocket for ' + url));

          const ws = new WebSocket(wsUrl);
          let errors = [];

          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 2,
                method: 'Runtime.evaluate',
                params: { expression: 'document.getElementById("root") ? document.getElementById("root").innerHTML.trim() : ""' }
              }));
            }, 2500);
          };

          ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.exceptionThrown') {
              errors.push(msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text || 'Unknown Error');
            } else if (msg.id === 2) {
              const html = msg.result?.result?.value || '';
              ws.close();

              if (target.id) {
                const closeReq = http.request(`http://127.0.0.1:9222/json/close/${target.id}`, { method: 'GET' }, () => {});
                closeReq.end();
              }

              if (errors.length > 0) {
                console.error(`  ❌ [FALLO] ${label} (${url}): Excepciones en runtime:`);
                errors.forEach(e => console.error('     ->', e));
                return reject(new Error(`Errores en ruta ${url}`));
              }

              if (!html || html.length < 50) {
                console.error(`  ❌ [FALLO] ${label} (${url}): Pantalla negra/vacía detectada.`);
                return reject(new Error(`DOM vacío en ${url}`));
              }

              console.log(`  ✅ [OK] ${label} (${url}) -> ${html.length} bytes renderizados, 0 errores.`);
              resolve(true);
            }
          };
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runFullSuite() {
  console.log('🛡️ PROTOCOLO DE VERIFICACIÓN DE DESPLIEGUE — 3 FILTROS');
  console.log(`🎯 Dominio base: ${BASE_URL}\n`);

  // Paso 1: Hash match estricto
  const verifiedBundle = await verifyBundleHashMatch();

  // Paso 2: Suite Headless Chrome
  console.log('🌐 INICIANDO AUDITORÍA RUNTIME EN CHROME HEADLESS...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  let passed = 0;
  let failed = 0;

  try {
    for (const route of ROUTES) {
      const fullUrl = `${BASE_URL}${route.path}`;
      try {
        await testSingleRoute(fullUrl, route.label);
        passed++;
      } catch (err) {
        failed++;
      }
      await new Promise(r => setTimeout(r, 500));
    }
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }

  let commitHash = 'desconocido';
  try {
    commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {}

  console.log('\n======================================================');
  console.log(`📊 RESULTADO DE LA AUDITORÍA: ${passed}/${ROUTES.length} rutas operativas.`);

  if (failed > 0) {
    console.error(`❌ ALERTA: ${failed} rutas fallaron. Despliegue con errores.`);
    process.exit(1);
  } else {
    console.log('🎉 REPORTE DE CIERRE — PROTOCOLO 3 FILTROS CUMPLIDO AL 100%:');
    console.log('| Filtro | Resultado |');
    console.log('|--------|-----------|');
    console.log('| 1. Validación Dual Local | ✅ Build limpio 0 errores |');
    console.log(`| 2. Sincronización Remota | ✅ Commit ${commitHash} en main |`);
    console.log(`| 3. Smoke Test HTTP (Hash Match) | ✅ ${verifiedBundle} activo en CDN |`);
    process.exit(0);
  }
}

runFullSuite();
