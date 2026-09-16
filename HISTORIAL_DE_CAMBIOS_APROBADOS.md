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

---

## [Registro #005] - 2026-09-15: Microinteracción de Vuelo, Ráfagas Unificadas (9s), Animación de Expansión, Espaciado Ceñido y Elevación 3D del Showcase
- **Estado:** ✅ APROBADO & PROTEGIDO (Memoria Protegida Inmutable)
- **Detalle Exhaustivo de Cambios Realizados y Verificados:**
  1. **Microinteracción del Avioncito de Papel (`FlyingPaperPlane.tsx`):**
     - Animación de vuelo parabólico suave (`paperPlaneFlight`) desde el botón de envío hasta la base de la burbuja.
     - Calibración de trayectoria contenida (`translate(-18px, -54px)`) con inclinación angular y desaparición suave sin desbordamiento.
  2. **Animación de Entrada de Burbujas con Expansión Progresiva (Blooming):**
     - Entrada orgánica desde el punto de origen (`origin-bottom-right` en burbuja de usuario, `origin-bottom-left` en burbuja del bot).
     - Curva `cubic-bezier(0.16, 1, 0.3, 1)` de 0.68s que crece desde escala 0.12 a 1.0 con fundido de opacidad, simulando eclosión física fluida.
  3. **Motor de Ráfagas con Ventana de Cortesía de 9 Segundos (`useMessageBatcher.ts`):**
     - Debounce y acumulación inteligente de 9000ms (`debounceMs = 9000`) para mensajes fragmentados consecutivos del usuario.
     - Generación de una sola respuesta cohesiva por parte del asistente RAG evitando interrupciones prematuras.
  4. **Espaciado Vertical Ultra Ceñido:**
     - Margen entre mensajes continuos del mismo remitente compactado a `mt-0.5` (~2px, estilo WhatsApp).
     - Margen entre turnos de conversación establecido en `mt-2` (~8px) optimizando el área visible.
  5. **Burbuja de Usuario Esbelta en Glassmorphism:**
     - Fondo dorado al 50% de opacidad (`bg-[#D79F4C]/50`) con desenfoque de fondo (`backdrop-blur-md`) y borde translúcido (`border-[#D79F4C]/30`).
     - Grosor y altura vertical ceñida (`px-2.5 py-0.5`), perfectamente calibrada e igualada a la silueta de la píldora verde RAG.
  6. **Elevación y Sombra Profunda en Burbujas del Bot:**
     - Sombra de profundidad (`shadow-lg shadow-black/60`) y borde suave (`border-white/[0.12]`).
  7. **Elevación 3D y Sombra Flotante del Showcase (`ProductShowcase.tsx`, `ServiceShowcase.tsx`):**
     - Implementación de `z-10`, borde izquierdo `border-l border-white/[0.1]` y sombra proyectada hacia la izquierda (`lg:shadow-[-24px_0_50px_-5px_rgba(0,0,0,0.85)]`).
     - Efecto visual de proximidad física en el que el panel de producto o servicio aparece en primer plano sobre el chat.
  8. **Garantía ARQMODULAR y Blindaje Inmutable:**
     - 100% de componentes frontend bajo el límite de 150 líneas.
     - Cero modificaciones a los archivos en `lockedFiles`.
     - Build de producción verificado y desplegado en Cloudflare Pages CDN.
- **Deploy en Vivo:** `https://clikchat.pages.dev`
- **Commits Clave:** `927e87b`, `c2f6d02`, `56a5bbb`, `eea2e85`, `2401295`

---

