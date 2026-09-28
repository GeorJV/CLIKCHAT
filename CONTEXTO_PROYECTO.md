# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 15:32 GMT-6
- **Versión Actual:** 1.37.0 (Limpieza Pura de Productos y Extracción Post-LLM en Botones Rápidos)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Botones Rápidos Impecables: Erradicada repetición de coletillas de consulta (ej: "cuanto vale", "precio", "que trae") en etiquetas de botones y comanda.
  - Extracción y Refinamiento Post-LLM: Sincronización exacta del nombre oficial ("Carlota de Melocotón") y precio ("$2.500") desde el modelo y base RAG.
  - Adición Resiliente a Comanda: Sanitización de entradas y rescate contextual de precio/ítem si el usuario confirma directamente.
  - Build Verificado: 0 errores en compilación Vite (6.27s) y sintaxis de Cloudflare Functions.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

