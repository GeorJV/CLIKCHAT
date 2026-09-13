const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { runMigration } = require('../database/initDb');
const chatRoutes = require('./routes/chat');
const tenantsRoutes = require('./routes/tenants');
const productsRoutes = require('./routes/products');
const faqsRoutes = require('./routes/faqs');
const auditRoutes = require('./routes/audit');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck & Diagnostic Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Clikchat SaaS Multi-Tenant Backend',
    version: '1.0.0',
    ragLevels: {
      level1: 'Episodic Session Memory',
      level2: 'Strict FAQs Vector Match',
      level3: 'Catalog & Product Specifications',
      fallback: 'Human-in-the-Loop Auto-Learning'
    },
    cloudDeployment: 'Clikchat.pages.dev',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build if present
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>Clikchat Server API</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;padding:2rem;text-align:center;">
            <h1>⚡ Clikchat Backend API Activo</h1>
            <p>El servidor API está corriendo en el puerto ${PORT}.</p>
            <p><a href="/api/health" style="color:#38bdf8;">Verificar Estado del Sistema (/api/health)</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Auto-run DB migration on boot
runMigration().catch(err => {
  console.warn('Advertencia en migración inicial:', err.message);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Clikchat corriendo en: http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
