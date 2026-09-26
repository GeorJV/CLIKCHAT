import React from 'react';
import { CreditCard, Calendar, CheckCircle2, DollarSign, Sparkles, Clock } from 'lucide-react';
import { Tenant } from '../../../types';

interface AccountBillingCardProps {
  tenant: Tenant | null;
}

export const AccountBillingCard: React.FC<AccountBillingCardProps> = ({ tenant }) => {
  const planName = (tenant?.plan || 'enterprise').toUpperCase();
  const currency = tenant?.currency || 'CRC';
  const monthlyAmount = tenant?.monthly_price || (currency === 'CRC' ? 25000 : 49);
  
  const formattedAmount = currency === 'CRC'
    ? `₡${Number(monthlyAmount).toLocaleString('es-CR')} CRC`
    : `$${Number(monthlyAmount).toFixed(2)} USD`;

  // Calcular fechas legibles
  const createdDate = tenant?.created_at ? new Date(tenant.created_at) : new Date(2026, 0, 15);
  const formattedCreated = createdDate.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const nextBillingDate = new Date();
  nextBillingDate.setDate(nextBillingDate.getDate() + 24);
  const formattedNextBilling = nextBillingDate.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="onyx-card rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl border border-[#282626] bg-[#141313] text-slate-100 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242323] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Suscripción & Facturación</h3>
            <p className="text-xs text-zinc-400">Ciclos de facturación y estado de cuenta del software</p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shrink-0 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Suscripción Al Día</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Plan Actual */}
        <div className="p-3.5 bg-[#181717] rounded-xl border border-[#262424] space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Plan de Suscripción
          </span>
          <p className="text-sm font-black text-white">{planName}</p>
          <span className="text-[10px] text-zinc-500">Inteligencia Artificial 24/7</span>
        </div>

        {/* Monto a Pagar */}
        <div className="p-3.5 bg-[#181717] rounded-xl border border-[#262424] space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Monto a Pagar
          </span>
          <p className="text-sm font-black text-emerald-400">{formattedAmount} <span className="text-[10px] font-normal text-zinc-400">/ mes</span></p>
          <span className="text-[10px] text-zinc-500">Tarifa fija sin comisiones</span>
        </div>

        {/* Próximo Pago */}
        <div className="p-3.5 bg-[#181717] rounded-xl border border-[#262424] space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Próximo Pago
          </span>
          <p className="text-xs font-black text-white">{formattedNextBilling}</p>
          <span className="text-[10px] text-zinc-500">Renovación automática</span>
        </div>

        {/* Fecha Creación Cuenta */}
        <div className="p-3.5 bg-[#181717] rounded-xl border border-[#262424] space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            Creación de la Cuenta
          </span>
          <p className="text-xs font-black text-zinc-200">{formattedCreated}</p>
          <span className="text-[10px] text-zinc-500">Cuenta activa y verificada</span>
        </div>
      </div>
    </div>
  );
};
