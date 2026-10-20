import { useEffect } from 'react';
import { useSmartPolling } from './useSmartPolling';

interface LivePresenceOptions {
  tenantSlug: string;
  sessionId?: string;
  currentPath?: string;
  activeProduct?: string;
  hasCart?: boolean;
  cartTotal?: number;
  disabled?: boolean;
}

export function useLivePresencePing({
  tenantSlug,
  sessionId,
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/',
  activeProduct = '',
  hasCart = false,
  cartTotal = 0,
  disabled = false,
}: LivePresenceOptions) {
  const sendPing = async () => {
    if (disabled || typeof window === 'undefined') return;
    try {
      const actualSession = sessionId || localStorage.getItem('clikchat_session_id') || 'anon_' + Math.random().toString(36).substring(2, 9);
      if (!sessionId && !localStorage.getItem('clikchat_session_id')) {
        localStorage.setItem('clikchat_session_id', actualSession);
      }
      await fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: actualSession,
          tenantSlug,
          currentPath,
          activeProduct,
          hasCart,
          cartTotal,
        }),
      });
    } catch {}
  };

  useEffect(() => {
    sendPing();
  }, [tenantSlug, activeProduct, hasCart]);

  useSmartPolling(sendPing, {
    intervalMs: 25000,
    enabled: !disabled,
    runImmediatelyOnFocus: true,
  });
}
