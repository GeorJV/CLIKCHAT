/**
 * Script de Verificación Integral de Producción (Filtro 3 - Suite Completa)
 * Audita todas las rutas críticas en Chrome Headless para garantizar 0 fallos.
 */
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'https://clikchat.pages.dev';

const ROUTES = [
  { path: '/', label: 'Web Oficial / Landing' },
  { path: '/chat/comida-callejera-xl', label: 'Chat Negocio (Ruta Limpia)' },
  { path: '/chat/comida-callejera-xl/prod_1789447247688', label: 'Chat Producto (Ruta Limpia)' },
  { path: '/producto', label: 'Chat de Catálogo Producto' },
  { path: '/servicio', label: 'Chat de Reserva de Servicio' },
  { path: '/user/mi-negocio/comida-callejera-xl/mi-negocio', label: 'Panel: Mi Negocio' },
  { path: '/user/mi-negocio/comida-callejera-xl/productos', label: 'Panel: Productos' },
  { path: '/user/mi-negocio/comida-callejera-xl/conversaciones', label: 'Panel: Conversaciones' },
  { path: '/user/mi-negocio/comida-callejera-xl/mi-cuenta', label: 'Panel: Mi Cuenta' },
  { path: '/super-admin', label: 'Panel: Super Admin' },
  { path: '/dashboard', label: 'Redirección Canónica /dashboard' }
];

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

              // Close target page in Chrome to free resources
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
  console.log('🛡️ INICIANDO AUDITORÍA TOTAL DE PRODUCCIÓN EN CLOUDFLARE PAGES');
  console.log(`🎯 Dominio base: ${BASE_URL}\n`);

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

  console.log('\n======================================================');
  console.log(`📊 RESULTADO DE LA AUDITORÍA: ${passed}/${ROUTES.length} rutas operativas.`);
  if (failed > 0) {
    console.error(`❌ ALERTA: ${failed} rutas fallaron. Revisar detalles arriba.`);
    process.exit(1);
  } else {
    console.log('🎉 GARANTÍA DE PRODUCCIÓN CONFIRMADA: 100% de las rutas funcionando sin errores.');
    process.exit(0);
  }
}

runFullSuite();
