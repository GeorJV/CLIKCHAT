# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150 líneas por archivo).
- **Última Actualización:** 2026-09-14 21:05 GMT-6
- **Versión Actual:** 1.16.0 (Métricas en 0, D1 100% Online, Links Universales y Fotos Reales)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Métricas de nuevos productos inicializadas estrictamente en cero (0) y persistidas en Cloudflare D1 (`product_metrics`).
  - Tracking online en tiempo real para eventos `view`, `buy_click`, `benefit_view` y `lead` (frío, tibio, caliente).
  - Eliminación total de fotos de prueba de Unsplash y Sérum mock; carga exclusiva de fotos subidas por el dueño.
  - Resolución universal de links QLink (`?p=id` y `?t=slug&p=id`) en cualquier navegador mediante `useProductResolver` y Edge Functions.
  - Interfaz de producto aclarada a `#222020` y botón Comprar Ahora unificado con estilo Nivel 3 Catálogo.
  - Proyecto supervisado en ARQ AI Studio (ID: `proj-1789360940430`, status: `ready_for_review`).
- **Siguiente Paso Inmediato:** Validar con el usuario la creación de nuevos productos con métricas en 0 y fotos reales en clikchat.pages.dev.
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_APROBADOS.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.


