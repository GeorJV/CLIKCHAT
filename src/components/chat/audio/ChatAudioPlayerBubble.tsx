import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, CheckCheck } from 'lucide-react';

interface ChatAudioPlayerBubbleProps {
  audioUrl?: string;
  duration?: number;
  timestamp?: string;
  isUser?: boolean;
}

const BARS = [30, 55, 80, 40, 70, 95, 60, 45, 85, 65, 45, 80, 90, 40, 55, 75, 50, 30];

export const ChatAudioPlayerBubble: React.FC<ChatAudioPlayerBubbleProps> = ({
  audioUrl,
  duration = 3,
  timestamp,
  isUser = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
    audio.onerror = () => { setIsPlaying(false); setCurrentTime(0); };
    return () => { audio.pause(); audioRef.current = null; };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const currentDisplayTime = isPlaying ? currentTime : duration;
  const progressRatio = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return (
    <div className="flex items-center gap-2 py-0.5 select-none w-[175px] sm:w-[185px]">
      {/* Botón de reproducción ultra esbelto */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!audioUrl}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer shadow-sm ${
          isUser
            ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300'
            : 'bg-emerald-500 text-white hover:bg-emerald-400'
        }`}
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
      </button>

      {/* Columna central compacta: ondas arriba, métricas abajo */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center justify-between h-3.5 px-0.5">
          {BARS.map((height, i) => {
            const barProgress = (i + 1) / BARS.length;
            const isFilled = isPlaying && barProgress <= progressRatio;
            return (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className={`w-[2px] rounded-full transition-colors duration-150 ${
                  isFilled
                    ? isUser ? 'bg-amber-300' : 'bg-emerald-400'
                    : isUser ? 'bg-white/45' : 'bg-zinc-600'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-0.5 px-0.5 text-[9px] text-white/80 font-mono leading-none">
          <span>{formatSeconds(currentDisplayTime)}</span>
          <span className="flex items-center gap-0.5 text-[8.5px] opacity-80">
            {timestamp || '20:03'}
            <CheckCheck className="w-2.5 h-2.5 text-sky-400 inline" />
          </span>
        </div>
      </div>

      {/* Micrófono sutil alineado al centro */}
      <div className="relative shrink-0 flex items-center pr-0.5">
        <Mic className={`w-3 h-3 ${isUser ? 'text-amber-300/80' : 'text-emerald-400/80'}`} />
      </div>
    </div>
  );
};
