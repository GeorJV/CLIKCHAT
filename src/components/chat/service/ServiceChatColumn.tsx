import React, { useRef, useEffect, useState } from 'react';
import { Send, Sparkles, LogOut } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from '../product/ProductRAGBadge';
import { FlyingPaperPlane } from '../FlyingPaperPlane';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string;
  serviceTitle: string; messages: ProductChatMessage[];
  inputValue: string; isLoading: boolean;
  onInputChange: (val: string) => void; onSendMessage: () => void; onExit?: () => void;
}

export const ServiceChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, serviceTitle,
  messages, inputValue, isLoading, onInputChange, onSendMessage, onExit
}) => {
  const [flightKey, setFlightKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!inputValue && textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [inputValue]);

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
      onSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120';

  return (
    <section className="flex flex-col h-full bg-[#151414] border-b lg:border-b-0 lg:border-r border-[#262424] overflow-hidden relative min-h-0">
      {/* Slim Header */}
      <header className="h-11 px-3 bg-[#111010] border-b border-[#262424] flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img src={agentAvatar || defaultAvatar} alt={agentName} className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shadow-sm" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#111010]" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Especialista
            </span>
          </div>
        </div>
        {onExit && (
          <button type="button" onClick={onExit} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition text-xs font-bold p-1 cursor-pointer" title="Volver al panel">
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Salir</span>
          </button>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col bg-[#141313] min-h-0">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          return (
            <div key={msg.id} className={`flex items-start ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-0.5' : idx === 0 ? 'mt-0' : 'mt-2'}`}>
              <div className={`w-fit max-w-[85%] sm:max-w-[78%] rounded-2xl px-3 py-1.5 text-xs sm:text-sm shadow-sm animate-bubble-in ${
                isAssistant ? 'bg-[#1a1919] border border-[#282626] text-zinc-200 rounded-tl-xs shadow-lg shadow-black/60 origin-bottom-left' : 'bg-[#D79F4C]/50 backdrop-blur-md border border-[#D79F4C]/40 text-white rounded-tr-xs font-medium shadow-sm origin-bottom-right'
              }`}>
                {isAssistant && msg.ragTrace ? (
                  <div className="space-y-1">
                    <div className="whitespace-pre-wrap leading-snug">{msg.content}</div>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <ProductRAGBadge trace={msg.ragTrace} />
                      <span className="text-[10px] text-zinc-500 shrink-0 self-end select-none">{msg.timestamp || '08:22 PM'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="whitespace-pre-wrap leading-snug break-words">{msg.content}</span>
                    <span className={`text-[10px] shrink-0 self-end select-none tabular-nums ${isAssistant ? 'text-zinc-500' : 'text-zinc-900/70'}`}>{msg.timestamp || '08:22 PM'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start justify-start animate-fade-in mt-1.5">
            <div className="bg-[#1a1919] border border-[#282626] rounded-2xl rounded-tl-xs px-3 py-2 flex items-center gap-1.5 shadow-lg shadow-black/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-zinc-400 ml-1">Consultando agenda disponible...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Auto-Expand Multiline & Shift+Enter support - Optimized Minimal Height */}
      <footer className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-[#111010] border-t border-[#262424] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-1.5 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-xl px-2.5 py-1 transition shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={`Consulta a ${agentName} sobre ${serviceTitle}... (Shift+Enter para nueva línea)`}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-0.5 min-h-[22px] max-h-[100px] overflow-y-auto block"
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer self-end mb-0.5" title="Enviar mensaje">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
