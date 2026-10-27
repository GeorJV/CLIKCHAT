import React, { useState } from 'react';
import { Tenant, FAQ } from '../../../../types';
import { SimulatorMessage, SimulatorChatBubble } from './SimulatorChatBubble';
import { CorrectionModal } from './CorrectionModal';
import { Send, RotateCcw, Bot, Zap, AlertCircle } from 'lucide-react';

interface LiveBotSimulatorProps {
  tenant: Tenant | null;
  tenantSlug: string;
  faqs?: FAQ[];
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  initialTrigger?: string;
}

export const LiveBotSimulator: React.FC<LiveBotSimulatorProps> = ({
  tenant,
  tenantSlug,
  onCreateFaq,
  initialTrigger
}) => {
  const botName = tenant?.bot_name || (tenant?.business_type === 'restaurante' ? 'Valeria (Mesera)' : 'Asesor Virtual');
  const isService = tenant?.business_type === 'servicios';

  const [messages, setMessages] = useState<SimulatorMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: tenant?.welcome_message || `¡Hola! 👋 Te saluda **${botName}**. ¿En qué te puedo colaborar el día de hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragLevel: 'level_1'
    }
  ]);
  const [input, setInput] = useState(initialTrigger || '');
  const [loading, setLoading] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<SimulatorMessage | null>(null);

  const testSuggestions = isService
    ? ['¿Cómo agendo una cita?', '¿Tienen parqueo o dónde quedan?', '¿Aceptan Sinpe o tarjeta?', '¿Cuánto dura la sesión?']
    : ['¿Hacen envíos hoy?', '¿Qué métodos de pago tienen?', '¿Aceptan Sinpe Móvil?', '¿Qué promociones tienen hoy?'];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: SimulatorMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const clientHist = messages.slice(-10).map(m => ({ sender: m.sender, message: m.text }));
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: tenantSlug || tenant?.slug || 'comida-callejera-xl',
          tenantId: tenant?.id,
          sessionId: 'sim_' + (tenant?.id || 'default'),
          message: text,
          conversationHistory: clientHist
        })
      });

      const data = await res.json();
      const botMsg: SimulatorMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: data.answer || '¡Hola! Con mucho gusto te colaboro.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragLevel: data.level || 'level_3_catalog',
        inResponseTo: text
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          text: 'Disculpa, hubo un problema al simular la respuesta. Revisa tu conexión.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCorrection = async (question: string, newAnswer: string) => {
    const ok = await onCreateFaq(question, newAnswer, isService ? 'Citas & Servicios' : 'Objeciones');
    if (ok && correctionTarget) {
      setMessages(prev =>
        prev.map(m => m.id === correctionTarget.id ? { ...m, text: newAnswer, ragLevel: 'level_2_faq' } : m)
      );
    }
    return ok;
  };

  return (
    <div className="bg-[#151414] border border-[#272525] rounded-2xl flex flex-col h-[520px] overflow-hidden text-zinc-100 shadow-xl">
      {/* Cabecera del Simulador */}
      <div className="p-3.5 bg-[#1a1919] border-b border-[#292626] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Simulador en Vivo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-zinc-400">Prueba cómo responde tu bot en tiempo real y corrige respuestas con un clic.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMessages(messages.slice(0, 1))}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          title="Reiniciar chat de prueba"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <SimulatorChatBubble
            key={msg.id}
            message={msg}
            botName={botName}
            onCorrect={(m) => setCorrectionTarget(m)}
          />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 p-2 italic animate-pulse">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>{botName} está escribiendo...</span>
          </div>
        )}
      </div>

      {/* Sugerencias Rápidas */}
      <div className="px-3 py-1.5 bg-[#121111] border-t border-[#242222] flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 text-amber-400" /> Pruebas rápidas:
        </span>
        {testSuggestions.map(q => (
          <button
            key={q}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#1c1b1b] hover:bg-[#282626] text-zinc-300 hover:text-white border border-[#2e2c2c] whitespace-nowrap cursor-pointer transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input de Envío */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-[#171616] border-t border-[#262424] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe como si fueras un cliente..."
          className="flex-1 bg-[#100f0f] border border-[#2b2828] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md shadow-emerald-950/40 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Modal de Corrección 1-Clic */}
      {correctionTarget && (
        <CorrectionModal
          isOpen={true}
          onClose={() => setCorrectionTarget(null)}
          userQuestion={correctionTarget.inResponseTo || 'Pregunta del cliente'}
          originalAnswer={correctionTarget.text}
          onSaveCorrection={handleSaveCorrection}
        />
      )}
    </div>
  );
};
