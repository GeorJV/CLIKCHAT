# Historial de Cambios Aprobados: ClikchatWeb
> 🛡️ **MEMORIA PROTEGIDA INMUTABLE:**
> Queda estrictamente PROHIBIDO a cualquier agente o IA modificar, romper, refactorizar sin permiso o revertir las funcionalidades que se encuentren registradas en este documento. Toda nueva funcionalidad debe construirse hacia adelante respetando este historial.

---

## [Registro #001] - 2026-09-13: Arquitectura Base, Cloudflare D1 y Motor RAG de 3 Niveles
- **Estado:** ✅ APROBADO & OPERATIVO
- **Base de Datos:** Cloudflare D1 Serverless Edge (`clikchat-db`, UUID: `e0f64033-4d16-41b9-800b-baae12787d1c`) en la cuenta GEO (`01514e27c0cdd221efd91900be83fb16`).
- **Motor RAG:**
  - Nivel 1: Memoria episódica de sesión en tabla `chat_messages`.
  - Nivel 2: FAQs con Detención Inmediata (*Early Stopping*) ante coincidencia semántica $\ge 0.65$.
  - Nivel 3: Catálogo general y especificaciones técnicas oficiales con enrutador multi-LLM (OpenRouter y Google AI Studio Gemini).
  - Fallback HITL: Registro de dudas pendientes en `unresolved_queries` con auto-entrenamiento automático a FAQs cuando el dueño responde.
- **Repositorio Git:** `https://github.com/homilia7/clikchat`

---

## [Registro #002] - 2026-09-13: Refactorización ARQMODULAR del Chat
- **Estado:** ✅ APROBADO & OPERATIVO
- **Estándar:** ARQMODULAR (Skill #21), estricta separación de 3 capas y límite de 150 líneas por archivo.
- **Componentes Creados:**
  - `src/types/chat.ts`: Tipos y contratos sin `any`.
  - `src/hooks/useTenantData.ts`: Custom hook de catálogo y Cloudflare D1.
  - `src/hooks/useChatRAG.ts`: Custom hook de orquestación conversacional.
  - `src/components/chat/ChatMessageItem.tsx`: Burbuja atómica con badges RAG.
  - `src/components/chat/ChatMessagesList.tsx`: Contenedor de scroll.
  - `src/components/chat/ChatQuickPills.tsx`: Píldoras de preguntas.
  - `src/components/chat/ChatInputBar.tsx`: Input con colapso de carrusel móvil.
  - `src/components/chat/MobileChatView.tsx`: Orquestador delgado (111 líneas).
- **Compilación:** `npm run build` verificado en 4.15 segundos.

---

## [Registro #003] - 2026-09-13: Vinculación a ARQ AI Studio Hub
- **Estado:** ✅ APROBADO & REGISTRADO
- **Proyecto en ARQ AI Studio:** `ClikchatWeb` (ID: `proj-1789360940430`).
- **Archivo de Enlace:** `.arqai.json` con `lockedFiles` para blindar archivos críticos.

---

## [Registro #004] - 2026-09-14: Acordeón FAQs con Edición Directa, Optimización de Chat y Botón Comprar Ahora
- **Estado:** ✅ APROBADO & PROTEGIDO
- **Módulos y Componentes Involucrados:**
  - `src/components/client/faqs/FaqAccordionItem.tsx` y `FaqList.tsx`: Lista de preguntas frecuentes en formato acordeón colapsable con editor textarea inline ("Editar") y guardado directo ("Guardar" / "Cancelar").
  - `src/hooks/useClientPortal.ts` y `server/routes/faqs.js`: Endpoint `PUT /api/faqs/:id` conectado a Cloudflare D1 para actualizar preguntas frecuentes en tiempo real con feedback visual.
  - `src/components/client/conversations/ConversationDetail.tsx`: Preservación de la vista de conversaciones en formato WhatsApp con burbujas limpias, indicador de conexión y eliminación de badges técnicos.
  - `src/components/chat/product/ProductChatColumn.tsx` y `ServiceChatColumn.tsx`: Eliminación del avatar repetitivo en cada mensaje del asistente (se mantiene centralizado en el header superior); reducción del padding vertical del input al mínimo funcional con soporte `Shift + Enter` multilínea.
  - `src/components/chat/product/ProductShowcase.tsx` y `ServiceShowcase.tsx`: Esquinas redondeadas simétricas `rounded-2xl` con `isolate`; reducción drástica en rango y opacidad de sombras superior e inferior para fotos nítidas; botón "Comprar Ahora" con degradado difuminado amarillo anaranjado a verde (`from-amber-500 via-emerald-500 to-emerald-600`).
  - `src/components/chat/product/ProductFullscreenModal.tsx` y `DesktopProductShowcase.tsx`: Unificación de estilos del botón "Comprar Ahora".
- **Estándar Arquitectónico:** 100% ARQMODULAR (<150 líneas por componente), cero advertencias o errores de compilación (`npm run build`).
- **Deploy en Vivo:** `https://clikchat.pages.dev` en Cloudflare Pages CDN.

