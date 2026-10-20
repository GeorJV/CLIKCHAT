import React, { useState } from 'react';
import { RiderDelivery } from '../../types/fastfood';
import { Truck, Navigation, Phone, MessageSquare, CheckCircle2, DollarSign, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

const INITIAL_DELIVERIES: RiderDelivery[] = [
  {
    id: 'del-1',
    ticketId: 'kds-101',
    orderNumber: '#101',
    customerName: 'Carlos Morales',
    customerPhone: '+506 8888-8888',
    deliveryAddress: 'San Pedro, 100m norte del parque central, casa blanca con portón negro',
    itemsSummary: '2x Burger Doble, 1x Papas Rústicas, 2x Gaseosas',
    totalAmount: 16200,
    currency: 'CRC',
    paymentStatus: 'paid',
    status: 'assigned',
  },
  {
    id: 'del-2',
    ticketId: 'kds-103',
    orderNumber: '#103',
    customerName: 'Alejandro Castro',
    customerPhone: '+506 6666-6666',
    deliveryAddress: 'Curridabat, Condominio El Roble, Casa 42',
    itemsSummary: '1x Combo Parrillero, 1x Té Frío Melocotón',
    totalAmount: 21300,
    currency: 'CRC',
    paymentStatus: 'collect_cash',
    status: 'in_transit',
    pickedUpAt: '19:42',
  },
];

export const RiderDispatchView: React.FC<{ riderName?: string }> = ({ riderName = 'Rider #1 (Andrés)' }) => {
  const [deliveries, setDeliveries] = useState<RiderDelivery[]>(INITIAL_DELIVERIES);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const handleUpdateStatus = (id: string, newStatus: RiderDelivery['status']) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, deliveredAt: newStatus === 'delivered' ? 'Ahora' : d.deliveredAt } : d))
    );
  };

  const activeDeliveries = deliveries.filter((d) => (filter === 'active' ? d.status !== 'delivered' : d.status === 'delivered'));

  return (
    <div className="flex flex-col h-full w-full bg-[#121214] text-slate-100 font-sans select-none overflow-hidden">
      {/* Header Motorizado */}
      <header className="h-14 shrink-0 bg-[#18181c] border-b border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#ff5416] flex items-center justify-center text-white shadow-md shadow-[#ff5416]/20">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight">Portal de Entregas & Motorizados</h1>
            <span className="text-[11px] text-zinc-400">{riderName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filter === 'active' ? 'bg-[#ff5416] text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Activas ({deliveries.filter((d) => d.status !== 'delivered').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              filter === 'completed' ? 'bg-[#ff5416] text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Entregadas
          </button>
        </div>
      </header>

      {/* Lista de Entregas Táctil para Teléfono en Moto */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl w-full mx-auto">
        {activeDeliveries.length === 0 ? (
          <div className="text-center py-16 bg-[#161619] rounded-2xl border border-dashed border-zinc-800 p-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
            <h3 className="text-sm font-bold text-white">No tienes entregas pendientes</h3>
            <p className="text-xs text-zinc-400">Cuando la cocina marque un pedido como listo, aparecerá aquí al instante.</p>
          </div>
        ) : (
          activeDeliveries.map((del) => {
            const isCRC = del.currency === 'CRC';
            const sym = isCRC ? '₡' : '$';
            const formattedTotal = isCRC ? Math.round(del.totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : del.totalAmount.toFixed(2);
            const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(del.deliveryAddress)}`;
            const waUrl = `https://wa.me/${del.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`¡Hola ${del.customerName}! Soy el repartidor con tu orden ${del.orderNumber}. Ya voy en camino.`)}`;

            return (
              <div key={del.id} className="rounded-2xl border border-zinc-800 bg-[#18181c] p-4 shadow-xl space-y-3">
                {/* Cabecera de Orden */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-white">{del.orderNumber}</span>
                    <span className="text-xs font-bold text-zinc-200">{del.customerName}</span>
                  </div>
                  <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-full ${
                    del.paymentStatus === 'paid' ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300' : 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                  }`}>
                    {del.paymentStatus === 'paid' ? 'SINPE PAGADO · Solo Entregar' : `COBRAR: ${sym}${formattedTotal}`}
                  </span>
                </div>

                {/* Dirección y Detalle de Comanda */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 bg-[#121214] p-2.5 rounded-xl border border-zinc-800/80">
                    <MapPin className="w-4 h-4 text-[#ff5416] shrink-0 mt-0.5" />
                    <span className="text-zinc-200 leading-snug">{del.deliveryAddress}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 pl-1">🛍️ {del.itemsSummary}</p>
                </div>

                {/* Botones de Navegación Rápida */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Abrir Waze</span>
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-black" />
                    <span>WhatsApp Cliente</span>
                  </a>
                </div>

                {/* Acciones de Estado del Repartidor */}
                <div className="pt-2 border-t border-zinc-800">
                  {del.status === 'assigned' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(del.id, 'in_transit')}
                      className="w-full py-3 rounded-xl bg-[#ff5416] hover:bg-[#e0450d] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff5416]/20 transition cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Comenzar Viaje hacia el Cliente</span>
                    </button>
                  )}

                  {del.status === 'in_transit' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(del.id, 'delivered')}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Entrega Realizada</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
