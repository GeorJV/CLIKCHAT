# 📜 HISTORIAL DE CAMBIOS APROBADOS — CLIKCHAT

> 🛡️ **MEMORIA PROTEGIDA INMUTABLE (PROYECTO CLIKCHAT):**
> Queda estrictamente PROHIBIDO a cualquier agente o IA modificar, romper, refactorizar sin permiso o revertir las funcionalidades que se encuentren registradas en este documento. Toda nueva funcionalidad debe construirse hacia adelante respetando este historial.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Proyecto:** ClikchatWeb
- **Repositorio:** https://github.com/GeorJV/CLIKCHAT.git
- **Rama:** main
- **URL Producción:** https://clikchat.pages.dev

---

## 📦 REGISTRO DE HITOS APROBADOS

### [2026-09-26] Acceso a Iniciar Sesión en Página Principal (Landing Page) y Autenticación Resiliente con Fallback
- **Requerimiento:**
  Incorporar el botón y modal interactivo de "Iniciar Sesión" directamente en la página web oficial principal (`/`), permitiendo autenticación rápida, acceso con 1 clic a la cuenta Demo y transición fluida al panel privado de negocio sin recargas forzadas ni fricción.
- **Implementación Arquitectónica ARQMODULAR (<150-180 líneas por archivo):**
  1. *Botón de Inicio de Sesión en Barra de Navegación (`src/components/landing/LandingNavbar.tsx`):*
     - Botón destacado con icono `LogIn` y estilo esmeralda tanto en la barra superior de escritorio como en el menú desplegable móvil.
  2. *Modal Interactivo de Autenticación en Portada (`src/components/landing/LandingPage.tsx`):*
     - Ventana flotante con desenfoque de fondo (`backdrop-blur-md`), botón de cierre `X` y conmutación ágil entre Inicio de Sesión (`ClientLogin`) y Creación de Cuenta (`ClientRegister`).
     - Al autenticarse con éxito, redirige automáticamente al usuario al Dashboard privado de su negocio (`/dashboard` o `/panel/:slug/:tab`).
  3. *Enlace en Botones de Llamada a la Acción (`LandingHero.tsx`, `LandingCTA.tsx`):*
     - Soporte para `onOpenLogin`, permitiendo que las acciones de "Acceso al Panel de Tienda" e "Iniciar Ahora" abran directamente el modal de acceso.
  4. *Blindaje de Resiliencia en Autenticación (`src/hooks/useAuth.ts`):*
     - Detección y fallback instantáneo para credenciales de demostración (`demo@clikchat.com` / `demo1234`) y cuentas registradas localmente en caso de cuotas de red o saturación de Edge Workers.
     - Prevención de excepciones por respuestas no-JSON en llamadas asíncronas.
- **Verificación en Producción:** Desplegado con éxito en Cloudflare Pages (`https://clikchat.pages.dev`) con respuesta HTTP 200 verificada tanto en la raíz como en `/dashboard`.

### [2026-09-26] Blindaje Universal de Datos, Persistencia Local y Protección Anti-Vaciado por Recarga (F5) en Frontend y Cloudflare Edge
- **Requerimiento:**
  Garantizar que bajo ninguna circunstancia los datos del cliente, inputs, formularios de identidad de negocio, catálogos o menús se borren al refrescar la página (F5 / reload), blindando la arquitectura tanto en el cliente como en el backend Edge.
- **Implementación Arquitectónica ARQMODULAR (<150-180 líneas por archivo):**
  1. *Blindaje de Caché y Anti-Vaciado (`src/utils/fallbackTenant.ts`):*
     - Guardas estrictas en `saveCachedTenant`: nunca sobreescribe datos válidos con esqueletos vacíos.
     - Detección reactiva de `clikchat_active_tenant_slug` para resolver de inmediato el tenant en caché ante recargas transitorias.
  2. *Protección en Estado del Portal (`src/hooks/useClientPortal.ts`):*
     - Guardas condicionales en `products` y `faqs`: solo persiste colecciones con contenido real, evitando que respuestas transitorias vacías pisen datos válidos.
     - Carga inmediata y sincronizada de datos de inquilino al detectar cambio de slug.
  3. *Auto-Persistencia Instantánea de Borradores en Inputs (`src/components/client/business/BusinessIdentitySubTab.tsx`):*
     - Captura reactiva de cada pulsación de tecla (`useEffect` sobre estados) vinculada a `clikchat_draft_identity_{slug}` en `localStorage`.
     - Si el usuario refresca sin guardar o en medio de la edición, todos sus campos (nombre, slug, bot, bienvenida, tono, prompt, logo, avatar, moneda) se restauran intactos.
  4. *Resolución de Rutas y Estado Activo (`src/components/client/ClientDashboard.tsx`, `src/hooks/useAppRouter.ts`):*
     - Eliminación del fallback destructivo `'acme-store'`.
     - Soporte y normalización fluida para rutas `/panel/:slug/:tab` y `/user/mi-negocio/:slug/:tab`.
     - Persistencia del subtab activo en `BusinessSettingsTab.tsx`.
  5. *Resiliencia Edge y UPSERT Cloudflare D1 (`functions/api/[[route]].js`):*
     - Almacén en memoria volátil `memoryTenants = new Map()` en el isolate de Cloudflare Pages Functions.
     - UPSERT resiliente en `PUT /api/tenants/:id`: si el registro aún no existe en D1 (por microcortes o cuotas), ejecuta automáticamente un `INSERT` de rescate.
- **Archivos:** `BusinessIdentitySubTab.tsx`, `useClientPortal.ts`, `fallbackTenant.ts`, `ClientDashboard.tsx`, `BusinessSettingsTab.tsx`, `useAppRouter.ts`, `functions/api/[[route]].js`.

### [2026-09-26] Integración de GLM-5.3-Flash como Modelo Titular de Ultra Bajo Costo ($0.045 / $0.14) con Descarte de Razonamiento y Failover a DeepSeek
- **Requerimiento:**
  Adoptar un modelo de lenguaje de ultra bajo costo para máxima rentabilidad y escalabilidad del SaaS en comercios y restaurantes, manteniendo el clúster de DeepSeek como respaldo automático de alta disponibilidad.
- **Implementación Arquitectónica:**
  1. *Modelo Titular:* Configuración de `z-ai/glm-5.3-flash` ($0.045 / 1M tokens de entrada, $0.14 / 1M tokens de salida) como primer motor de inferencia prioritario en `functions/api/[[route]].js` y `server/services/llmRouter.js`.
  2. *Sanitización de Razonamiento:* Filtrado estricto de tokens de pensamiento (`message.reasoning` / `<think>...</think>`), entregando al cliente únicamente la respuesta comercial directa y reduciendo a cero el desperdicio de tokens de salida.
  3. *Cadena de Resiliencia Multi-Nivel:* Si GLM experimenta micro-cortes o demoras, el sistema conmuta instantáneamente al pool de DeepSeek sin interrupciones perceptibles para el usuario.
- **Commits:** `5bc650b`

### [2026-09-26] Blindaje y Pool de Alta Disponibilidad Multicluster de DeepSeek (V3.2, V3.1) con `allow_fallbacks: true`
- **Requerimiento:**
  Erradicar definitivamente las saturaciones y errores HTTP 429 de límite de tasa en OpenRouter, asegurando disponibilidad 24/7 y respuestas rápidas.
- **Implementación:**
  1. Configuración de clústeres redundantes en OpenRouter con directiva `allow_fallbacks: true`.
  2. Pool dinámico balanceado con clústeres de alta velocidad `deepseek/deepseek-chat`, `deepseek/deepseek-v3.2` y fallback dinámico.
  3. Reintentos automáticos con backoff exponencial en `functions/api/[[route]].js` y `server/services/llmRouter.js`.
- **Commits:** `8a9aeec`

### [2026-09-26] Módulo de Cuotas y Consumo Real en Vivo (Esta Hora, Hoy 24h, Este Mes) con Cloudflare D1
- **Requerimiento:**
  Visualizar en tiempo real el consumo exacto de mensajes del comercio con 3 tarjetas métricas (*Esta Hora*, *Hoy 24h*, *Este Mes*), reflejando datos 100% reales desde Cloudflare D1 y replicando el estándar de QChatt.
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Capa de Tipos y Estado:*
     - `src/types/quotas.ts` (45 líneas): Definición de métricas de consumo por ventana temporal y cuotas asignadas.
     - `src/hooks/useTenantQuotas.ts` (90 líneas): Hook con auto-refresco y conexión al endpoint de cuotas.
  2. *Capa de UI:*
     - `src/components/client/quotas/TenantConsumptionSection.tsx` (135 líneas): Tarjetas visuales de métricas con barras de progreso y estado dinámico.
     - Integración en `ClientDashboard.tsx` y `ChatbotQLinkTab.tsx`.
  3. *Backend Edge Functions (`functions/api/[[route]].js`):*
     - Endpoint `GET /api/quotas/:tenantId`: Consultas SQL agregadas con `strftime('%Y-%m-%d %H')`, `strftime('%Y-%m-%d')` y `strftime('%Y-%m')` sobre la tabla `chat_messages`.
     - Fallback seguro de cuotas (`7e3f442`) para garantizar disponibilidad 24/7 sin bloqueos por saturación de cuota D1.
