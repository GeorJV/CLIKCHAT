import React, { useState } from 'react';
import { Copy, Check, Smartphone, ShieldCheck } from 'lucide-react';

interface Props {
  totalAmount: number;
  currency: string;
  businessPhone?: string;
  storeName?: string;
  sinpeReference: string;
  onReferenceChange: (ref: string) => void;
}

export const SinpePaymentSection: React.FC<Props> = ({
  totalAmount,
  currency,
  businessPhone = '8888-8888',
  storeName = 'Restaurante',
  sinpeReference,
  onReferenceChange
}) => {
  const [copied, setCopied] = useState(false);
  const isCRC = currency.toUpperCase() === 'CRC';
  const sym = isCRC ? '₡' : '$';
  const formattedAmount = isCRC ? Math.round(totalAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : totalAmount.toFixed(2);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(businessPhone.replace(/[^0-9]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-[#1e1c18] p-3 text-xs space-y-2.5 animate-fade-in font-sans">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Datos para transferencia SINPE Móvil</span>
        </div>
        <span className="font-mono text-xs font-black text-amber-400">{sym}{formattedAmount}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-[#141312] p-2 rounded-lg border border-amber-500/15">
          <span className="text-zinc-400 block text-[10px]">Número de teléfono:</span>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="font-mono font-bold text-white text-xs">{businessPhone}</span>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
              title="Copiar número de teléfono"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="bg-[#141312] p-2 rounded-lg border border-amber-500/15">
          <span className="text-zinc-400 block text-[10px]">Titular de la cuenta:</span>
          <span className="font-bold text-white text-xs truncate block mt-0.5">{storeName}</span>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
          Número de comprobante / Referencia SINPE:
        </label>
        <input
          type="text"
          value={sinpeReference}
          onChange={(e) => onReferenceChange(e.target.value)}
          placeholder="Ej: 123456 o últimos 4 dígitos"
          className="w-full rounded-lg border border-amber-500/30 bg-[#121110] px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-amber-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-amber-300/80">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
        <span>Tu comanda se enviará a cocina de inmediato y se validará al confirmar la transferencia.</span>
      </div>
    </div>
  );
};
