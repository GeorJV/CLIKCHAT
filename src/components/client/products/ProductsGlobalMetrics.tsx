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
  const buyClicks = metrics?.buyClicks ?? 8;
  const descViews = metrics?.descriptionViews ?? 194;
  const benefitViews = metrics?.benefitViews ?? 73;
  const storeViews = metrics?.storeViews ?? 15;
  const totalEvents = metrics?.totalEvents ?? 286;

  const kpis: MetricItem[] = [
    { label: 'CLICS "COMPRAR AHORA"', value: `${buyClicks} Clics`, colorClass: 'text-teal-400' },
    { label: 'VISTAS DESCRIPCIÓN', value: `${descViews} Vistas`, colorClass: 'text-sky-400' },
    { label: 'VISTAS BENEFICIOS', value: `${benefitViews} Vistas`, colorClass: 'text-purple-400' },
    { label: 'VISTAS A LA TIENDA', value: `${storeViews} Visitas`, colorClass: 'text-amber-400' },
    { label: 'TOTAL INTERACCIONES', value: `${totalEvents} Eventos`, colorClass: 'text-rose-400' }
  ];

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <PieChart className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>📊 Métricas & Analítica Global</span>
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Métricas En Vivo</span>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="onyx-surface rounded-xl p-3 flex flex-col justify-between"
          >
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {kpi.label}
            </span>
            <span className={`text-base sm:text-lg font-black mt-1 ${kpi.colorClass}`}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Info Banner */}
      <div className="border-t border-teal-900/40 pt-3 flex items-start sm:items-center space-x-2 text-xs">
        <Share2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-slate-300 leading-relaxed text-xs">
          <strong className="text-teal-400 font-bold">Venta Especializada por Producto:</strong>{' '}
          Al compartir el QLink de cualquier producto, la IA asesora directamente al cliente y mide su temperatura:{' '}
          <span className="text-sky-400 font-semibold">Frío ❄️</span>,{' '}
          <span className="text-amber-300 font-semibold">Tibio 🍧</span> o{' '}
          <span className="text-rose-500 font-semibold">Caliente 🔥</span>.
        </p>
      </div>
    </div>
  );
};
