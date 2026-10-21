import React, { useState } from 'react';
import { Send, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface VoceroAiSandboxProps {
  tenantSlug: string;
  tenantName?: string;
}

export const VoceroAiSandbox: React.FC<VoceroAiSandboxProps> = ({ tenantSlug, tenantName }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'assistant',
      text: `¡Hola! Soy tu agente virtual para ${tenantName || 'tu negocio'}. Estoy configurado con RAG y embudo de ventas. ¿En qué te puedo asesorar hoy?`,
      rag: 'L1 · Bienvenida'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const PERSONAS = [
    { label: '🛍️ Decidido', text: 'Hola, quiero comprar ya mismo. ¿Cómo puedo pagar y cuándo me lo envían?' },
    { label: '🏷️ Precios', text: 'Hola, ¿cuánto cuesta lo más vendido y qué ofertas tienen hoy?' },
    { label: '😡 Molesto', text: 'Llevo esperando mi pedido y nadie me contesta, exijo una solución.' },
    { label: '🙋 Pide Humano', text: 'Hola, no quiero hablar con un bot, pásame con un asesor real por favor.' },
    { label: '❓ Fuera de Menú', text: '¿Ustedes también venden repuestos de autos y hacen envíos a México?' },
    { label: '📱 Informal', text: 'ke onda bro si benden comida todavia o ya cerraron?' },
  ];

  const handleSendText = async (textToSend?: string) => {
    const txt = (textToSend || input).trim();
    if (!txt || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text: txt, rag: '' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, sessionId: 'sandbox_' + Date.now(), message: txt })
      });
      if (res.ok) {
        const d = await res.json();
        setMessages(prev => [...prev, {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: d.answer || 'Respuesta generada.',
          rag: d.rag_level_used || 'RAG Híbrido D1'
        }]);
      }
    } catch (e) {
      console.warn('Sandbox error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => handleSendText();

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Laboratorio</h2>
          <span className="vocero-kicker ml-2">Simulador IA</span>
        </div>
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reiniciar</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {m.rag && (
                <span className="font-mono text-[9px] text-[#0038d8] bg-[#ebf1ff] px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" /> {m.rag}
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-[13px] leading-relaxed border shadow-sm ${
                  isUser
                    ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm'
                    : 'bg-[#ebf1ff] border-[#d3e2ff] text-[#0a1730] rounded-tl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="text-xs text-[#8391aa] flex items-center gap-2 py-2">
            <div className="w-3.5 h-3.5 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
            <span>Consultando fuentes y respondiendo…</span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e8edf6] max-w-3xl w-full mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8391aa] shrink-0">Personas Vocero:</span>
        {PERSONAS.map(p => (
          <button
            key={p.label}
            onClick={() => handleSendText(p.text)}
            disabled={loading}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#dde5f1] hover:border-[#0d5bff] hover:text-[#0d5bff] text-[#42506b] shadow-2xs whitespace-nowrap transition cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-[#e8edf6] max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe como un comprador para probar la respuesta del agente…"
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-40 text-white shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
