import { useState, useEffect, useCallback } from 'react';

interface UseExitIntentOptions {
  inactivityMs?: number;
  disabled?: boolean;
}

export function useExitIntent({ inactivityMs = 35000, disabled = false }: UseExitIntentOptions = {}) {
  const [showExitIntent, setShowExitIntent] = useState(false);

  const trigger = useCallback(() => {
    if (disabled) return;
    const hasTriggered = sessionStorage.getItem('clikchat_exit_triggered');
    if (!hasTriggered) {
      sessionStorage.setItem('clikchat_exit_triggered', 'true');
      setShowExitIntent(true);
    }
  }, [disabled]);

  const dismissExitIntent = useCallback(() => {
    setShowExitIntent(false);
  }, []);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    // 1. Mouseleave detector (moving cursor towards tab bar)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 12) {
        trigger();
      }
    };

    // 2. Inactivity timer
    let timer = setTimeout(trigger, inactivityMs);
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(trigger, inactivityMs);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetTimer));
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, inactivityMs, trigger]);

  return { showExitIntent, dismissExitIntent };
}
