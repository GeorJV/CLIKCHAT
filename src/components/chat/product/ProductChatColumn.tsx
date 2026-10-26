import React, { useRef, useEffect, useState } from 'react';
import { Send, LogOut, Paperclip, RotateCcw } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ProductRAGBadge } from './ProductRAGBadge';
import { isBusinessAdminViewer } from '../../../utils/adminCheck';
import { ProductChatTheme, ThemeStyles } from './productThemes';
import { FlyingPaperPlane } from '../FlyingPaperPlane';
import { ChatMicButton } from '../audio/ChatMicButton';
import { ChatAudioPlayerBubble } from '../audio/ChatAudioPlayerBubble';
import { ChatMessageContent } from '../ChatMessageContent';
import { QuickActionButtons } from '../QuickActionButtons';
import { splitMessageByDeliveryMode, DeliveryMode } from '../../../utils/messageSplitter';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string; productTitle: string; messages: ProductChatMessage[];
  inputValue: string; isLoading: boolean; theme: ProductChatTheme; themeStyles: ThemeStyles; onThemeChange?: (t: ProductChatTheme) => void;
  deliveryMode?: DeliveryMode; onInputChange: (val: string) => void; onSendMessage: (text?: string, fromVoice?: boolean) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void; onExit?: () => void; onResetChat?: () => void;
}

