import React, { useRef, useEffect, useState } from 'react';
import { Send, LogOut, Paperclip } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from './ProductRAGBadge';
import { ProductChatTheme, ThemeStyles } from './productThemes';
import { FlyingPaperPlane } from '../FlyingPaperPlane';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string;
  productTitle: string; messages: ProductChatMessage[];
  inputValue: string; isLoading: boolean;
  theme: ProductChatTheme; themeStyles: ThemeStyles;
  onThemeChange?: (t: ProductChatTheme) => void;
  onInputChange: (val: string) => void; onSendMessage: () => void; onExit?: () => void;
}

export const ProductChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, productTitle, messages, inputValue,
  isLoading, themeStyles, onInputChange, onSendMessage, onExit
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

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';

  return (
    <section className={`flex flex-col h-full ${themeStyles.containerBg} border-b lg:border-b-0 lg:border-r ${themeStyles.chatColumnBorder} overflow-hidden relative min-h-0`}>
      {/* Header exactly matching reference photo */}
      <header className={`h-11 px-3.5 ${themeStyles.headerBg} border-b ${themeStyles.headerBorder} flex items-center justify-between z-10 shrink-0 select-none`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img src={agentAvatar || defaultAvatar} alt={agentName} className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shadow-sm" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#1c1a1a]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className={`text-xs sm:text-sm font-bold ${themeStyles.textPrimary} tracking-tight truncate`}>{storeName}</h2>
            <span className={`hidden sm:inline text-[11px] ${themeStyles.textSecondary} font-medium truncate`}>• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea
            </span>
          </div>
        </div>

        {onExit && (
          <button type="button" onClick={onExit} className={`flex items-center gap-1.5 text-xs font-bold p-1 cursor-pointer ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition`} title="Volver al panel">
            <LogOut className="w-3.5 h-3.5" /> <span>Salir</span>
          </button>
        )}
      </header>

      {/* Messages Scroll Area with 8px Dot Grid */}
      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 ${themeStyles.messagesAreaBg} min-h-0`}>
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}>
              <div className={`w-fit max-w-[85%] sm:max-w-[78%] px-3 py-1.5 text-xs sm:text-sm animate-bubble-in ${isAssistant ? themeStyles.botBubble : themeStyles.userBubble}`}>
                {isAssistant && msg.ragTrace ? (
                  <div className="space-y-1">
                    <div className="whitespace-pre-wrap leading-snug">{msg.content}</div>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <ProductRAGBadge trace={msg.ragTrace} />
                      <span className={`text-[10px] ${themeStyles.textSecondary} shrink-0 self-end select-none`}>{msg.timestamp || '20:03'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="whitespace-pre-wrap leading-snug break-words">{msg.content}</span>
                    <span className={`text-[10px] shrink-0 self-end select-none tabular-nums ${isAssistant ? themeStyles.textSecondary : 'opacity-70'}`}>{msg.timestamp || '20:03'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start justify-start animate-fade-in">
            <div className={`${themeStyles.botBubble} px-3 py-2 flex items-center gap-1.5`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className={`text-xs ${themeStyles.textSecondary} ml-1`}>Consultando catálogo oficial...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Attachment Paperclip and Honey Amber Send Button */}
      <footer className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 ${themeStyles.inputFooterBg} border-t shrink-0`}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className={`flex items-end gap-1.5 ${themeStyles.inputBoxBg} border ${themeStyles.inputBoxBorder} rounded-xl px-2.5 py-1 transition shadow-inner`}>
          <button type="button" className="text-zinc-500 hover:text-zinc-300 p-1 self-end mb-0.5 transition cursor-pointer" title="Adjuntar">
            <Paperclip className="w-3.5 h-3.5" />
          </button>
          <textarea
            ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={handleKeyDown}
            placeholder="Pregúntale..."
            className={`flex-1 bg-transparent text-xs sm:text-sm ${themeStyles.inputTextColor} ${themeStyles.inputPlaceholder} focus:outline-none resize-none leading-snug py-0.5 min-h-[22px] max-h-[100px] overflow-y-auto block`}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className={`p-1.5 rounded-lg ${themeStyles.sendBtn} disabled:opacity-40 transition active:scale-95 shrink-0 cursor-pointer self-end mb-0.5`} title="Enviar">
            <Send className={`w-3.5 h-3.5 ${themeStyles.sendIconColor}`} />
          </button>
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