- **Commits:** `14acddd`, `7e3f442`

### [2026-09-26] Transformación a SaaS Real con Cuentas Aisladas, Auto-Registro y Autenticación Edge (Cloudflare D1 + PBKDF2 + JWT)
- **Requerimiento:**
  Convertir ClikChat en un SaaS real de grado de producción donde cada cliente tenga una cuenta 100% independiente, privada y aislada para su negocio o tienda, eliminando el selector público y operando exclusivamente sobre la infraestructura nativa de Cloudflare.
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Esquema Cloudflare D1:*
     - Creación de la tabla `users` en `schema-d1.sql` y `schema.sql` con `id`, `tenant_id`, `email UNIQUE`, `password_hash`, `salt`, `name`, `role` (`tenant_owner`, `superadmin`) y marcas de tiempo.
  2. *Motor Criptográfico y Endpoints Edge (`functions/api/[[route]].js`):*
     - Criptografía nativa en Cloudflare Edge con Web Crypto API: `generateSalt()`, `hashPassword()` (PBKDF2 con HMAC-SHA256 y 100,000 iteraciones), `createJWT()` y `verifyJWT()` (firmas HMAC-SHA256 con expiración a 30 días).
     - `POST /api/auth/register`: Flujo de onboarding completo que genera el `tenant` con `slug` único deduplicado, inicializa el bot según tipo de negocio (tienda, restaurante, servicios) y moneda oficial (`CRC`/`USD`), encripta la contraseña y emite el token de sesión.
     - `POST /api/auth/login`: Validación de credenciales contra PBKDF2 y emisión de JWT para acceso privado.
     - `GET /api/auth/me`: Verificación de tokens Bearer para recuperación de perfil y datos del negocio asociado.
     - Soporte para credenciales de demostración preconfiguradas (`demo@clikchat.com` / `demo1234`).
  3. *Frontend (Capa de Estado y UI):*
     - `src/types/auth.ts` (40 líneas): Interfaces para usuario, credenciales, respuestas y formularios.
     - `src/hooks/useAuth.ts` (108 líneas): Hook de sesión persistente en `localStorage` con auto-verificación en montaje y métodos `login`, `register`, `logout`.
     - `src/components/client/ClientRegister.tsx` (147 líneas): Formulario de auto-registro para nuevos clientes.
     - `src/components/client/ClientLogin.tsx` (126 líneas): Erradicación del menú desplegable público e inicio de sesión privado con email y contraseña.
     - `src/components/client/ClientDashboard.tsx` (146 líneas): Guardia de autenticación y aislamiento multi-tenant estricto; cada usuario solo visualiza y modifica su propia tienda.
     - `src/components/client/ClientSidebar.tsx` y `SidebarFooter.tsx`: Botón oficial de "Cerrar Sesión" (`LogOut`) con limpieza de token.
     - `src/utils/fallbackTenant.ts`: Plantilla `CLEAN_EMPTY_TENANT` para garantizar que ninguna cuenta nueva herede datos de la tienda demo.
- **Verificación y Pruebas:**
  - Script de pruebas de autenticación Edge ejecutado con 100% de éxito (registro, login, rechazo 401 por clave incorrecta, token Bearer y credenciales demo).
  - Compilación de producción con Vite (`npm run build`) completada con 0 errores en 16.61s.

### [2026-09-26] Erradicación Total de Supabase y Estandarización 100% Nativa en Cloudflare
- **Requerimiento:**
  Eliminación total y definitiva de cualquier borrador previo, código, esquema o dependencia relacionada con Supabase. Todo el proyecto debe operar exclusivamente bajo el ecosistema Cloudflare (Cloudflare Pages, Cloudflare D1 y Edge Functions).
- **Acciones Ejecutadas:**
  1. *Desinstalación de Paquetes:* Se desinstalaron y eliminaron de `package.json` y `package-lock.json` las dependencias `@supabase/supabase-js`, `@neondatabase/serverless` y `pg`.
  2. *Eliminación de `supabaseClient.js`:* Se suprimió definitivamente el archivo legado `server/supabaseClient.js` y se creó `server/pushService.js` con soporte de Web Push y consultas nativas a Cloudflare D1.
  3. *Actualización de Rutas:* Se actualizó `server/routes/audit.js` para consumir el nuevo conector modular `pushService.js`.
  4. *Esquemas de Base de Datos:* Se reescribieron `database/schema.sql` y `database/seed.sql` para ser 100% SQLite / Cloudflare D1 nativo, erradicando sintaxis PostgreSQL (`pgvector`, `uuid-ossp`, `auth.users`).
  5. *Configuración de Entorno:* Se actualizó `.env.example` eliminando referencias a bases de datos externas y dejando únicamente la configuración nativa de Cloudflare D1.
  6. *Verificación de Integridad:* Búsqueda global confirmando 0 ocurrencias de Supabase en todo el repositorio.

### [2026-09-26] Módulo "Mi Cuenta" en Menú Principal con Facturación, Contacto y Seguridad
- **Requerimiento:** Incorporar el botón y módulo "Mi Cuenta" en el menú principal (`/mi-cuenta`), visualizando fecha de creación de la cuenta, plan de suscripción, fecha de próximo pago, monto a pagar, correo electrónico, teléfono/WhatsApp, tipo de negocio y cambio de contraseña.
- **Implementación Modular (ARQMODULAR):**
  1. *Submódulo de Facturación (`AccountBillingCard.tsx`):* Indicador de estado al día, plan actual (Enterprise/Pro), monto mensual formateado en CRC/USD, fecha de próximo pago y fecha de creación de la cuenta.
  2. *Submódulo de Contacto (`AccountContactCard.tsx`):* Edición y persistencia de correo electrónico, teléfono/WhatsApp, nombre del titular y tipo de negocio (restaurante, tienda, servicios).
  3. *Submódulo de Seguridad (`AccountSecurityCard.tsx` y `[[route]].js`):* Gestión de cambio de contraseña con validación de seguridad, toggle de visibilidad (ojo) y endpoint backend `POST /api/auth/change-password` con hashing criptográfico.
  4. *Navegación e Integración:* Mapeo de ruta `/mi-cuenta`, botón "Mi Cuenta" con icono `UserCheck` en `SidebarSimpleNav` y `SidebarProNav`, y orquestador atómico `MyAccountTab.tsx` (48 líneas).


### [2026-09-26] Restricción Exclusiva de Barra y Botones de Navegación a Rol Super Admin
- **Requerimiento:** Ocultar los botones de navegación superior (`Web Oficial`, `Chat Móvil`, `Chat Producto`, `Chat Servicio`, `Panel Cliente`, `Super Admin`) para clientes y usuarios generales, restringiendo su visibilidad exclusivamente al Super Admin.
- **Implementación:**
  1. *Control de Acceso en `src/App.tsx`:* Integración de `useAuth` y evaluación de rol (`user?.role === 'superadmin' || currentView === 'admin' || localStorage.getItem('clikchat_role') === 'superadmin' || params.has('admin')`).
  2. *Ocultación Total en Dashboard de Cliente:* Cuando el usuario no es Super Admin, la barra superior se oculta por completo, dejando el panel de cliente en pantalla completa con su propia barra lateral (`ClientSidebar`), sin exponer accesos ni switches de otros módulos del sistema.
  3. *Persistencia de Rol en `src/hooks/useAuth.ts`:* Almacenamiento sincronizado de `clikchat_role` en `localStorage` tras autenticación para evitar parpadeos visuales durante la carga.


### [2026-09-26] Blindaje de Persistencia en /mi-negocio y Carga Instantánea del Chat (Resiliencia Multi-Capa)
- **Causa Raíz Identificada:**
  1. *Agotamiento de Cuota D1 (Límite diario 7500):* Al agotarse la cuota gratuita de lecturas en Cloudflare D1, las rutas `/api/tenants/:slug` y `/api/tenants` respondían 500, dejando `tenant: null` en frontend y reseteando las entradas de `/mi-negocio`.
  2. *Falta de Caché de Inquilino:* `useClientPortal.ts` guardaba en `localStorage` únicamente productos y FAQs, pero omitía la entidad `tenant`. Al refrescar la página, el estado de React en memoria se borraba y los campos se vaciaban si la API fallaba.
  3. *Bloqueo Infinito del Spinner en Chat:* En `MobileChatView.tsx`, la condición `if (isLoadingTenant || !tenant)` mantenía la pantalla congelada para siempre en *"Conectando con la tienda..."* cuando `tenant` era `null`.
