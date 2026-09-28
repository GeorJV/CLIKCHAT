# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150-180 líneas por archivo).
- **Última Actualización:** 2026-09-28 15:53 GMT-6
- **Versión Actual:** 1.40.0 (Blindaje Definitivo Anti-CoT, Sanitización Bilingüe y DeepSeek v3.2 Titular)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT
- **Estado Actual del Sistema:**
  - Erradicación Total de Fugas CoT / Monólogos: Sanitizador universal en Edge, Server y Cliente descartando pensamientos internos en español e inglés y tags unclosed (<think>, <thought>, <reasoning>).
  - Motor Titular de Micro-Costo: DeepSeek v3.2 ($0.00000042/tok, directo y conversacional) como #1, respaldo DeepSeek Chat y contingencia GLM/GPT-4o-mini.
  - Regla 0 Anti-Razonamiento: Prompt del sistema prohíbe terminantemente pensar en voz alta o reflexionar antes de responder.
  - Presupuesto Blindado: Cero acceso a modelos costosos (Claude/o1 terminantemente bloqueados).
  - Supervisión en ARQ AI Studio (`proj-1789360940430`, status: `ready_for_review`).
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar funcionalidades registradas en HISTORIAL_DE_CAMBIOS_CLIKCHAT.md.
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-180 líneas por archivo en todo el frontend (ARQMODULAR).
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.

