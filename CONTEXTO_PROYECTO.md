# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 17:21 GMT-6
- **Versión Actual:** 1.45.0 (Botón Agregado Presionado Verde en Resumen de Comanda)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Botón Agregado Presionado y Verde: Al emitir el resumen de pedido ("queda así:", cantidades "1x", "4x"), los botones se muestran automáticamente como "✓ Agregado", con sombra interior de botón presionado y tono esmeralda. Las sugerencias de menú conservan su botón naranja "+ Agregar".
  - Dichos Coloquiales y Agregación Referencial: Soporte universal para expresiones ("dame uno de esos", "quiero uno", "si quiero ese", "agregalo", etc.) con resolución de producto desde el historial y RAG chunks.
  - Rescate Post-LLM de Comanda: Si la IA confirma que anotó un producto ("Tu [Producto] ya está anotado"), el sistema lo extrae, busca su precio en documentos/catálogo y actualiza automáticamente `orderTotal` y la tabla `orders` en D1.
  - Botón Rápido de Confirmación: Generación interactiva de `➕ Confirmar [Producto] (₡Precio)` y `🧾 Ver Comanda / Total`.
  - Motor Titular GLM-5.3-Flash Ultra-Rápido (~700ms) con blindaje anti-CoT activo.
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

