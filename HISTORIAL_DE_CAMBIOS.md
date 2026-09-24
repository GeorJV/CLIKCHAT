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
- **Cumplimiento de Estándares:** Arquitectura 100% modular (<150 líneas por archivo en `src/components/landing/`) y verificación de despliegue en Cloudflare Pages.



