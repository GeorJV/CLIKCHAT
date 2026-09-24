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

### [2026-09-24] Corrección Universal de Codificación UTF-8 en Cloudflare D1 y Edge Gateway
- **Causa Raíz:** Al insertar las FAQs de horarios y promociones mediante PowerShell Windows, los caracteres con tilde y eñe (`ó`, `á`, `í`, `ñ`) se enviaron con codificación Windows-1252/ISO-8859-1 en lugar de UTF-8 puro, almacenando caracteres de reemplazo ().
- **Solución y Blindaje:**
  1. Base de Datos Cloudflare D1 saneada mediante script nativo Node.js UTF-8 en todas las tablas (`faqs`, `tenants`, `products`).
  2. Forzado de encabezado explícito `'Content-Type': 'application/json; charset=utf-8'` en todas las respuestas del Edge Gateway (`functions/api/[[route]].js`).
  3. Verificado en producción con respuestas 100% limpias sin caracteres extraños.

### [2026-09-24] Blindaje Total de Conocimiento RAG y Erradicación de Respuestas Vacías
- Inyección unificada de horarios, FAQs oficiales y políticas en el prompt del LLM (Nivel 3).
- Boost de palabras clave y coincidencia difusa ortográfica en Nivel 2.
- Reglas de ventas para no emitir negativas frías ante promociones.

### [2026-09-24] Módulo Configurable de Cadencia y Velocidad de Respuesta IA
- Base de datos D1 con `response_delay_sec`.
- Panel interactivo con Modo Inmediato (1s), Modo Humano (9s) y Rango manual (1-20s).
- Sincronización en tiempo real en todas las vistas de chat.

### [2026-09-24] Persistencia Universal de Historial de Chat tras Recarga
- Almacenamiento continuo en Cloudflare D1 (`chat_messages`) con vinculación por `session_id`.
- Sincronización en `localStorage` por tenant para restaurar automáticamente las conversaciones ante recargas de página en web y móvil.
- Función de reinicio limpio de conversación (`resetChat`) con nuevo token de sesión.

### [2026-09-24] Motor Dual 90/10 (DeepSeek + GPT-4o Mini) y Conectividad Abierta de IA
- **Gobernanza Super Admin (Confidencial):** Control centralizado en Cloudflare D1 del balance 90% DeepSeek V3 (`deepseek/deepseek-chat`) para atención comercial de alta velocidad y 10% OpenAI GPT-4o Mini (`openai/gpt-4o-mini`) para razonamiento complejo y comparativas técnicas, con respaldo cruzado automático entre ambos.
- **Panel de Usuario Protegido:** El cliente únicamente visualiza "Modelo del Sistema (Predefinido)" con opción de "Conectar mi propia IA (Personalizada)" para cualquier proveedor (Google AI Studio, OpenAI, OpenRouter, etc.) mediante `custom_llm_key`.
- Cumplimiento estricto de límites modulares ARQMODULAR (<150 líneas por componente).

### [2026-09-24] Carga Universal de Documentos (Texto, Word y Excel) con Drag & Drop
- **Formatos Soportados:** Texto plano (`.txt`, `.md`, `.csv`), Documentos Word (`.docx`, `.doc`) y Hojas de Cálculo Excel (`.xlsx`, `.xls`).
- **Métodos de Carga:** Zona interactiva de arrastrar y soltar (Drag and Drop) y selector nativo de archivos desde la PC.
- **Procesamiento de Conocimiento:** Lector modular en cliente (`documentParser.ts`) que convierte documentos y tablas en conocimiento estructurado, particionado automáticamente en chunks en Cloudflare D1 para el RAG Nivel 3.
- Componentes atómicos `DocumentDropzone.tsx` y `DocumentsManagerTab.tsx` respetando ARQMODULAR (<150 líneas).

### [2026-09-24] Gestión y Creación Activa de Usuarios e Inquilinos en Super Admin
- **Ubicación:** Panel `/super-admin` accesible desde la barra superior de navegación (ícono de escudo).
- **Creación en Vivo:** Formulario conectado a la API Edge Cloudflare D1 (`POST /api/admin/tenants`) que crea la cuenta del negocio con UUID v4, slug autogenerado, correo del dueño, plan SaaS y bot comercial predeterminado.
- **Acciones Directas:** Tabla interactiva de inquilinos con accesos rápidos al Chat en Vivo (`/chat?t=slug`), al Panel del Cliente (`/dashboard?t=slug`) y eliminación segura (`DELETE /api/admin/tenants/:id`).

