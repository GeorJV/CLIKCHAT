import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ServiceItem, ServiceBookingData } from '../../../types/serviceChat';
import { ProductChatMessage } from '../../../types/productChat';
import { ServiceChatColumn } from './ServiceChatColumn'; import { ServiceShowcase } from './ServiceShowcase'; import { ServiceDetailModal } from './ServiceDetailModal'; import { ServiceBookingModal } from './ServiceBookingModal';
import { BookedAppointmentModal } from './BookedAppointmentModal'; import { ProductFullscreenModal } from '../product/ProductFullscreenModal';
import { DEFAULT_SERVICE } from './serviceChatMock'; import { useMessageBatcher } from '../../../hooks/useMessageBatcher'; import { generateClientChatFallback } from '../../../services/clientChatFallback';
import { DeliveryMode, deliverStaggeredBubbles } from '../../../utils/messageSplitter';
import { getCampaignContextFromUrl } from '../../../utils/campaignTracking';
import { broadcastBookingCreated } from '../../../utils/bookingSyncBus';

interface Props {
  storeName?: string; agentName?: string; agentAvatar?: string; tenantSlug?: string; whatsappNumber?: string;
  services?: ServiceItem[]; initialService?: ServiceItem; responseDelaySec?: number; botResponseSpeedSec?: number; deliveryMode?: DeliveryMode; welcomeMessage?: string; onExit?: () => void;
}

