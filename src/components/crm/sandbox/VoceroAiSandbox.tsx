import React, { useState } from 'react';
import { Send, Bot, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

interface VoceroAiSandboxProps {
  tenantSlug: string;
  tenantName?: string;
}

interface SandboxMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  ragLevel?: string;
}

export const VoceroAiSandbox: React.FC<VoceroAiSandboxProps> = ({ tenantSlug, tenantName }) => {
  const [messages, setMessages] = useState<SandboxMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `¡Hola! Soy tu asesor virtual para ${tenantName || 'tu negocio'}. Estoy listo para vender, resolver dudas y avanzar el embudo en 4 pasos. ¿Qué deseas consultar?`,
      ragLevel: 'L1: Bienvenida'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');

    const userMsg: SandboxMessage = { id: String(Date.now()), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug,
          sessionId: 'sandbox_' + Date.now(),
          message: userText
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: SandboxMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.answer || 'Respuesta generada por el bot.',
          ragLevel: data.rag_level_used || 'RAG Híbrido D1'
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.warn('Sandbox error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 font-sans p-4 max-w-4xl mx-auto space-y-3">
      {/* Cabecera del Sandbox */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AI Sandbox & Simulador Vocero</h2>
            <p className="text-[11px] text-zinc-400">Prueba el flujo de venta y la telemetría RAG antes de interactuar con clientes reales.</p>
          </div>
        </div>
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition border border-zinc-700 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reiniciar</span>
        </button>
      </div>

      {/* Flujo de Mensajes */}
      <div className="flex-1 overflow-y-auto bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {m.ragLevel && (
              <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 mb-1 flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                {m.ragLevel}
              </span>
            )}
            <div
              className={`p-3 rounded-2xl text-xs max-w-lg leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-zinc-800 text-white rounded-tr-sm border border-zinc-700'
                  : 'bg-emerald-950/70 text-emerald-100 rounded-tl-sm border border-emerald-500/30'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Consultando fuentes RAG y generando respuesta...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe como un cliente para probar al bot..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Probar</span>
        </button>
      </div>
    </div>
  );
};
