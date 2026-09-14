import React from 'react';
import { Pin } from 'lucide-react';

interface SidebarHeaderProps {
  isExpanded: boolean;
  isSimpleMode: boolean;
  setIsSimpleMode: (val: boolean) => void;
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  showToast: (msg: string) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isExpanded,
  isSimpleMode,
  setIsSimpleMode,
  isPinned,
  setIsPinned,
  showToast
}) => {
  const handleTogglePin = () => {
    const nextState = !isPinned;
    setIsPinned(nextState);
    showToast(nextState ? 'Menú fijado (Permanente)' : 'Menú en modo flotante (Auto-colapso)');
  };

  const handleToggleMode = () => {
    const nextMode = !isSimpleMode;
    setIsSimpleMode(nextMode);
    showToast(nextMode ? 'Activado Modo Simple' : 'Activado Modo Pro');
  };

  return (
    <div className={`flex items-center ${isExpanded ? 'justify-between px-1.5 pb-2' : 'justify-center pb-2'} border-b border-slate-800/80`}>
      {isExpanded && (
        <button
          onClick={handleToggleMode}
          className="flex items-center space-x-2 text-[11px] font-bold tracking-wider text-slate-300 hover:text-white transition py-1 px-1.5 rounded-lg hover:bg-slate-900/80 cursor-pointer"
          title="Haz clic para alternar entre Modo Simple y Modo Pro"
        >
          <span className={`w-2 h-2 rounded-full ${isSimpleMode ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400 shadow-sm shadow-purple-500/50'}`} />
          <span className="font-extrabold uppercase">{isSimpleMode ? 'MODO SIMPLE' : 'MODO PRO'}</span>
        </button>
      )}

      <button
        onClick={handleTogglePin}
        className={`p-1.5 rounded-lg border transition cursor-pointer ${
          isPinned
            ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-sm shadow-emerald-600/20'
            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700'
        }`}
        title={isPinned ? 'Desfijar menú (Contraer)' : 'Fijar menú (Mantener visible)'}
      >
        <Pin className={`w-3.5 h-3.5 transition-transform duration-200 ${isPinned ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
};