## [Registro #006] - 2026-09-15: RAG Semántico del Historial, Limpieza Total de Mocks, Notas de Voz en Cloudflare Workers AI Whisper y Botón de Micrófono Amarillo con Alternancia Dinámica
- **Estado:** ✅ APROBADO & PROTEGIDO (Memoria Protegida Inmutable)
- **Detalle Exhaustivo de Cambios Realizados y Verificados:**
  1. **RAG Semántico del Historial de Conversación (Memoria Episódica Continua):**
     - Ventana de contexto ampliada a 100 mensajes por sesión en Cloudflare D1 (`ragEngine.js`).
     - Separación de ventana caliente (últimos 6 mensajes inmediatos) y memoria episódica profunda mediante escaneo semántico (`rankBySimilarity`).
     - Inyección contextual de `[MEMORIA SEMÁNTICA DEL HISTORIAL DE ESTA SESIÓN (RAG EPISÓDICO)]` ante consultas referenciales del usuario.
     - Extracción automática de perfil y preferencias (presupuesto, ubicación, intereses) para eliminar la amnesia conversacional.
  2. **Eliminación Total de Datos Simulados (100% Reales en Cloudflare D1):**
     - Clientes (`ClientsTab.tsx`): Removido `MOCK_CLIENTS`, enlazado al endpoint `/api/chat/tenant-clients/:tenantId` en Cloudflare D1.
     - Citas (`AgendaTab.tsx`): Removido `MOCK_APPOINTMENTS`, mostrando exclusivamente citas reales generadas por el bot.
     - Conversaciones (`ConversationsTab.tsx`): Removido `FALLBACK_SESSIONS`, operando con sesiones vivas de D1.
     - Perfil (`UserProfileTab.tsx`): Eliminados IDs ficticios, conectado a la identidad real del dueño.
     - Catálogo de productos: Blindado exclusivamente con el producto real creado por el usuario (*"Vendedor Online"*, $49 USD).
  3. **Escucha y Transcripción de Notas de Voz en el Ecosistema Cloudflare:**
     - Integración con el modelo `@cf/openai/whisper` de Cloudflare Workers AI (`wrangler.toml` con binding `[ai] binding = "AI"`).
     - Ejecución nativa en Edge Functions (`functions/api/[[route]].js`) con soporte de binding `env.AI.run` y fallback REST.
     - Endpoint compatible en Node.js (`server/routes/chat.js`) para desarrollo y tests locales.
  4. **Filtro Anti-Alucinaciones y Anti-Bucles (`audioCleaner.js`):**
     - Algoritmo `cleanWhisperLooping()` que elimina bucles de palabras únicas (`\b(\w+)(?:\s+\1\b)+`) y frases reiteradas en eco (`\b((?:\w+\s+){1,4}\w+)(?:\s+\1\b)+`).
     - Eliminación de etiquetas de subtítulos y artefactos de ruido (`[Música]`, `subtítulos por...`, etc.).
  5. **Detección de Actividad de Voz (VAD en Cliente en `useVoiceRecorder.ts`):**
     - Análisis volumétrico en tiempo real mediante `AudioContext` y `AnalyserNode`.
     - Descarte automático de silencios o ruidos de fondo sin voz audible (`maxVolume < 4` o tamaño < 500 bytes) con alerta amigable.
  6. **Botón de Micrófono Amarillo Dorado y Alternancia Dinámica Tipo WhatsApp:**
     - Componente `ChatMicButton.tsx`: Botón en gradiente amarillo oro vibrante (`from-yellow-300 via-yellow-400 to-amber-500`) con anillo perimetral satinado, resplandor cálido e icono negro carbón de alto contraste.
     - Ubicación estratégica: Situado exactamente en la misma posición que el botón de enviar (palomita / avioncito).
     - Comportamiento WhatsApp: mientras el texto esté vacío se muestra el micrófono amarillo; en cuanto el usuario escribe una sola letra, el micrófono se oculta y aparece el botón de enviar; al enviar o borrar el texto, el micrófono amarillo reaparece de inmediato.
     - Integrado armónicamente en `ProductChatColumn.tsx`, `ServiceChatColumn.tsx` y `ChatInputBar.tsx`.
  7. **Garantía ARQMODULAR y Blindaje Inmutable:**
     - 100% de los componentes frontend bajo el límite estricto de 150 líneas.
     - Cero alteraciones en archivos en `lockedFiles`.
     - Compilación limpia con `npm run build` (0 errores).
     - Despliegue en vivo en Cloudflare Pages CDN (`wrangler pages deploy dist`).
- **Deploy en Vivo:** `https://clikchat.pages.dev`
- **Commits Clave:** `59672aa`, `123762d`, `9a7feac`, `60255a4`, `b9263bc`

---

## [Registro #007] — Fix: Objeciones Desacopladas + Feat: Métricas Globales al Dashboard Principal

- **Fecha:** 2026-09-16
- **Estado:** `ready_for_review`
- **Versión:** v1.20.52
- **Commits:** `007757e`, `3d61d33`

### Cambios Realizados

#### Fix 1: Desacoplamiento de Objeciones Resueltas
- **Problema:** `objectionsResolved` se calculaba artificialmente sumando `Math.min(questionsAnswered, 8) + totalProdWarm`, lo que inflaba la métrica con preguntas genéricas y calor de leads.
- **Solución:** Ahora se lee directamente desde la tabla `chat_messages` con filtro por palabras clave reales de objeciones.
- **Archivos modificados:**
  - `functions/api/[[route]].js` (~línea 401): Eliminada fórmula artificial. Ahora: `const objectionsResolved = Number(objections[0]?.count) || 0;`
  - `server/routes/chat.js` (~línea 193): Mismo fix para servidor Node.js de desarrollo.
  - `src/components/client/products/ProductExactKpis.tsx` (~línea 25): Reemplazado `Math.ceil(warmLeads * 0.6)` con `product.metrics?.objectionsResolved ?? 0`.
- **Resultado verificado:** API retorna `"objectionsResolved": 8` (antes: 226).

#### Feat 2: Traslado de Métricas & Analítica Global al Dashboard Principal
- **Problema:** El módulo `ProductsGlobalMetrics` (5 KPIs + temperatura de leads) solo era visible en la pestaña *Mis Productos*, no en el Dashboard Principal.
- **Solución:** Se movió el cálculo de `globalMetrics` y el render del componente a `ChatbotQLinkTab` (Dashboard Principal).
- **Archivos modificados:**
  - `src/components/client/ChatbotQLinkTab.tsx`: Agregados props `products` y `onRefresh`; cálculo via `useMemo`; render de `<ProductsGlobalMetrics>` entre `TenantExactMetrics` y sección RAG. (100 líneas)
  - `src/components/client/ClientDashboard.tsx`: Pasa `products` y `onRefresh` a `ChatbotQLinkTab`.
  - `src/components/client/ProductsManagerTab.tsx`: Eliminados import, useMemo y render de `ProductsGlobalMetrics`. (101 líneas)
- **KPIs visibles en Dashboard:** Clics "Comprar", Vistas Descripción, Vistas Beneficios, Vistas Tienda, Total Eventos, Temperatura de Leads (Frío/Tibio/Caliente).

### Verificación
- Compilación limpia (`npm run build`, 0 errores).
- Deploy exitoso en Cloudflare Pages CDN.
- Bundle en producción: `index-CHcMzEKo.js`.
- **Deploy en Vivo:** `https://clikchat.pages.dev`
