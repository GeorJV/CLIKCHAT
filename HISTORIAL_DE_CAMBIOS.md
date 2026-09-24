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

### [2026-09-24] Módulo Configurable de Cadencia y Velocidad de Respuesta IA (Modo Humano vs Modo Inmediato)
- **Base de Datos Cloudflare D1:** Agregada columna `response_delay_sec INTEGER DEFAULT 9` a la tabla `tenants`.
- **API Edge Gateway (`functions/api/[[route]].js`):** Soporte en `PUT /api/tenants/:id` y `GET /api/tenants/:slug` para actualizar y leer la cadencia de respuesta.
- **Panel de Negocio (`ChatCadenceSettingCard.tsx` - 118 líneas):**
  - **Modo Inmediato (1 segundo):** Máxima velocidad de respuesta transaccional para clientes que exigen inmediatez mensaje a mensaje.
  - **Modo Humano Recomendado (9 segundos):** Pausa inteligente con explicación visual en la UI. Permite al cliente enviar múltiples mensajes seguidos (estilo WhatsApp) y la IA responde a todo el contexto acumulado de forma natural.
  - **Modo Manual Personalizado (1 a 20 segundos):** Slider y selector numérico con badges de nivel de cadencia en tiempo real.
- **Hooks y Vistas Conectadas:**
  - `useChatRAG.ts`: Agrupamiento de mensajes con temporizador debounce basado en `tenant.response_delay_sec`.
  - `ProductChatView.tsx` y `ServiceChatView.tsx`: Vinculados a la cadencia del negocio.
  - `useProductResolver.ts`: Resolución de cadencia desde el Edge.
- **Estándar ARQMODULAR:** Todos los archivos de `src/` estrictamente bajo 150 líneas.

### [2026-09-24] Habilitación Completa de Motor RAG Edge Serverless y Conexión en Producción
- **Arquitectura:** Migración completa sin Docker a Cloudflare Pages Functions + Cloudflare D1 + OpenRouter API (GPT-4o-mini).
- **RAG 4 Niveles:** Memoria Episódica (D1), FAQs a $0 costo, Catálogo e Inventario RAG (OpenRouter), y HITL Fallback a WhatsApp.
- **Frontend & UX:** Eliminación de mocks estáticos, reparación de callbacks asíncronos y carga masiva de Excel/CSV en inventario.
