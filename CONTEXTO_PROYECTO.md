# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 16:52 GMT-6
- **Versión Actual:** 1.42.0 (Motor Ultra-Rápido GLM-5.3-Flash Titular ~700ms + Sort Latency)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Motor Titular GLM-5.3-Flash Ultra-Rápido: Configurado con `reasoning: { effort: 'low' }` y `provider: { sort: 'latency' }`, logrando tiempos de ~700ms a 1.2s y costo de $0.000027 por consulta.
  - Cadena Resiliente: 1° GLM-5.3-Flash, 2° DeepSeek Chat, 3° DeepSeek v3.2, 4° GPT-4o Mini.
  - Blindaje Anti-CoT & Guardrails: Sanitización estricta que erradica monólogos en inglés y reportes de seguridad en Cloudflare Edge, Fallback Cliente y Server Router.
  - Cadencia de Tienda Intacta: Selector de velocidad y delay de respuesta del dueño (1 seg, etc.) plenamente respetado.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

