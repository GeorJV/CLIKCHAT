# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 17:40 GMT-6
- **Versión Actual:** 1.48.0 (Optimización Extrema de Latencia del Bot a Sub-2s)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Latencia Sub-2s del Bot: Titular asignado a `openai/gpt-4o-mini` con respuesta en ~1.2s-2.5s, micro-costo estricto ($0.15/1M tokens) y cero fugas de CoT. Respaldos en `deepseek-chat` y `deepseek-v3.2` con timeout de 6.5s por intento vía AbortController en Cloudflare Edge (`functions/api/[[route]].js`).
  - Debounce Client-Side Acelerado: Reducido de 1000ms a 250ms al escribir, y despacho inmediato (0ms) en clics de acciones rápidas (`immediate: true`).
  - Motor Resiliente: Sincronizado en `server/services/llmRouter.js` y `clientChatFallback.ts` manteniendo los límites ARQMODULAR (<180 líneas).
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Validación obligatoria de cada cambio con los 3 filtros antes de dar por terminado.
  - Registro en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md únicamente tras verificación del usuario y comando `hca`.
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md (Memoria Protegida).
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

