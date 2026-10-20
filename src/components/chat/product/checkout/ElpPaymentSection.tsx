import React from 'react';
import { CreditCard, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

interface Props {
  totalAmount: number;
  currency: string;
}

export const ElpPaymentSection: React.FC<Props> = ({ totalAmount, currency }) => {
  const isCRC = currency.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : '$';
  const formatted = isCRC ? Math.round(totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : totalAmount.toFixed(2);

  return (
    <div className="rounded-xl border border-[#ff5416]/30 bg-[#1c1614] p-3 text-xs space-y-2.5 animate-fade-in font-sans">
      <div className="flex items-center justify-between border-b border-[#ff5416]/20 pb-2">
        <div className="flex items-center gap-1.5 text-orange-300 font-bold">
          <CreditCard className="w-4 h-4 text-[#ff5416]" />
          <span>Enlace de Pago Oficial (ELP)</span>
        </div>
        <span className="font-mono text-xs font-black text-[#ff5416]">{sym}{formatted}</span>
      </div>

      <p className="text-[11px] text-zinc-300 leading-relaxed">
        Paga de forma 100% segura con tu tarjeta de débito o crédito (Visa, Mastercard, BAC Credomatic).
      </p>

      <div className="p-2.5 rounded-lg bg-[#14100e] border border-[#ff5416]/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#ff5416]" />
          <span className="font-semibold text-zinc-200">Pasarela Cifrada SSL 256-bit</span>
        </div>
        <span className="text-[10px] text-orange-400 font-mono">Autorización Inmediata</span>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Al confirmar, la comanda entrará a cocina y se te enviará el comprobante digital.</span>
      </div>
    </div>
  );
};
