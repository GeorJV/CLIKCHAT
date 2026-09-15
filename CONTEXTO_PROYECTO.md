# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150 líneas por archivo).
- **Última Actualización:** 2026-09-14 21:12 GMT-6
- **Versión Actual:** 1.16.1 (Tracking Real de Todos los Botones en D1 & Refresco En Vivo)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Registro de métricas 100% real en Cloudflare D1 ante interacción con CUALQUIER botón (Comprar, Beneficios, Detalle, Chat, Checkout).
  - Resolución inteligente de UUID/slug para actualizar siempre la fila correcta en `product_metrics`.
  - Panel del dueño con refresco automático en segundo plano cada 8s y botón interactivo "Métricas En Vivo ↺".
  - Métricas inicializadas estrictamente en 0 para productos nuevos sin simulación de hash.
  - Enlaces universales QLink funcionales en cualquier navegador con fotos auténticas del dueño sin mocks.
  - Proyecto supervisado en ARQ AI Studio (ID: `proj-1789360940430`, status: `ready_for_review`).
- **Siguiente Paso Inmediato:** Validar con el usuario el incremento en vivo de métricas al tocar botones en https://clikchat.pages.dev.
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_APROBADOS.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.


