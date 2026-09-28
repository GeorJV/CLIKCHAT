# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 15:48 GMT-6
- **Versión Actual:** 1.39.0 (Blindaje Anti-Guardrails, Erradicación de User Safety y Sanitización CoT)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Erradicación Total de "User Safety: safe": Descartados reportes técnicos y fugas de guardrails en todos los niveles.
  - Limpieza de Base de Datos D1: Eliminada clave custom_llm_key obsoleta que forzaba openrouter/free en comercios.
  - Sanitizador Universal Post-LLM: Filtro en Edge API, server router y cliente descartando pensamientos en inglés.
  - Jerarquía Activa: 1° GLM 5.3 Flash (Titular) -> 2° DeepSeek V3 (Respaldo) -> 3° GPT-4o Mini (Contingencia).
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

