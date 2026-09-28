# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 17:13 GMT-6
- **Versión Actual:** 1.44.0 (Dichos Referenciales, Rescate Post-LLM de Comanda y Botón Confirmar)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Dichos Coloquiales y Agregación Referencial: Soporte universal para expresiones ("dame uno de esos", "quiero uno", "si quiero ese", "agregalo", etc.) con resolución de producto desde el historial y RAG chunks.
  - Rescate Post-LLM de Comanda: Si la IA confirma que anotó un producto ("Tu [Producto] ya está anotado"), el sistema lo extrae, busca su precio en documentos/catálogo y actualiza automáticamente `orderTotal` y la tabla `orders` en D1.
  - Botón Rápido de Confirmación: Generación interactiva de `➕ Confirmar [Producto] (₡Precio)` y `🧾 Ver Comanda / Total`.
  - Depuración de Falsos Positivos: Exclusión de políticas de envío express de botones automáticos de compra.
  - Motor Titular GLM-5.3-Flash Ultra-Rápido (~700ms) con blindaje anti-CoT activo.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

