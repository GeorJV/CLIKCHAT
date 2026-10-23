import React, { useState } from 'react';
import { VoceroLead } from '../../../types/crm';
import { Product } from '../../../types';
import { BarChart3, TrendingUp, MousePointerClick } from 'lucide-react';
import { VoceroCommercialOverview } from './VoceroCommercialOverview';
import { VoceroClickPerformanceReport } from './VoceroClickPerformanceReport';

interface VoceroResultsViewProps {
  leads: VoceroLead[];
  tenantSlug: string;
  currency?: string;
  products?: Product[];
  onTrackProductEvent?: (productId: string, event: string) => void;
}

export const VoceroResultsView: React.FC<VoceroResultsViewProps> = ({
  leads,
  tenantSlug,
  currency = 'CRC',
  products = [],
  onTrackProductEvent
}) => {
  const [subTab, setSubTab] = useState<'commercial' | 'clicks'>('clicks');

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <BarChart3 className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1730] truncate">
            Resultados & Métricas
          </h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">Métricas en Tiempo Real</span>
        </div>

        {/* Selector de Subpestañas */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab('clicks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              subTab === 'clicks' ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
            }`}
          >
            <MousePointerClick className="h-3.5 w-3.5" />
            <span>Clics & Rendimiento</span>
            <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.2 text-[9px] text-white font-bold animate-pulse">
              En Vivo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('commercial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              subTab === 'commercial' ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d] hover:text-[#0a1730]'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Resumen Comercial</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto">
        {subTab === 'clicks' ? (
          <VoceroClickPerformanceReport
            products={products}
            currency={currency}
            onSimulateEvent={onTrackProductEvent}
          />
        ) : (
          <VoceroCommercialOverview
            leads={leads}
            tenantSlug={tenantSlug}
            currency={currency}
          />
        )}
      </main>
    </div>
  );
};
