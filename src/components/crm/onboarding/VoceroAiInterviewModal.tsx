import React, { useState } from 'react';
import { X, Sparkles, MessageSquareCode } from 'lucide-react';
import { Tenant, Product } from '../../../types';
import { sendInterviewMessage, InterviewMessage, SetupPayload } from '../../../services/aiOnboardingService';
import { VoceroAiInterviewChat } from './VoceroAiInterviewChat';
import { VoceroAiInterviewSuccess } from './VoceroAiInterviewSuccess';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onUpdateSettings?: (updates: Partial<Tenant>) => Promise<boolean>;
  onCreateProduct?: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroAiInterviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tenant,
  onUpdateSettings,
  onCreateProduct,
  onCreateFaq
}) => {
  const initialGreeting = `¡Hola! 👋 Soy tu Asistente de Configuración Inteligente impulsado por Meta Llama 3 en Cloudflare.

En solo 4 preguntas rápidas voy a dejar tu negocio y tu bot listos para vender. Para empezar:
¿Cómo se llama tu negocio y qué productos o servicios ofreces?`;

  const [messages, setMessages] = useState<InterviewMessage[]>([
    { id: '1', role: 'assistant', content: initialGreeting, timestamp: new Date().toISOString() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedPayload, setCompletedPayload] = useState<SetupPayload | null>(null);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: InterviewMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await sendInterviewMessage(nextMessages, tenant?.name, tenant?.business_type);
      const aiMsg: InterviewMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toISOString()
      };
      setMessages([...nextMessages, aiMsg]);

      if (res.payload && res.payload.is_complete) {
        setCompletedPayload(res.payload);
        await persistPayload(res.payload);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Disculpa, tuve un micro corte de conexión con el Edge de Cloudflare. ¿Podrías reiterar tu última respuesta?',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const persistPayload = async (payload: SetupPayload) => {
    try {
      if (payload.tenant && onUpdateSettings) {
        await onUpdateSettings({
          name: payload.tenant.name || tenant?.name,
          business_type: payload.tenant.business_type || tenant?.business_type || 'tienda',
          description: payload.tenant.description,
          phone: payload.tenant.phone || tenant?.phone,
          bot_name: payload.tenant.bot_name || 'Asesor Virtual',
          welcome_message: payload.tenant.welcome_message,
          tone_of_voice: payload.tenant.tone_of_voice || 'Cercano y Amigable'
        });
      }
      if (payload.products && onCreateProduct) {
        for (const p of payload.products) {
          if (p.name) {
            await onCreateProduct({
              name: p.name,
              price: Number(p.price) || 0,
              short_description: p.short_description || p.name,
              details: { category: p.category || 'General' }
            });
          }
        }
      }
      if (payload.faqs && onCreateFaq) {
        for (const f of payload.faqs) {
          if (f.question && f.answer) {
            await onCreateFaq(f.question, f.answer, f.category || 'general');
          }
        }
      }
    } catch (e) {
      console.error('Error al persistir onboarding:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0] flex flex-col max-h-[90vh]">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#e8edf6] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0d5bff] flex items-center justify-center border border-blue-100 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0a1730] flex items-center gap-1.5">
                <span>Entrevista Asistida con IA</span>
                <span className="text-[10px] bg-blue-50 text-[#0d5bff] font-mono px-2 py-0.2 rounded-full font-bold">
                  Meta Llama 3
                </span>
              </h3>
              <p className="text-[11px] text-[#62728d]">
                4 preguntas rápidas para calibrar y poner en marcha tu negocio.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8391aa] hover:text-[#0a1730] hover:bg-[#f6f8fc] transition cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido: o el Chat o la pantalla de Éxito */}
        {completedPayload ? (
          <VoceroAiInterviewSuccess payload={completedPayload} onFinish={onClose} />
        ) : (
          <VoceroAiInterviewChat
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
