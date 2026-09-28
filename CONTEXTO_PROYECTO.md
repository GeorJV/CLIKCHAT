# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 16:03 GMT-6
- **Versión Actual:** 1.41.0 (Sincronización Total Comanda/Precios ¢ y Blindaje Anti-Truncamiento)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Sincronización Total de Comanda: Soporte para símbolo ¢ (colones) en backend y frontend. Botón TOTAL se actualiza de inmediato vía rescate de precios en 3 niveles (acción, historial y RAG chunks).
  - Blindaje Anti-Truncamiento: Rechazo de `finish_reason: length`, tokens ampliados a 800 y extractor de oraciones incompletas que erradica fragmentos cortados a la mitad.
  - Motor Titular DeepSeek v3.2: Directo, ultra bajo costo ($0.00000042/tok), sin fugas de razonamiento.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