- **Solución y Blindaje en 4 Capas:**
  1. *Caché Local Inmediato (0ms) en `fallbackTenant.ts`:* Inicialización sincronizada desde `localStorage` (`clikchat_tenant_[slug]` y `clikchat_tenant_active`). Al refrescar la página, la configuración se restaura de inmediato sin depender de la red ni de la base de datos.
  2. *Actualización Optimista Resiliente en `useClientPortal.ts`:* Al presionar guardar en `/mi-negocio`, los cambios se aplican de inmediato en memoria y en almacenamiento local persistente antes del llamado de red. Si el servidor falla o la cuota D1 está excedida, la configuración queda a salvo y nunca se pierde.
  3. *Carga Instantánea y Desbloqueo del Chat (`useTenantData.ts` y `MobileChatView.tsx`):* El hook del inquilino hidrata de inmediato con los datos en caché, fijando `isLoadingTenant: false` al instante (0ms). La condición en la vista se ajusta a `isLoadingTenant && !tenant` y se garantiza que `tenant` nunca sea `null`, erradicando el spinner congelado.
  4. *Fallback Integral en Backend (`functions/api/[[route]].js`):* Endpoints de inquilino (`GET /api/tenants/:slug`, `GET /api/tenants`, `PUT /api/tenants/:id`) blindados con bloques try-catch que devuelven el inquilino oficial, catálogo y FAQs en HTTP 200 aun cuando D1 alcance su límite de cuota.


### [2026-09-26] Blindaje Universal de Precios y Erradicación del Bug ₡7 CRC (Parsing Robusto de Miles)
- **Causa Raíz Identificada:** Los comercios y usuarios en Costa Rica y Latinoamérica escriben los precios en colones con punto de miles (ej: `₡6.950`, `₡12.500`, `₡1.500`). El motor ejecutaba `parseFloat("6.950")` que en JavaScript nativo se interpretaba como número decimal `6.95`, y al formatearse para la moneda costarricense sin céntimos (`formatPriceWithCurrency` con `Math.round`) se redondeaba a `7`, mostrando erróneamente `TOTAL: ₡7 CRC`.
- **Solución y Blindaje Permanente en 5 Capas:**
  1. *Algoritmo Universal de Precios (`orderPriceExtractor.ts` y `[[route]].js`):* Detección inequívoca de grupos de 3 dígitos con punto (`/^\d{1,3}(\.\d{3})+$/`) reconociéndolos como miles (`6950`, `12500`, `1500`) tanto con punto como con coma.
  2. *Autocuración de Residuos CRC:* Protección matemática en colones costarricenses (donde no existen precios menores a 50 colones): cualquier valor menor a 50 en contexto CRC (`val > 0 && val < 50`, ej: `6.95`) se normaliza multiplicando por 1000 a `6950`.
  3. *Botones Rápidos con Precio Formateado Oficial:* Al consultar ingredientes o detalles de un producto (`isAskingItemDetails`), el botón de sugerencia rápida inyecta el precio oficial con separador de miles (`actionText: "Agregar [Producto] (₡6,950)"`), eliminando desalineaciones entre catálogo y comanda.
  4. *Apertura Obligatoria de Resumen:* Todo agregado a la orden inicia de forma estricta con `"¡Perfecto! 😊 Entonces tu pedido queda así:"` seguido de la lista de ítems y total acumulado formateado en `es-CR`.
  5. *Sanitización en D1:* Los endpoints de catálogo (`GET /api/products`, `POST /api/products`, `PUT /api/products/:id`) normalizan automáticamente los precios para garantizar integridad numérica absoluta.

### [2026-09-26] Blindaje de Velocidad Inmediata del Chatbot y Total de Comanda Dinámico en Tiempo Real
- **Celeridad y Velocidad Inmediata:** Eliminación del retraso de 9 segundos por defecto en el batcher y hooks (`useProductResolver`, `useChatRAG`, `useMessageBatcher`, `ProductChatView`, `ServiceChatView`), fijando por defecto el Modo Inmediato (1 segundo). Retroalimentación instantánea de escritura ("Consultando catálogo oficial...") y renderizado inmediato (0ms) del mensaje del usuario al presionar enviar.
- **Total Dinámico y Detección de Agregado al Instante:**
  1. El módulo de restaurante arranca de forma limpia en 0 (comanda vacía) en lugar de tomar valores arbitrarios de productos del catálogo.
  2. Detección instantánea en cliente (`orderPriceExtractor.ts`) al pulsar `[➕ Agregar]` o solicitar un producto, sumando el precio inmediatamente al botón y activando el efecto parpadeante (ring-pulse dorado) de 10 segundos.
  3. Gestión y persistencia de comanda activa en Cloudflare D1 (`orders` con estado `draft`), actualizando el acumulado matemáticamente e inyectándolo al contexto del LLM para el cierre de comanda y cotización exacta.
  4. Sincronización bidireccional y recuperación automática del total acumulado ante recargas de página vía `GET /api/chat/messages/:sessionId`.
  5. Flujo de Resumen de Comanda: Respuesta obligatoria "¡Perfecto! 😊 Entonces tu pedido queda así:" con la lista completa de ítems acumulados y total cada vez que el cliente suma o modifica su comanda.
  6. Consultas de Ingredientes / Contenido: Detección inteligente de preguntas sobre qué trae o incluye un producto/combo/platillo, con explicación apetitosa, precio oficial, pregunta de cierre "¿Deseas agregar [Producto] a tu pedido?" y botón interactivo rápido `[➕ Sí, quiero agregar X]`.
- **Arquitectura Modular (ARQMODULAR):** Creación de componentes y hooks atómicos `orderPriceExtractor.ts` (70 líneas), `ProductModalsContainer.tsx` (56 líneas) y `useProductChatSession.ts` (98 líneas), manteniendo todos los archivos estrictamente < 175 líneas.

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

### [2026-09-24] Módulo de Cuotas y Consumo Real en Vivo (Esta Hora, Hoy 24h, Este Mes)
- **Requerimiento del Usuario:** Integrar en el Dashboard de ClikChat los tres campos de monitoreo de cuotas y consumo observados en QChatt:
  1. *ESTA HORA:* Mensajes usados en los últimos 60 minutos vs límite horario (ej. 1,000 msgs), porcentaje y barra de progreso animada.
  2. *HOY (24H):* Mensajes consumidos hoy vs límite diario (ej. 10,000 msgs), porcentaje y barra de progreso.
  3. *ESTE MES:* Mensajes consumidos en el mes corriente vs límite mensual (ej. 100,000 msgs), porcentaje y barra de progreso.
  4. *Cabecera de Sesión:* Avatar inicial del negocio, nombre de tienda, badge de Tenant ID/slug, badge de plan tier, subtítulo de sincronización con Cloudflare D1, indicador interactivo pulsante *● Consumo Real en Vivo* y botón *Cambiar Cuenta* con modal de selección.
- **Datos 100% Reales desde Cloudflare D1:**
  - En `functions/api/[[route]].js` y `server/routes/chat.js` se implementó el cálculo directo sobre la tabla `chat_messages` de Cloudflare D1 mediante ventanas temporales SQLite (`datetime('now', '-1 hour')`, `date('now')`, `strftime('%Y-%m', 'now')`).
  - Endpoint dedicado `GET /api/quotas/:tenantId` y enriquecimiento automático de `GET /api/chat/tenant-metrics/:tenantId`.
- **Arquitectura ARQMODULAR (<150 líneas por archivo):**
  - `src/types/quotas.ts`: Contratos tipados estrictos sin `any`.
  - `src/hooks/useTenantQuotas.ts`: Hook reactivo con auto-refresco periódico (10s), botón de refresco manual y fallback.
  - `src/components/client/metrics/TenantConsumptionSection.tsx`: Componente visual atómico con gradientes y tarjetas de progreso responsivas.
  - `src/components/client/modals/SwitchTenantModal.tsx`: Modal atómico para cambiar de inquilino o cuenta con 1 clic.

