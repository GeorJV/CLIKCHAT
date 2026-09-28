import React from 'react';
import { SaasFinancialMetrics } from '../../../types/adminFinance';

interface Props {
  saasMetrics?: SaasFinancialMetrics;
}

export const SaasKpiCards: React.FC<Props> = ({ saasMetrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-400 block">MRR (Mensual Recurrente)</span>
        <p className="text-xl font-black text-emerald-400 font-mono">
          ${(saasMetrics?.mrr || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mes</span>
        </p>
      </div>

      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-400 block">ARR (Anual Recurrente)</span>
        <p className="text-xl font-black text-blue-400 font-mono">
          ${(saasMetrics?.arr || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/año</span>
        </p>
      </div>

      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-400 block">Ingresos Históricos</span>
        <p className="text-xl font-black text-white font-mono">
          ${(saasMetrics?.totalHistoricalIncome || 0).toLocaleString()}
        </p>
      </div>

      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1">
        <span className="text-[10px] font-bold uppercase text-slate-400 block">Suscripciones Activas</span>
        <p className="text-xl font-black text-indigo-400 font-mono">
          {saasMetrics?.totalActiveSubscriptions || 0} <span className="text-xs text-slate-400 font-normal">Negocios</span>
        </p>
      </div>
    </div>
  );
};