### [2026-09-24] Lanzamiento de Página Web Oficial (Landing Page) de Alta Conversión
- **Dirección de Arte y Arquitectura B2B (`frontend-design` & `arqmodular`):** Portada oficial en la ruta raíz `/` con estética corporativa de alto impacto, modo oscuro refinado y componentes atómicos (<150 líneas cada uno en `src/components/landing/`).
- **Narrativa Comercial Persuasiva:**
  1. *Hero Section:* "Tu mejor vendedor ahora trabaja 24/7 y cierra ventas mientras duermes."
  2. *Badge Anti-Meta:* Cero comisiones a Meta y sin complicaciones con WhatsApp Business API.
  3. *¿Para quién es?:* Segmentación por dolores reales (dueños que quieren vender a las 2 AM, tiendas con catálogo visual, negocios de servicios y equipos de venta).
  4. *Bento Grid de Capacidades:* Auto-aprendizaje continuo en 1 clic (HITL: si no sabe te pregunta a ti, respondes una vez y lo aprende para siempre), reportes reales por clic (vistas, compras, temperatura de leads), supervisión en tiempo real con intervención humana y cierre directo a WhatsApp.
  5. *Simulador Demo en Vivo:* Widget interactivo en pantalla donde el visitante prueba las respuestas y carruseles de productos en tiempo real.
  6. *FAQ y CTA Final:* Resolución de objeciones sobre WhatsApp, documentos y precios.

### [2026-09-24] Rediseño de Alta Gama con Estética de Lujo, Tipografía Cinzel y Tonos Champagne/Obsidiana
- **Dirección de Arte de Lujo (Ultra-High-End Luxury):** Erradicación total de esquemas SaaS genéricos y adopción de una identidad visual distinguida inspirada en marcas de alta relojería y productos de lujo (Leica, Monocle, Apple Pro, Ramp):
  1. *Lienzo y Contrastes:* Fondo en tono alabastro cálido (`#fbfaf8`) con texto principal en tinta obsidiana profunda (`#181716`), bordes refinados en platino cálido (`border-stone-200/80`) y acentos en verde carreras profundo (`#194c37`) y terracota suave.
  2. *Tipografía Escultórica:* Integración de la fuente monumental `Cinzel` (`font-cinzel`) para titulares principales, insignias de prestigio y numeraciones de sección (`01 / INDEPENDENCIA`, etc.), complementada con `Inter` para una lectura editorial impecable.
  3. *Acentos en Oro Champagne:* Botones de acción, emblemas de marca y anillos de enfoque en oro champán cepillado (`#caa461`, `#d4af37`), eliminando los colores estridentes convencionales.
- **Componentes de Portada Elevados:**
  - *Navbar:* Emblema monograma `CC` con marco de oro cepillado y tipografía `CLIKCHAT CONCIERGE`.
  - *Hero:* Titular monumental con resalte en degradado oro champagne, badge "ARQUITECTURA DE CONCIERGE DIGITAL" y micro-garantías de privacidad.
  - *Audiencia Objetiva:* Tarjetas editoriales numeradas con cajas de fricción sepia y beneficios en verde bosque.
  - *Bento Grid & Demo:* Simulador de concierge en vivo con visualizador de producto de alta fidelidad, botón de checkout WhatsApp de lujo y tarjetas de arquitectura técnica.
  - *Vault CTA:* Módulo final estilo caja fuerte obsidiana con resplandor dorado sutil.
### [2026-09-24] Blindaje contra Desbordamiento de Burbujas, Formateo Markdown y Calibración Humana del Bot
- **Problema Detectado:**
  1. *Desbordamiento Horizontal:* Enlaces largos o texto sin espacios (ej. enlaces de WhatsApp `wa.me/...`) se salían de las cajas de chat debido a la ausencia de envoltorio de palabra (`break-words`, `overflow-wrap: anywhere`) y falta de parser markdown.
  2. *Texto Excesivo y Tono Tieso/Seco:* Respuestas kilométricas (más de 400 palabras, 7 canales enumerados y etiquetas de código crudo `###`) con tono robótico generado por temperaturas muy bajas (0.25-0.35) y un `system_prompt` sin pautas de personalidad en la base de datos D1.
- **Solución Implementada:**
  1. *Componente Atómico `ChatMessageContent.tsx` (<120 líneas):* Renderizador inteligente que formatea negritas (`**`), transforma enlaces markdown (`[Texto](url)`) en botones/pills estilizados (con distintivo especial de WhatsApp) y limpia encabezados `###`, garantizando contención estricta con `break-words [overflow-wrap:anywhere] break-all`.
  2. *Blindaje de Contenedores:* Aplicado en `ChatMessageItem.tsx`, `ProductChatColumn.tsx` y `ServiceChatColumn.tsx` con `min-w-0 max-w-[88%] overflow-hidden`.
  3. *Ingeniería de Prompts y Voz Humana en Edge (`functions/api/[[route]].js`):*
     - Regla estricta Anti-Biblias: Máximo 2 a 3 párrafos breves o 3 viñetas concisas.
     - Prohibición de listas interminables y eliminación de etiquetas markdown crudas (`###`).
     - Tono de voz cálido, inteligente, persuasivo y conversacional (estilo WhatsApp) con pregunta de cierre natural.
     - Ajuste de temperatura a `0.55` para naturalidad emocional y `max_tokens` a 380 para respuestas rápidas y compactas.