export const ProductChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, messages, inputValue, isLoading, themeStyles, deliveryMode, onInputChange, onSendMessage, onAudioRecorded, onExit, onResetChat
}) => {
  const [flightKey, setFlightKey] = useState(0);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const t = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 120);
    return () => clearTimeout(t);
  }, [messages, isLoading]);

  useEffect(() => {
    const handleScroll = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    window.addEventListener('clikchat:scroll-bottom', handleScroll);
    return () => window.removeEventListener('clikchat:scroll-bottom', handleScroll);
  }, []);
  useEffect(() => { if (!inputValue && textareaRef.current) textareaRef.current.style.height = 'auto'; }, [inputValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; }
  };
  const handleSend = () => { if (inputValue.trim() && !isLoading) { setFlightKey(Date.now()); onSendMessage(inputValue); } };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <section className={`flex flex-col h-full ${themeStyles.containerBg} border-b md:border-b-0 md:border-r ${themeStyles.chatColumnBorder} overflow-hidden relative min-h-0`}>
      <header className={`h-12 px-3.5 ${themeStyles.headerBg} border-b ${themeStyles.headerBorder} flex items-center justify-between z-10 shrink-0 select-none`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            {agentAvatar ? (
              <img src={agentAvatar} alt={agentName} className="w-9 h-9 sm:w-7 sm:h-7 rounded-full object-cover border border-emerald-500/50 shadow-sm" />
            ) : (
              <div className="w-9 h-9 sm:w-7 sm:h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-sm">
                {storeName ? storeName.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#1c1a1a]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className={`text-sm sm:text-sm font-bold ${themeStyles.textPrimary} tracking-tight truncate`}>{storeName}</h2>
            <span className={`hidden sm:inline text-[11px] ${themeStyles.textSecondary} font-medium truncate`}>• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onResetChat && (
            <button type="button" onClick={onResetChat} className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg cursor-pointer ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition`} title="Reiniciar chat">
              <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
          {onExit && (
            <button type="button" onClick={onExit} className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg cursor-pointer ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition`} title="Volver al panel">
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>
      </header>

      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col ${themeStyles.messagesAreaBg} min-h-0`}>
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          const activeMode: DeliveryMode = deliveryMode || (typeof window !== 'undefined' ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) : null) || 'moderate';
          const bubbles = isAssistant && !msg.isAudio ? splitMessageByDeliveryMode(msg.content, activeMode) : [];

          if (isAssistant && !msg.isAudio && bubbles.length > 1) {
            return (
              <div key={msg.id} className="flex flex-col items-start w-full space-y-1.5 mt-2">
                {bubbles.map((chunk, bIdx) => (
                  <div key={`${msg.id}-b-${bIdx}`} className={`w-fit max-w-[88%] sm:max-w-[80%] px-3.5 py-2 text-xs sm:text-sm animate-bubble-in break-words overflow-hidden min-w-0 ${themeStyles.botBubble} origin-bottom-left`}>
                    <div className="space-y-1.5 min-w-0">
                      <ChatMessageContent content={chunk} isUser={false} onActionClick={onSendMessage} />
                      {bIdx === bubbles.length - 1 && msg.quickActions && msg.quickActions.length > 0 && (
                        <QuickActionButtons actions={msg.quickActions} onSelect={onSendMessage} disabled={isLoading} />
                      )}
                      {bIdx === bubbles.length - 1 && (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                          {msg.ragTrace && isBusinessAdminViewer() ? <ProductRAGBadge trace={msg.ragTrace} /> : <span />}
                          <span className={`text-[10px] ${themeStyles.textSecondary} shrink-0 self-end select-none`}>{msg.timestamp || '20:03'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-start w-full ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-0.5' : idx === 0 ? 'mt-0' : 'mt-2'}`}>
              <div className={`w-fit animate-bubble-in break-words overflow-hidden min-w-0 ${msg.isAudio ? 'px-2 py-0.5' : isAssistant ? 'max-w-[88%] sm:max-w-[80%] px-3.5 py-2 text-xs sm:text-sm' : 'max-w-[85%] sm:max-w-[78%] px-3 py-1.5 text-xs sm:text-sm'} ${isAssistant ? `${themeStyles.botBubble} origin-bottom-left` : `${themeStyles.userBubble} origin-bottom-right`}`}>
                {msg.isAudio ? <ChatAudioPlayerBubble audioUrl={msg.audioUrl} duration={msg.audioDuration} timestamp={msg.timestamp} isUser={!isAssistant} /> : isAssistant ? (
                  <div className="space-y-1.5 min-w-0">
                    <ChatMessageContent content={msg.content} isUser={false} onActionClick={onSendMessage} />
                    {msg.quickActions && msg.quickActions.length > 0 && <QuickActionButtons actions={msg.quickActions} onSelect={onSendMessage} disabled={isLoading} />}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                      {msg.ragTrace && isBusinessAdminViewer() ? <ProductRAGBadge trace={msg.ragTrace} /> : <span />}
                      <span className={`text-[10px] ${themeStyles.textSecondary} shrink-0 self-end select-none`}>{msg.timestamp || '20:03'}</span>
                    </div>
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

      <footer className={`px-2.5 py-2 sm:px-3 sm:py-1.5 ${themeStyles.inputFooterBg} border-t shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]`}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className={`flex items-end gap-2 ${themeStyles.inputBoxBg} border ${themeStyles.inputBoxBorder} rounded-2xl sm:rounded-xl px-3 py-1.5 sm:px-2.5 sm:py-1 transition shadow-inner`}>
          <button type="button" className="text-zinc-500 hover:text-zinc-300 p-1.5 self-end mb-0.5 transition cursor-pointer" title="Adjuntar"><Paperclip className="w-4 h-4 sm:w-3.5 sm:h-3.5" /></button>
          {isAudioRecording ? (
            <div className="flex-1 flex items-center justify-between gap-2 py-1 px-1 select-none animate-fade-in min-h-[42px] sm:min-h-[22px]">
              <div className="flex items-center gap-1.5 shrink-0"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /><span className="text-xs sm:text-[11px] font-mono font-bold text-red-400">Grabando...</span></div>
              <div className="flex-1 flex items-center justify-center gap-0.5 px-1 max-w-[120px]">
                <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-5 bg-red-500 rounded-full animate-pulse [animation-delay:75ms]" />
                <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-0.5 h-5.5 bg-red-500 rounded-full animate-pulse [animation-delay:100ms]" />
                <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse [animation-delay:200ms]" />
              </div>
              <span className="text-[11px] sm:text-[10px] text-zinc-400 truncate">Suelta para enviar</span>
            </div>
          ) : (
            <textarea
              ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={handleKeyDown}
              placeholder="Pregúntale..."
              className={`flex-1 bg-transparent text-[15px] sm:text-xs ${themeStyles.inputTextColor} ${themeStyles.inputPlaceholder} focus:outline-none resize-none leading-snug py-1.5 sm:py-0.5 min-h-[42px] sm:min-h-[22px] max-h-[120px] overflow-y-auto block`}
            />
          )}
          {inputValue.trim() ? (
            <button type="submit" disabled={isLoading} className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full sm:rounded-lg ${themeStyles.sendBtn} disabled:opacity-40 transition active:scale-95 shrink-0 cursor-pointer self-end mb-0.5 flex items-center justify-center`} title="Enviar">
              <Send className={`w-5 h-5 sm:w-3.5 sm:h-3.5 ${themeStyles.sendIconColor}`} />
            </button>
          ) : (
            <ChatMicButton disabled={isLoading} onRecordingChange={setIsAudioRecording} onAudioRecorded={onAudioRecorded} onTranscription={(t) => onSendMessage(t, true)} />
          )}
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
