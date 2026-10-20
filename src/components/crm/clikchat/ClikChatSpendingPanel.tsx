import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { useTenantAiSpending } from '../../../hooks/useTenantAiSpending';
import { SpendingKpiCards } from './SpendingKpiCards';
import { SpendingChatTable } from './SpendingChatTable';

interface Props {
  tenantId?: string;
  storeName?: string;
}

export const ClikChatSpendingPanel: React.FC<Props> = ({ tenantId }) => {
  const { spending, loading, refresh } = useTenantAiSpending(tenantId);

  const daily = spending?.daily || {
    neurons_today: 0,
    neurons_daily_limit: 10000,
    neurons_percentage: 0,
    cost_today_usd: 0,
    messages_today: 0,
    tokens_today: 0
  };

  const overall = spending?.overall || {
    total_cost_usd: 0,
    total_neurons: 0,
    total_tokens: 0,
    total_chats: 0,
    avg_cost_per_chat: 0,
    avg_neurons_per_chat: 0
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#0a1730] flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#0d5bff]" />
            <span>Panel de Consumo & Neuronas IA</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-mono font-semibold border border-indigo-100">
              Live Edge Telemetry
            </span>
          </h2>
          <p className="text-xs text-[#62728d] mt-0.5">
            Métricas de gasto por chat y monitoreo de cuota de Neuronas (Cloudflare Workers AI Llama 3.3) y OpenRouter (GLM-5.3-Flash).
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] text-xs font-semibold text-[#0a1730] hover:bg-[#edf2f9] transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#0d5bff] ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Actualizando...' : 'Refrescar'}</span>
        </button>
      </div>

      {/* KPI Cards & Model Breakdown */}
      <SpendingKpiCards
        daily={daily}
        overall={overall}
        llama={spending?.models_breakdown?.llama_3_3}
        glm={spending?.models_breakdown?.glm_flash}
      />

      {/* Tabla de Gasto por Chat */}
      <SpendingChatTable chats={spending?.recent_chats || []} />
    </div>
  );
};
