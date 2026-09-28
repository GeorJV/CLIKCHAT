import React from 'react';
import { Sparkles, Cpu, Bot, Activity, Sliders, Zap } from 'lucide-react';
import { AiSpendingMetrics } from '../../../types/adminDirectory';

interface Props {
  metrics: AiSpendingMetrics | null;
  onOpenBudgetModal?: () => void;
}

export const AiSpendingCard: React.FC<Props> = ({ metrics, onOpenBudgetModal }) => {
  const formatUsd = (val?: number) => {
    if (!val) return '$0.00';
    return val > 0 && val < 0.05 ? `$${val.toFixed(4)}` : `$${val.toFixed(2)}`;
  };

  const StatBox = ({ label, val, color = 'text-teal-400', cap }: { label: string; val: number; color?: string; cap?: number }) => (
    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
      <span className="text-[9px] uppercase font-bold text-slate-400 block">{label}</span>
      <span className={`text-xs font-mono font-black ${color}`}>{formatUsd(val)}</span>
      {cap !== undefined && <span className="text-[8px] text-slate-500 block font-mono">Tope: ${cap}</span>}
    </div>
  );

  const optModel = metrics?.models?.optional;
  return (
    <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Gasto Real de IA por Modelo (Día, Semana, Mes)</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> API OpenRouter
              </span>
            </h3>
            <p className="text-xs text-slate-400">Presupuestos y consumo en tiempo real sincronizados</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onOpenBudgetModal && (
            <button
              onClick={onOpenBudgetModal}
              className="px-2.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-black rounded-xl border border-purple-500/60 flex items-center gap-1.5 transition shadow-lg shadow-purple-900/30 active:scale-95 cursor-pointer"
            >
              <Sliders size={13} className="text-amber-300" />
              <span>Definir Límites a Todas las Cuentas</span>
            </button>
          )}
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-mono text-[11px] rounded-lg border border-slate-700">
            Key: <span className="font-bold text-amber-400">{metrics?.openrouter?.label || 'sk-or-v1-f5e...85e'}</span>
          </span>
          <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 font-mono font-bold text-[11px] rounded-lg border border-emerald-800">
            Saldo Restante: <span className="text-emerald-400 font-black">{formatUsd(metrics?.openrouter?.limit_remaining ?? 0)} USD</span>
          </span>
        </div>
      </div>
      {/* Banner de Límites por Cuenta para Todos los Modelos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
        <div className="flex items-center gap-2">
          <Bot size={15} className="text-purple-400 shrink-0" />
          <span className="text-slate-300 font-medium text-[11px]">
            Límites por cuenta fijados: <strong className="text-teal-400 font-mono">GLM (${metrics?.limits?.glm_monthly_limit || metrics?.models?.glm?.monthlyLimitPerAccount || 5}/mes)</strong> • <strong className="text-purple-400 font-mono">GPT (${metrics?.limits?.gpt_monthly_limit || metrics?.models?.gpt?.monthlyLimitPerAccount || 2}/mes)</strong>
            {optModel?.enabled && <> • <strong className="text-indigo-400 font-mono">{optModel.name} (${optModel.monthlyLimitPerAccount}/mes)</strong></>}
          </span>
        </div>
        {onOpenBudgetModal && (
          <button onClick={onOpenBudgetModal} className="text-amber-300 hover:text-white font-bold text-[11px] underline cursor-pointer self-start sm:self-auto shrink-0">
            Modificar montos para todas las cuentas &rarr;
          </button>
        )}
      </div>

      {/* Models Grid */}
      <div className={`grid grid-cols-1 ${optModel?.enabled ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-3.5`}>
        {/* Modelo 1: GLM 5.3 Flash */}
        <div className="p-3.5 rounded-xl border border-teal-800/50 bg-teal-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <div>
                <h4 className="font-bold text-xs text-white">GLM-5.3-Flash (Z.ai)</h4>
                <span className="text-[10px] text-teal-400 font-mono">z-ai/glm-5.3-flash</span>
              </div>
            </div>
            <button
              onClick={onOpenBudgetModal}
              className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-900/60 text-teal-300 hover:bg-teal-800 transition cursor-pointer"
              title="Clic para editar monto de este modelo a todas las cuentas"
            >
              Límite: ${metrics?.limits?.glm_monthly_limit || metrics?.models?.glm?.monthlyLimitPerAccount || 5}/mes
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <StatBox label="Hoy" val={metrics?.models?.glm?.day ?? 0} color="text-teal-400" />
            <StatBox label="Semana" val={metrics?.models?.glm?.week ?? 0} color="text-teal-400" />
            <StatBox label="Mes" val={metrics?.models?.glm?.month ?? 0} color="text-teal-400" />
          </div>
        </div>

        {/* Modelo 2: GPT-4o Mini */}
        <div className="p-3.5 rounded-xl border border-purple-800/50 bg-purple-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <div>
                <h4 className="font-bold text-xs text-white">GPT-4o Mini (OpenAI)</h4>
                <span className="text-[10px] text-purple-400 font-mono">openai/gpt-4o-mini</span>
              </div>
            </div>
            <button
              onClick={onOpenBudgetModal}
              className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-900/60 text-purple-300 hover:bg-purple-800 transition cursor-pointer"
              title="Clic para editar monto de este modelo a todas las cuentas"
            >
              Límite: ${metrics?.limits?.gpt_monthly_limit || metrics?.models?.gpt?.monthlyLimitPerAccount || 2}/mes
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <StatBox label="Hoy" val={metrics?.models?.gpt?.day ?? 0} color="text-purple-400" />
            <StatBox label="Semana" val={metrics?.models?.gpt?.week ?? 0} color="text-purple-400" />
            <StatBox label="Mes" val={metrics?.models?.gpt?.month ?? 0} color="text-purple-400" />
          </div>
        </div>

        {/* Modelo 3 Opcional */}
        {optModel?.enabled && (
          <div className="p-3.5 rounded-xl border border-indigo-800/50 bg-indigo-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-xs text-white truncate max-w-[110px]">{optModel.name}</h4>
                  <span className="text-[10px] text-indigo-400 font-mono truncate max-w-[110px] block">{optModel.modelId}</span>
                </div>
              </div>
              <button
                onClick={onOpenBudgetModal}
                className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800 transition cursor-pointer"
                title="Clic para editar monto de este modelo a todas las cuentas"
              >
                Límite: ${optModel.monthlyLimitPerAccount}/mes
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <StatBox label="Hoy" val={optModel.day ?? 0} color="text-indigo-400" />
              <StatBox label="Semana" val={optModel.week ?? 0} color="text-indigo-400" />
              <StatBox label="Mes" val={optModel.month ?? 0} color="text-indigo-400" />
            </div>
          </div>
        )}

        {/* Consumo Global & Presupuestos */}
        <div className="p-3.5 rounded-xl border border-emerald-800/50 bg-emerald-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Gasto Total OpenRouter</h4>
                <span className="text-[10px] text-emerald-400 font-mono">Consumo Real API</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-900/60 text-emerald-300">
              Total: {formatUsd(metrics?.summary?.totalAllTime ?? 0)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <StatBox label="Total Hoy" val={metrics?.summary?.totalDay ?? 0} color="text-emerald-400" cap={metrics?.budgets?.dayBudget} />
            <StatBox label="Total Sem" val={metrics?.summary?.totalWeek ?? 0} color="text-emerald-400" cap={metrics?.budgets?.weekBudget} />
            <StatBox label="Total Mes" val={metrics?.summary?.totalMonth ?? 0} color="text-emerald-400" cap={metrics?.budgets?.monthBudget} />
          </div>
        </div>
      </div>
    </div>
  );
};
