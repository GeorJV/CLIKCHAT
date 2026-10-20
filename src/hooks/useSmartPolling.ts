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
