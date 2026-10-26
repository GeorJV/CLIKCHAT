import React, { useRef, useEffect, useState } from 'react';
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

interface Props {
  storeName: string; agentName: string; agentAvatar?: string; serviceTitle: string;
  messages: ProductChatMessage[]; inputValue: string; isLoading: boolean;
  confirmedBooking?: ServiceBookingData | null; businessPhone?: string;
  onInputChange: (val: string) => void; onSendMessage: (text?: string, fromVoice?: boolean) => void;
  onAudioRecorded?: (audioData: { audioUrl: string; duration: number }) => void; onExit?: () => void;
  onOpenBooking?: () => void; onOpenConfirmedModal?: () => void;
  onConfirmBookingFromCard?: (data: ServiceBookingData) => void;
}

function parseBookingCard(text: string): { cleanContent: string; bookingData: ServiceBookingData | null } {
  const match = text.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/);
  if (match) {
    try {
      const p = JSON.parse(match[1]);
      const clean = text.replace(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/g, '').trim();
      return {
        cleanContent: clean,
        bookingData: {
          service: { id: p.serviceId || 'srv_selected', title: p.service || p.serviceTitle || 'Desarrollo Web & SaaS', price: Number(p.price) || 1200, currency: p.currency || 'USD', image: '', serviceModality: 'online' },
          date: p.date || '25 de Octubre', timeSlot: p.time || p.timeSlot || '10:00 AM', customerName: p.customerName || p.name || 'Cliente',
          customerEmail: p.customerEmail || p.email || '', customerPhone: p.customerPhone || p.phone || '', notes: p.notes || ''
        }
      };
    } catch {}
  }
  const isConfirming = /registrado\s+tu\s+(?:nombre|informaci[oó]n|cita)|cita\s+del|cita\s+para\s+el|qued[oó]\s+agendad|reserva\s+confirmad/i.test(text);
  if (isConfirming) {
    const dateM = text.match(/(?:el\s+)?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|[0-9]{1,2}\s+de\s+[a-záéíóú]+|[0-9]{4}-[0-9]{2}-[0-9]{2})/i);
    const timeM = text.match(/([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm|AM|PM)|[0-9]{1,2}:[0-9]{2})/i);
    const nameM = text.match(/(?:Genial|Excelente|Perfecto|Gracias|Hola),?\s*([A-Za-zÁÉÍÓÚáéíóúñ]+)/i);
    const emailM = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    const phoneM = text.match(/(\+?[0-9\s\-]{8,16})/);
    return {
      cleanContent: text,
      bookingData: {
        service: { id: 'srv_selected', title: 'Desarrollo Web & SaaS', price: 1200, currency: 'USD', image: '', serviceModality: 'online' },
        date: dateM ? dateM[0].replace(/^el\s+/i, '').trim() : '25 de Octubre', timeSlot: timeM ? timeM[0].trim() : '10:00 AM',
        customerName: nameM ? nameM[1].trim() : 'Cliente', customerEmail: emailM ? emailM[1].trim() : '',
        customerPhone: phoneM ? phoneM[0].trim() : '+506 7293-5612', notes: ''
      }
    };
  }
  return { cleanContent: text, bookingData: null };
}

