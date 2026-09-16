import React from 'react';
import { Trash2, Pause, Play, Send } from 'lucide-react';

interface ChatMicLockedBarProps {
  recordingSeconds: number;
  isPaused: boolean;
  onCancel: () => void;
  onTogglePause: () => void;
  onSend: () => void;
}

export const ChatMicLockedBar: React.FC<ChatMicLockedBarProps> = ({
  recordingSeconds,
  isPaused,
  onCancel,
  onTogglePause,
  onSend
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-[#1b1919] border border-[#333030] rounded-xl px-2.5 py-1 text-xs shadow-xl animate-fade-in shrink-0 self-end mb-0.5">
      {/* Indicador de grabación / pausa */}
      <div className="flex items-center gap-1.5 min-w-[55px]">
        {isPaused ? (
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        )}
        <span className="font-mono font-bold text-white tabular-nums text-[11px]">
          {formatTime(recordingSeconds)}
        </span>
      </div>

      {/* Ondas simuladas */}
      <div className="flex items-center gap-0.5 px-1 h-3">
        <span className={`w-0.5 bg-red-400 rounded-full transition-all ${isPaused ? 'h-1.5' : 'h-3 animate-pulse'}`} />
        <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isPaused ? 'h-1' : 'h-2 animate-pulse delay-75'}`} />
        <span className={`w-0.5 bg-red-400 rounded-full transition-all ${isPaused ? 'h-2' : 'h-3.5 animate-pulse delay-150'}`} />
        <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isPaused ? 'h-1' : 'h-2 animate-pulse delay-100'}`} />
      </div>

      {/* Botón Borrar / Descartar */}
      <button
        type="button"
        onClick={onCancel}
        title="Borrar audio"
        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer active:scale-95"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Botón Pausar / Reanudar */}
      <button
        type="button"
        onClick={onTogglePause}
        title={isPaused ? 'Reanudar grabación' : 'Pausar grabación'}
        className="p-1.5 text-zinc-300 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition cursor-pointer active:scale-95"
      >
        {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
      </button>

      {/* Botón Enviar Audio */}
      <button
        type="button"
        onClick={onSend}
        title="Enviar nota de voz"
        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