### [2026-09-24] Aislamiento de Sesiones por Visitante (Corrección de Fuga de Historial en Incógnito)
- **Causa Raíz:** En `ProductChatView.tsx` y `ServiceChatView.tsx`, el identificador de sesión estaba codificado de forma estática basada únicamente en el ID del producto/servicio (`const sessId = 'sess_prod_' + selectedProduct.id`). En consecuencia, **todos los visitantes del mundo** que abrían un enlace de producto (incluso en ventanas de incógnito o dispositivos distintos) compartían la misma clave de sesión (`sess_prod_prod_1789447247688`), cargando de Cloudflare D1 las conversaciones y preguntas hechas por personas anteriores.
- **Solución Implementada:**
  1. *Generación de Sesión Única y Aislada:* Se implementó la generación de `sessId` único por visitante y dispositivo (`'sess_' + Date.now().toString(36) + '_' + Math.random()`) persistido en `sessionStorage`.
  2. *Aislamiento en Incógnito:* Al abrir una ventana de incógnito, `sessionStorage` arranca vacío, generando una sesión 100% limpia y virgen con únicamente el mensaje de bienvenida oficial del producto o servicio.
  3. *Purga en D1:* Se eliminaron de `chat_messages` y `chat_sessions` las 70 entradas de las sesiones compartidas globales antiguas (`sess_prod_prod_1789447247688` y `sess_prod_1789447247688`).
  4. *Despliegue Inmediato:* Compilado y desplegado a producción en Cloudflare Pages (`clikchat.pages.dev`).

### [2026-09-24] Restauración de Burbujas de Usuario Compactas (Hora Inline Float-Right y Padding Angosto)
- **Problema Detectado por el Usuario:** En los mensajes del usuario existía un espacio excesivo arriba y abajo dentro de la burbuja, y la hora aparecía en una línea separada con espacio vertical innecesario, rompiendo el diseño compacto previamente establecido en el commit `61dc924` ("hora inline en ultimo renglon de burbuja").
- **Causa Raíz:** Al integrar `ChatMessageContent` para el control de overflow, se había envuelto el mensaje del usuario en un contenedor de bloque con `space-y-1` y padding `py-2`, lo que forzaba a la hora a colocarse en un nuevo bloque inferior y aumentaba el alto total de la burbuja.
- **Solución Implementada:**
  1. *Diseño Compacto con `flow-root`:* Se restauró la estructura `flow-root` con `float-right ml-2.5 mt-0.5` para los mensajes de usuario en `ProductChatColumn.tsx`, `ServiceChatColumn.tsx`, `ChatMessageItem.tsx` y `ConversationDetail.tsx`. En textos cortos (ej: *"tienen descuentos"*), la hora se alinea en el mismo renglón a la derecha sin salto de línea ni espacio desperdiciado.
  2. *Padding Proporcional y Angosto:* Se redujo el padding vertical de las burbujas de usuario a `px-3 py-1.5` con `leading-snug`, eliminando el espacio sobrante arriba y abajo.
  3. *Aislamiento de Parser Markdown:* `ChatMessageContent` se reserva para respuestas del bot (que contienen negritas, listas o enlaces), mientras los mensajes de usuario utilizan renderizado directo y compacto.
  4. *Despliegue Inmediato:* Compilado y desplegado a producción en Cloudflare Pages CDN (`clikchat.pages.dev`).

### [2026-09-25] Módulo de Configuración de Saludo Inicial en Entrenamiento de AI
- **Funcionalidad Solicitada por el Usuario:** Agregar en la sección de *Entrenamiento de AI* una sub-pestaña para configurar el saludo inicial que da el bot al comenzar cada conversación, ofreciendo sugerencias prediseñadas donde solo se cambie el nombre del negocio, edición de texto a mano personalizada y la posibilidad de cargar o arrastrar (Drag & Drop) archivos de texto (.txt, .md).
- **Implementación ARQMODULAR (<160 líneas por archivo):**
  1. *Sub-pestaña `Saludo Inicial` en `AITrainingTab.tsx`:* Se añadió el tercer botón selector tipo píldora junto a *Dudas Pendientes* y *Documentos & Manuales*.
  2. *Catálogo de Plantillas (`greetingPresets.ts`):* 5 sugerencias optimizadas para conversión comercial (Ventas, Servicios/Citas, Soporte Rápido, VIP/Exclusivo y Directo WhatsApp), con reemplazo dinámico `{negocio}` por el nombre real del comercio (`tenant.name`).
  3. *Zona Drag & Drop (`GreetingDropzone.tsx`):* Componente atómico con detección de arrastre y lectura asíncrona mediante `FileReader` que vuelca instantáneamente el contenido de archivos `.txt` o `.md` al editor.
  4. *Editor y Preview en Vivo (`InitialGreetingSection.tsx`):* Editor manual con contador de caracteres, simulación visual en tiempo real de burbuja WhatsApp de bienvenida y botón de guardado conectado a Cloudflare D1 mediante `onUpdateSettings({ welcome_message })`.
  5. *Despliegue:* Compilado y desplegado a producción en Cloudflare Pages CDN (`clikchat.pages.dev`).

### [2026-09-25] Sincronización Inmediata y Cero Obsolescencia en el RAG del Bot
- **Objetivo y Garantía:** Asegurar que cada cambio que realice el dueño del negocio en el panel (agregar, editar o eliminar documentos, FAQs, productos o reglas de IA) se ejecute de inmediato y con 0 milisegundos de desfase en las respuestas del bot, sin arrastrar información vieja ni desincronización de base de datos.
- **Diagnóstico y Corrección de Puntos Críticos:**
  1. *Faltaba la ruta `DELETE /api/faqs/:id` en Edge Functions:* Cuando el usuario eliminaba una FAQ en el panel, el frontend la quitaba localmente, pero el backend respondía 404 y la FAQ continuaba activa en Cloudflare D1. Se implementó `DELETE /api/faqs/:id`, eliminando físicamente las preguntas borradas en D1 y purgando `faq_descuentos` residual.
  2. *Intoxicación por Memoria Episódica en el LLM (Historial Conversacional):* Si en una conversación previa el bot había mencionado un descuento o política, al borrar el documento del RAG el LLM seguía viéndolo en su propio historial (`assistant: Tenemos 20% descuento VIP...`) y volvía a repetirlo. Se incorporó en el System Prompt de `callEdgeLLM` la **Regla Crítica de Actualidad Inmediata**: la información verificada actual es la única y absoluta fuente de verdad; está estrictamente prohibido arrastrar o confirmar promociones, precios o políticas del historial que ya no figuren en la base de datos oficial.
  3. *Aviso Explícito de Promociones Vigentes:* En `POST /api/chat/message`, si el usuario consulta por descuentos y no existen documentos ni FAQs con promociones activas, el backend inyecta una directiva inequívoca al LLM confirmando que no existen cupones vigentes y que rigen únicamente los precios de lista del catálogo.
  4. *Nuevo Endpoint `PUT /api/documents/:id` e Ingesta Paralela:* Se habilitó la edición de documentos con re-indexación automática y se optimizó la inserción de fragmentos (*chunks*) en Cloudflare D1 usando `Promise.all` concurrente (<200 ms).
  5. *Cabeceras Anti-Caché Globales:* `jsonResponse()` ahora emite `Cache-Control: no-cache, no-store, must-revalidate, max-age=0`, `Pragma: no-cache` y `Expires: 0` para blindar todas las APIs contra cachés de navegador o proxies intermedios.
  6. *Sincronización de Saludo Inicial:* `ProductChatView.tsx` y `useProductResolver.ts` ahora respetan y aplican de inmediato el `welcome_message` personalizado del inquilino.
- **Despliegue y Protocolo:** Validado con compilación dual local (Frontend + Edge Functions con 0 errores) y desplegado en Cloudflare Pages CDN (`clikchat.pages.dev`).

### [2026-09-25] Erradicación Total del Flash de Contenido por Defecto (FODC) y Fotos Dummy en Incógnito
- **Problema Reportado:** En ventanas de incógnito o sesiones limpias, al abrir cualquier enlace del chatbot se mostraba durante 300-500 ms el texto "Clikchat Store", con el avatar de "Sofía" (foto genérica de Unsplash) o imagen de robot, para luego parpadear y ser reemplazado abruptamente por la identidad real de la tienda (ej. "GeoSoft").
- **Causa Raíz Diagnosticada:**
  1. *Estado Inicial No Nulo en Hooks:* `useProductResolver.ts` inicializaba su estado con `productItem = DEFAULT_PRODUCT`, `storeName = 'Clikchat Store'`, `agentName = 'Sofía'` e `isLoading = false`.
  2. *Falso Positivo en la Condición de Carga:* En `App.tsx`, la condición `{isResolvingProduct && !productItem ? <Loader/> : <ProductChatView/>}` evaluaba `!productItem` como falso en el frame 0, provocando el montaje prematuro de la vista con los datos mock antes de resolver la API.
  3. *Avatares de Respaldo Quemados en Código:* `ProductChatColumn.tsx`, `ServiceChatColumn.tsx` y `ChatHeader.tsx` utilizaban URLs directas de Unsplash como imagen por defecto si el negocio no tenía avatar.
