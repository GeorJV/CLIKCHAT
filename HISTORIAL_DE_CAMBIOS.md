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
