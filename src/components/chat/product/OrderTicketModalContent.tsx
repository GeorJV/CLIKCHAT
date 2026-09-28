import React from 'react';
import { Receipt, UtensilsCrossed, ShoppingBag, Clock } from 'lucide-react';
import { OrderItem } from '../../../types/productChat';

interface Props {
  orderItems: OrderItem[];
  orderTotal: number | null;
  currency?: string;
  storeName?: string;
}

export const OrderTicketModalContent: React.FC<Props> = ({
  orderItems,
  orderTotal,
  currency = 'CRC',
  storeName = 'Restaurante'
}) => {
  const isCRC = currency.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : (currency.toUpperCase() === 'EUR' ? '€' : '$');

  const formatPrice = (val: number) => {
    if (!val || isNaN(val)) return '0';
    if (isCRC) {
      return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return Number.isInteger(val)
      ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : val.toFixed(2);
  };

  const totalCalculated = orderTotal !== null && orderTotal !== undefined && orderTotal > 0
    ? orderTotal
    : orderItems.reduce((acc, it) => acc + (Number(it.price || 0) * (Number(it.quantity) || 1)), 0);

  const totalQuantity = orderItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

  if (orderItems.length === 0) {
    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-[#131212] rounded-2xl border border-dashed border-zinc-800">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
          <UtensilsCrossed className="w-6 h-6 stroke-[1.75]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Tu comanda está lista para empezar</h4>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            Aún no has agregado productos. Pídele opciones al asesor en el chat o toca el botón <span className="text-amber-400 font-semibold">[+ Agregar]</span> en las sugerencias para armar tu pedido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Encabezado del Ticket */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">{storeName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>Comanda en curso ({totalQuantity} {totalQuantity === 1 ? 'ítem' : 'ítems'})</span>
        </div>
      </div>

      {/* Lista de Productos Agregados */}
      <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
        {orderItems.map((item, idx) => {
          const qty = Number(item.quantity) || 1;
          const unitPrice = Number(item.price) || 0;
          const lineSubtotal = unitPrice * qty;

          return (
            <div
              key={`order-it-${idx}`}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#141313] border border-zinc-800/90 hover:border-amber-500/30 transition group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-xs">
                  {qty}x
                </span>
                <div className="min-w-0">
                  <h5 className="font-semibold text-zinc-100 text-xs truncate max-w-[200px] sm:max-w-xs">
                    {item.name}
                  </h5>
                  <span className="text-[11px] text-zinc-400">
                    Unitario: {sym}{formatPrice(unitPrice)}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-amber-300 font-mono">
                  {sym}{formatPrice(lineSubtotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Separador perforado */}
      <div className="border-t border-dashed border-zinc-700/80 my-2" />

      {/* Resumen Total Acumulado */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 shadow-inner">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 block">
              Total Acumulado
            </span>
            <span className="text-[10px] text-zinc-400">
              {totalQuantity} {totalQuantity === 1 ? 'artículo en orden' : 'artículos en orden'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base sm:text-lg font-black text-amber-300 tracking-wide font-mono">
            {sym}{formatPrice(totalCalculated)} {isCRC ? 'CRC' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