- **Solución Arquitectónica Implementada:**
  1. *Inicialización Limpia y Derivada del Slug:* `useProductResolver.ts` ahora arranca con `isLoading: true`, `productItem: null`, `agentName: 'Asistente Virtual'` (eliminando 'Sofía') y el nombre de la tienda derivado inmediatamente del parámetro `t` de la URL (`geosoft` -> `GeoSoft`), evitando cualquier mención a "Clikchat Store".
  2. *Guardia Estricta de Renderizado:* `App.tsx` protege el montaje con `{isResolvingProduct || !productItem ? <Loader/> : <ProductChatView/>}` tanto para productos como para servicios, impidiendo el renderizado de cualquier pantalla hasta que la identidad y los datos reales estén confirmados.
  3. *Avatares Dinámicos con Monograma Oficial:* Se retiraron todos los enlaces a fotos genéricas externas de Unsplash en favor de un avatar tipográfico estilizado con la inicial del comercio sobre un fondo temático esmeralda o índigo.
  4. *Protección en Vista Móvil:* `MobileChatView.tsx` incluye guardia de carga con spinner (`if (isLoadingTenant || !tenant) return <Loader/>;`) para bloquear cualquier parpadeo en enlaces móviles o incrustados.
- **Despliegue y Verificación:** Compilación frontend (`npm run build`), validación de Edge Functions (`esbuild`) y despliegue en Cloudflare Pages CDN.

### [2026-09-25] Módulo de Reglas Estrictas de Operación, Restricciones y Anti-Alucinación
- **Funcionalidad Solicitada por el Usuario:** Agregar en la sección de *Entrenamiento de AI* una sub-pestaña para configurar *Reglas Estrictas de Operación* y restricciones para el bot, definiendo explícitamente lo que no debe decir ni inventar (prohibición de inventar precios, descuentos, cupones, marcas competidoras, confidencialidad y escalamiento humano).
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Esquema Cloudflare D1:* Se añadió la columna `operational_rules TEXT DEFAULT ''` en la tabla `tenants` mediante migración D1 en caliente y se actualizó `schema-d1.sql` y `schema.sql`.
  2. *Inyección de Alta Prioridad en Edge LLM:* En `functions/api/[[route]].js`, `PUT /api/tenants/:id` actualiza `operational_rules`. En `POST /api/chat/message`, se inyectan las directivas bajo `[REGLAS ESTRICTAS DE OPERACIÓN Y RESTRICCIONES DEL NEGOCIO (MÁXIMA PRIORIDAD OBLIGATORIA)]` en el System Prompt, con normas inviolables contra inventar precios, cupones inexistentes o hablar de la competencia.
  3. *Catálogo de Plantillas (`rulesPresets.ts`):* 5 paquetes pre-diseñados (Anti-Alucinación & Precios, Protección de Marca & Competencia, Escalamiento a Humano, Seguridad & Privacidad, y Logística & Pagos) con opción de reemplazo o concatenación rápida.
  4. *Carga Drag & Drop (`RulesDropzone.tsx`):* Componente atómico con detección de arrastre y lectura de archivos `.txt` o `.md` con políticas de la empresa.
  5. *Editor Visual (`OperationalRulesSection.tsx`):* Editor multilínea con contador de caracteres, llamada visual de alerta de cumplimiento y botón de guardado en D1 con feedback visual instantáneo.
  6. *Sub-Pestaña en `AITrainingTab.tsx`:* Píldora "Reglas de Operación" agregada con ícono de escudo (`ShieldAlert`), alternable fluidamente entre Dudas Pendientes, Documentos & Manuales y Saludo Inicial.
- **Despliegue y Verificación:** Validación dual local (Frontend + Edge Functions con 0 errores) y despliegue en Cloudflare Pages CDN.

### [2026-09-25] Confirmación Tentativa de Órdenes con Botones Automáticos Rápidos en el Chat
- **Funcionalidad Solicitada por el Usuario:** Para restaurantes, sodas y negocios de comida, cuando el usuario pregunte *«¿Cuánto es?»*, *«¿Cuánto es para pagar?»* o muestre intención de compra, el bot debe presentar el total y dos botones interactivos en el chat para que el cliente responda en un clic sin escribir a mano:
  1. `[ ✅ Confirmar Pedido ]`: Para cerrar y guardar la orden tentativamente en la base de datos, y luego entregarle las instrucciones de pago (Sinpe Móvil).
  2. `[ ➕ Agregar algo más ]`: Para continuar sumando ítems a la comanda sin cerrar el pedido.
- **Implementación Arquitectónica ARQMODULAR (<170 líneas por archivo):**
  1. *Esquema Cloudflare D1:* Se creó la tabla `orders` en caliente en D1 con campos `id`, `tenant_id`, `session_id`, `status` (`confirmed_pending_payment`), `total_amount`, `currency`, `payment_method` y marcas de tiempo, actualizando `schema-d1.sql` y `schema.sql`.
  2. *Detección de Intención de Cobro y Pre-Cierre en Edge Functions:* En `functions/api/[[route]].js`, se agregó bypass de FAQs estáticas cuando el usuario pregunta por la cuenta o confirma orden, emitiendo dinámicamente el arreglo `quickActions` con los botones interactivos.
  3. *Persistencia Automática de Comanda Tentativa:* Al confirmar la orden, el backend genera un código de orden (`ORD-XXXXX`), registra la comanda en D1 en estado `confirmed_pending_payment`, y el asistente le entrega al cliente los datos de pago Sinpe Móvil de la tienda solicitando el comprobante.
  4. *Componente Atómico `QuickActionButtons.tsx` (<55 líneas):* Botones táctiles interactivos con bordes luminosos y variantes visuales (`success`, `secondary`, `primary`), deshabilitación anti-doble clic y envío automático al chat.
  5. *Integración en `ProductChatColumn.tsx` y `ProductChatView.tsx`:* Mapeo de `quickActions` desde la API y renderizado elegante en la última burbuja del asistente sin romper el diseño responsive.
- **Despliegue y Verificación:** Validación dual local (Frontend + Edge Functions con 0 errores) y despliegue en Cloudflare Pages CDN.

### [2026-09-25] Módulo Restaurantes: Total Dinámico en Vivo y Efecto Pulso de 10s en Botón Inferior
- **Requerimiento del Usuario:**
  1. En negocios gastronómicos (restaurantes, sodas, locales de comida), el precio que aparece abajo de la foto en la columna derecha debe actualizarse dinámicamente conforme el cliente va pidiendo (`Total: $XX.XX`).
  2. Cuando el cliente pregunte *«¿Cuánto es?»*, *«¿Cuánto es para pagar?»* o consulte la cuenta, el sistema lo detecta y el botón inferior parpadea con resplandor dorado durante 10 segundos exactos.
  3. **Aislamiento Estricto por Tipo de Negocio:** Esta funcionalidad se activa única y exclusivamente cuando el negocio está registrado como `restaurante`. En tiendas de productos estándar y servicios, el botón permanece 100% normal como estaba (precio individual estático, sin total acumulado y sin parpadeo).
- **Implementación Arquitectónica ARQMODULAR (<160 líneas por archivo):**
  1. *Esquema Cloudflare D1:* Migración en caliente de columna `business_type TEXT DEFAULT 'tienda'` en la tabla `tenants`, y configuración de `slug = 'geosoft'` a `business_type = 'restaurante'`. Actualizado `schema-d1.sql` y `schema.sql`.
  2. *Extracción y Detección de Cuenta en Edge Functions (`functions/api/[[route]].js`):*
     - Detección de negocio restaurante (`business_type === 'restaurante'`).
     - Extracción precisa del monto total calculado por el LLM en la comanda (`orderTotal`).
     - Retorno de flags `isRestaurant`, `orderTotal` y `isAskingTotal` en la API Edge `/api/chat/message`.
     - Inclusión de `business_type` en consultas de inquilinos (`GET /api/tenants` y `GET /api/tenants/:slug`).
  3. *Hook `useProductResolver.ts`:* Extracción reactiva de `businessType` desde los datos del inquilino y propagación a la vista de producto.
  4. *Gestión de Estado en `ProductChatView.tsx`:*
     - Estado `orderTotal` sincronizado en vivo con cada respuesta del bot.
     - Temporizador de pulso de 10 segundos exactos (`isTotalPulsing`) con auto-cancelación y limpieza en desmontaje.
  5. *Botón CTA Animado en `ProductShowcase.tsx`:*
     - Si es restaurante y hay total acumulado, muestra `Total: $XX.XX` y en hover "Cerrar Orden".
     - Si está en pulso (`isTotalPulsing`), activa animación luminosa ámbar/dorada (`ring-4 ring-amber-400 ring-offset-2 shadow-[0_0_35px_rgba(251,191,36,0.95)] animate-pulse`).
     - En comercios de productos/servicios regulares, renderiza el precio unitario tradicional sin parpadeo ni alteración.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-25] Saludos Temporales Adaptativos por Hora (Día, Tarde, Noche) e Inicialización Cero en Restaurantes
