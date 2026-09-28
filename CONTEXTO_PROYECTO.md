# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 15:37 GMT-6
- **Versión Actual:** 1.38.0 (Jerarquía IA: 1° GLM 5.3 Titular / 2° DeepSeek Respaldo / 3° GPT Final)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Jerarquía Estricta de Modelos: 1° GLM-5.3-Flash (Principal), 2° DeepSeek V3 (Respaldo), 3° GPT-4o Mini (Respaldo Final).
  - Sincronización Global: Aplicado en Edge Functions, Client Fallback, Server Router y Consola Super Admin.
  - Failover Inmediato: Si GLM entra en rate-limit, conmuta de inmediato a DeepSeek y GPT sin perder el mensaje.
  - Build Verificado: 0 errores en compilación Vite y sintaxis en Cloudflare Edge.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

