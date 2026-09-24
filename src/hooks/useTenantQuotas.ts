import { useState, useEffect, useCallback } from 'react';
import { TenantQuotasResponse, TenantQuotas } from '../types/quotas';

const DEFAULT_QUOTAS: TenantQuotas = {
  hourly: { limit: 1000, used: 0, remaining: 1000, percentage: 0 },
  daily: { limit: 10000, used: 0, remaining: 10000, percentage: 0 },
  monthly: { limit: 100000, used: 0, remaining: 100000, percentage: 0 }
};

interface UseTenantQuotasProps {
  tenantId?: string;
  autoRefreshIntervalMs?: number;
}

export function useTenantQuotas({ tenantId, autoRefreshIntervalMs = 10000 }: UseTenantQuotasProps) {
  const [quotasData, setQuotasData] = useState<TenantQuotasResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuotas = useCallback(async (isManualRefresh = false) => {
    if (!tenantId) return;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else if (!quotasData) {
      setIsLoading(true);
    }

    try {
      // Intentar endpoint de cuotas específico
      const res = await fetch(`/api/quotas/${tenantId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json() as TenantQuotasResponse;
        if (data && data.quotas) {
          setQuotasData(data);
          setLastUpdated(new Date());
          return;
        }
      }

      // Fallback a tenant-metrics si el backend aún no expone /api/quotas
      const metricsRes = await fetch(`/api/chat/tenant-metrics/${tenantId}`, { cache: 'no-store' });
      if (metricsRes.ok) {
        const data = await metricsRes.json();
        if (data && data.quotas) {
          setQuotasData({
            success: true,
            tenantId,
            quotas: data.quotas,
            updatedAt: new Date().toISOString()
          });
          setLastUpdated(new Date());
        }
      }
    } catch (e) {
      console.warn('Sincronización silenciosa de cuotas:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [tenantId, quotasData]);

  useEffect(() => {
    if (!tenantId) return;
    fetchQuotas(false);

    const intervalId = setInterval(() => {
      fetchQuotas(false);
    }, autoRefreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [tenantId, autoRefreshIntervalMs, fetchQuotas]);

  return {
    quotasData: quotasData?.quotas || DEFAULT_QUOTAS,
    rawResponse: quotasData,
    isLoading,
    isRefreshing,
    lastUpdated,
    refresh: () => fetchQuotas(true)
  };
}