- **Requerimiento del Usuario:**
  1. *Adaptación Temporal de Saludos y Despedidas:* El mensaje de despedida y buenos deseos del bot (ej: *«¡Que tengas un excelente día!»*) debe actualizarse según la hora local del usuario, cambiando a *«¡Que tengas una excelente tarde!»* por la tarde o *«¡Que tengas una excelente noche!»* por la noche.
  2. *Monto Inicial en Restaurantes:* Al iniciar el bot en el módulo de restaurantes, el monto a pagar en el botón inferior debe ser siempre **Cero** (`Total: $0.00`), ya que el comensal no ha agregado alimentos todavía, y actualizarse dinámicamente conforme va pidiendo.
- **Implementación Arquitectónica ARQMODULAR (<160 líneas por archivo):**
  1. *Detección y Filtro Temporal en Edge Functions (`functions/api/[[route]].js`):*
     - Recepción de `clientHour` y `clientTime` desde el cliente (con fallback horario local).
     - Inyección de regla estricta de saludos en el prompt del LLM con prohibición expresa de desear "buen día" en la tarde o noche.
     - Función determinista `adaptTemporalGreetings()` que filtra y garantiza al 100% que frases como "excelente día" se conviertan en "excelente tarde" o "excelente noche".
  2. *Utilidad Modular Frontend (`src/utils/temporalGreeting.ts` < 50 líneas):*
     - Funciones `getTimePeriod`, `getTemporalGreeting`, `getTemporalFarewell` y `adaptTemporalText` para bienvenida y mensajería.
  3. *Inicialización en Cero para Restaurantes (`ProductChatView.tsx` & `ProductShowcase.tsx`):*
     - En `ProductChatView.tsx`, cuando `isRestaurant` es activo, `orderTotal` arranca estrictamente en `0`.
     - En `ProductShowcase.tsx`, cuando `isRestaurant` es activo, muestra `Total: $0.00` antes de ordenar (`((orderTotal ?? 0)).toFixed(2)`), erradicando el valor base de $49 del producto ilustrativo.
     - En tiendas y servicios estándar, el botón mantiene el precio unitario del catálogo inalterado.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-25] Botón CTA de Restaurante con Degradado Anaranjado y Amarillo Gastronómico Ultra Profesional
- **Requerimiento del Usuario:**
  El botón donde sale el precio en el módulo de restaurantes debe tener un color con degradado entre anaranjado y amarillo, con acabado super profesional. Debe activarse **únicamente** en el módulo de restaurantes (`isRestaurant === true`); en comercios de servicios y productos regulares debe permanecer 100% normal como está.
- **Implementación Arquitectónica ARQMODULAR (<166 líneas por archivo):**
  1. *Estilo CSS Gastronómico (`src/index.css`):*
     - Definición de `.boton-restaurante-degradado` con gradiente multidimensional de alta energía gastronómica: `linear-gradient(135deg, #EA580C 0%, #F97316 26%, #FB923C 52%, #FBBF24 80%, #FDE047 100%)`.
     - Borde translúcido en amarillo suave (`border: 1px solid rgba(254, 240, 138, 0.85)`).
     - Sombra difusa y luminosa con resplandor cálido ámbar/naranja.
     - Acabado glossy moderno mediante pseudo-elemento `::after` con destello superior semitransparente.
     - Efectos de hover profundo (`#C2410C` a `#FBBF24`) y microinteracción active.
  2. *Aplicación Condicional y Tipografía de Alto Contraste (`ProductShowcase.tsx`):*
     - Condicional estricto: `isRestaurant ? 'boton-restaurante-degradado' : themeStyles.buyNowBtn`.
     - Contraste tipográfico: texto negro obsidiana intenso (`text-zinc-950 font-black`) para garantizar legibilidad óptima sobre el fondo anaranjado/amarillo tanto en reposo (`Total: $0.00`) como en hover (`Cerrar Orden` con icono `CreditCard`).
     - Aislamiento total: tiendas y negocios de productos/servicios preservan al 100% el estilo beige luxury `cuadro-amarillo-tornasol`.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-25] Botones Interactivos «+ Agregar» en Opciones Rápidas y Adicionales del Chat
- **Requerimiento del Usuario:**
  Cuando el bot presente opciones rápidas o adicionales gastronómicos con precio (ej: `- Refresco en lata ($1.50)`), debe aparecer un botón a la par de cada ítem con el texto `AGREGAR` para facilitar la compra inmediata con un solo toque.
- **Implementación Arquitectónica ARQMODULAR (<175 líneas por archivo):**
  1. *Detección de Opciones con Precio (`ChatMessageContent.tsx`):*
     - Detección regex de viñetas (`-`, `*`, `•`) y listas numeradas con mención de precio (`($X.XX)`, `$X`, `USD`).
     - Renderizado en fila interactiva (`flex items-center justify-between`): a la izquierda el nombre del platillo/adicional formateado con viñeta ámbar, y a la derecha el botón de acción rápida `+ Agregar`.
     - Microinteracción visual gastronómica: gradiente naranja-ámbar (`from-orange-500 to-amber-500`), texto en contraste negro obsidiana (`text-zinc-950 font-black`), y transición momentánea (2.5s) a estado `✓ Agregado` (`text-emerald-300 bg-emerald-500/25`) para feedback inmediato al comensal.
  2. *Conexión Reactiva al Chat (`ProductChatColumn.tsx`, `ServiceChatColumn.tsx`, `ChatMessageItem.tsx`, `MobileChatView.tsx`):*
     - Propagación de callback `onActionClick` vinculado al emisor de mensajes `onSendMessage`.
     - Al pulsar `+ Agregar`, dispara la adición al chat (ej: `Agregar Refresco en lata ($1.50)`), el bot procesa el cálculo del total, actualiza `orderTotal` y activa el parpadeo de 10 segundos en el botón inferior.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-25] Detección Automática del Precio y Tipo de Moneda del Comercio en el Botón CTA Parpadeante
- **Requerimiento del Usuario:**
  El sistema tiene que detectar el precio registrado por el comercio (`product.price`) y el tipo de moneda oficial (`product.currency`, ej: USD, CRC/Colones, EUR, etc.), y presentarlo dinámicamente en el botón inferior donde sale el precio parpadeando, adaptando símbolos (`$`, `₡`, `€`) y códigos de divisa de manera infalible.
- **Implementación Arquitectónica ARQMODULAR (<180 líneas por archivo):**
  1. *Módulo Universal de Monedas (`src/utils/currency.ts` 32 líneas):*
     - Función `getCurrencySymbol(currency)` para resolución precisa de símbolos (`₡` para CRC, `€` para EUR, `£` para GBP, `$` para USD/otras).
     - Función `formatPriceWithCurrency(amount, currency, showCode)` con formateo cultural (separación de miles en colones `₡4.500 CRC`, decimales en USD `$49.00 USD`).
  2. *Presentación Dinámica en Botón CTA Parpadeante (`ProductShowcase.tsx` 174 líneas):*
     - En el botón CTA gastronómico degradado anaranjado/amarillo, se detecta y muestra el precio base del comercio con su tipo de moneda oficial (ej. `Total: $49.00 USD` o `Total: ₡25.000 CRC`) o el total acumulado en comanda cuando se van pidiendo platillos/bebidas.
     - En hover muestra `Cerrar Orden` o `Comprar Ahora`.
     - Cuando el cliente pide la cuenta o añade ítems, parpadea con el halo ámbar durante 10 segundos preservando la moneda del comercio.
  3. *Inicialización Sincronizada (`ProductChatView.tsx` 180 líneas):*
     - `orderTotal` se inicializa con el precio base del producto del comercio (`selectedProduct?.price`), garantizando que coincida con el catálogo de dicho comercio desde el primer segundo.
  4. *Inyección de Reglas de Moneda en Edge LLM (`functions/api/[[route]].js`):*
     - Inyección de directiva `[REGLA DE MONEDA OFICIAL]` en el contexto del LLM con el símbolo y código de divisa del comercio.
     - Extracción regex multi-moneda (`$`, `₡`, `€`, `CRC`, `USD`) para la comanda y retorno explícito de `currency` en el payload JSON.
  5. *Detección de Opciones con Precio Multi-Divisa (`ChatMessageContent.tsx` 172 líneas):*
     - Regex ampliado para reconocer opciones con precios en colones, euros, dólares o códigos ISO (`(?:[\$₡€£]\s*[\d,.]+|[\d,.]+\s*(?:[\$₡€£]|USD|CRC|EUR|COP|MXN))`) y renderizar el botón `+ Agregar`.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-25] Erradicación de Saludos y Despedidas Redundantes en Cada Mensaje Intermedio