export const ServiceChatColumn: React.FC<Props> = ({
  storeName, agentName, agentAvatar, serviceTitle, messages, inputValue, isLoading, confirmedBooking, businessPhone = '50672935612',
  onInputChange, onSendMessage, onAudioRecorded, onExit, onOpenBooking, onOpenConfirmedModal, onConfirmBookingFromCard
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
            <h2 className="text-sm sm:text-sm font-bold text-white tracking-tight truncate">{storeName}</h2>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium truncate">• {agentName}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> En línea</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onExit && <button type="button" onClick={onExit} className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition" title="Salir"><LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" /></button>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col bg-[#111010] min-h-0 overscroll-contain">
        {messages.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          const isSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;
          const { cleanContent, bookingData } = isAssistant ? parseBookingCard(msg.content) : { cleanContent: msg.content, bookingData: null };
          return (
            <div key={msg.id} className={`flex items-start w-full ${isAssistant ? 'justify-start' : 'justify-end'} ${isSameSender ? 'mt-0.5' : idx === 0 ? 'mt-0' : 'mt-2'}`}>
              <div className={`w-fit animate-bubble-in break-words overflow-hidden min-w-0 ${msg.isAudio ? 'px-2 py-0.5' : isAssistant ? 'max-w-[92%] sm:max-w-[85%] px-3.5 py-2 text-xs sm:text-sm' : 'max-w-[85%] sm:max-w-[78%] px-3 py-1.5 text-xs sm:text-sm'} ${isAssistant ? 'bg-[#1e1d1d] text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.12] shadow-lg shadow-black/60 origin-bottom-left' : 'bg-[#D79F4C]/50 backdrop-blur-md text-white rounded-2xl rounded-br-sm border border-[#D79F4C]/30 shadow-md origin-bottom-right'}`}>
                {msg.isAudio ? <ChatAudioPlayerBubble audioUrl={msg.audioUrl} duration={msg.audioDuration} timestamp={msg.timestamp} isUser={!isAssistant} /> : isAssistant ? (
                  <div className="space-y-1.5 min-w-0">
                    {cleanContent && <ChatMessageContent content={cleanContent} isUser={false} onActionClick={onSendMessage} />}
                    {bookingData && <BookingCardBubble bookingData={bookingData} isConfirmed={Boolean(confirmedBooking && (confirmedBooking.date === bookingData.date || confirmedBooking.timeSlot === bookingData.timeSlot))} storeName={storeName} businessPhone={businessPhone} onConfirm={(d) => onConfirmBookingFromCard?.(d)} />}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                      {msg.ragTrace && isBusinessAdminViewer() ? <ProductRAGBadge trace={msg.ragTrace} /> : <span />}
                      <span className="text-[10px] select-none tabular-nums text-zinc-400">{msg.timestamp || '20:03'}</span>
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
            <div className="bg-[#1e1d1d] border border-white/[0.12] rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" /><span className="text-xs text-zinc-400 ml-1">Consultando agenda disponible...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills: Único botón de Agendar Cita */}
      <div className="px-2.5 py-2 sm:py-1.5 bg-[#141313] border-t border-[#262424] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {confirmedBooking ? (
          <button type="button" onClick={onOpenConfirmedModal} className="px-3.5 sm:px-2.5 py-1.5 sm:py-1 rounded-xl sm:rounded-lg bg-emerald-600/35 text-emerald-200 border border-emerald-500/60 text-xs sm:text-[11px] font-bold shrink-0 flex items-center gap-1.5 min-h-[34px] sm:min-h-0 shadow-sm transition active:scale-95 cursor-pointer">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /><span>✅ Mi Cita ({confirmedBooking.timeSlot})</span>
          </button>
        ) : (
          <button type="button" onClick={onOpenBooking} className="px-3.5 sm:px-2.5 py-1.5 sm:py-1 rounded-xl sm:rounded-lg bg-emerald-600/25 hover:bg-emerald-600/35 text-emerald-300 border border-emerald-500/40 text-xs sm:text-[11px] font-bold shrink-0 flex items-center gap-1.5 min-h-[34px] sm:min-h-0 transition active:scale-95 cursor-pointer shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /><span>📅 Agendar Cita</span>
          </button>
        )}
        <button type="button" onClick={() => onSendMessage('¿Cuáles son los horarios disponibles para agendar una cita?')} className="px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-200 border border-[#2a2828] text-xs sm:text-[11px] font-medium shrink-0 min-h-[34px] sm:min-h-0 transition cursor-pointer">
          ⏰ Horarios disponibles
        </button>
        <button type="button" onClick={() => onSendMessage(`¿Qué incluye el servicio de ${serviceTitle}?`)} className="px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-xl sm:rounded-lg bg-[#1c1b1b] hover:bg-[#252424] text-zinc-200 border border-[#2a2828] text-xs sm:text-[11px] font-medium shrink-0 min-h-[34px] sm:min-h-0 transition cursor-pointer">
          💡 ¿Qué incluye?
        </button>
      </div>

      <footer className="px-2.5 py-2 sm:px-3 sm:py-2 bg-[#111010] border-t border-[#262424] shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2 bg-[#171616] border border-[#282626] focus-within:border-emerald-500 rounded-2xl sm:rounded-xl px-3 py-1.5 sm:px-2.5 sm:py-1 transition shadow-inner">
          {isAudioRecording ? (
            <div className="flex-1 flex items-center justify-between gap-2 py-1 px-1 select-none animate-fade-in text-xs font-mono text-red-400 min-h-[42px] sm:min-h-[26px]">Grabando...</div>
          ) : (
            <textarea
              ref={textareaRef} rows={1} value={inputValue} onChange={handleTextChange} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Consulta o agenda cita sobre ${serviceTitle}...`}
              className="flex-1 bg-transparent text-[15px] sm:text-xs text-white placeholder:text-zinc-500 focus:outline-none resize-none leading-snug py-1.5 sm:py-1 min-h-[42px] sm:min-h-[26px] max-h-[120px] overflow-y-auto block"
            />
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
