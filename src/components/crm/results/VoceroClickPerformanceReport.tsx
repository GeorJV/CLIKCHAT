import React, { useState } from 'react';
import { Product } from '../../../types';
import { MousePointerClick, Eye, MessageSquare, ShoppingCart, XCircle, CreditCard, Undo2, FileText } from 'lucide-react';
import { VoceroProductMetricsTable } from './VoceroProductMetricsTable';

interface VoceroClickPerformanceReportProps {
  products: Product[];
  currency?: string;
  onSimulateEvent?: (productId: string, event: string) => void;
}

export const VoceroClickPerformanceReport: React.FC<VoceroClickPerformanceReportProps> = ({
  products, currency = 'CRC', onSimulateEvent
}) => {
  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<'all' | 'high_demand' | 'abandoned'>('all');

  const totals = products.reduce((acc, p) => {
    const m = p.metrics || ({} as any);
    return {
      views: acc.views + (Number(m.views) || 0),
      photos: acc.photos + (Number(m.photoViews) || 0),
      chats: acc.chats + (Number(m.chatInteractions) || 0),
      details: acc.details + (Number(m.detailViews) || 0),
      added: acc.added + (Number(m.addedToCart) || 0),
      notAdded: acc.notAdded + (Number(m.notAdded) || 0),
      buys: acc.buys + (Number(m.buyClicks) || 0),
      removed: acc.removed + (Number(m.removedFromCart) || 0),
    };
  }, { views: 0, photos: 0, chats: 0, details: 0, added: 0, notAdded: 0, buys: 0, removed: 0 });

  const filteredProducts = products.filter(p => {
    const m = p.metrics || ({} as any);
    if (activeFilter === 'high_demand') return (m.buyClicks || 0) > 0 || (m.addedToCart || 0) > 0;
    if (activeFilter === 'abandoned') return (m.removedFromCart || 0) > 0;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Banner de Telemetría en Vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-[#0a1730]">Telemetría en Vivo: Clics y Rendimiento</h3>
            <span className="vocero-kicker text-emerald-600 bg-emerald-50 border border-emerald-200">8 Métricas Activas</span>
          </div>
          <p className="text-xs text-[#62728d] mt-1">
            Análisis de comportamiento en tiempo real: fotos, chats IA, detalle de producto, compras y abandonos.
          </p>
        </div>

        {products.length > 0 && onSimulateEvent && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-[#f8fafc] p-2 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] font-bold text-[#62728d] mr-1">Simular:</span>
            <button onClick={() => onSimulateEvent(selectedProdId || products[0].id, 'buy_click')} className="px-2 py-1 rounded bg-[#0d5bff] text-white text-[10px] font-bold hover:bg-[#0047e1] transition cursor-pointer">+1 Comprar</button>
            <button onClick={() => onSimulateEvent(selectedProdId || products[0].id, 'detail_view')} className="px-2 py-1 rounded bg-teal-600 text-white text-[10px] font-bold hover:bg-teal-700 transition cursor-pointer">+1 Detalle</button>
            <button onClick={() => onSimulateEvent(selectedProdId || products[0].id, 'photo_view')} className="px-2 py-1 rounded bg-purple-600 text-white text-[10px] font-bold hover:bg-purple-700 transition cursor-pointer">+1 Foto</button>
            <button onClick={() => onSimulateEvent(selectedProdId || products[0].id, 'added_to_cart')} className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition cursor-pointer">+1 Agregó</button>
            <button onClick={() => onSimulateEvent(selectedProdId || products[0].id, 'removed_from_cart')} className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition cursor-pointer">+1 Quitado</button>
          </div>
        )}
      </div>

      {/* Grid de las 8 Métricas Principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Clic Producto</span>
            <MousePointerClick className="h-3.5 w-3.5 text-[#0d5bff]" />
          </div>
          <p className="text-xl font-bold text-[#0a1730]">{totals.views}</p>
          <p className="text-[10px] text-[#62728d] mt-0.5">Vistas totales</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Vio la Foto</span>
            <Eye className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-[#0a1730]">{totals.photos}</p>
          <p className="text-[10px] text-purple-600 font-medium mt-0.5">{totals.views > 0 ? Math.round((totals.photos / totals.views) * 100) : 0}% vistas</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Chat IA</span>
            <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-[#0a1730]">{totals.chats}</p>
          <p className="text-[10px] text-[#62728d] mt-0.5">Consultas</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Vio Detalle</span>
            <FileText className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <p className="text-xl font-bold text-teal-600">{totals.details}</p>
          <p className="text-[10px] text-teal-700 font-medium mt-0.5">Detalles</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Lo Agregó</span>
            <ShoppingCart className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-600">{totals.added}</p>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Comanda</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">No Agregó</span>
            <XCircle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600">{totals.notAdded}</p>
          <p className="text-[10px] text-[#62728d] mt-0.5">Descartados</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Clic Comprar</span>
            <CreditCard className="h-3.5 w-3.5 text-[#0d5bff]" />
          </div>
          <p className="text-xl font-bold text-[#0d5bff]">{totals.buys}</p>
          <p className="text-[10px] text-[#0d5bff] font-medium mt-0.5">Checkout</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#8391aa] mb-1">
            <span className="text-[11px] font-semibold">Compró y Quitó</span>
            <Undo2 className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <p className="text-xl font-bold text-rose-600">{totals.removed}</p>
          <p className="text-[10px] text-rose-600 font-medium mt-0.5">Abandonos</p>
        </div>
      </div>

      {/* Tabla Desglosada */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-[#0a1730]">Desglose por Producto / Menú ({filteredProducts.length})</h3>
          <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl text-[11px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${activeFilter === 'all' ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#62728d]'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('high_demand')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${activeFilter === 'high_demand' ? 'bg-white text-emerald-600 shadow-xs' : 'text-[#62728d]'}`}
            >
              Alta Demanda
            </button>
            <button
              onClick={() => setActiveFilter('abandoned')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${activeFilter === 'abandoned' ? 'bg-white text-rose-600 shadow-xs' : 'text-[#62728d]'}`}
            >
              Abandonos
            </button>
          </div>
        </div>

        <VoceroProductMetricsTable
          products={filteredProducts}
          currency={currency}
          selectedProdId={selectedProdId}
          onSelectProdId={setSelectedProdId}
        />
      </div>
    </div>
  );
};
