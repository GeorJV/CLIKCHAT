import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Send, LogOut, Calendar, CalendarCheck } from 'lucide-react';
import { ProductChatMessage } from '../../../types/productChat';
import { ServiceBookingData } from '../../../types/serviceChat';
import { ProductRAGBadge } from '../product/ProductRAGBadge';
import { isBusinessAdminViewer } from '../../../utils/adminCheck';
import { FlyingPaperPlane } from '../FlyingPaperPlane';
import { ChatMicButton } from '../audio/ChatMicButton';
import { ChatAudioPlayerBubble } from '../audio/ChatAudioPlayerBubble';
import { ChatMessageContent } from '../ChatMessageContent';
import { BookingCardBubble } from './BookingCardBubble';
import { splitMessageByDeliveryMode, DeliveryMode } from '../../../utils/messageSplitter';
import { parseBookingCard } from '../../../utils/bookingCardParser';

interface Props {
  storeName: string; agentName: string; agentAvatar?: string; serviceTitle: string; messages: ProductChatMessage[];
  inputValue: string; isLoading: boolean; confirmedBooking?: ServiceBookingData | null; businessPhone?: string;
  deliveryMode?: DeliveryMode; onInputChange: (val: string) => void; onSendMessage: (text?: string, fromVoice?: boolean) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void; onExit?: () => void;
  onOpenBooking?: () => void; onOpenConfirmedModal?: () => void; onConfirmBookingFromCard?: (data: ServiceBookingData) => void;
}

