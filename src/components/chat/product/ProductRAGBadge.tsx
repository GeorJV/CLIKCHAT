import React, { useState } from 'react';
import { Sparkles, HelpCircle, Layers, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductRAGTrace } from '../../../types/productChat';

interface Props {
  trace?: ProductRAGTrace;
}

export const ProductRAGBadge: React.FC<Props> = ({ trace }) => {
  const [expanded, setExpanded] = useState(false);
  if (!trace) return null;

  const getLevelConfig = () => {
    switch (trace.levelUsed) {
      case 1:
        return {
          label: 'Nivel 1: Memoria Episódica',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: Layers,
        };
      case 2:
        return {
          label: 'Nivel 2: Regla / FAQ Estricta',
          color: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          icon: Sparkles,
        };
      case 3:
        return {
          label: 'Nivel 3: Catálogo D1',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: HelpCircle,
        };
      case 'fallback_hitl':
      default:
        return {
          label: 'Fallback: Escalado Humano (HITL)',
          color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: UserCheck,
        };
    }
  };

  const config = getLevelConfig();
  const Icon = config.icon;

  return (
    <div className="mt-0.5 text-[11px] font-sans select-none">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all cursor-pointer ${config.color} hover:opacity-90`}
      >
        <Icon className="w-3 h-3" />
        <span className="font-semibold tracking-tight">{config.label}</span>
        {trace.confidence !== undefined && (
          <span className="opacity-75 text-[10px]">({Math.round(trace.confidence * 100)}% conf)</span>
        )}
        {expanded ? <ChevronUp className="w-2.5 h-2.5 ml-0.5" /> : <ChevronDown className="w-2.5 h-2.5 ml-0.5" />}
      </button>

      {expanded && (
        <div className="mt-1.5 p-2 rounded-xl bg-[#181717] border border-[#282626] text-[11px] text-zinc-300 space-y-1 shadow-lg">
          <div className="flex justify-between text-zinc-400 text-[10px] font-mono">
            <span>Modelo: {trace.modelUsed || 'RAG Hybrid'}</span>
            <span>Tiempo: {trace.executionTimeMs || 18}ms</span>
          </div>
          {trace.sourcesMatched && trace.sourcesMatched.length > 0 && (
            <div>
              <span className="text-zinc-400 text-[10px]">Fuentes validadas:</span>
              <ul className="list-disc list-inside text-zinc-200 mt-0.5 text-[10px]">
                {trace.sourcesMatched.map((s, idx) => (
                  <li key={idx} className="truncate">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {trace.reasoning && (
            <div className="text-[10px] text-zinc-400 pt-1 border-t border-[#252323]">
              {trace.reasoning}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
