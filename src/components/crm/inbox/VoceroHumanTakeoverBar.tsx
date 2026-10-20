import React from 'react';
import { Bot, UserCheck, ShieldAlert, Sparkles, PauseCircle, PlayCircle } from 'lucide-react';

interface VoceroHumanTakeoverBarProps {
  isAiPaused: boolean;
  onToggleTakeover: () => void;
  leadName?: string;
}

export const VoceroHumanTakeoverBar: React.FC<VoceroHumanTakeoverBarProps> = ({
  isAiPaused,
  onToggleTakeover,
  leadName,
}) => {
  return (
    <div
      className={`px-3.5 py-2 border-b flex items-center justify-between gap-3 transition-colors ${
        isAiPaused
          ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
            isAiPaused
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isAiPaused ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-tight">
              {isAiPaused ? 'Atención Humana Activa' : 'IA en Automático (RAG Híbrido)'}
            </span>
            <span
              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                isAiPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isAiPaused ? 'IA Pausada' : 'Bot Activo'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 truncate">
            {isAiPaused
              ? `El bot NO responderá a ${leadName || 'este cliente'}. Solo tú envías mensajes.`
              : `El bot atiende preguntas, objeciones y avanza el embudo automáticamente.`}
          </p>
        </div>
      </div>

      <button
        onClick={onToggleTakeover}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 border cursor-pointer ${
          isAiPaused
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            : 'bg-zinc-800 hover:bg-amber-600/20 text-amber-400 hover:text-amber-300 border-zinc-700 hover:border-amber-500/40'
        }`}
      >
        {isAiPaused ? (
          <>
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Reanudar IA</span>
          </>
        ) : (
          <>
            <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pausar IA</span>
          </>
        )}
      </button>
    </div>
  );
};
