# Estado & Contexto del Proyecto: ClikchatWeb
- **Tipo de Proyecto:** SaaS Multi-Tenant B2B2C de Bots de Ventas con RAG Híbrido Completo y Portal del Dueño.
- **Estándar Arquitectónico:** ARQMODULAR (3 capas: types, hooks, UI <150 líneas por archivo).
- **Última Actualización:** 2026-09-14 15:15 GMT-6
- **Versión Actual:** 1.10.0 (Réplica exacta de Menú Modo Simple y Configuración Onboarding de Qchatt)
- **Deploy en Vivo:** https://clikchat.pages.dev (24/7 Permanente en Cloudflare CDN)
- **Repositorio Git:** https://github.com/GeorJV/CLIKCHAT (Commit: d27436a)
- **Estado Actual del Sistema:**
  - Menú Modo Simple sincronizado idéntico a Qchatt con exactamente 7 opciones principales y promo card.
  - Sección Configuración transformada en "Configuración del Negocio & Onboarding QChat" en 3 pasos:
    1. Paso 1: Selector interactivo de 8 industrias (Tienda, Clínica, Restaurante, Abogado, Inmobiliaria, etc.).
    2. Paso 2: Identidad comercial, QNumber/Slug, WhatsApp/Sinpe para comprobantes, rol y guardado en D1.
    3. Paso 3: Identidad digital QLink y Kit de bienvenida con código QR e inicio de chatbot.
  - Componentes atómicos en `src/components/client/settings/` (< 150 líneas c/u) cumpliendo ARQMODULAR.
  - Proyecto supervisado en ARQ AI Studio (ID: `proj-1789360940430`, status: `ready_for_review`).
- **Siguiente Paso Inmediato:** Validar con el usuario el flujo comercial y avanzar según prioridades.
- **Decisiones Técnicas Inmutables:**
  - Prohibido modificar archivos en `lockedFiles` sin autorización explícita.
  - Respetar el límite de 150-200 líneas por archivo en todo el frontend.
  - Tareas sincronizadas a `status: "ready_for_review"` en ARQ AI Studio.
