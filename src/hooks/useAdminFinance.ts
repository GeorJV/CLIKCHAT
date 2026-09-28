import { useState, useEffect, useCallback } from 'react';
import { FinanceMetricsResponse } from '../types/adminFinance';
import { AiSpendingMetrics } from '../types/adminDirectory';

export function useAdminFinance() {
  const [financeMetrics, setFinanceMetrics] = useState<FinanceMetricsResponse | null>(null);
  const [aiMetrics, setAiMetrics] = useState<AiSpendingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinanceMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/finance-metrics');
      if (res.ok) {
        const data = await res.json();
        setFinanceMetrics(data);
      }
    } catch (err: any) {
      console.error('Error fetching finance metrics:', err);
    }
  }, []);

  const fetchAiMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ai-spending-metrics');
      if (res.ok) {
        const data = await res.json();
        setAiMetrics(data);
      }
    } catch (err: any) {
      console.error('Error fetching AI metrics:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchFinanceMetrics(), fetchAiMetrics()]);
    } catch (err: any) {
      setError(err?.message || 'Error al refrescar métricas');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFinanceMetrics, fetchAiMetrics]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    financeMetrics,
    aiMetrics,
    isLoading,
    error,
    refreshAll
  };
}
