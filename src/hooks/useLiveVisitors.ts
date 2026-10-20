import { useState, useCallback } from 'react';
import { useSmartPolling } from './useSmartPolling';

export interface LiveVisitor {
  sessionId: string;
  tenantSlug: string;
  currentPath: string;
  activeProduct?: string;
  hasCart?: boolean;
  cartTotal?: number;
  secondsAgo: number;
}

export function useLiveVisitors(tenantSlug?: string) {
  const [activeCount, setActiveCount] = useState<number>(0);
  const [visitors, setVisitors] = useState<LiveVisitor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchActive = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = tenantSlug ? `/api/presence/active?tenant=${encodeURIComponent(tenantSlug)}` : '/api/presence/active';
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setActiveCount(data?.activeCount || 0);
      setVisitors(data?.visitors || []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [tenantSlug]);

  useSmartPolling(fetchActive, {
    intervalMs: 12000,
    enabled: true,
    runImmediatelyOnFocus: true,
  });

  return { activeCount, visitors, isLoading, refresh: fetchActive };
}
