# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 15:03 GMT-6
- **Versión Actual:** 1.36.0 (Venta Cruzada Condicional Estricta tras Agregar a la Compra)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Venta Cruzada Condicional: "¿Te gustaría agregarle algo más a tu orden, como una bebida o más papas?" solo sale cuando el usuario ya agregó o solicitó agregar algo a su compra.
  - Filtrado Riguroso de Consultas: Preguntas de información, ingredientes, menú, horarios y precios no disparan adición ni venta cruzada prematura.
  - Build Verificado: 0 errores en compilación Vite (7.30s) y esbuild de Cloudflare Functions.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

