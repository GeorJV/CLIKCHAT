import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, LogOut } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from '../product/ProductRAGBadge';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) onSendMessage();
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
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-[#141313] min-h-0">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex gap-2 items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}>
              {isAssistant && (
                <img src={agentAvatar || defaultAvatar} alt="Avatar" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-emerald-500/30 shrink-0 mt-0.5" />
              )}
              <div className={`max-w-[90%] sm:max-w-[82%] rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm shadow-sm ${
                isAssistant ? 'bg-[#1a1919] border border-[#282626] text-zinc-200 rounded-tl-xs' : 'bg-emerald-600 text-white rounded-tr-xs font-medium shadow-emerald-600/20'
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
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-0.5">
                    <span className="whitespace-pre-wrap leading-snug flex-1 min-w-[60px]">{msg.content}</span>
                    <span className={`text-[10px] shrink-0 self-end ml-auto select-none ${isAssistant ? 'text-zinc-500' : 'text-emerald-100/80'}`}>{msg.timestamp || '08:22 PM'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2 items-start animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-[#1f1e1e] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 animate-spin" />
            </div>
            <div className="bg-[#1a1919] border border-[#282626] rounded-2xl rounded-tl-xs px-3 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-zinc-400 ml-1">Consultando agenda disponible...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Auto-Expand Multiline & Shift+Enter support */}
      <footer className="p-2.5 bg-[#111010] border-t border-[#262424] shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); if (inputValue.trim() && !isLoading) onSendMessage(); }} className="flex items-end gap-2 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-xl px-3 py-1.5 transition shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={`Consulta a ${agentName} sobre ${serviceTitle}... (Shift+Enter para nueva línea)`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-1 min-h-[26px] max-h-[120px] overflow-y-auto"
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer mb-0.5" title="Enviar mensaje">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </section>
  );
};
