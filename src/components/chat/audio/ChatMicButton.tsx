import React, { useState, useRef } from 'react';
import { Mic, Loader2, Lock, ChevronUp } from 'lucide-react';
import { useVoiceRecorder } from '../../../hooks/useVoiceRecorder';
import { ChatMicLockedBar } from './ChatMicLockedBar';

interface ChatMicButtonProps {
  onTranscription: (cleanText: string) => void;
  disabled?: boolean;
}

export const ChatMicButton: React.FC<ChatMicButtonProps> = ({ onTranscription, disabled }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const {
    isRecording, isPaused, recordingSeconds, isTranscribing,
    startRecording, stopRecording, cancelRecording, pauseRecording, resumeRecording
  } = useVoiceRecorder({
    onTranscription: (text) => {
      setFeedback(null);
      setIsLocked(false);
      onTranscription(text);
    },
    onError: (err) => {
      setFeedback(err);
      setIsLocked(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isTranscribing || isRecording) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsPressing(true);
    setIsLocked(false);
    startRecording();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPressing || isLocked) return;
    const deltaY = e.clientY - startPos.current.y;
    const deltaX = e.clientX - startPos.current.x;

    // Deslizar arriba: Bloquea grabación manos libres tipo WhatsApp
    if (deltaY < -35) {
      setIsLocked(true);
      setIsPressing(false);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    }
    // Deslizar izquierda: Cancela y descarta
    else if (deltaX < -50) {
      cancelRecording();
      setIsPressing(false);
      setIsLocked(false);
    }
  };

  const handlePointerUp = () => {
    if (isPressing && !isLocked) {
      setIsPressing(false);
      stopRecording(); // Se envía inmediatamente al soltar el botón
    }
  };

  if (isTranscribing) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 animate-pulse shrink-0 self-end mb-0.5">
        <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
        <span className="font-semibold">Procesando audio...</span>
      </div>
    );
  }

  if (isLocked) {
    return (
      <ChatMicLockedBar
        recordingSeconds={recordingSeconds}
        isPaused={isPaused}
        onCancel={() => { cancelRecording(); setIsLocked(false); }}
        onTogglePause={() => (isPaused ? resumeRecording() : pauseRecording())}
        onSend={() => { stopRecording(); setIsLocked(false); }}
      />
    );
  }

  return (
    <div className="relative shrink-0 self-end mb-0.5 touch-none select-none">
      {/* Tooltip flotante al presionar: Deslizar arriba para fijar y deslizar izquierda para cancelar */}
      {isPressing && (
        <>
          <div className="absolute bottom-full right-0 mb-3 flex flex-col items-center gap-1 bg-[#161515] border border-amber-400/40 px-2.5 py-1.5 rounded-xl shadow-2xl text-[10px] text-zinc-200 z-50 animate-bounce pointer-events-none whitespace-nowrap">
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="font-bold flex items-center gap-0.5">
              <ChevronUp className="w-2.5 h-2.5 text-amber-400" /> Desliza arriba para fijar
            </span>
          </div>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 flex items-center gap-1.5 bg-[#161515] border border-zinc-700/60 px-2.5 py-1 rounded-xl shadow-xl text-[10px] text-zinc-400 z-50 pointer-events-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>◀ Desliza para cancelar</span>
          </div>
        </>
      )}

      {/* Botón amarillo dorado */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { if (!isLocked) { cancelRecording(); setIsPressing(false); } }}
        disabled={disabled}
        title="Mantén presionado para hablar (suelta para enviar, desliza arriba para fijar)"
        className={`p-1.5 rounded-lg bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-zinc-950 font-semibold shadow-md shadow-yellow-500/30 ring-1 ring-yellow-200/80 transition cursor-pointer flex items-center justify-center shrink-0 ${
          isPressing ? 'scale-110 ring-4 ring-yellow-400/50' : 'active:scale-95'
        }`}
      >
        <Mic className="w-3.5 h-3.5 text-zinc-950 stroke-[2.4]" />
      </button>

      {feedback && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#1a1818] border border-amber-500/40 rounded-xl text-[10px] text-amber-200 shadow-xl z-50 animate-fade-in">
          {feedback}
        </div>
      )}
    </div>
  );
};