export const ServiceChatView: React.FC<Props> = ({
  storeName = 'Centro Especializado', agentName = 'Asesora Profesional', agentAvatar, tenantSlug = 'comida-callejera-xl',
  whatsappNumber = '50672935612', services = [], initialService, responseDelaySec, botResponseSpeedSec, deliveryMode, welcomeMessage, onExit,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(initialService || services[0] || { ...DEFAULT_SERVICE, title: 'Servicio Especializado', image: '', images: [] });
  const [mobileTab, setMobileTab] = useState<'chat' | 'service'>('chat');
  const servKey = selectedService?.id || initialService?.id || services[0]?.id || 'default';
  const storageKey = `clik_sess_serv_${servKey}`;
  const msgStorageKey = `clik_msgs_serv_${tenantSlug || 'default'}_${servKey}`;
  const confirmKey = `clik_confirmed_booking_${tenantSlug || 'default'}`;

  const [confirmedBooking, setConfirmedBooking] = useState<ServiceBookingData | null>(() => {
    if (typeof window !== 'undefined') { try { const c = localStorage.getItem(confirmKey); if (c) return JSON.parse(c); } catch (e) {} }
    return null;
  });
  const [viewConfirmedModal, setViewConfirmedModal] = useState(false); const [messages, setMessages] = useState<ProductChatMessage[]>(() => {
    if (typeof window !== 'undefined') { try { const c = localStorage.getItem(msgStorageKey); if (c) { const p = JSON.parse(c); if (Array.isArray(p) && p.length > 0) return p[0]?.content?.includes('¿Deseas conocer qué incluye') ? [] : p; } } catch (e) {} }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'includes' | 'requirements' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false); const [bookingOpen, setBookingOpen] = useState(false);
  const [sessId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
      if (s) return s;
      const c = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
      localStorage.setItem(storageKey, c); return c;
    }
    return 'sess_' + Date.now().toString(36);
  });

  useEffect(() => {
    if (initialService) setSelectedService(initialService);
    else if (services.length > 0 && !selectedService?.id) setSelectedService(services[0]);
  }, [initialService, services]);

  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) { try { localStorage.setItem(msgStorageKey, JSON.stringify(messages)); } catch (e) {} }
  }, [messages, msgStorageKey]);

  useEffect(() => {
    const welcome = welcomeMessage?.trim() ? welcomeMessage.replace(/\{nombre_del_negocio\}|\{negocio\}/gi, storeName).replace(/\{asesor\}|\{bot\}/gi, agentName) : `¡Hola! 👋 Bienvenido a **${storeName}**.\n\n¿En qué te podemos ayudar? ¿Cuál es el proyecto en el que te podemos colaborar?`;
    setMessages((prev) => prev.length > 0 ? prev : [{
      id: `msg-${Date.now()}`, sessionId: sessId, tenantId: 'tenant-services', sender: 'assistant', content: welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ragTrace: { levelUsed: 3, confidence: 0.99, executionTimeMs: 12, modelUsed: 'Agenda D1 Edge', reasoning: 'Bienvenida al servicio.' },
    }]);
  }, [selectedService.id, sessId, agentName, storeName, welcomeMessage]);

  const { sendMessage: sendBatchedMessage, sendVoiceQuery } = useMessageBatcher({
    debounceMs: Math.max((responseDelaySec ?? 1) * 1000, 400), deliveryDelayMs: 0, onSetLoading: setIsLoading,
    onDeliverUserMessage: (userMsg) => setMessages((prev) => [...prev, userMsg]),
    onTriggerBotReply: async (batch) => {
      const userText = batch.join('\n').trim();
      if (!userText) return;
      setIsLoading(true);
      const startTime = Date.now();
      try {
        const pM = userText.match(/(?:\+?506[\s-]?)?[2678]\d{3}[\s-]?\d{4}|\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{4}|\b\d{8,12}\b/);
        if (pM && !pM[0].includes('72935612')) { try { localStorage.setItem('clikchat_cust_phone', pM[0].trim()); } catch (e) {} }
        const nM = userText.match(/(?:me\s+llamo|mi\s+nombre\s+es|soy|nombre:\s*)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]{2,})?)/i);
        if (nM && !/^cliente$/i.test(nM[1].trim())) { try { localStorage.setItem('clikchat_cust_name', nM[1].trim()); } catch (e) {} }
        const uName = typeof window !== 'undefined' ? (localStorage.getItem('clikchat_cust_name') || undefined) : undefined;
        const uPhone = typeof window !== 'undefined' ? (localStorage.getItem('clikchat_cust_phone') || undefined) : undefined;

        const clientHist = messages.slice(-10).map((m) => ({ sender: m.sender, message: m.content }));
        const res = await fetch('/api/chat/message', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantSlug: tenantSlug || 'comida-callejera-xl', tenantId: (selectedService as any).tenant_id, sessionId: sessId, message: userText, conversationHistory: clientHist, userName: uName, userPhone: uPhone, clientHour: new Date().getHours(), clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), campaignContext: getCampaignContextFromUrl() })
        });
        if (!res.ok) throw new Error('Chat service error');
        const data = await res.json();
        const targetDelayMs = Math.max((botResponseSpeedSec ?? 0) * 1000, 0);
        const elapsed = Date.now() - startTime;
        if (elapsed < targetDelayMs) await new Promise((r) => setTimeout(r, targetDelayMs - elapsed));
        const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
        const rawAns = data?.answer || '¡Con gusto te asesoro! ¿En qué te podemos colaborar hoy?';
        const cardMatch = rawAns.match(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/);
        const textWithoutCard = rawAns.replace(/\[BOOKING_CARD:\s*\{[\s\S]*?\}\s*\]/g, '').trim();
        if (cardMatch) {
          try {
            const parsed = JSON.parse(cardMatch[0].replace(/^\[BOOKING_CARD:\s*/, '').replace(/\s*\]$/, ''));
            const cData: ServiceBookingData = { service: { id: parsed.serviceId || 'srv_selected', title: parsed.service || selectedService.title, price: Number(parsed.price) || 1200, currency: parsed.currency || 'USD', image: '', serviceModality: parsed.modality || 'online' }, date: parsed.date, timeSlot: parsed.time, customerName: parsed.customerName, customerEmail: parsed.customerEmail, customerPhone: parsed.customerPhone };
            setConfirmedBooking(cData);
            try { localStorage.setItem(confirmKey, JSON.stringify(cData)); } catch (e) {}
            broadcastBookingCreated(tenantSlug, { id: 'apt_' + Date.now(), clientName: cData.customerName, serviceName: cData.service.title, date: cData.date, time: cData.timeSlot, price: cData.service.price });
          } catch (e) {}
          setMessages((prev) => [...prev, { id: `asst-${Date.now()}-0`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: `${textWithoutCard}\n\n${cardMatch[0]}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ragTrace: { levelUsed: (lvlMap[data?.level] || 3) as any, confidence: data?.confidence || 0.95, executionTimeMs: 80, modelUsed: data?.provider || 'RAG Edge', reasoning: data?.levelLabel || 'RAG Servicios D1' } }]);
        } else {
          const activeMode: DeliveryMode = deliveryMode || (typeof window !== 'undefined' ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) : null) || 'moderate';
          await deliverStaggeredBubbles({
            fullText: textWithoutCard, mode: activeMode, responseDelaySec, onSetLoading: setIsLoading,
            createMessage: (bubble, isLast, bIdx) => ({ id: `asst-${Date.now()}-${bIdx}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: bubble, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ragTrace: isLast ? { levelUsed: (lvlMap[data?.level] || 3) as any, confidence: data?.confidence || 0.95, executionTimeMs: 80, modelUsed: data?.provider || 'RAG Edge', reasoning: data?.levelLabel || 'RAG Servicios D1' } : undefined }),
            onDeliver: (msg) => setMessages((prev) => [...prev, msg])
          });
        }
      } catch {
        try {
          const fb = await generateClientChatFallback({ tenantSlug: tenantSlug || 'comida-callejera-xl', storeName, agentName, businessType: 'servicio', userMessage: userText, sessionId: sessId });
          const targetDelayMs = Math.max((botResponseSpeedSec ?? 0) * 1000, 0);
          if (Date.now() - startTime < targetDelayMs) await new Promise((r) => setTimeout(r, targetDelayMs - (Date.now() - startTime)));
          const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
          const activeMode: DeliveryMode = deliveryMode || (typeof window !== 'undefined' ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode) : null) || 'moderate';
          await deliverStaggeredBubbles({
            fullText: fb.answer, mode: activeMode, responseDelaySec, onSetLoading: setIsLoading,
            createMessage: (bubble, isLast, bIdx) => ({ id: `asst-${Date.now()}-${bIdx}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: bubble, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ragTrace: isLast ? { levelUsed: (lvlMap[fb.level] || 3) as any, confidence: fb.confidence, executionTimeMs: 100, modelUsed: fb.provider, reasoning: fb.levelLabel } : undefined }),
            onDeliver: (msg) => setMessages((prev) => [...prev, msg])
          });
        } catch {
          setMessages((prev) => [...prev, { id: `err-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: '¡Hola! ¿En qué te podemos colaborar hoy?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
      } finally { setIsLoading(false); }
    },
  });

  const handleSendMessage = (customText?: string, fromVoice?: boolean) => {
    const text = (customText || inputValue).trim(); if (!text) return; setInputValue('');
    if (!fromVoice) sendBatchedMessage(text); else sendVoiceQuery(text);
  };

  const handleConfirmBooking = (data: ServiceBookingData) => {
    setConfirmedBooking(data);
    try { localStorage.setItem(confirmKey, JSON.stringify(data)); } catch (e) {}
    fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantSlug, tenantId: (selectedService as any).tenant_id || (selectedService as any).tenantId, customerName: data.customerName, customerEmail: data.customerEmail || '', customerPhone: data.customerPhone, serviceId: data.service.id, serviceName: data.service.title, date: data.date, timeSlot: data.timeSlot, modality: data.service.serviceModality || 'online', price: data.service.price || 0, currency: data.service.currency || 'USD', notes: data.notes || '' }) }).catch(() => {});
    try {
      const k = `clikchat_bookings_${tenantSlug || 'default'}`;
      const apt = { id: 'apt_' + Date.now(), clientName: data.customerName, email: data.customerEmail || '', serviceName: data.service.title, date: data.date, dateKey: data.date, displayDate: data.date, time: data.timeSlot, status: 'confirmed', channel: 'web', phone: data.customerPhone, notes: data.notes || '', price: data.service.price || 0 };
      localStorage.setItem(k, JSON.stringify([apt, ...JSON.parse(localStorage.getItem(k) || '[]')]));
      broadcastBookingCreated(tenantSlug, { id: apt.id, clientName: apt.clientName, serviceName: apt.serviceName, date: apt.displayDate, time: apt.time, price: apt.price });
    } catch (e) {}
    setMessages((prev) => [...prev, { id: `book-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant', content: `📅 **¡Cita Confirmada con Éxito!**\n\nHemos registrado tu sesión de **${data.service.title}** para el **${data.date} a las ${data.timeSlot}**. Te enviamos los detalles a tu WhatsApp. ¡Nos vemos en la sesión!`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMobileTab('chat');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#131212] text-slate-100 overflow-hidden font-sans">
      <div className="lg:hidden flex items-center justify-between px-3 py-2 bg-[#171616] border-b border-[#282626] shrink-0 z-20">
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#111010] border border-[#282626]">
          <button type="button" onClick={() => setMobileTab('chat')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 min-h-[32px] ${mobileTab === 'chat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}><MessageSquare className="w-4 h-4" /><span>Chat</span></button>
          <button type="button" onClick={() => setMobileTab('service')} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 min-h-[32px] ${mobileTab === 'service' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}><Sparkles className="w-4 h-4" /><span>Servicio</span></button>
        </div>
      </div>
      <div className="flex-1 w-full h-full flex lg:grid lg:grid-cols-2 overflow-hidden min-h-0">
        <div className={`h-full w-full ${mobileTab === 'chat' ? 'flex' : 'hidden'} lg:flex min-h-0 overflow-hidden`}>
          <ServiceChatColumn
            storeName={storeName} agentName={agentName} agentAvatar={agentAvatar} serviceTitle={selectedService.title} messages={messages} inputValue={inputValue} isLoading={isLoading} confirmedBooking={confirmedBooking} businessPhone={whatsappNumber || (selectedService as any).phone || '50672935612'} deliveryMode={deliveryMode} onInputChange={setInputValue} onSendMessage={handleSendMessage}
            onAudioRecorded={(a) => setMessages((prev) => [...prev, { id: `audio-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'user', content: '', isAudio: true, audioDuration: a.duration, audioUrl: a.audioUrl, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])}
            onExit={onExit} onOpenBooking={() => setBookingOpen(true)} onOpenConfirmedModal={() => setViewConfirmedModal(true)} onConfirmBookingFromCard={handleConfirmBooking}
          />
        </div>
        <div className={`h-full w-full ${mobileTab === 'service' ? 'flex' : 'hidden'} lg:flex min-h-0 overflow-hidden`}>
          <ServiceShowcase service={selectedService} onOpenIncludes={() => setDetailModal('includes')} onOpenRequirements={() => setDetailModal('requirements')} onOpenFullscreen={() => setFullscreenOpen(true)} onBookNow={() => setBookingOpen(true)} />
        </div>
      </div>
      {detailModal && <ServiceDetailModal service={selectedService} mode={detailModal} onClose={() => setDetailModal(null)} onBookService={() => { setDetailModal(null); setBookingOpen(true); }} />}
      {fullscreenOpen && <ProductFullscreenModal product={selectedService as any} storeName={storeName} onClose={() => setFullscreenOpen(false)} onAskAboutProduct={(p) => { setFullscreenOpen(false); handleSendMessage(`¿Requisitos de ${p.title}?`); }} onDirectCheckout={() => { setFullscreenOpen(false); setBookingOpen(true); }} />}
      {bookingOpen && <ServiceBookingModal service={selectedService} storeName={storeName} onClose={() => setBookingOpen(false)} onConfirmBooking={handleConfirmBooking} />}
      {viewConfirmedModal && confirmedBooking && <BookedAppointmentModal booking={confirmedBooking} storeName={storeName} businessPhone={whatsappNumber || (selectedService as any).phone || '50672935612'} onClose={() => setViewConfirmedModal(false)} />}
    </div>
  );
};