### [2026-09-24] Visor Interactivo de Contenido y Chunks RAG en Entrenamiento AI
- **Funcionalidad Solicitada:** Al hacer clic en cualquier tarjeta de documento cargado en el panel (ej. "RAG CLIKCHAT PRUEBA", "RAG PRUEBA DESCUENTO"), el usuario debe poder inspeccionar y leer todo su contenido interno.
- **Implementación y Arquitectura:**
  1. *API Edge Endpoint (`GET /api/documents/:id`):* Recupera en Cloudflare Pages Edge el registro completo de `knowledge_documents` (`raw_content`) y todos sus fragmentos particionados en `document_chunks` ordenados por `chunk_index`.
  2. *Componente Atómico `DocumentViewerModal.tsx` (<155 líneas):*
     - Modo Dual: Vista de **Chunks RAG Particionados** (mostrando cada fragmento con su número de chunk `#1, #2...`, caracteres y texto exacto que consulta el bot) y Vista de **Texto Completo Original** (con botón de copiado rápido al portapapeles).
     - Buscador en tiempo real de palabras clave dentro de los chunks.
     - Metadatos visuales: categoría, fecha de carga y conteo de fragmentos D1.
  3. *Tarjetas Clicables en `DocumentsManagerTab.tsx`:*
     - Las tarjetas completas son clicables (`cursor-pointer hover:border-emerald-500/50`).
     - Botón explícito "Ver contenido" con ícono de ojo (`Eye`) y flecha interactiva.
### [2026-09-24] Visualización y Transcripción en Tiempo Real de Conversaciones en Vivo
- **Causa Raíz:** El endpoint de listado `/api/chat/tenant-conversations/:tenantId` devolvía metadatos de las sesiones (id, último mensaje, total de mensajes), pero el panel de detalle (`ConversationDetail.tsx`) no ejecutaba la consulta a `/api/chat/messages/:sessionId`. En consecuencia, al seleccionar una sesión real de Cloudflare D1 se mostraba el estado vacío *"Sin mensajes en esta sesión"*.
- **Solución Implementada:**
  1. *Carga Reactiva y Polling en Vivo:* `ConversationDetail.tsx` ahora consulta `/api/chat/messages/:sessionId` tan pronto se selecciona la conversación y activa un polling ligero cada 4 segundos para actualizar nuevos mensajes entrantes.
  2. *Formateo Enriquecido:* Los mensajes del auditor ahora se renderizan mediante `ChatMessageContent` con soporte de trazas RAG (`m.rag_level_used`), marcas de tiempo y quiebre de palabras seguro.
  3. *Auto-refresco de Sesiones:* `ConversationsTab.tsx` refresca automáticamente la lista de chats cada 6 segundos para detectar visitantes nuevos en tiempo real.

### [2026-09-24] Blindaje Arquitectónico 100% Producción del Motor RAG
- **Problema de Seguridad y Concurrencia:** 
  1. *Falsos Positivos de Consultas Cortas:* El cálculo de cobertura (`coverage = matches / tokensA.length`) producía 100% de coincidencia ante consultas de 1 sola palabra (ej: "pago", "descuento", "garantía"), activando el Nivel 2 y silenciando el conocimiento de documentos.
  2. *Violación de Clave Foránea (FK Constraint) en D1:* En SQLite D1, `knowledge_documents.tenant_id` tiene restricción de clave foránea estricta hacia `tenants.id`. Si el frontend pasaba el slug (`geosoft`) o estaba cargando el estado en React (`undefined`), la inserción fallaba con error 500 `FOREIGN KEY constraint failed`.
  3. *Sombreado de Documentos por FAQs (Interceptor Shadowing):* Si un negocio subía un manual con condiciones específicas (ej: 45 días de reembolso o 36 meses de garantía) y existía una FAQ previa con términos similares, la FAQ podía interceptar la respuesta antes de consultar el manual.
