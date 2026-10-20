import React, { useState } from 'react';
import { TrafficSource } from '../../../types/crm';
import { Sparkles, Send, RefreshCw, Layers } from 'lucide-react';

interface Props {
  tenantSlug: string;
  storeName?: string;
}

export const ClikChatAttributionSimulator: React.FC<Props> = ({ tenantSlug, storeName = 'Mi Negocio' }) => {
  const [source, setSource] = useState<TrafficSource>('anuncio');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'assistant',
      text: `¡Hola! Veo que vienes desde nuestro anuncio comercial. Con mucho gusto te asesoro sobre el menú y promociones de ${storeName}. ¿En qué te puedo servir hoy?`,
      rag: 'L1 · Bienvenida Anuncio'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text: txt, rag: '' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          sessionId: `sim_${source}_${Date.now()}`,
          message: txt,
          source
        })
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
    } catch {
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: '¡Claro que sí! Con gusto te cotizo.',
        rag: 'RAG Híbrido D1'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceChange = (newSource: TrafficSource) => {
    setSource(newSource);
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        text: `¡Hola! Simulación iniciada con origen [${newSource.toUpperCase()}]. ¿Qué deseas consultar hoy?`,
        rag: `L1 · Origen ${newSource}`
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-xs font-sans">
      <div className="h-14 shrink-0 px-4 border-b border-[#e8edf6] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0a1730]">Simular Origen de Tráfico:</span>
          <select
            value={source}
            onChange={(e) => handleSourceChange(e.target.value as TrafficSource)}
            className="rounded-lg border border-[#d8e2f0] bg-[#f8fafc] px-2.5 py-1 text-xs font-bold text-[#0d5bff] focus:outline-none"
          >
            <option value="anuncio">📣 Anuncio Pagado (Ads)</option>
            <option value="dm">💬 DM de Instagram / Messenger</option>
            <option value="post">📝 Publicación / Bio</option>
            <option value="sms">📱 Mensaje SMS / WhatsApp</option>
            <option value="qr">🏁 Escaneo Código QR</option>
            <option value="web">🌐 Visita Web Directa</option>
          </select>
        </div>
        <button
          onClick={() => handleSourceChange(source)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#d8e2f0] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f6f8fc]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {m.rag && (
                <span className="font-mono text-[9px] text-[#0038d8] bg-[#ebf1ff] px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                  <Layers className="h-2.5 w-2.5" /> {m.rag}
                </span>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed border shadow-xs ${
                isUser ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm' : 'bg-white border-[#e2e8f0] text-[#0a1730] rounded-tl-sm'
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#e8edf6] flex items-center gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Escribe un mensaje de prueba simulando entrada desde ${source}...`}
          className="flex-1 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d5bff] text-white text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
};
