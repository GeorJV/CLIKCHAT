import React, { useRef, useEffect, useState } from 'react';
import { Send, LogOut } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from '../product/ProductRAGBadge';
import { FlyingPaperPlane } from '../FlyingPaperPlane';
import { ChatMicButton } from '../audio/ChatMicButton';
import { ChatAudioPlayerBubble } from '../audio/ChatAudioPlayerBubble';
import { ChatMessageContent } from '../ChatMessageContent';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string; serviceTitle: string;
  messages: ProductChatMessage[]; inputValue: string; isLoading: boolean;
  onInputChange: (val: string) => void; onSendMessage: (text?: string, fromVoice?: boolean) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void; onExit?: () => void;
}

export const ServiceChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, serviceTitle, messages, inputValue,
  isLoading, onInputChange, onSendMessage, onAudioRecorded, onExit
}) => {
  const [flightKey, setFlightKey] = useState(0);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120';

  return (
    <section className="flex flex-col h-full bg-[#131212] border-b lg:border-b-0 lg:border-r border-[#262424] overflow-hidden relative min-h-0 font-sans">
      <header className="h-11 px-3.5 bg-[#171616] border-b border-[#262424] flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img src={agentAvatar || defaultAvatar} alt={agentName} className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shadow-sm" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#171616]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea</span>
          </div>
        </div>
        {onExit && (
          <button type="button" onClick={onExit} className="flex items-center gap-1.5 text-xs font-bold p-1 cursor-pointer text-zinc-400 hover:text-white transition" title="Volver al panel">
            <LogOut className="w-3.5 h-3.5" /> <span>Salir</span>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col bg-[#111010] min-h-0">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          return (
            <div key={msg.id} className={`flex items-start w-full ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-0.5' : idx === 0 ? 'mt-0' : 'mt-2'}`}>
              <div className={`w-fit animate-bubble-in break-words [overflow-wrap:anywhere] overflow-hidden min-w-0 ${msg.isAudio ? 'px-2 py-0.5' : 'max-w-[88%] sm:max-w-[80%] px-3.5 py-2 text-xs sm:text-sm'} ${isAssistant ? 'bg-[#1e1d1d] text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.12] shadow-lg shadow-black/60 origin-bottom-left' : 'bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-2xl rounded-br-sm border border-[#D79F4C]/30 shadow-md origin-bottom-right'}`}>
                {msg.isAudio ? (
                  <ChatAudioPlayerBubble audioUrl={msg.audioUrl} duration={msg.audioDuration} timestamp={msg.timestamp} isUser={!isAssistant} />
                ) : isAssistant && msg.ragTrace ? (
                  <div className="space-y-1.5 min-w-0">
                    <ChatMessageContent content={msg.content} isUser={false} />
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                      <ProductRAGBadge trace={msg.ragTrace} />
                      <span className="text-[10px] text-zinc-400 shrink-0 self-end select-none">{msg.timestamp || '20:03'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 min-w-0">
                    <ChatMessageContent content={msg.content} isUser={!isAssistant} />
                    <div className="flex justify-end">
                      <span className={`text-[10px] select-none tabular-nums ${isAssistant ? 'text-zinc-400' : 'opacity-70'}`}>{msg.timestamp || '20:03'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-start justify-start animate-fade-in mt-1.5">
            <div className="bg-[#1e1d1d] border border-white/[0.12] rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-zinc-400 ml-1">Consultando agenda disponible...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-[#111010] border-t border-[#262424] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-1.5 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-xl px-2.5 py-1 transition shadow-inner">
          {isAudioRecording ? (
            <div className="flex-1 flex items-center justify-between gap-2 py-0.5 px-1 select-none animate-fade-in">
              <div className="flex items-center gap-1.5 shrink-0"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /><span className="text-[11px] font-mono font-bold text-red-400">Grabando...</span></div>
              <div className="flex-1 flex items-center justify-center gap-0.5 px-1 max-w-[120px]">
                <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-4 bg-red-500 rounded-full animate-pulse [animation-delay:75ms]" />
                <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-0.5 h-4.5 bg-red-500 rounded-full animate-pulse [animation-delay:100ms]" />
                <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-pulse [animation-delay:200ms]" />
              </div>
              <span className="text-[10px] text-zinc-400 truncate">Suelta para enviar</span>
            </div>
          ) : (
            <textarea
              ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={handleKeyDown}
              placeholder={`Consulta a ${agentName} sobre ${serviceTitle}...`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-0.5 min-h-[22px] max-h-[100px] overflow-y-auto block"
            />
          )}
          {inputValue.trim() ? (
            <button type="submit" disabled={isLoading} className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer self-end mb-0.5" title="Enviar">
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <ChatMicButton
              disabled={isLoading}
              onRecordingChange={setIsAudioRecording}
              onAudioRecorded={onAudioRecorded}
              onTranscription={(cleanText) => onSendMessage(cleanText, true)}
            />
          )}
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
