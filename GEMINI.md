# Reglas del Proyecto: ClikchatWeb

Este repositorio cuenta con el estándar **ARQMODULAR**, la Skill **arqai-setup** y la regla de oro de **Memoria Protegida**.

## 🛑 Protocolo Obligatorio para Todo Chat / Sesión:
1. **Lectura Inmediata de Contexto (Ahorro de Tokens)**: Al abrir CUALQUIER chat nuevo, el asistente DEBE leer primero `CONTEXTO_PROYECTO.md` para conocer el estado actual y continuar de inmediato sin pedirle contexto al usuario.
2. **Consulta Previa del Historial**: ANTES de realizar cualquier edición o propuesta de código, todo chat/asistente DEBE leer el archivo `HISTORIAL_DE_CAMBIOS_CLIKCHAT.md`.
3. **Protección Absoluta de Lo Ya Funcionando**: Queda estrictamente PROHIBIDO modificar, refactorizar sin permiso, revertir o romper cualquier funcionalidad registrada en el historial o en `lockedFiles` de `.arqai.json`.
4. **Registro por Confirmación**: Solo agregar nuevas entradas a dicho historial cuando el usuario indique explícitamente *"Agrégalo al historial de cambios"*.
5. **Actualización Obligatoria de `CONTEXTO_PROYECTO.md` por Tarea Completada**: Tras finalizar y verificar una tarea, actualizar `CONTEXTO_PROYECTO.md` con el estado final (máximo 25 líneas).
6. **Alerta Proactiva de Límite de 40.000 Tokens**: Si la sesión de chat acumula aproximadamente 40.000 tokens (o ~15 a 18 turnos de trabajo intenso), la IA DEBE incluir al final de su mensaje la recomendación de rotar chat.
7. **Sincronización Automática con ARQ AI Studio (Autónoma)**:
   - Al iniciar sesión y tras completar cualquier cambio o tarea:
     - Leer `.arqai.json`.
     - **Estado Obligatorio:** Pasar tareas a `status: "ready_for_review"`. **PROHIBIDO** marcar como `"completed"` o `"done"`.
     - **Notificación en Pantalla Obligatoria:** Invocar `POST https://arqaistudio.pages.dev/api/agent/notify-user` con `{ title, message, agentName, type: "task_completed", projectId }`.
     - Entregar obligatoriamente las dos URLs: `gitUrl` (Git commit/repo) y `workUrl` (URL del proyecto web en vivo).
