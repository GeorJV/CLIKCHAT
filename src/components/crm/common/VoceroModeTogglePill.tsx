import React from 'react';
import { Layers, MessageCircle } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroModeTogglePillProps {
  variant?: 'floating' | 'inline';
}

export const VoceroModeTogglePill: React.FC<VoceroModeTogglePillProps> = ({ variant = 'floating' }) => {
  const { isVoceroMode, toggleVoceroMode } = useVoceroMode();

  const buttonContent = (
    <button
      onClick={toggleVoceroMode}
      title="Alternar entre la experiencia ClikChat CRM y ClikChat Clásico"
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-xl border cursor-pointer ${
        isVoceroMode
          ? 'bg-zinc-900/90 hover:bg-zinc-800 text-emerald-400 border-emerald-500/40 hover:border-emerald-500 shadow-emerald-950/40'
          : 'bg-[#1a1919]/90 hover:bg-[#252323] text-zinc-300 border-[#383535] hover:border-emerald-500/50 shadow-black/60'
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${isVoceroMode ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
      <span className="flex items-center gap-1.5">
        {isVoceroMode ? (
          <>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-tight text-white">Modo ClikChat CRM</span>
            <span className="text-[10px] text-zinc-400 font-normal hidden sm:inline">| Ver Clásico</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition" />
            <span className="tracking-tight">ClikChat Clásico</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              ⚡ Modo ClikChat CRM
            </span>
          </>
        )}
      </span>
    </button>
  );

  if (variant === 'inline') {
    return buttonContent;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-subtle">
      {buttonContent}
    </div>
  );
};
