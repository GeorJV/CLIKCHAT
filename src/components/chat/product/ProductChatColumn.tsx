import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, LogOut } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from './ProductRAGBadge';

interface Props {
  storeName: string;
  agentName: string;
  agentAvatar?: string;
  productTitle: string;
  messages: ProductChatMessage[];
  inputValue: string;
  isLoading: boolean;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  onExit?: () => void;
}

export const ProductChatColumn: React.FC<Props> = ({
  storeName,
  agentName,
  agentAvatar,
  productTitle,
  messages,
  inputValue,
  isLoading,
  onInputChange,
  onSendMessage,
  onExit,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';

  return (
    <section className="flex flex-col h-full bg-[#151414] border-b lg:border-b-0 lg:border-r border-[#262424] overflow-hidden relative min-h-0">
      {/* Slim Header */}
      <header className="h-11 px-3 bg-[#111010] border-b border-[#262424] flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={agentAvatar || defaultAvatar}
              alt={agentName}
              className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#111010]" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              En línea
            </span>
          </div>
        </div>

        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition text-xs font-bold p-1 cursor-pointer"
            title="Volver al panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#141313] min-h-0">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex gap-2.5 items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}>
              {isAssistant && (
                <img
                  src={agentAvatar || defaultAvatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/30 shrink-0 mt-1"
                />
              )}
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isAssistant
                    ? 'bg-[#1a1919] border border-[#282626] text-zinc-200 rounded-tl-xs'
                    : 'bg-emerald-600 text-white rounded-tr-xs font-medium shadow-emerald-600/20'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {isAssistant && msg.ragTrace && <ProductRAGBadge trace={msg.ragTrace} />}
                <div className={`text-[10px] mt-1.5 text-right ${isAssistant ? 'text-zinc-500' : 'text-emerald-100'}`}>
                  {msg.timestamp || '08:22 PM'}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-start animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-[#1f1e1e] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-[#1a1919] border border-[#282626] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-zinc-400 ml-1">Consultando catálogo oficial...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <footer className="p-2.5 bg-[#111010] border-t border-[#262424] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-center gap-2 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-xl px-3 py-1.5 transition shadow-inner"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Pregúntale a ${agentName} sobre ${productTitle}...`}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </section>
  );
};
