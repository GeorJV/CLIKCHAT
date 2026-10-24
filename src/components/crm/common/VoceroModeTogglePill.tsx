import React from 'react';
import { Layers, MessageCircle, ArrowLeftRight } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface VoceroModeTogglePillProps {
  variant?: 'floating' | 'inline';
}

export const VoceroModeTogglePill: React.FC<VoceroModeTogglePillProps> = ({ variant = 'floating' }) => {
  const { isVoceroMode, toggleVoceroMode } = useVoceroMode();

  const buttonContent = (
    <button
      onClick={toggleVoceroMode}
      title={isVoceroMode ? 'Cambiar a experiencia ClikChat Clásico' : 'Cambiar a experiencia ClikChat CRM'}
      className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-xl border cursor-pointer ${
        isVoceroMode
          ? 'bg-white hover:bg-[#f6f8fc] text-[#0a1730] border-[#d8e2f0] shadow-blue-900/10 hover:shadow-2xl'
          : 'bg-[#181717]/95 hover:bg-[#222020] text-zinc-200 border-[#333131] hover:border-emerald-500/50 shadow-black/80'
      }`}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${isVoceroMode ? 'bg-[#0d5bff] animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
      <span className="flex items-center gap-2">
        {isVoceroMode ? (
          <>
            <Layers className="w-3.5 h-3.5 text-[#0d5bff]" />
            <span className="tracking-tight text-[#0a1730] font-bold">Modo ClikChat CRM</span>
            <span className="text-[10px] text-[#0d5bff] font-bold bg-[#ebf1ff] px-2 py-0.5 rounded-full border border-[#d3e2ff] flex items-center gap-1">
              <ArrowLeftRight className="w-2.5 h-2.5" /> Ver Clásico
            </span>
          </>
        ) : (
          <>
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-tight text-white font-bold">ClikChat Clásico</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              ⚡ Ver ClikChat CRM
            </span>
          </>
        )}
      </span>
    </button>
  );

  if (variant === 'inline') {
    return <div className="hidden md:inline-block">{buttonContent}</div>;
  }

  // Oculto al 100% en vista móvil/celular para no estorbar el chat ni la navegación
  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50 animate-bounce-subtle">
      {buttonContent}
    </div>
  );
};
