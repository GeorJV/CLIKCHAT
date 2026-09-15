import React from 'react';
import { Share2, Activity, PieChart } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  colorClass: string;
}

interface ProductsGlobalMetricsProps {
  metrics?: {
    buyClicks?: number;
    descriptionViews?: number;
    benefitViews?: number;
    storeViews?: number;
    totalEvents?: number;
  };
}

export const ProductsGlobalMetrics: React.FC<ProductsGlobalMetricsProps> = ({ metrics }) => {
  const buyClicks = metrics?.buyClicks ?? 0;
  const descViews = metrics?.descriptionViews ?? 0;
  const benefitViews = metrics?.benefitViews ?? 0;
  const storeViews = metrics?.storeViews ?? 0;
  const totalEvents = metrics?.totalEvents ?? 0;

  const kpis: MetricItem[] = [
    { label: 'CLICS "COMPRAR"', value: `${buyClicks} Clics`, colorClass: 'text-teal-400' },
    { label: 'VISTAS DESCRIPCIÓN', value: `${descViews} Vistas`, colorClass: 'text-sky-400' },
    { label: 'VISTAS BENEFICIOS', value: `${benefitViews} Vistas`, colorClass: 'text-purple-400' },
    { label: 'VISTAS TIENDA', value: `${storeViews} Visitas`, colorClass: 'text-amber-400' },
    { label: 'TOTAL EVENTOS', value: `${totalEvents} Eventos`, colorClass: 'text-rose-400' }
  ];

  return (
    <div className="onyx-card rounded-xl p-2.5 sm:p-3 shadow-md space-y-2">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <PieChart className="w-3 h-3" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-tight">
            Métricas & Analítica Global
          </h3>
        </div>

        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>Métricas En Vivo</span>
        </div>
      </div>

      {/* 5 KPI Metric Cards en fila compacta */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="onyx-surface rounded-lg px-2.5 py-1.5 flex flex-col justify-center border border-white/[0.04]"
          >
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-slate-400 uppercase truncate">
              {kpi.label}
            </span>
            <span className={`text-xs sm:text-sm font-bold mt-0.5 ${kpi.colorClass}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Info Banner */}
      <div className="border-t border-slate-800/60 pt-1.5 flex items-center space-x-1.5 text-[11px]">
        <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <p className="text-slate-300 text-[11px] leading-tight truncate">
          <strong className="text-teal-400 font-semibold">Venta Especializada:</strong>{' '}
          La IA mide la temperatura del cliente:{' '}
          <span className="text-sky-400 font-medium">Frío ❄️</span>,{' '}
          <span className="text-amber-300 font-medium">Tibio 🍧</span> o{' '}
          <span className="text-rose-400 font-medium">Caliente 🔥</span>.
        </p>
      </div>
    </div>
  );
};
