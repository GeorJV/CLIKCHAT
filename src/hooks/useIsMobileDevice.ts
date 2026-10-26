import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el usuario está en celular (pantalla <= 768px, dispositivo táctil o UserAgent móvil).
 * Permite adaptar dinámicamente controles táctiles, tamaños de texto y botones nativos.
 */
export function useIsMobileDevice(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isSmall = window.innerWidth <= breakpoint;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isSmall || (isTouch && isMobileAgent);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      const isSmall = window.innerWidth <= breakpoint;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isSmall || (isTouch && isMobileAgent));
    };

    window.addEventListener('resize', check, { passive: true });
    window.addEventListener('orientationchange', check, { passive: true });
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, [breakpoint]);

  return isMobile;
}
