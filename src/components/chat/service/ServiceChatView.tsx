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
  storeName?: string;
  agentName?: string;
  agentAvatar?: string;
  services?: ServiceItem[];
  initialService?: ServiceItem;
  onExit?: () => void;
}

export const ServiceChatView: React.FC<Props> = ({
  storeName = 'Centro Estético Aura',
  agentName = 'Dra. Elena',
  agentAvatar,
  services = [DEFAULT_SERVICE],
  initialService,
  onExit,
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
      id: `msg-${Date.now()}`,
      sessionId: `sess-${Date.now()}`,
      tenantId: 'tenant-services',
      sender: 'assistant',
      content: `¡Hola! 🌸 Soy **${agentName}**, especialista de **${storeName}**.\n\nVeo que te interesa agendar **${selectedService.title}** (${selectedService.duration || '45 min'}).\n\n¿Deseas conocer qué incluye la sesión o prefieres que revisemos los horarios disponibles para esta semana?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragTrace: { levelUsed: 3, confidence: 0.99, executionTimeMs: 12, modelUsed: 'Agenda D1 Edge', reasoning: 'Bienvenida contextualizada al servicio.' },
    };
    setMessages([welcomeMsg]);
  }, [selectedService.id]);

  const { sendMessage: sendBatchedMessage } = useMessageBatcher({
    debounceMs: 9000,
    deliveryDelayMs: 350,
    onDeliverUserMessage: (userMsg) => {
      setMessages((prev) => [...prev, userMsg]);
    },
    onSetLoading: setIsLoading,
    onTriggerBotReply: (batch) => {
      const isMulti = batch.length > 1;
      const reasoning = isMulti
        ? `RAG L2: Análisis unificado de ráfaga (${batch.length} preguntas acumuladas).`
        : 'Respuesta validada contra condiciones del servicio.';

      const replyMsg: ProductChatMessage = {
        id: `asst-${Date.now()}`,
        sessionId: 'sess',
        tenantId: 'tenant',
        sender: 'assistant',
        content: `¡Con gusto! **${selectedService.title}** es una sesión 1 a 1 (${selectedService.serviceModality === 'presencial' ? 'en cabina' : 'online por videollamada'}). Puedes pulsar **"Agendar Cita"** en el panel derecho para seleccionar el día y turno que mejor te acomode.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragTrace: { levelUsed: 2, confidence: 0.97, executionTimeMs: 15, modelUsed: 'FAQ RAG Hybrid L2', reasoning },
      };
      setMessages((prev) => [...prev, replyMsg]);
    },
  });

  const handleSendMessage = (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text) return;
    setInputValue('');
    sendBatchedMessage(text);
  };

  const handleConfirmBooking = (data: ServiceBookingData) => {
    const confirmMsg: ProductChatMessage = {
      id: `book-${Date.now()}`,
      sessionId: 'sess',
      tenantId: 'tenant',
      sender: 'assistant',
      content: `📅 **¡Cita Agendada con Éxito!**\n\n- **Servicio:** ${data.service.title}\n- **Fecha:** ${data.date} a las ${data.timeSlot}\n- **Cliente:** ${data.customerName} (${data.customerPhone})\n- **Modalidad:** ${data.service.serviceModality === 'presencial' ? 'Presencial en clínica' : 'Online (Google Meet / Zoom)'}\n\nTe enviamos los datos de acceso y el recordatorio a tu WhatsApp. ¡Nos vemos en consulta!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#131212] text-slate-100 overflow-hidden font-sans">
      <div className="flex-1 w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-0">
        <ServiceChatColumn
          storeName={storeName}
          agentName={agentName}
          agentAvatar={agentAvatar}
          serviceTitle={selectedService.title}
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSendMessage={() => handleSendMessage()}
          onExit={onExit}
        />
        <ServiceShowcase
          service={selectedService}
          onOpenIncludes={() => setDetailModal('includes')}
          onOpenRequirements={() => setDetailModal('requirements')}
          onOpenFullscreen={() => setFullscreenOpen(true)}
          onBookNow={() => setBookingOpen(true)}
        />
      </div>

      {detailModal && (
        <ServiceDetailModal
          service={selectedService}
          mode={detailModal}
          onClose={() => setDetailModal(null)}
          onProceedBooking={() => { setDetailModal(null); setBookingOpen(true); }}
        />
      )}
      {fullscreenOpen && (
        <ProductFullscreenModal
          product={{ ...selectedService, price: selectedService.price || 0, currency: selectedService.currency || 'USD', stock: 1 }}
          storeName={storeName}
          onClose={() => setFullscreenOpen(false)}
          onAskAboutProduct={(p) => { setFullscreenOpen(false); handleSendMessage(`¿Cuáles son los beneficios de ${p.title}?`); }}
          onDirectCheckout={() => { setFullscreenOpen(false); setBookingOpen(true); }}
        />
      )}
      {bookingOpen && (
        <ServiceBookingModal
          service={selectedService}
          storeName={storeName}
          onClose={() => setBookingOpen(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}
    </div>
  );
};
