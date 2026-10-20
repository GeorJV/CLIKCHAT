import React from 'react';
import { Banknote, Calculator } from 'lucide-react';

interface Props {
  totalAmount: number;
  currency: string;
  cashAmount: number;
  onCashAmountChange: (amt: number) => void;
}

export const CashPaymentSection: React.FC<Props> = ({
  totalAmount,
  currency,
  cashAmount,
  onCashAmountChange
}) => {
  const isCRC = currency.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : '$';
  const format = (v: number) => isCRC ? Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : v.toFixed(2);
  const changeDue = Math.max(0, cashAmount - totalAmount);

  const QUICK_BILLS = isCRC ? [5000, 10000, 20000] : [20, 50, 100];

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#161618] p-3 text-xs space-y-2.5 animate-fade-in font-sans">
      <div className="flex items-center justify-between text-zinc-300 font-semibold border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-1.5">
          <Banknote className="w-4 h-4 text-emerald-400" />
          <span>Pago en Efectivo / Contra Entrega</span>
        </div>
        <span className="text-[10px] text-zinc-400">Pagas al recibir</span>
      </div>

      <div>
        <label className="block text-[11px] text-zinc-400 mb-1">¿Con cuánto dinero pagarás?</label>
        <div className="flex items-center gap-1.5">
          {QUICK_BILLS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onCashAmountChange(b)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                cashAmount === b
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-zinc-800 bg-[#1e1e22] text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {sym}{format(b)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onCashAmountChange(totalAmount)}
            className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
              cashAmount === totalAmount
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                : 'border-zinc-800 bg-[#1e1e22] text-zinc-300 hover:border-zinc-700'
            }`}
          >
            Exacto
          </button>
        </div>
      </div>

      {cashAmount > totalAmount && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Vuelto que llevará el motorizado:</span>
          </div>
          <span className="font-mono font-bold text-xs">{sym}{format(changeDue)}</span>
        </div>
      )}
    </div>
  );
};
