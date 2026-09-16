import React from 'react';
import { Mic, Square, X, Loader2 } from 'lucide-react';
import { useVoiceRecorder } from '../../../hooks/useVoiceRecorder';

interface ChatMicButtonProps {
  onTranscription: (cleanText: string) => void;
  disabled?: boolean;
}

export const ChatMicButton: React.FC<ChatMicButtonProps> = ({ onTranscription, disabled }) => {
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const {
    isRecording,
    recordingSeconds,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useVoiceRecorder({
    onTranscription: (text) => {
      setFeedback(null);
      onTranscription(text);
    },
    onError: (err) => {
      setFeedback(err);
      setTimeout(() => setFeedback(null), 4000);
    }
  });

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (isTranscribing) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 animate-pulse shrink-0 self-end mb-0.5">
        <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
        <span className="font-semibold">Procesando audio...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2 bg-red-950/70 border border-red-500/40 rounded-xl px-2.5 py-1 text-xs shrink-0 self-end mb-0.5 shadow-lg shadow-red-900/20 animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span className="font-mono font-bold text-red-300 tabular-nums text-[11px]">{formatTime(recordingSeconds)}</span>
        <button
          type="button"
          onClick={cancelRecording}
          title="Cancelar grabación"
          className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={stopRecording}
          title="Enviar audio"
          className="p-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative shrink-0 self-end mb-0.5">
      <button
        type="button"
        onClick={startRecording}
        disabled={disabled}
        title="Grabar nota de voz"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition active:scale-95 disabled:opacity-40 cursor-pointer"
      >
        <Mic className="w-3.5 h-3.5" />
      </button>

      {feedback && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#1a1818] border border-amber-500/40 rounded-xl text-[10px] text-amber-200 shadow-xl z-50 animate-fade-in">
          {feedback}
        </div>
      )}
    </div>
  );
};
