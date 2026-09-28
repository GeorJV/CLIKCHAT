import React from 'react';
import { Sparkles, Cpu, Bot, Activity } from 'lucide-react';
import { AiSpendingMetrics } from '../../../types/adminDirectory';

interface Props {
  metrics: AiSpendingMetrics | null;
}

export const AiSpendingCard: React.FC<Props> = ({ metrics }) => {
  const formatUsd = (val?: number) => {
    if (val === undefined || val === null || val === 0) return '$0.00';
    if (val > 0 && val < 0.05) return `$${val.toFixed(4)}`;
    return `$${val.toFixed(2)}`;
  };

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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API OpenRouter En Vivo
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Métricas de consumo en dólares sincronizadas en tiempo real desde la API de OpenRouter
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-mono text-[11px] rounded-lg border border-slate-700 flex items-center gap-1.5 shadow-sm">
            <span className="text-slate-400">Key:</span>
            <span className="font-bold text-amber-400">{metrics?.openrouter?.label || 'sk-or-v1-f5e...85e'}</span>
          </span>
          <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 font-mono font-bold text-[11px] rounded-lg border border-emerald-800 flex items-center gap-1.5 shadow-sm">
            <span>Saldo Restante:</span>
            <span className="text-emerald-400 font-black">{formatUsd(metrics?.openrouter?.limit_remaining ?? 0)} USD</span>
          </span>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-900/60 text-teal-300">
              Límite: $5.00/mes
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Hoy</span>
              <span className="text-xs font-mono font-black text-teal-400">{formatUsd(metrics?.models?.glm?.day ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Semana</span>
              <span className="text-xs font-mono font-black text-teal-400">{formatUsd(metrics?.models?.glm?.week ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Mes</span>
              <span className="text-xs font-mono font-black text-teal-400">{formatUsd(metrics?.models?.glm?.month ?? 0)}</span>
            </div>
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
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-900/60 text-purple-300">
              Límite: $2.00/mes
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Hoy</span>
              <span className="text-xs font-mono font-black text-purple-400">{formatUsd(metrics?.models?.gpt?.day ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Semana</span>
              <span className="text-xs font-mono font-black text-purple-400">{formatUsd(metrics?.models?.gpt?.week ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Mes</span>
              <span className="text-xs font-mono font-black text-purple-400">{formatUsd(metrics?.models?.gpt?.month ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Consumo Global */}
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
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Hoy</span>
              <span className="text-xs font-mono font-black text-emerald-400">{formatUsd(metrics?.summary?.totalDay ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Semana</span>
              <span className="text-xs font-mono font-black text-emerald-400">{formatUsd(metrics?.summary?.totalWeek ?? 0)}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Mes</span>
              <span className="text-xs font-mono font-black text-emerald-400">{formatUsd(metrics?.summary?.totalMonth ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
