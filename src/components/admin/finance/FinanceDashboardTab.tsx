import React from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useAdminFinance } from '../../../hooks/useAdminFinance';
import { CashFlowProjections } from './CashFlowProjections';
import { SaasKpiCards } from './SaasKpiCards';
import { CategoryBreakdownTable } from './CategoryBreakdownTable';
import { AiSpendingCard } from '../directory/AiSpendingCard';

export const FinanceDashboardTab: React.FC = () => {
  const { financeMetrics, aiMetrics, isLoading, refreshAll } = useAdminFinance();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Inteligencia Financiera & Proyector de Flujo de Caja
            </h2>
            <p className="text-xs text-slate-400">
              Proyección de cobros, recurrencia MRR/ARR y telemetría de costos IA en vivo
            </p>
          </div>
        </div>

        <button
          onClick={refreshAll}
          disabled={isLoading}
          className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
          title="Refrescar métricas financieras"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Flujo de Caja */}
      <CashFlowProjections cashFlow={financeMetrics?.cashFlow} />

      {/* KPIs SaaS */}
      <SaasKpiCards saasMetrics={financeMetrics?.saasMetrics} />

      {/* Telemetría Real de IA (GLM 5.3 Flash + GPT-4o) */}
      <AiSpendingCard metrics={aiMetrics} />

      {/* Desglose por Industrias */}
      <CategoryBreakdownTable categories={financeMetrics?.categories} />
    </div>
  );
};
