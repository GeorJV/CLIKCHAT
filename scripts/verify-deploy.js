/**
 * Script de Verificación Automática en Vivo (Filtro 3)
 * Lanza Chrome Headless vía CDP para verificar que la app renderiza 100% libre de errores.
 */
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.TEST_URL || 'https://clikchat.pages.dev/user/mi-negocio/pizzas-deli/mi-negocio';

async function runSmokeTest() {
  console.log('🚀 Iniciando verificación headless de producción en:', TARGET_URL);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  const cleanup = () => {
    try { chromeProc.kill(); } catch (e) {}
  };

  await new Promise(r => setTimeout(r, 1500));

  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:9222/json/new?${encodeURIComponent(TARGET_URL)}`, { method: 'PUT' }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const target = JSON.parse(body);
          const wsUrl = target.webSocketDebuggerUrl;
          if (!wsUrl) throw new Error('No se obtuvo WebSocket de Chrome');

          const ws = new WebSocket(wsUrl);
          let fatalErrors = [];

          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 3,
                method: 'Runtime.evaluate',
                params: { expression: 'document.getElementById("root") ? document.getElementById("root").innerHTML.trim() : ""' }
              }));
            }, 3500);
          };

          ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Runtime.exceptionThrown') {
              fatalErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
            } else if (msg.id === 3) {
              const html = msg.result?.result?.value || '';
              ws.close();
              cleanup();

              if (fatalErrors.length > 0) {
                console.error('❌ ERROR FATAL DETECTADO EN PRODUCCIÓN:');
                fatalErrors.forEach(err => console.error('  ->', err));
                return reject(new Error('Falló la prueba: excepciones en runtime'));
              }

              if (!html || html.length < 50) {
                console.error('❌ PANTALLA EN BLANCO/NEGRO DETECTADA (#root vacío)');
                return reject(new Error('Falló la prueba: DOM vacío'));
              }

              console.log('✅ VERIFICACIÓN EXITOSA: DOM renderizado correctamente (' + html.length + ' bytes), 0 excepciones.');
              resolve(true);
            }
          };
        } catch (err) {
          cleanup();
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      cleanup();
      reject(err);
    });
    req.end();
  });
}

runSmokeTest()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Test fallido:', err.message);
    process.exit(1);
  });
