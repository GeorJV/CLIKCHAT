import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceBookingData } from '../../../types/serviceChat';
import { ProductChatMessage } from '../../../types/productChat';
import { ServiceChatColumn } from './ServiceChatColumn';
import { ServiceShowcase } from './ServiceShowcase';
import { ServiceDetailModal } from './ServiceDetailModal';
import { ServiceBookingModal } from './ServiceBookingModal';
import { ProductFullscreenModal } from '../product/ProductFullscreenModal';
import { DEFAULT_SERVICE } from './serviceChatMock';
import { useMessageBatcher } from '../../../hooks/useMessageBatcher';

interface Props {
  storeName?: string; agentName?: string; agentAvatar?: string;
  services?: ServiceItem[]; initialService?: ServiceItem; onExit?: () => void;
}

export const ServiceChatView: React.FC<Props> = ({
  storeName = 'Centro Estético Aura', agentName = 'Dra. Elena', agentAvatar,
  services = [DEFAULT_SERVICE], initialService, onExit,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(initialService || services[0] || DEFAULT_SERVICE);
  const [messages, setMessages] = useState<ProductChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<'includes' | 'requirements' | null>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const welcomeMsg: ProductChatMessage = {
      id: `msg-${Date.now()}`, sessionId: `sess-${Date.now()}`, tenantId: 'tenant-services', sender: 'assistant',
      content: `¡Hola! 🌸 Soy **${agentName}**, especialista de **${storeName}**.\n\nVeo que te interesa agendar **${selectedService.title}** (${selectedService.duration || '45 min'}).\n\n¿Deseas conocer qué incluye la sesión o prefieres que revisemos los horarios disponibles?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragTrace: { levelUsed: 3, confidence: 0.99, executionTimeMs: 12, modelUsed: 'Agenda D1 Edge', reasoning: 'Bienvenida al servicio.' },
    };
    setMessages([welcomeMsg]);
  }, [selectedService.id]);

  const { sendMessage: sendBatchedMessage, sendVoiceQuery } = useMessageBatcher({
    debounceMs: 9000,
    deliveryDelayMs: 350,
    onDeliverUserMessage: (userMsg) => setMessages((prev) => [...prev, userMsg]),
    onTriggerBotReply: async (batch) => {
      const userText = batch.join('\n').trim();
      if (!userText) return;
      setIsLoading(true);
      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantSlug: 'geosoft',
            tenantId: (selectedService as any).tenant_id,
            sessionId: `sess_${selectedService.id || 'service'}`,
            message: userText
          })
        });
        const data = res.ok ? await res.json() : null;
        const lvlMap: Record<string, number> = { level_1: 1, level_2_faq: 2, level_3_catalog: 3, fallback_hitl: 4 };
        setMessages((prev) => [...prev, {
          id: `asst-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
          content: data?.answer || `¡Con gusto! **${selectedService.title}** es una sesión 1 a 1. Puedes pulsar **"Agendar Cita"** para coordinar.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ragTrace: {
            levelUsed: (lvlMap[data?.level] || 3) as any,
            confidence: data?.confidence || 0.95,
            executionTimeMs: 80,
            modelUsed: data?.provider || 'RAG Edge',
            reasoning: data?.levelLabel || 'RAG Servicios D1'
          }
        }]);
      } catch {
        setMessages((prev) => [...prev, {
          id: `err-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
          content: 'Hubo una breve intermitencia de conexión. ¿Podrías reiterar tu consulta?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleAudioRecorded = (audioData: { audioUrl: string; duration: number }) => {
    setMessages((prev) => [...prev, {
      id: `audio-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'user', content: '',
      isAudio: true, audioDuration: audioData.duration, audioUrl: audioData.audioUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const handleSendMessage = (customText?: string, fromVoice?: boolean) => {
    const text = (customText || inputValue).trim();
    if (!text) return;
    setInputValue('');
    if (!fromVoice) {
      sendBatchedMessage(text);
    } else {
      sendVoiceQuery(text);
    }
  };

  const handleConfirmBooking = (data: ServiceBookingData) => {
    setMessages((prev) => [...prev, {
      id: `book-${Date.now()}`, sessionId: 'sess', tenantId: 'tenant', sender: 'assistant',
      content: `📅 **¡Cita Agendada con Éxito!**\n\n- **Servicio:** ${data.service.title}\n- **Fecha:** ${data.date} a las ${data.timeSlot}\n- **Cliente:** ${data.customerName} (${data.customerPhone})\n- **Modalidad:** ${data.service.serviceModality === 'presencial' ? 'Presencial en clínica' : 'Online'}\n\nTe enviamos los datos de acceso y el recordatorio a tu WhatsApp. ¡Nos vemos en consulta!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#131212] text-slate-100 overflow-hidden font-sans">
      <div className="flex-1 w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-0">
        <ServiceChatColumn
          storeName={storeName} agentName={agentName} agentAvatar={agentAvatar} serviceTitle={selectedService.title}
          messages={messages} inputValue={inputValue} isLoading={isLoading}
          onInputChange={setInputValue} onSendMessage={handleSendMessage} onAudioRecorded={handleAudioRecorded} onExit={onExit}
        />
        <ServiceShowcase
          service={selectedService}
          onOpenIncludes={() => setDetailModal('includes')} onOpenRequirements={() => setDetailModal('requirements')}
          onOpenFullscreen={() => setFullscreenOpen(true)} onBookNow={() => setBookingOpen(true)}
        />
      </div>
      {detailModal && <ServiceDetailModal service={selectedService} mode={detailModal} onClose={() => setDetailModal(null)} onBookService={() => { setDetailModal(null); setBookingOpen(true); }} />}
      {fullscreenOpen && <ProductFullscreenModal product={selectedService as any} storeName={storeName} onClose={() => setFullscreenOpen(false)} onAskAboutProduct={(p) => { setFullscreenOpen(false); handleSendMessage(`¿Requisitos de ${p.title}?`); }} onDirectCheckout={() => { setFullscreenOpen(false); setBookingOpen(true); }} />}
      {bookingOpen && <ServiceBookingModal service={selectedService} storeName={storeName} onClose={() => setBookingOpen(false)} onConfirmBooking={handleConfirmBooking} />}
    </div>
  );
};
