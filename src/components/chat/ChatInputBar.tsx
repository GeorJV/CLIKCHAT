import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMicButton } from './audio/ChatMicButton';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void;
  onInputFocus?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onAudioRecorded,
  onInputFocus,
  isLoading,
  placeholder = 'Escribe tu mensaje o consulta comercial...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputValue && textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="p-2 sm:p-3 bg-slate-900 border-t border-slate-800 flex items-end gap-2 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      {isAudioRecording ? (
        <div className="flex-1 flex items-center justify-between gap-2 py-2 px-3 rounded-2xl sm:rounded-xl bg-slate-800 border border-slate-700 select-none animate-fade-in min-h-[42px] sm:min-h-[32px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs sm:text-[11px] font-mono font-bold text-red-400">Grabando...</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-0.5 px-2 max-w-[140px]">
            <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse" />
            <span className="w-0.5 h-5 bg-red-500 rounded-full animate-pulse [animation-delay:75ms]" />
            <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="w-0.5 h-6 bg-red-500 rounded-full animate-pulse [animation-delay:100ms]" />
            <span className="w-0.5 h-3.5 bg-amber-400 rounded-full animate-pulse [animation-delay:200ms]" />
          </div>
          <span className="text-[11px] sm:text-[10px] text-zinc-400 truncate">Suelta para enviar</span>
        </div>
      ) : (
        <textarea
          ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onFocus={onInputFocus}
          onKeyDown={handleKeyDown} placeholder={placeholder} disabled={isLoading}
          className="flex-1 text-[15px] sm:text-xs px-3.5 py-2 sm:py-1 rounded-2xl sm:rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60 resize-none leading-snug min-h-[42px] sm:min-h-[28px] max-h-[120px] overflow-y-auto"
        />
      )}

      {inputValue.trim() ? (
        <button
          onClick={handleSend} disabled={isLoading} aria-label="Enviar mensaje"
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full sm:rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition active:scale-95 shadow-md shadow-indigo-600/30 flex items-center justify-center shrink-0 mb-0.5 cursor-pointer"
        >
          <Send className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
        </button>
      ) : (
        <ChatMicButton
          disabled={isLoading}
          onRecordingChange={setIsAudioRecording}
          onAudioRecorded={onAudioRecorded}
          onTranscription={(text) => onSendMessage(text)}
        />
      )}
    </div>
  );
};
