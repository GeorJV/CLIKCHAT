# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150 líneas por archivo).
- **Última Actualización:** 2026-09-14 11:46 GMT-6
- **Versión Actual:** 1.6.1 (Codificación UTF-8 Universal Corregida - 0 Rombos con ?)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT (Commit: c6df3a9)
- **Estado Actual del Sistema:**
  - Codificación UTF-8 corregida al 100% en todos los componentes del cliente y servicios backend (eliminados todos los caracteres de reemplazo U+FFFD).
  - Tildes, eñes, signos de apertura (¿, ¡) y badges con emojis normalizados y verificados en build de producción.
  - 1. RAG Caché Semántico, 2. No Estructurado, 3. Estructurado y 4. Memoria Continua 100% operativos.
  - Proyecto supervisado en ARQ AI Studio (ID: `proj-1789360940430`).
- **Siguiente Paso Inmediato:** Validar la visualización limpia de caracteres en vivo y continuar con mejoras de usuario.
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-200 líneas por archivo en todo el frontend.
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

