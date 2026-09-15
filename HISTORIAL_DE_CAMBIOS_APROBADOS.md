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

## [Registro #004] - 2026-09-14: Optimización Integral del Chat, Acordeón de FAQs, Rediseño Visual y Botón de Compra
- **Estado:** ✅ APROBADO & PROTEGIDO (Memoria Protegida Inmutable)
- **Detalle Exhaustivo de Cambios Realizados y Verificados:**
  1. **Acordeón en Preguntas Frecuentes (FAQs):**
     - Estructuración de las FAQs en formato de acordeón desplegable/colapsable (`FaqAccordionItem.tsx`, `FaqList.tsx`).
     - Botón **"Editar"** en cada FAQ que abre un `<textarea>` inline con la respuesta para su modificación inmediata.
     - Botón **"Guardar"** con feedback en tiempo real y botón **"Cancelar"**.
     - Integración con el backend mediante endpoint `PUT /api/faqs/:id` en `server/routes/faqs.js` y `useClientPortal.ts`, persistiendo en Cloudflare D1.
  2. **Espaciado Reducido de Mensajes y Reubicación de la Hora:**
     - En `ConversationDetail.tsx`, compactación del espacio vertical entre burbujas de mensajes.
     - Reubicación y ajuste tipográfico de la marca de tiempo (hora) para una apariencia más limpia, equilibrada y nativa.
  3. **Entrada de Texto con Soporte Multilínea (`Shift + Enter`):**
     - En `ChatInputBar.tsx`, `ProductChatColumn.tsx` y `ServiceChatColumn.tsx`, implementación de `<textarea>` con salto de línea al presionar `Shift + Enter` o al llegar al borde horizontal del contenedor.
     - Envío instantáneo de mensaje con `Enter` solo sin modificador.
  4. **Restauración de la Ventana de Conversaciones del Chat:**
     - Reversión de las conversaciones a su formato de burbujas nativas tipo WhatsApp (descartando el acordeón en conversaciones y concentrándolo exclusivamente en FAQs).
     - Conservación del indicador de usuario conectado (online) pulsante y eliminación de badges técnicos intrusivos.
  5. **Caja de Imagen con Cobertura y Esquinas Redondeadas Simétricas:**
     - Contenedores de imagen en `ProductShowcase.tsx` y `ServiceShowcase.tsx` con redondeo simétrico `rounded-2xl` tanto en la parte superior (`rounded-t-2xl`) como en la inferior (`rounded-b-2xl`).
     - Cobertura superior agregada con aislamiento `isolate` para evitar fugas visuales en navegadores WebKit/Blink.
  6. **Eliminación del Avatar Repetitivo del Bot en los Mensajes:**
     - Remoción del icono/avatar del asistente al lado de cada mensaje individual y en los indicadores de "escribiendo...".
     - Avatar mantenido de forma limpia y exclusiva en el encabezado (header) superior del chat.
  7. **Optimización del Espacio Vertical en la Barra de Entrada de Texto:**
     - Reducción drástica del padding vertical superior e inferior en el chat de producto y servicio:
       - Contenedor footer: `py-1.5`
       - Formulario input: `py-1`
       - Área de texto: `py-0.5 min-h-[22px] max-h-[100px]`
       - Botón de envío ceñido con icono de `14px`.
     - Recuperación de más de 20px de espacio vertical en pantalla para mayor área visible de mensajes.
  8. **Reducción de Sombras en las Fotos de Productos y Servicios:**
     - Disminución sustancial del rango y opacidad de las sombras superpuestas sobre las fotografías.
     - Sombra superior recortada a un velo suave (`h-12`, `from-black/50 via-black/20 to-transparent`).
     - Sombra inferior ceñida a los textos de información (`pt-6 pb-2.5`, `from-black/70 via-black/35 to-transparent`), permitiendo apreciar las imágenes con total claridad y nitidez.
  9. **Botón "Comprar Ahora" Predominantemente Amarillo y Anaranjado:**
     - Rediseño del botón con degradado difuminado con más del **70% de color amarillo luminoso y anaranjado cálido**, y un sutil remate lateral difuminado en verde esmeralda (`from-yellow-400 via-orange-500 via-70% to-emerald-600`).
     - Borde dorado suave (`border-amber-300/30`), sombra luminosa cálida (`shadow-amber-500/25`) y tipografía blanca con relieve `drop-shadow-sm`.
     - Unificado en `ProductShowcase.tsx`, `DesktopProductShowcase.tsx` y `ProductFullscreenModal.tsx`.
  10. **Blindaje de Calidad y Estándar ARQMODULAR:**
      - 100% de los componentes frontend bajo el límite estricto de 150 líneas.
      - Cero afectación o modificación de archivos en `lockedFiles`.
      - Verificación de compilación limpia con `npm run build` sin errores.
- **Deploy en Vivo:** `https://clikchat.pages.dev` en Cloudflare Pages CDN.