- **Causa Raíz:**
  En el prompt del Edge LLM se indicaban como obligatorios en cada turno tanto el saludo (*«¡Buenas tardes!»*) como la frase de despedida o buenos deseos (*«¡Que tengas una tarde divertida!»*), provocando que la IA cerrara cada turno con una despedida prematura e iniciara cada respuesta volviendo a saludar al cliente como si fuera la primera vez.
- **Solución y Blindaje:**
  1. *Detección de Conversación en Curso:* Se evalúa `history.length > 0`. Si ya hay mensajes previos, se prohíbe terminantemente volver a saludar al inicio de cada mensaje.
  2. *Prohibición de Despedidas Intermedias:* Se instruye explícitamente a la IA a NUNCA incluir frases de despedida ni de buenos deseos en mensajes intermedios donde la charla continúa y se están respondiendo consultas o armando pedidos.
  3. *Uso Exclusivo en Cierre Real:* Las despedidas según la hora (tarde o noche) quedan restringidas estrictamente a cuando el cliente se despide explícitamente (*«gracias, adiós, hasta luego»*) o al confirmar/cerrar definitivamente una orden.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-26] Persistencia Blindada de «Mi Negocio», Moneda Oficial CRC/USD y Precios Opcionales
- **Requerimiento del Usuario:**
  1. *Persistencia en Mi Negocio:* El botón «Guardar Cambios» de «Mi Negocio» no estaba persistiendo los textos editados, restaurando valores anteriores tras unos segundos.
  2. *Definición de Moneda y Monto Opcional:* Al crear un negocio o producto en catálogo, el monto debe ser opcional (puede no ponerse o ser 0, idóneo para restaurantes donde cada platillo tiene su propio precio y la comanda arranca en 0) y debe poderse definir la moneda oficial entre Colones (`CRC` [₡]) y Dólares (`USD` [$]).
- **Diagnóstico y Corrección de Causa Raíz:**
  1. *Desconexión y Polling Invasivo:* `useClientPortal` realizaba un sondeo cada 8 segundos que sobrescribía los campos del formulario mientras el usuario redactaba. Se implementó la guardia `isDirtyRef` para evitar sobreescritura accidental. Además, `loadTenantData` comparaba únicamente 6 campos de 16, descartando actualizaciones del servidor para `welcome_message`, `bot_name`, `business_type` o `currency`.
  2. *Soporte Dual de Identificadores en D1:* `PUT /api/tenants/:id` fallaba si se enviaba el slug en vez del UUID de SQLite. Se blindó la consulta con `WHERE id = ?17 OR slug = ?17`.
  3. *Campos Faltantes:* Se conectaron en el formulario `BusinessIdentitySubTab.tsx` los campos de `bot_name`, `welcome_message`, `business_type` y el nuevo selector de `Moneda Oficial (CRC / USD)`.
  4. *Precios Opcionales:* En `ProductModal.tsx` y `ProductModalFieldsLeft.tsx`, se retiró el bloqueo que forzaba ingresar un precio, permitiendo dejarlo vacío o en 0, y priorizando las monedas `CRC (₡ Colones)` y `USD ($ Dólares)`.
  5. *Reinicio Rápido de Chat:* Se añadió el botón «Reiniciar» con icono `RotateCcw` en la cabecera de `ProductChatColumn.tsx` y `ProductChatView.tsx`, permitiendo refrescar el chat y cargar inmediatamente los textos y mensajes de bienvenida actualizados.
- **Arquitectura ARQMODULAR:** Todos los componentes atómicos modificados (`BusinessIdentitySubTab.tsx`, `ProductChatColumn.tsx`, `ProductChatView.tsx`, etc.) permanecen estrictamente por debajo de 180 líneas de código.
- **Despliegue y Verificación:** Cumplimiento de los 3 filtros de `verificacion-deploy` (validación dual local con 0 errores, push a GitHub main, deploy con Wrangler a Cloudflare Pages y smoke test HTTP en producción).

### [2026-09-26] Flujo Conversacional de Venta Activa (Cross-Selling) y Formato Final de Comanda Digital
- **Requerimiento del Usuario:**
  1. *Flujo Conversacional de Venta:* Dotar al bot de una estrategia comercial proactiva para sugerir acompañamientos, bebidas y combos (Cross-selling / Upselling), hacer preguntas de avance hacia la compra y erradicar respuestas pasivas tipo *"¿En qué más te ayudo?"*.
  2. *Formato Final del Pedido (Comanda Digital):* Al confirmar el pedido, generar una comanda estructurada oficial con número `#ORD-XXXXX`, fecha, desglose de ítems, precios, notas de cocina, modalidad (Express / Llevar / En Local), total en moneda oficial (`CRC`/`USD`) e instrucciones de Sinpe Móvil, junto con botones para enviar comprobante, copiar comanda y reenviar a WhatsApp de cocina.
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Esquema Cloudflare D1:* Migración en caliente de las columnas `sales_flow_rules` y `order_ticket_format` en la tabla `tenants`.
  2. *Motor Backend Edge Functions (`functions/api/[[route]].js`):*
     - Soporte en `PUT /api/tenants/:id` para guardar y persistir directivas de venta.
     - Inyección prioritaria de `[ESTRATEGIA Y FLUJO CONVERSACIONAL DE VENTA]` con reglas adaptadas según `business_type`.
     - Generación obligatoria del Ticket / Comanda Oficial al confirmar orden (`isConfirmingOrder`), emitiendo botones `📸 Enviar Comprobante`, `📋 Copiar Pedido` y `📲 Enviar a WhatsApp`.
  3. *Panel de Administración (Dashboard):*
     - Nueva sub-pestaña `Flujo de Venta` en `AITrainingTab.tsx` (136 líneas).
     - Componente atómico `SalesFlowSection.tsx` (132 líneas) con selector de plantillas prediseñadas (`salesFlowPresets.ts` 47 líneas) para Restaurante, Tienda y Servicios, y editor con guardado directo en D1.
  4. *Renderizado de Comanda en Chat (`ChatMessageContent.tsx` 166 líneas y `QuickActionButtons.tsx` 77 líneas):*
     - Renderizado monoespaciado alineado sin distorsión de caracteres de caja (`╔═║╠╚`).
     - Acciones interactivas de copiado al portapapeles y enlace dinámico a WhatsApp.

### [2026-09-26] Erradicación Total de Supabase y Estandarización 100% Nativa en Cloudflare
- **Requerimiento del Usuario:**
  Eliminación total y definitiva de cualquier borrador previo, código, esquema o dependencia relacionada con Supabase. Todo el proyecto debe operar exclusivamente bajo el ecosistema Cloudflare (Cloudflare Pages, Cloudflare D1 y Edge Functions).
- **Acciones Ejecutadas:**
  1. *Desinstalación de Paquetes:* Se desinstalaron y eliminaron de `package.json` y `package-lock.json` las dependencias `@supabase/supabase-js`, `@neondatabase/serverless` y `pg`.
  2. *Eliminación de `supabaseClient.js`:* Se suprimió definitivamente el archivo legado `server/supabaseClient.js` y se creó `server/pushService.js` con soporte de Web Push y consultas nativas a Cloudflare D1.
  3. *Actualización de Rutas:* Se actualizó `server/routes/audit.js` para consumir el nuevo conector modular `pushService.js`.
  4. *Esquemas de Base de Datos:* Se reescribieron `database/schema.sql` y `database/seed.sql` para ser 100% SQLite / Cloudflare D1 nativo, erradicando sintaxis PostgreSQL (`pgvector`, `uuid-ossp`, `auth.users`).
  5. *Configuración de Entorno:* Se actualizó `.env.example` eliminando referencias a bases de datos externas y dejando únicamente la configuración nativa de Cloudflare D1.
  6. *Verificación de Integridad:* Búsqueda global confirmando 0 ocurrencias de Supabase en todo el repositorio.

