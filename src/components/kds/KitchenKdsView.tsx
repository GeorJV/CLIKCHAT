import React, { useState, useEffect } from 'react';
import { useKitchenKds } from './useKitchenKds';
import { KdsTicketCard } from './KdsTicketCard';
import { UtensilsCrossed, Bell, Clock, RefreshCw, Flame, CheckCircle2, Truck } from 'lucide-react';

interface Props {
  tenantSlug?: string;
  storeName?: string;
}

export const KitchenKdsView: React.FC<Props> = ({ tenantSlug = 'comida-callejera-xl', storeName = 'Cocina Principal' }) => {
  const { tickets, updateTicketStatus, toggleItemPrepared } = useKitchenKds(tenantSlug);
  const [filterType, setFilterType] = useState<'all' | 'delivery' | 'takeaway' | 'dine_in'>('all');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = tickets.filter(
    (t) => (filterType === 'all' || t.orderType === filterType) && t.status !== 'dispatched'
  );

  const queued = filteredTickets.filter((t) => t.status === 'queued');
  const cooking = filteredTickets.filter((t) => t.status === 'cooking');
  const ready = filteredTickets.filter((t) => t.status === 'ready');

  return (
    <div className="flex flex-col h-full w-full bg-[#121214] text-slate-100 font-sans select-none overflow-hidden">
      {/* Topbar KDS de Cocina */}
      <header className="h-14 shrink-0 bg-[#18181c] border-b border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#ff5416] flex items-center justify-center text-white shadow-md shadow-[#ff5416]/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>Comandas de Cocina (KDS)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {storeName}
              </span>
            </h1>
          </div>
        </div>

        {/* Reloj en Vivo & Filtros */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-zinc-800 text-xs">
            {(['all', 'delivery', 'takeaway', 'dine_in'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  filterType === ft ? 'bg-[#ff5416] text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ft === 'all' ? 'Todas' : ft === 'delivery' ? 'Express' : ft === 'takeaway' ? 'Retiro' : 'Mesa'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm font-black bg-[#121214] border border-zinc-800 px-3 py-1 rounded-xl text-amber-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{currentTime || '00:00:00'}</span>
          </div>
        </div>
      </header>

      {/* Columnas KDS de Alto Rendimiento */}
      <main className="flex-1 overflow-x-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[850px]">
        {/* Columna 1: En Cola */}
        <div className="flex flex-col bg-[#161619] border border-zinc-800 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>En Cola (Nuevas)</span>
            </div>
            <span className="font-mono text-xs font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {queued.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {queued.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-12">No hay comandas en cola</p>
            ) : (
              queued.map((t) => (
                <KdsTicketCard key={t.id} ticket={t} onUpdateStatus={updateTicketStatus} onToggleItem={toggleItemPrepared} />
              ))
            )}
          </div>
        </div>

        {/* Columna 2: En Cocción */}
        <div className="flex flex-col bg-[#161619] border border-zinc-800 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5416] animate-pulse" />
              <span>En Plancha / Fuego</span>
            </div>
            <span className="font-mono text-xs font-black bg-[#ff5416]/20 text-[#ff5416] px-2 py-0.5 rounded-full">
              {cooking.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cooking.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-12">Sin órdenes en cocción</p>
            ) : (
              cooking.map((t) => (
                <KdsTicketCard key={t.id} ticket={t} onUpdateStatus={updateTicketStatus} onToggleItem={toggleItemPrepared} />
              ))
            )}
          </div>
        </div>

        {/* Columna 3: Listo para Despacho */}
        <div className="flex flex-col bg-[#161619] border border-zinc-800 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-zinc-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Listas para Entrega</span>
            </div>
            <span className="font-mono text-xs font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              {ready.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {ready.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-12">Sin comandas listas aún</p>
            ) : (
              ready.map((t) => (
                <KdsTicketCard key={t.id} ticket={t} onUpdateStatus={updateTicketStatus} onToggleItem={toggleItemPrepared} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
