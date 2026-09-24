import React from 'react';
import { Clock, Activity, Calendar, Users, RefreshCw } from 'lucide-react';
import { Tenant } from '../../../types';
import { useTenantQuotas } from '../../../hooks/useTenantQuotas';

interface TenantConsumptionSectionProps {
  tenant: Tenant | null;
  tenantSlug: string;
  onSwitchAccount?: () => void;
}

export const TenantConsumptionSection: React.FC<TenantConsumptionSectionProps> = ({
  tenant,
  tenantSlug,
  onSwitchAccount
}) => {
  const { quotasData, isRefreshing, refresh } = useTenantQuotas({
    tenantId: tenant?.id
  });

  const tenantName = tenant?.name || tenantSlug || 'ClikChat';
  const initial = tenantName.charAt(0).toUpperCase();
  const planTier = tenant?.plan || 'pro';
  const shortId = tenant?.id ? tenant.id.slice(0, 8) : tenantSlug;

  return (
    <div className="onyx-card rounded-2xl p-4 sm:p-4.5 border border-[#262424] shadow-lg space-y-3.5 font-sans">
      {/* Cabecera de la Sesión y Cuenta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242222] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-base shadow-inner shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-100 tracking-tight">
                {tenantName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tenant #{shortId}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300 uppercase tracking-wider border border-slate-700">
                {planTier}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Sesión activa: <strong className="text-slate-300 font-mono">{tenantName}</strong> • Cuotas y consumos sincronizados en vivo con Cloudflare D1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/20 transition"
            onClick={() => refresh()}
            title="Cuotas y consumo 100% real de sesiones sincronizadas con Cloudflare D1. Clic para refrescar."
          >
            <Activity size={13} className={`text-emerald-400 ${isRefreshing ? 'animate-spin' : 'animate-pulse'}`} />
            <span>Consumo Real en Vivo</span>
          </div>

          {onSwitchAccount && (
            <button
              type="button"
              onClick={onSwitchAccount}
              className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer active:scale-95"
            >
              <Users size={13} className="text-indigo-400" />
              <span>Cambiar Cuenta</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid de 3 Tarjetas de Cuotas: Hora, Día, Mes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. ESTA HORA */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-emerald-400" />
              <span>Esta Hora</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {quotasData.hourly.used} de {quotasData.hourly.limit}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-slate-100 font-mono">
              {quotasData.hourly.used}
              <span className="text-xs text-slate-500 font-normal"> / {quotasData.hourly.limit} msgs</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {quotasData.hourly.percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${quotasData.hourly.percentage}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 block">Se renueva cada 60 min</span>
        </div>

        {/* 2. HOY (24H) */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Activity size={11} className="text-teal-400" />
              <span>Hoy (24h)</span>
            </span>
            <span className="font-mono text-teal-400 font-bold">
              {quotasData.daily.used} de {quotasData.daily.limit}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-slate-100 font-mono">
              {quotasData.daily.used}
              <span className="text-xs text-slate-500 font-normal"> / {quotasData.daily.limit} msgs</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {quotasData.daily.percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${quotasData.daily.percentage}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 block">Se renueva a medianoche</span>
        </div>

        {/* 3. ESTE MES */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-indigo-400" />
              <span>Este Mes</span>
            </span>
            <span className="font-mono text-indigo-400 font-bold">
              {quotasData.monthly.used} de {quotasData.monthly.limit}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-slate-100 font-mono">
              {quotasData.monthly.used}
              <span className="text-xs text-slate-500 font-normal"> / {quotasData.monthly.limit} msgs</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {quotasData.monthly.percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${quotasData.monthly.percentage}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 block">Renovación ciclo mensual</span>
        </div>
      </div>
    </div>
  );
};
