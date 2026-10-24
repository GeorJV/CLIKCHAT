import React, { useRef, useEffect, useState } from 'react';
import { Send, LogOut, Calendar } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from '../product/ProductRAGBadge';
import { isBusinessAdminViewer } from '../../../utils/adminCheck';
import { FlyingPaperPlane } from '../FlyingPaperPlane';
import { ChatMicButton } from '../audio/ChatMicButton';
import { ChatAudioPlayerBubble } from '../audio/ChatAudioPlayerBubble';
import { ChatMessageContent } from '../ChatMessageContent';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string; serviceTitle: string;
  messages: ProductChatMessage[]; inputValue: string; isLoading: boolean;
  onInputChange: (val: string) => void; onSendMessage: (text?: string, fromVoice?: boolean) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void; onExit?: () => void;
  onOpenBooking?: () => void;
}

export const ServiceChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, serviceTitle, messages, inputValue,
  isLoading, onInputChange, onSendMessage, onAudioRecorded, onExit, onOpenBooking
}) => {
  const [flightKey, setFlightKey] = useState(0);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const t = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
    return () => clearTimeout(t);
  }, [messages, isLoading]);

  useEffect(() => { if (!inputValue && textareaRef.current) textareaRef.current.style.height = 'auto'; }, [inputValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      setFlightKey(Date.now());
      onSendMessage(inputValue);
    }
  };

  return (
    <section className="flex flex-col h-full w-full bg-[#131212] border-b lg:border-b-0 lg:border-r border-[#262424] overflow-hidden relative min-h-0 font-sans">
      <header className="h-12 px-3 sm:px-4 bg-[#171616] border-b border-[#262424] flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            {agentAvatar ? <img src={agentAvatar} alt={agentName} className="w-8 h-8 rounded-full object-cover border border-emerald-500/50 shadow-sm" /> : <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">{storeName ? storeName.charAt(0).toUpperCase() : 'C'}</div>}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#171616]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenBooking && (
            <button type="button" onClick={onOpenBooking} className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer">
              <Calendar className="w-3.5 h-3.5" /><span>Agendar Cita</span>
            </button>
          )}
          {onExit && <button type="button" onClick={onExit} className="text-xs font-bold p-1 cursor-pointer text-zinc-400 hover:text-white transition" title="Salir"><LogOut className="w-3.5 h-3.5" /></button>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col bg-[#111010] min-h-0 overscroll-contain">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          return (
            <div key={msg.id} className={`flex items-start w-full ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-0.5' : idx === 0 ? 'mt-0' : 'mt-2'}`}>
              <div className={`w-fit animate-bubble-in break-words overflow-hidden min-w-0 ${msg.isAudio ? 'px-2 py-0.5' : isAssistant ? 'max-w-[88%] sm:max-w-[80%] px-3.5 py-2 text-xs sm:text-sm' : 'max-w-[85%] sm:max-w-[78%] px-3 py-1.5 text-xs sm:text-sm'} ${isAssistant ? 'bg-[#1e1d1d] text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.12] shadow-lg shadow-black/60 origin-bottom-left' : 'bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-2xl rounded-br-sm border border-[#D79F4C]/30 shadow-md origin-bottom-right'}`}>
                {msg.isAudio ? <ChatAudioPlayerBubble audioUrl={msg.audioUrl} duration={msg.audioDuration} timestamp={msg.timestamp} isUser={!isAssistant} /> : isAssistant && msg.ragTrace && isBusinessAdminViewer() ? (
                  <div className="space-y-1.5 min-w-0">
                    <ChatMessageContent content={msg.content} isUser={false} onActionClick={onSendMessage} />
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]"><ProductRAGBadge trace={msg.ragTrace} /><span className="text-[10px] text-zinc-400 shrink-0 self-end select-none">{msg.timestamp || '20:03'}</span></div>
                  </div>
                ) : isAssistant ? (
                  <div className="space-y-1 min-w-0">
                    <ChatMessageContent content={msg.content} isUser={false} onActionClick={onSendMessage} />
                    <div className="flex justify-end"><span className="text-[10px] select-none tabular-nums text-zinc-400">{msg.timestamp || '20:03'}</span></div>
                  </div>
                ) : (
                  <div className="flow-root leading-snug"><span className="whitespace-pre-wrap break-words select-text">{msg.content}</span><span className="float-right ml-2.5 mt-0.5 text-[10px] shrink-0 select-none tabular-nums opacity-70">{msg.timestamp || '20:03'}</span></div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start justify-start animate-fade-in mt-1.5">
            <div className="bg-[#1e1d1d] border border-white/[0.12] rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" /><span className="text-xs text-zinc-400 ml-1">Consultando agenda disponible...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <div className="px-2.5 py-1.5 bg-[#141313] border-t border-[#262424] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button type="button" onClick={onOpenBooking} className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold shrink-0 flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-sm">
          <Calendar className="w-3 h-3 text-emerald-400" /><span>📅 Agendar Cita</span>
        </button>
        <button type="button" onClick={() => onSendMessage('¿Cuáles son los horarios disponibles para agendar una cita?')} className="px-2.5 py-1 rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-300 border border-[#2a2828] text-[11px] font-medium shrink-0 transition cursor-pointer">
          ⏰ Horarios disponibles
        </button>
        <button type="button" onClick={() => onSendMessage(`¿Qué incluye el servicio de ${serviceTitle}?`)} className="px-2.5 py-1 rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-300 border border-[#2a2828] text-[11px] font-medium shrink-0 transition cursor-pointer">
          💡 ¿Qué incluye?
        </button>
      </div>

      <footer className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#111010] border-t border-[#262424] shrink-0 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-1.5 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-xl px-2.5 py-1 transition shadow-inner">
          {isAudioRecording ? (
            <div className="flex-1 flex items-center justify-between gap-2 py-0.5 px-1 select-none animate-fade-in text-[11px] font-mono text-red-400">Grabando...</div>
          ) : (
            <textarea
              ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Consulta o agenda cita sobre ${serviceTitle}...`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-1 min-h-[26px] max-h-[100px] overflow-y-auto block"
            />
          )}
          {inputValue.trim() ? (
            <button type="submit" disabled={isLoading} className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer self-end mb-0.5" title="Enviar"><Send className="w-3.5 h-3.5" /></button>
          ) : (
            <ChatMicButton disabled={isLoading} onRecordingChange={setIsAudioRecording} onAudioRecorded={onAudioRecorded} onTranscription={(cleanText) => onSendMessage(cleanText, true)} />
          )}
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