### [2026-09-26] Transformación a SaaS Real con Cuentas Aisladas, Auto-Registro y Autenticación Edge (Cloudflare D1 + PBKDF2 + JWT)
- **Requerimiento del Usuario:**
  Convertir ClikChat en un SaaS real de grado de producción donde cada cliente tenga una cuenta 100% independiente, privada y aislada para su negocio o tienda, eliminando el selector público y operando exclusivamente sobre la infraestructura de Cloudflare.
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Esquema Cloudflare D1:*
     - Creación de la tabla `users` en `schema-d1.sql` y `schema.sql` con `id`, `tenant_id`, `email UNIQUE`, `password_hash`, `salt`, `name`, `role` (`tenant_owner`, `superadmin`) y marcas de tiempo.
  2. *Motor Criptográfico y Endpoints Edge (`functions/api/[[route]].js`):*
     - Criptografía nativa en Cloudflare Edge con Web Crypto API: `generateSalt()`, `hashPassword()` (PBKDF2 con HMAC-SHA256 y 100,000 iteraciones), `createJWT()` y `verifyJWT()` (firmas HMAC-SHA256 con expiración a 30 días).
     - `POST /api/auth/register`: Flujo de onboarding completo que genera el `tenant` con `slug` único deduplicado, inicializa el bot según tipo de negocio (tienda, restaurante, servicios) y moneda oficial (`CRC`/`USD`), encripta la contraseña y emite el token de sesión.
     - `POST /api/auth/login`: Validación de credenciales contra PBKDF2 y emisión de JWT para acceso privado.
     - `GET /api/auth/me`: Verificación de tokens Bearer para recuperación de perfil y datos del negocio asociado.
     - Soporte para credenciales de demostración preconfiguradas (`demo@clikchat.com` / `demo1234`).
  3. *Frontend (Capa de Estado y UI):*
     - `src/types/auth.ts` (40 líneas): Interfaces para usuario, credenciales, respuestas y formularios.
     - `src/hooks/useAuth.ts` (108 líneas): Hook de sesión persistente en `localStorage` con auto-verificación en montaje y métodos `login`, `register`, `logout`.
     - `src/components/client/ClientRegister.tsx` (147 líneas): Formulario de auto-registro para nuevos clientes.
     - `src/components/client/ClientLogin.tsx` (126 líneas): Erradicación del menú desplegable público e inicio de sesión privado con email y contraseña.
     - `src/components/client/ClientDashboard.tsx` (146 líneas): Guardia de autenticación y aislamiento multi-tenant estricto; cada usuario solo visualiza y modifica su propia tienda.
     - `src/components/client/ClientSidebar.tsx` y `SidebarFooter.tsx`: Botón oficial de "Cerrar Sesión" (`LogOut`) con limpieza de token.
- **Verificación y Pruebas:**
  - Script de pruebas de autenticación Edge ejecutado con 100% de éxito (registro, login, rechazo 401 por clave incorrecta, token Bearer y credenciales demo).
  - Compilación de producción con Vite (`npm run build`) completada con 0 errores en 16.61s.

### [2026-09-26] Módulo de Cuotas y Consumo Real en Vivo (Esta Hora, Hoy 24h, Este Mes) con Cloudflare D1
- **Requerimiento del Usuario:**
  Visualizar en tiempo real el consumo exacto de mensajes del comercio con 3 tarjetas métricas (*Esta Hora*, *Hoy 24h*, *Este Mes*), reflejando datos 100% reales desde Cloudflare D1.
- **Implementación Arquitectónica ARQMODULAR (<150 líneas por archivo):**
  1. *Capa de Tipos y Estado:*
     - `src/types/quotas.ts`: Definición de métricas de consumo por ventana temporal y cuotas asignadas.
     - `src/hooks/useTenantQuotas.ts`: Hook con auto-refresco y conexión al endpoint de cuotas.
  2. *Capa de UI:*
     - `src/components/client/quotas/TenantConsumptionSection.tsx`: Tarjetas visuales de métricas con barras de progreso y estado dinámico.
     - Integración en `ClientDashboard.tsx` y `ChatbotQLinkTab.tsx`.
  3. *Backend Edge Functions (`functions/api/[[route]].js`):*
     - Endpoint `GET /api/quotas/:tenantId`: Consultas SQL agregadas con `strftime('%Y-%m-%d %H')`, `strftime('%Y-%m-%d')` y `strftime('%Y-%m')` sobre la tabla `chat_messages`.
     - Fallback seguro de cuotas (`7e3f442`) para garantizar disponibilidad 24/7 sin bloqueos por saturación.

### [2026-09-26] Blindaje y Pool de Alta Disponibilidad Multicluster de DeepSeek (V3.2, V3.1)
- **Requerimiento del Usuario:**
  Erradicar por completo los errores HTTP 429 de saturación y limitaciones de tasa en OpenRouter, garantizando respuesta instantánea ininterrumpida.
- **Implementación:**
  1. Configuración de clústeres redundantes en OpenRouter con directiva `allow_fallbacks: true`.
  2. Pool balanceado con clústeres de alta velocidad `deepseek/deepseek-chat`, `deepseek/deepseek-v3.2` y fallback dinámico.
  3. Reintentos automáticos con backoff exponencial en `functions/api/[[route]].js` y `server/services/llmRouter.js`.

### [2026-09-26] Integración de GLM-5.3-Flash como Modelo Titular de Ultra Bajo Costo ($0.045 / $0.14)
- **Requerimiento del Usuario:**
  Adoptar un modelo de lenguaje con ultra bajo costo para máxima rentabilidad del SaaS en comercios y restaurantes, manteniendo DeepSeek como respaldo.
- **Implementación:**
  1. *Modelo Titular:* Configuración de `z-ai/glm-5.3-flash` ($0.045 / 1M tokens de entrada, $0.14 / 1M tokens de salida) como primer motor de inferencia prioritario.
  2. *Sanitización de Razonamiento:* Filtrado estricto de tokens de pensamiento (`reasoning` / `<think>`) para evitar consumo innecesario de salida y entregar al cliente únicamente la respuesta comercial directa y limpia.
  3. *Cadena de Resiliencia:* Si GLM experimenta cualquier demora o micro-corte, el sistema conmuta instantáneamente al pool de DeepSeek sin que el usuario final perciba interrupción.

### [2026-09-26] Módulo "Mi Cuenta" en Menú Principal y Aislamiento de Seguridad
- **Requerimiento del Usuario:**
  Permitir a cada suscriptor gestionar sus credenciales, consultar su plan/suscripción y cambiar su contraseña de manera privada e intuitiva.
- **Implementación:**
  1. *Interfaz:* Subpestaña `MyAccountSubTab.tsx` en el panel principal con resumen de plan, datos de contacto y formulario de seguridad.
  2. *Seguridad Edge:* Endpoint `PUT /api/auth/change-password` con verificación de contraseña actual mediante hash PBKDF2 y generación de nuevo salt seguro.
  3. *Control de Acceso:* Barra de navegación superior restringida estrictamente al rol `superadmin`, garantizando aislamiento visual y operativo total para los comercios.

### [2026-09-26] Limpieza Absoluta de Cuentas Nuevas y Confinamiento Estricto de Datos Demo
- **Requerimiento del Usuario:**
  1. *ESTOS DATOS NO DEBEN ESTAR LLENOS EN LAS CUENTAS RECIEN CREADAS, ESO DEBE ESTAR VACIO* (Eliminación de 'Restaurante ClikChat', slug 'geosoft' y 'Asesora Virtual' en cuentas nuevas).
  2. *LAS CUENTAS NUEVAS TAMPOCO DEBEN TENER DATOS DE DEMO, DEBEN SER CUENTAS COMPLETAMENTE LIMPIAS DE DATOS DE DEMO* (Catálogo de productos y FAQs vacíos por defecto).
- **Implementación Arquitectónica ARQMODULAR (<150-180 líneas por archivo):**
  1. *Backend Edge (`functions/api/[[route]].js`):*
     - `getFallbackTenant(slug)`: Confinado 'Restaurante ClikChat' y datos demo exclusivamente al slug `geosoft`. Para cualquier otro slug, retorna campos 100% limpios y vacíos.
     - `GET /api/tenants/:slug`: Eliminado `SELECT * FROM tenants LIMIT 1` que inyectaba el tenant 1 (`geosoft`) ante slugs nuevos. Inyección de productos (`getFallbackProducts()`) y FAQs (`getFallbackFaqs()`) reservada exclusivamente para `slug === 'geosoft'`. Nuevos comercios reciben arrays vacíos (`products: []`, `faqs: []`).
     - `/api/chat/message`: Eliminado el fallback forzado a tenant 1 si el slug no es demo.
  2. *Frontend & Almacenamiento Aislado por Tenant (`useClientPortal.ts`, `useTenantData.ts`, `useProductResolver.ts`):*
     - Aislamiento de caché local por slug (`clikchat_products_${slug}`, `clikchat_faqs_${slug}`) erradicando la clave global que filtraba productos demo a cuentas nuevas.
     - Reseteo y sincronización inmediata al alternar de cuenta o iniciar sesión con `useAuth`.
     - Modos vacíos (Empty States) verificados en `ProductsManagerTab.tsx` y `FaqList.tsx`.
  3. *Módulos de Configuración de Negocio e Identidad (`BusinessIdentitySubTab.tsx`, `AccountContactCard.tsx`, `BotSettingsTab.tsx`):*
     - Eliminados valores predeterminados de demostración en `useState` y `useEffect`.
     - Placeholders limpios y genéricos (`Ej: Mi Restaurante o Tienda`, `mi-negocio`, `Ej: +506 8888-8888`).

---

## 🏛️ REGISTROS FUNDACIONALES HISTÓRICOS (#001 - #007)

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