export const ServiceChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, serviceTitle, messages, inputValue, isLoading, confirmedBooking, businessPhone = '50672935612', deliveryMode,
  onInputChange, onSendMessage, onAudioRecorded, onExit, onOpenBooking, onOpenConfirmedModal, onConfirmBookingFromCard
}) => {
  const [flightKey, setFlightKey] = useState(0);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
    const t1 = setTimeout(() => scrollToBottom('smooth'), 80);
    const t2 = setTimeout(() => scrollToBottom('smooth'), 220);
    const t3 = setTimeout(() => scrollToBottom('auto'), 450);
    const t4 = setTimeout(() => scrollToBottom('auto'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      scrollToBottom('smooth');
      setTimeout(() => scrollToBottom('smooth'), 100);
      setTimeout(() => scrollToBottom('auto'), 300);
    };
    window.addEventListener('clikchat:scroll-bottom', handleScroll);
    return () => window.removeEventListener('clikchat:scroll-bottom', handleScroll);
  }, [scrollToBottom]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; }
  };
  const handleSend = () => { if (inputValue.trim() && !isLoading) { setFlightKey(Date.now()); onSendMessage(inputValue); } };

  return (
    <section className="flex flex-col h-full w-full bg-[#131212] border-b lg:border-b-0 lg:border-r border-[#262424] overflow-hidden relative min-h-0 font-sans">
      <header className="h-12 px-3 sm:px-4 bg-[#171616] border-b border-[#262424] flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            {agentAvatar ? <img src={agentAvatar} alt={agentName} className="w-9 h-9 sm:w-8 sm:h-8 rounded-full object-cover border border-emerald-500/50 shadow-sm" /> : <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">{storeName ? storeName.charAt(0).toUpperCase() : 'C'}</div>}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-[#171616]" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onExit && <button type="button" onClick={onExit} className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition" title="Salir"><LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" /></button>}
        </div>
      </header>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 pb-10 sm:pb-14 flex flex-col bg-[#111010] min-h-0 overscroll-contain">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          const isNextSameSender = idx < messages.length - 1 && messages[idx + 1].sender === msg.sender;
          const { cleanContent, bookingData } = isAssistant ? parseBookingCard(msg.content) : { cleanContent: msg.content, bookingData: null };
          const activeMode: DeliveryMode = deliveryMode || (typeof window !== 'undefined' ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) : null) || 'moderate';
          const bubbles = isAssistant && !msg.isAudio ? splitMessageByDeliveryMode(cleanContent, activeMode) : [];

          if (isAssistant && !msg.isAudio && bubbles.length > 1) {
            return (
              <div key={msg.id} className="flex flex-col items-start w-full space-y-1.5 mt-2">
                {bubbles.map((chunk, bIdx) => (
                  <div key={`${msg.id}-b-${bIdx}`} className="w-fit max-w-[92%] sm:max-w-[85%] px-3.5 py-2 text-xs sm:text-sm bg-[#1e1d1d] text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.12] shadow-lg shadow-black/60 origin-bottom-left animate-bubble-in break-words overflow-hidden min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <ChatMessageContent content={chunk} isUser={false} onActionClick={onSendMessage} />
                      {bIdx === bubbles.length - 1 && bookingData && (
                        <BookingCardBubble bookingData={bookingData} isConfirmed={Boolean(confirmedBooking && (confirmedBooking.date === bookingData.date || confirmedBooking.timeSlot === bookingData.timeSlot))} storeName={storeName} businessPhone={businessPhone} onConfirm={(d) => onConfirmBookingFromCard?.(d)} />
                      )}
                      {bIdx === bubbles.length - 1 && (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                          {msg.ragTrace && isBusinessAdminViewer() ? <ProductRAGBadge trace={msg.ragTrace} /> : <span />}
                          <span className="text-[10px] select-none tabular-nums text-zinc-400">{msg.timestamp || '20:03'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-start w-full ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-1' : idx === 0 ? 'mt-0' : 'mt-2.5'}`}>
              <div className={`w-fit animate-bubble-in break-words overflow-hidden min-w-0 ${msg.isAudio ? 'px-2 py-0.5' : isAssistant ? 'max-w-[92%] sm:max-w-[85%] px-3.5 py-2 text-xs sm:text-sm bg-[#1e1d1d] text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.12] shadow-lg shadow-black/60 origin-bottom-left' : 'max-w-[85%] sm:max-w-[78%] px-3 py-1.5 text-xs sm:text-sm bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-2xl rounded-br-sm border border-[#D79F4C]/30 shadow-md origin-bottom-right'}`}>
                {msg.isAudio ? <ChatAudioPlayerBubble audioUrl={msg.audioUrl} duration={msg.audioDuration} timestamp={msg.timestamp} isUser={!isAssistant} /> : isAssistant ? (
                  <div className="space-y-1.5 min-w-0">
                    {cleanContent && <ChatMessageContent content={cleanContent} isUser={false} onActionClick={onSendMessage} />}
                    {bookingData && <BookingCardBubble bookingData={bookingData} isConfirmed={Boolean(confirmedBooking && (confirmedBooking.date === bookingData.date || confirmedBooking.timeSlot === bookingData.timeSlot))} storeName={storeName} businessPhone={businessPhone} onConfirm={(d) => onConfirmBookingFromCard?.(d)} />}
                    {(!isNextSameSender || msg.ragTrace) && (
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                        {msg.ragTrace && isBusinessAdminViewer() ? <ProductRAGBadge trace={msg.ragTrace} /> : <span />}
                        <span className="text-[10px] select-none tabular-nums text-zinc-400">{msg.timestamp || '20:03'}</span>
                      </div>
                    )}
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
        <div ref={messagesEndRef} className="h-6 shrink-0" />
      </div>

      {/* Quick Action Pills: Único botón de Agendar Cita */}
      <div className="px-2.5 py-2 sm:py-1.5 bg-[#141313] border-t border-[#262424] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {confirmedBooking ? (
          <button type="button" onClick={onOpenConfirmedModal} className="px-3.5 sm:px-2.5 py-1.5 sm:py-1 rounded-xl sm:rounded-lg bg-emerald-600/35 text-emerald-200 border border-emerald-500/60 text-xs sm:text-[11px] font-bold shrink-0 flex items-center gap-1.5 min-h-[34px] sm:min-h-0 shadow-sm transition active:scale-95 cursor-pointer">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /><span>✅ Mi Cita ({confirmedBooking.timeSlot})</span>
          </button>
        ) : (
          <button type="button" onClick={onOpenBooking} className="px-3.5 sm:px-2.5 py-1.5 sm:py-1 rounded-xl sm:rounded-lg bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 text-xs sm:text-[11px] font-bold shrink-0 flex items-center gap-1.5 min-h-[34px] sm:min-h-0 transition active:scale-95 cursor-pointer shadow-sm"><Calendar className="w-3.5 h-3.5 text-emerald-400" /><span>📅 Agendar Cita</span></button>
        )}
        <button type="button" onClick={() => onSendMessage('¿Cuáles son los horarios disponibles para agendar una cita?')} className="px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-200 border border-[#2a2828] text-xs sm:text-[11px] font-medium shrink-0 min-h-[34px] sm:min-h-0 transition cursor-pointer">⏰ Horarios disponibles</button>
        <button type="button" onClick={() => onSendMessage(`¿Qué incluye el servicio de ${serviceTitle}?`)} className="px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-200 border border-[#2a2828] text-xs sm:text-[11px] font-medium shrink-0 min-h-[34px] sm:min-h-0 transition cursor-pointer">💡 ¿Qué incluye?</button>
      </div>

      <footer className="px-2.5 py-2 sm:px-3 sm:py-2 bg-[#111010] border-t border-[#262424] shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-2xl sm:rounded-xl px-3 py-1.5 sm:px-2.5 sm:py-1 transition shadow-inner">
          {isAudioRecording ? <div className="flex-1 flex items-center justify-between gap-2 py-1 px-1 select-none animate-fade-in text-xs font-mono text-red-400 min-h-[42px] sm:min-h-[26px]">Grabando...</div> : (
            <textarea ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={`Consulta o agenda cita sobre ${serviceTitle}...`} className="flex-1 bg-transparent text-[15px] sm:text-xs text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-1.5 sm:py-1 min-h-[42px] sm:min-h-[26px] max-h-[120px] overflow-y-auto block" />
          )}
          {inputValue.trim() ? (
            <button type="submit" disabled={isLoading} className="w-10 h-10 sm:w-8 sm:h-8 rounded-full sm:rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 shrink-0 shadow-sm cursor-pointer self-end mb-0.5 flex items-center justify-center" title="Enviar"><Send className="w-5 h-5 sm:w-3.5 sm:h-3.5" /></button>
          ) : (
            <ChatMicButton disabled={isLoading} onRecordingChange={setIsAudioRecording} onAudioRecorded={onAudioRecorded} onTranscription={(cleanText) => onSendMessage(cleanText, true)} />
          )}
        </form>
      </footer>
      <FlyingPaperPlane triggerKey={flightKey} />
    </section>
  );
};