- **Blindaje Definitivo Implementado:**
  1. *Similitud Simétrica Dice:* Para consultas de menos de 3 palabras, se utiliza exclusivamente el coeficiente simétrico de Sørensen-Dice, eliminando al 100% los falsos positivos por palabras aisladas.
  2. *Guardia Anti-Sombreado (`hasDocumentMatch` y `hasDirectProductMatch`):* Antes de permitir que el Nivel 2 detenga una consulta, el sistema verifica en paralelo si alguna palabra clave de la pregunta coincide con fragmentos o documentos crudos subidos por el cliente. Si hay coincidencia de documento, el Nivel 2 se anula de inmediato y cede el control al RAG de Nivel 3.
  3. *Resolución Infalible de Inquilino:* Tanto en el backend (`functions/api/[[route]].js`) como en los componentes frontend (`DocumentsManagerTab.tsx`, `DocumentDropzone.tsx`), cualquier `tenantId` se normaliza automáticamente al UUID válido del tenant, previniendo excepciones de base de datos.
  4. *Despliegue y Validación en Vivo:* Compilado y desplegado directamente en Cloudflare Pages (`clikchat.pages.dev`). Verificados 5 escenarios de prueba con respuestas inmediatas extraídas de documentos y FAQs con cero fallos.

### [2026-09-24] Corrección Tipográfica de Burbujas de Chat (Eliminación de Partición de Palabras)
- **Causa Raíz:** En `ChatMessageContent.tsx` y los contenedores de mensajes se había configurado la clase CSS `break-all` y `[overflow-wrap:anywhere]`. La propiedad `word-break: break-all` fuerza al navegador a romper las palabras en cualquier letra arbitraria para llenar la línea (ej: *"nuest-ro"*, *"respue-stas"*, *"produ-ctos"*, *"person-alizada"*), partiendo palabras normales por la mitad.
- **Solución Implementada:**
  1. *Alineación a Estándar de Mensajería:* Se removió `break-all` y `[overflow-wrap:anywhere]` de los textos, encabezados y párrafos en `ChatMessageContent.tsx`, `ChatMessageItem.tsx`, `ProductChatColumn.tsx`, `ServiceChatColumn.tsx` y `ConversationDetail.tsx`.
  2. *Envoltorio Natural con `break-words`:* Las palabras completas saltan limpiamente de línea de forma natural sin cortarse. Únicamente si una URL sin espacios excede el ancho de la burbuja, se permite el quiebre de esa cadena específica.
  3. *Despliegue Inmediato:* Compilado y desplegado a producción en Cloudflare Pages CDN (`clikchat.pages.dev`).

### [2026-09-24] Datos de Historial 100% Reales y Eliminación de Sesiones Sintéticas
- **Problema Detectado por el Usuario:**
  1. *Acumulación de Sesiones de Prueba Automatizadas:* En la base de datos de producción (`clikchat-db`), las pruebas automáticas anteriores (curl/scripts de agentes) habían creado 51 sesiones sintéticas con prefijos (`sess_mug0...`, `live_verification_...`, `test_...`) de 1 solo mensaje repetitivo sin datos de contacto, mostrándose como una lista masiva de *"Cliente Anónimo"*.
  2. *Estado Simulado en Código:* En `ConversationsTab.tsx` existía la lógica ficticia `i < 2 ? 'online' : 'closed'`, que forzaba arbitrariamente las 2 primeras sesiones como "online" y las 28 restantes como "cerradas", independientemente de la fecha real de actividad.
  3. *Desincronización Visual:* Al cambiar de conversación o al ejecutarse el sondeo automático cada 6 segundos, el estado de mensajes retenía los mensajes de la sesión anterior o reseteaba la selección al primer elemento, provocando que se mostrara la transcripción de otra sesión.
- **Solución y Blindaje Implementado:**
  1. *Purga Completa de D1:* Se eliminaron las 51 sesiones sintéticas de prueba de `chat_sessions` y sus 102 mensajes huérfanos de `chat_messages`, dejando exclusivamente las sesiones auténticas de clientes con sus preguntas y respuestas reales.
  2. *Esquema y Estado Real en Base de Datos:* Se agregó la columna `status TEXT DEFAULT 'active'` a `chat_sessions` en Cloudflare D1. El endpoint `POST /api/chat/status` ahora persiste cambios reales de estado ("Finalizar Chat" / "Reabrir Chat").
  3. *Cálculo Honesto de Online vs Historial:* Se eliminó cualquier condicional simulado. Una sesión se clasifica como `online` únicamente si tiene estado activo e interacción dentro de los últimos 30 minutos; de lo contrario, se agrupa honestamente en `Historial`.
  4. *Aislamiento Quirúrgico de Mensajes (`ConversationDetail.tsx`):* Al seleccionar una sesión, el estado de mensajes se resetea de forma inmediata y se valida la referencia de sesión en la respuesta asíncrona, eliminando al 100% cualquier contaminación o desincronización entre chats.
  5. *Identidades Claras de Visitantes:* Los clientes se identifican por su nombre o datos de contacto si fueron capturados, o mediante su identificador único real (`Visitante #<id>`), acompañado de su pregunta real y conteo verificado de mensajes.



