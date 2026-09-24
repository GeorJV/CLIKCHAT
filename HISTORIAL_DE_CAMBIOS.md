# 📜 HISTORIAL DE CAMBIOS APROBADOS — CLIKCHAT

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** https://github.com/GeorJV/CLIKCHAT.git
- **Rama:** main
- **URL Producción:** https://clikchat.pages.dev

---

## 📦 REGISTRO DE HITOS APROBADOS

### [2026-09-24] Habilitación Completa de Motor RAG Edge Serverless y Conexión en Producción
- **Arquitectura:** Migración completa sin Docker a Cloudflare Pages Functions + Cloudflare D1 + OpenRouter API (GPT-4o-mini).
- **RAG 4 Niveles:**
  1. *Nivel 1 (Memoria Episódica):* Historial de turnos guardado en SQLite D1 (`chat_messages`).
  2. *Nivel 2 (Reglas / FAQs $0 Costo):* Coincidencia instantánea por overlap y palabras clave sin invocar LLMs.
  3. *Nivel 3 (Catálogo & Documentos RAG):* Consulta en tiempo real de productos e inventario D1 y fragmentos de conocimiento con GPT-4o-mini en OpenRouter.
  4. *Nivel 4 (HITL Fallback):* Captura de prospecto y derivación a WhatsApp / operador humano ante consultas sin contexto.
- **Frontend & UX:**
  - Vistas `ProductChatView` y `ServiceChatView` conectadas nativamente a `POST /api/chat/message`.
  - Batcher debounced corregido a 1.0s - 1.2s para respuesta reactiva sin cortes ni cuelgues.
  - Gestión segura del callback `onSetLoading` y estados asíncronos.
  - Importación masiva de inventario por Excel/CSV integrada en Panel de Cliente.
  - Cumplimiento estricto con el estándar modular ARQMODULAR (<150 líneas por archivo en `src/`).
