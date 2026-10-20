import React from 'react';
import { KdsTicket } from '../../types/fastfood';
import { Clock, CheckSquare, Square, Truck, ShoppingBag, User, Check, Flame, Send } from 'lucide-react';

interface Props {
  ticket: KdsTicket;
  onUpdateStatus: (id: string, status: KdsTicket['status']) => void;
  onToggleItem: (ticketId: string, itemId: string) => void;
}

export const KdsTicketCard: React.FC<Props> = ({ ticket, onUpdateStatus, onToggleItem }) => {
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - new Date(ticket.createdAt).getTime()) / 60000));

  const timerColor =
    elapsedMinutes < 10
      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
      : elapsedMinutes < 20
      ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
      : 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse';

  const isCRC = ticket.currency.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : '$';
  const formattedTotal = isCRC ? Math.round(ticket.totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ticket.totalAmount.toFixed(2);

  return (
    <div className="rounded-2xl border border-[#2c2b30] bg-[#1a1a1e] p-3.5 shadow-xl flex flex-col justify-between space-y-3 font-sans transition hover:border-zinc-600">
      {/* Header de la Comanda */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-black text-white">{ticket.orderNumber}</span>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-bold ${
              ticket.orderType === 'delivery' ? 'bg-[#ff5416]/15 text-[#ff5416]' : ticket.orderType === 'takeaway' ? 'bg-amber-500/15 text-amber-300' : 'bg-blue-500/15 text-blue-300'
            }`}>
              {ticket.orderType === 'delivery' ? <Truck className="w-3 h-3" /> : ticket.orderType === 'takeaway' ? <ShoppingBag className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {ticket.orderType === 'delivery' ? 'Express' : ticket.orderType === 'takeaway' ? 'Retiro' : `Mesa ${ticket.tableNumber || '1'}`}
            </span>
          </div>

          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold ${timerColor}`}>
            <Clock className="w-3 h-3" />
            <span>{elapsedMinutes}m</span>
          </div>
        </div>

        {/* Cliente & Pago */}
        <div className="flex items-center justify-between py-1.5 text-[11px] text-zinc-400">
          <span className="truncate max-w-[140px] font-semibold text-zinc-200">{ticket.customerName}</span>
          <span className={`font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded ${
            ticket.paymentStatus === 'paid' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'
          }`}>
            {ticket.paymentStatus === 'paid' ? 'PAGADO' : `Cobrar ${sym}${formattedTotal}`}
          </span>
        </div>

        {/* Ítems para la Cocina (Interactivos) */}
        <div className="space-y-1.5 mt-2 bg-[#121214] p-2.5 rounded-xl border border-zinc-800/80">
          {ticket.items.map((it) => (
            <div
              key={it.id}
              onClick={() => onToggleItem(ticket.id, it.id)}
              className="flex items-start gap-2 cursor-pointer group select-none py-0.5"
            >
              <button type="button" className="text-zinc-500 group-hover:text-amber-400 mt-0.5">
                {it.isPrepared ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
              </button>
              <div className="min-w-0 flex-1 leading-snug">
                <span className={`text-xs font-semibold ${it.isPrepared ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                  <span className="font-mono font-bold text-amber-400 mr-1">{it.quantity}x</span>
                  {it.name}
                </span>
                {it.notes && (
                  <span className="block text-[10.5px] text-[#ff5416] font-medium">⚠️ {it.notes}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de Cambio de Estado en Cocina */}
      <div className="pt-2 border-t border-zinc-800">
        {ticket.status === 'queued' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(ticket.id, 'cooking')}
            className="w-full py-2 px-3 rounded-xl bg-[#ff5416] hover:bg-[#e0450d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#ff5416]/20 transition cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Pasar a Cocción</span>
          </button>
        )}

        {ticket.status === 'cooking' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(ticket.id, 'ready')}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Marcar Listo / Empacado</span>
          </button>
        )}

        {ticket.status === 'ready' && (
          <button
            type="button"
            onClick={() => onUpdateStatus(ticket.id, 'dispatched')}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Despachar con Motorizado</span>
          </button>
        )}
      </div>
    </div>
  );
};
