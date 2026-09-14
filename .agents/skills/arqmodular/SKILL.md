# 🏛️ ARQMODULAR: Estándar Universal de Modularidad, Arquitectura Limpia y Eficiencia con IA

Este documento define la arquitectura y las reglas de diseño modular que **todo asistente de Inteligencia Artificial y desarrollador DEBE cumplir estrictamente** en este proyecto.

---

## 🎯 Objetivo Fundamental
1. **Ahorro Extremo de Tokens:** Evitar la lectura o reescritura de archivos gigantes; trabajar en bloques de menos de 150 líneas reduce el consumo de tokens por turno a una fracción mínima.
2. **Cero Regresiones / A prueba de fallos:** Al aislar cada componente en su propio archivo, editar un botón o modal NUNCA romperá otra sección del sistema.
3. **Escalabilidad y Lectura Rápida:** Código limpio, tipado estricto y separación clara entre datos visuales y llamadas de red.

---

## 🧱 Las 6 Reglas de Oro de ARQMODULAR

### 1. Regla de los 150–200 Renglones (Componentes Atómicos)
- **Ningún archivo de vista (UI/JSX) debe superar las 150–200 líneas de código.**
- Los archivos de rutas (`page.tsx`) son **orquestadores delgados**:
  - Su única función es verificar la sesión/guard, gestionar el layout general e importar los submódulos.
  - La lógica y el markup de cada sección viven en su propio componente.
- **Estructura jerárquica obligatoria:**
  ```text
  src/
  ├── app/dashboard/page.tsx                # Orquestador (< 100 líneas)
  ├── components/dashboard/
  │   ├── SidebarNav.tsx                   # Navegación lateral (< 120 líneas)
  │   ├── CatalogSection.tsx               # Vista de productos (< 150 líneas)
  │   ├── ServicesSection.tsx              # Vista de servicios (< 150 líneas)
  │   ├── FunnelSection.tsx                # Vista de embudos (< 150 líneas)
  │   ├── ChatSimulator.tsx                # Simulador WhatsApp (< 180 líneas)
  │   └── modals/
  │       ├── ProductModal.tsx             # Modal alta/edición (< 120 líneas)
  │       ├── ServiceModal.tsx             # Modal servicios (< 120 líneas)
  │       └── UserProfileModal.tsx         # Modal perfil (< 120 líneas)
  ```

### 2. Separación Estricta de las 3 Capas
Queda estrictamente prohibido mezclar llamadas de red, estado complejo y diseño visual en un solo bloque:
1. **Capa de Tipos (`types/`):** Todos los contratos de datos (interfaces y schemas) se declaran en archivos independientes (ej. `types/catalog.ts`, `types/auth.ts`). **Prohibido usar `any`**.
2. **Capa de Lógica y Datos (`hooks/` o `services/`):** Las llamadas a la API/D1, validaciones y queries viven en Custom Hooks (ej. `hooks/useCatalog.ts`, `hooks/useAuthGuard.ts`).
3. **Capa de Presentación (`components/`):** Los componentes solo reciben datos por props o mediante su hook correspondiente y renderizan Tailwind CSS limpio.

### 3. Aislamiento Quirúrgico (Cero Efectos Secundarios)
- Si una instrucción pide: *"Cambia el texto o botón del modal de productos"*, la IA tiene **prohibido leer o reescribir otros componentes**.
- La IA solo debe cargar y modificar `ProductModal.tsx`.
- Esto reduce el consumo de tokens a menos de 400 tokens por turno y asegura que el resto del dashboard permanezca intacto.

### 4. Regla del Boy Scout para Proyectos o Archivos Existentes
Cuando se trabaje en un archivo monolítico existente (ej. un `page.tsx` de 1.000+ líneas):
- **Queda prohibido seguir engordando el archivo gigante:** No se permite agregar nuevas funcionalidades dentro de un monolito.
- **Extracción modular previa:** Antes de modificar o añadir código a una sección de un monolito, la IA debe extraer esa sección a su propio archivo atómico en `components/` y dejar en el orquestador solo la etiqueta `<NombreComponente />`.
- De esta manera, el código existente se moderniza de forma progresiva y segura sin interrupciones.

### 5. Datos Limpios y Estado Único (Single Source of Truth)
- **Cero datos simulados fijos (mockups hardcodeados):** Todo usuario nuevo que inicia sesión debe recibir un entorno limpio con métricas en cero.
- **Empty States Obligatorios:** Toda lista, tabla o embudo debe tener un estado vacío elegante cuando no existan registros (`productosList.length === 0`).
- **Autenticación Blindada:** Las rutas privadas deben validar activamente la sesión en Cloudflare D1 antes de mostrar datos privados.

### 6. Integración con RAG (ARQ AI Studio)
- Los archivos modulares pequeños (50–150 líneas) generan vectores semánticos de alta fidelidad en `https://arqaistudio.pages.dev`.
- La IA debe utilizar las búsquedas semánticas del RAG para localizar exactamente el archivo atómico a editar, en lugar de escanear directorios completos.

### 7. Tríada de Agentes para Máxima Eficiencia y Calidad
Para proteger la ventana de tokens y garantizar código moderno y estético:
- **Arquitecto Líder (Ventana Principal):** Modelo activo con pensamiento `High` (`gemini-3.8-flash-high` / `3.1-pro-high`); orquesta, analiza requisitos y valida builds.
- **Rastreador Veloz (Subagente Scout):** Modelo `flash` para explorar repositorios y leer documentación a máxima velocidad sin ensuciar el chat principal.
- **Constructor Asistente (Subagente Builder):** Modelo `inherit` con pensamiento `High` para escribir código limpio, tipado estricto y componentes UI modernos con Tailwind.

### 8. Memoria Protegida Universal (Historial de Cambios Aprobados)
- **Inmutabilidad de lo Aprobado:** Todo proyecto debe contar con un archivo `HISTORIAL_DE_CAMBIOS.md` (o `HISTORIAL_DE_CAMBIOS_<PROYECTO>.md`).
- **Prohibido Volver Atrás:** La IA tiene **ESTRICTAMENTE PROHIBIDO** alterar, revertir o borrar funcionalidades registradas en el historial.
- **Construcción Siempre Hacia Adelante:** La web se construye añadiendo nuevos componentes atómicos sin romper ni rehacer lo que ya fue probado y aprobado.
- **Registro por Aprobación:** Solo el usuario puede ordenar incluir nuevas funciones mediante *"Agrégalo al historial de cambios"*.

---

## ⚡ Comandos y Disparadores en el Chat

- **Modo Automático:** Este estándar está activo por defecto en cada sesión.
- **Comando de Refuerzo:** Si el usuario escribe `"arqmodular"` o `"trabaja en arqmodular"`, la IA confirmará inmediatamente que sus próximas acciones respetarán los límites de 150 líneas, la separación de hooks y los componentes atómicos.
- **Ampliación del Estándar:** Cuando el usuario indique `"Agrégalo a arqmodular"`, la IA actualizará este archivo registrando la nueva buena práctica o regla técnica acordada.
