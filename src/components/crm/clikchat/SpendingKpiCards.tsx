import React from 'react';
import { Cpu, DollarSign, MessageSquare, TrendingUp, Zap } from 'lucide-react';

interface Props {
  daily: {
    neurons_today: number;
    neurons_daily_limit: number;
    neurons_percentage: number;
    cost_today_usd: number;
    messages_today: number;
    tokens_today: number;
  };
  overall: {
    total_cost_usd: number;
    total_neurons: number;
    total_tokens: number;
    total_chats: number;
    avg_cost_per_chat: number;
    avg_neurons_per_chat: number;
  };
  llama?: { neurons: number; cost_usd: number; messages: number; tokens: number };
  glm?: { neurons: number; cost_usd: number; messages: number; tokens: number };
}

export const SpendingKpiCards: React.FC<Props> = ({ daily, overall, llama, glm }) => {
  return (
    <div className="space-y-4">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Neuronas Hoy */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#62728d]">
            <span className="font-semibold">Neuronas Hoy (Cloudflare)</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-[#0a1730] font-mono">
            {daily.neurons_today.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {daily.neurons_daily_limit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                daily.neurons_percentage > 85 ? 'bg-rose-500' : daily.neurons_percentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(daily.neurons_percentage, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#8391aa]">{daily.neurons_percentage}% de cuota diaria consumida</p>
        </div>

        {/* Gasto Hoy USD */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#62728d]">
            <span className="font-semibold">Gasto Hoy (USD)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-lg font-extrabold text-[#0a1730] font-mono">
            ${daily.cost_today_usd.toFixed(4)} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <p className="text-[10.5px] text-[#62728d]">{daily.messages_today} respuestas IA generadas hoy</p>
        </div>

        {/* Gasto General Acumulado */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#62728d]">
            <span className="font-semibold">Gasto General en Chats</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-lg font-extrabold text-[#0a1730] font-mono">
            ${overall.total_cost_usd.toFixed(4)} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <p className="text-[10.5px] text-[#62728d]">{overall.total_chats} conversaciones analizadas</p>
        </div>

        {/* Costo Promedio por Chat */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#62728d]">
            <span className="font-semibold">Costo Promedio / Chat</span>
            <MessageSquare className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="text-lg font-extrabold text-[#0a1730] font-mono">
            ${overall.avg_cost_per_chat.toFixed(4)} <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <p className="text-[10.5px] text-[#62728d]">~{overall.avg_neurons_per_chat} neuronas por chat</p>
        </div>
      </div>

      {/* Desglose por Modelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meta Llama 3.3 Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0a1730] flex items-center gap-1.5">
              <span>🦙 Meta Llama 3.3 70B Fast</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Cloudflare AI
            </span>
          </div>
          <p className="text-[11px] text-[#62728d]">Procesamiento nativo en GPUs de Cloudflare con medición por Neuronas.</p>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Neuronas</span>
              <span className="font-bold text-[#0a1730]">{llama?.neurons.toLocaleString() || 0}</span>
            </div>
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Costo Estimado</span>
              <span className="font-bold text-emerald-600">${llama?.cost_usd.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Respuestas</span>
              <span className="font-bold text-[#0a1730]">{llama?.messages || 0}</span>
            </div>
          </div>
        </div>

        {/* GLM-5.3-Flash Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0a1730] flex items-center gap-1.5">
              <span>⚡ GLM-5.3-Flash:floor</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              OpenRouter Price Sort
            </span>
          </div>
          <p className="text-[11px] text-[#62728d]">Conexión enrutada por el proveedor más económico disponible en OpenRouter.</p>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Tokens</span>
              <span className="font-bold text-[#0a1730]">{glm?.tokens.toLocaleString() || 0}</span>
            </div>
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Costo Total</span>
              <span className="font-bold text-emerald-600">${glm?.cost_usd.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="bg-[#f8fafc] p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-sans">Respuestas</span>
              <span className="font-bold text-[#0a1730]">{glm?.messages || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
