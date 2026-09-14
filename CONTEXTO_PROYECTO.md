# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150 líneas por archivo).
- **Última Actualización:** 2026-09-14 14:57 GMT-6
- **Versión Actual:** 1.9.0 (Carga de Archivos TXT/DOCX/PDF & Manual en FAQs)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT (Commit: cd2997b)
- **Estado Actual del Sistema:**
  - Sección de Preguntas Frecuentes (FAQ / RAG Nivel 2) con doble vía de ingesta:
    1. Carga masiva de archivos (.txt, .docx, .pdf, .md, .json) con extracción inteligente, preview y guardado bulk en D1.
    2. Subida manual pregunta por pregunta con categorización y Early Stopping (>= 0.65).
  - Buscador en tiempo real, filtros por categoría y badges de procedencia (Manual / Archivo / HITL).
  - Endpoint backend `POST /api/faqs/bulk` e integración en `useClientPortal`.
  - Componentes atómicos en `src/components/client/faqs/` (< 120 líneas c/u) cumpliendo ARQMODULAR.
  - Proyecto supervisado en ARQ AI Studio (ID: `proj-1789360940430`).
- **Siguiente Paso Inmediato:** Validar subida de documentos con el usuario y continuar con optimizaciones.
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-200 líneas por archivo en todo el frontend.
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.
