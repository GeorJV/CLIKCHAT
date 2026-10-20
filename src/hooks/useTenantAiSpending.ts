import { useState, useEffect, useCallback } from 'react';
import { useSmartPolling } from './useSmartPolling';

export interface SpendingData {
  daily: {
    date: string;
    neurons_today: number;
    neurons_daily_limit: number;
    neurons_percentage: number;
    cost_today_usd: number;
    messages_today: number;
    tokens_today: number;
  };
  overall: {
    total_cost_usd: number;
    total_neurons: number;
    total_tokens: number;
    total_chats: number;
    avg_cost_per_chat: number;
    avg_neurons_per_chat: number;
  };
  models_breakdown: {
    llama_3_3: {
      name: string;
      modelId: string;
      neurons: number;
      cost_usd: number;
      messages: number;
      rate: string;
    };
    glm_flash: {
      name: string;
      modelId: string;
      tokens: number;
      cost_usd: number;
      messages: number;
      rate: string;
    };
  };
  recent_chats: Array<{
    sessionId: string;
    leadName?: string;
    costUsd: number;
    neurons: number;
    tokens: number;
    messagesCount: number;
    lastModel?: string;
    lastActivity?: string;
  }>;
}

export function useTenantAiSpending(tenantId?: string) {
  const [spending, setSpending] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpending = useCallback(async (isManual = false) => {
    if (!tenantId) return;
    if (isManual) setLoading(true);
    try {
      const res = await fetch(`/api/chat/spending/${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const json = await res.json();
        setSpending(json);
        setError(null);
      }
    } catch (e: any) {
      setError(e.message || 'Error cargando consumo');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchSpending(true);
  }, [fetchSpending]);

  // Polling inteligente cada 30 segundos, suspendido al 100% en pestañas inactivas
  useSmartPolling(() => {
    fetchSpending(false);
  }, {
    intervalMs: 30000,
    enabled: Boolean(tenantId),
    runImmediatelyOnFocus: true
  });

  return {
    spending,
    loading,
    error,
    refresh: () => fetchSpending(true)
  };
}
