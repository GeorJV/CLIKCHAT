# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 17:02 GMT-6
- **Versión Actual:** 1.43.0 (Navegación al Dashboard Principal /dashboard Habilitada)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT (commit: 44bcd32)
- **Estado Actual del Sistema:**
  - Botón Dashboard Principal Reparado: `useAppRouter.ts` mapea `/dashboard` a `tab: 'chatbot'`. Al hacer clic en el sidebar mientras se está en `/mi-negocio`, navega a `/user/mi-negocio/:slug/dashboard` y renderiza el panel de métricas en vivo.
  - Validación Headless Chrome (CDP): Clic simulado verificado con éxito (URL cambia a `/dashboard`, botón se ilumina en verde esmeralda y renderiza KPIs).
  - Estado 3 Filtros: Filtro 1 (Build local 0 errores) ✅, Filtro 2 (Git main) ✅, Filtro 3 (En espera de propagación en Cloudflare CDN).
  - Motor Titular GLM-5.3-Flash Ultra-Rápido (~700ms) con blindaje anti-CoT y anti-truncamiento activo.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

