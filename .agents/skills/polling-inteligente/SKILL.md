---
name: polling-inteligente
description: >-
  Estándar obligatorio de ahorro de cuota y polling inteligente (Anti-Drain Polling) para APIs y Serverless/Edge (Cloudflare Workers, Supabase, D1, Vercel). Prohíbe terminantemente temporizadores ciegos (setInterval) sin detección de visibilidad. Pausa automática en pestañas ocultas (document.hidden) e intervalos racionales para erradicar el consumo fantasma de peticiones.
---

# ⏱️ Skill: Polling Inteligente & Ahorro de Cuota Edge (`polling-inteligente`)

Esta habilidad define el protocolo técnico obligatorio para toda aplicación web que realice consultas periódicas (polling) hacia APIs o servicios Edge/Serverless (Cloudflare Workers, Pages Functions, Supabase, Neon, Vercel Functions).

Su objetivo es **erradicar el desperdicio de peticiones fantasma** que agota límites de cuota (como el límite de 100.000 peticiones diarias de Cloudflare Workers) cuando los usuarios dejan pestañas abiertas en segundo plano o durante la noche.

---

## 🛑 Las 5 Reglas Inmutables de Polling

### 1. Prohibición Absoluta de `setInterval` Ciego
Queda estrictamente prohibido colocar llamadas `fetch()` o peticiones de red dentro de un `setInterval` sin control de visibilidad de la pestaña. Un solo usuario con 2 pestañas abiertas en un temporizador de 5 segundos consume más de **34.000 peticiones al día** sin realizar ninguna acción.

### 2. Pausa Inmediata en Segundo Plano (`document.hidden`)
Si la pestaña del navegador pasa a estado oculto (`document.visibilityState === 'hidden'`, minimizado o cambio de pestaña), el temporizador de red **DEBE suspenderse de inmediato**. El consumo en segundo plano debe ser exactamente **0 peticiones**.

### 3. Reactivación y Refresco al Regresar al Foco
Cuando el usuario regresa a la pestaña (`visibilitychange` a `visible` o evento `focus`), el sistema:
- Ejecuta una actualización inmediata para que el usuario vea datos frescos al instante.
- Reinicia el temporizador de sondeo periódico.

### 4. Intervalos Racionales por Tipo de Recurso
No todos los datos requieren la misma frecuencia. Se aplican los siguientes intervalos mínimos:
- **Chats activos en pantalla (en foco del usuario):** 10s – 12s.
- **Listados de fondo (inbox, lista de sesiones, notificaciones):** 15s – 25s.
- **Métricas de negocio, perfiles, catálogos o cuotas de uso:** 30s – 60s.

### 5. Limpieza Obligatoria de Eventos y Temporizadores
Todo hook o componente que implemente sondeo periódico debe limpiar tanto el intervalo (`clearInterval`) como los listeners (`removeEventListener('visibilitychange')`, `removeEventListener('focus')`) al desmontarse para prevenir fugas de memoria (memory leaks).

---

## 🛠️ Implementación Estándar Canónica en React: `useSmartPolling`

Todo proyecto web debe contar con este hook estándar reutilizable:

```typescript
import { useEffect, useRef } from 'react';

interface SmartPollingOptions {
  intervalMs: number;
  enabled?: boolean;
  runImmediatelyOnFocus?: boolean;
}

/**
 * Hook de Polling Inteligente con Ahorro de Cuota Edge:
 * - Pausa instantánea de peticiones cuando la pestaña está en segundo plano (document.hidden).
 * - Reactivación inmediata con refresh opcional al re-enfocar la ventana.
 * - Limpieza segura de temporizadores y listeners en desmontaje.
 */
export function useSmartPolling(
  callback: () => void | Promise<void>,
  { intervalMs, enabled = true, runImmediatelyOnFocus = true }: SmartPollingOptions
) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (!enabled || intervalMs <= 0) return;

    let timerId: ReturnType<typeof setInterval> | null = null;

    const startTimer = () => {
      if (timerId === null && typeof document !== 'undefined' && !document.hidden) {
        timerId = setInterval(() => {
          if (!document.hidden) {
            savedCallback.current();
          }
        }, intervalMs);
      }
    };

    const stopTimer = () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        if (runImmediatelyOnFocus) {
          savedCallback.current();
        }
        startTimer();
      }
    };

    // Iniciar solo si la pestaña está visible
    if (typeof document !== 'undefined' && !document.hidden) {
      startTimer();
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);
    }

    return () => {
      stopTimer();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      }
    };
  }, [intervalMs, enabled, runImmediatelyOnFocus]);
}
```

---

## 📋 Checklist de Auditoría en Todo Proyecto
- [ ] ¿Hay algún `setInterval` llamando a `/api/*` o endpoints externos?
- [ ] ¿Se pausa la ejecución cuando `document.hidden === true`?
- [ ] ¿El intervalo es mayor o igual a 10 segundos?
- [ ] ¿Se reanuda y refresca al enfocar la pestaña?
- [ ] ¿Se remueven los listeners en la función de limpieza de `useEffect`?
