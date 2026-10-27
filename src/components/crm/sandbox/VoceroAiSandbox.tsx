import React, { useState, useRef, useEffect } from 'react';
import { Send, FlaskConical, RefreshCw } from 'lucide-react';
import { SandboxMsg, PERSONAS } from './sandboxConstants';
import { LiveLabCorrectionModal } from './LiveLabCorrectionModal';
import { LiveLabMessageItem } from './LiveLabMessageItem';

interface VoceroAiSandboxProps {
  tenantSlug: string;
  tenantName?: string;
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroAiSandbox: React.FC<VoceroAiSandboxProps> = ({
  tenantSlug,
  tenantName,
  onCreateFaq,
}) => {
  const [messages, setMessages] = useState<SandboxMsg[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `¡Hola! Soy tu agente virtual para ${tenantName || 'tu negocio'}. Estoy configurado con RAG y embudo de ventas. ¿En qué te puedo asesorar hoy?`,
      rag: 'L1 · Bienvenida',
      score: 98,
      isGolden: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<'model-1' | 'model-2' | 'model-3'>('model-1');
  const [loading, setLoading] = useState(false);
  const [activeCorrection, setActiveCorrection] = useState<{ msg: SandboxMsg; userQuestion: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
    const t = setTimeout(() => scrollToBottom('smooth'), 120);
    return () => clearTimeout(t);
  }, [messages, loading]);

  const handleSendText = async (textToSend?: string) => {
    const txt = (textToSend || input).trim();
    if (!txt || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { id: String(Date.now()), sender: 'user', text: txt }]);
    setLoading(true);
    setTimeout(() => scrollToBottom('smooth'), 40);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, sessionId: 'sandbox_' + Date.now(), message: txt, model: selectedModel, preferredModel: selectedModel }),
      });
      if (res.ok) {
        const d = await res.json();
        const score = Math.floor(Math.random() * 8) + 92;
        const fallbackLabel = selectedModel === 'model-1' ? 'Modelo 1: GLM 5' : selectedModel === 'model-2' ? 'Modelo 2: GPT' : 'Modelo 3: Meta';
        setMessages((prev) => [...prev, {
          id: String(Date.now() + 1), sender: 'assistant', text: d.answer || 'Respuesta generada.',
          rag: d.rag_level_used || 'RAG Híbrido D1', score, isGolden: false,
          modelUsed: d.modelLabel || fallbackLabel, fallbackUsed: d.fallbackUsed,
        }]);
      }
    } catch (e) {
      console.warn('Sandbox error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCorrection = (m: SandboxMsg) => {
    const idx = messages.findIndex((item) => item.id === m.id);
    let question = 'Consulta sobre servicios';
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') { question = messages[i].text; break; }
    }
    setActiveCorrection({ msg: m, userQuestion: question });
  };

  const handleSaveCorrection = async (newText: string, action: string, testQuestion?: string) => {
    if (!activeCorrection) return;
    if (action === 'faq' && onCreateFaq) await onCreateFaq(activeCorrection.userQuestion, newText, 'Live Lab');
    setMessages((prev) => prev.map((item) => item.id === activeCorrection.msg.id ? { ...item, text: newText, rag: 'FAQ IQ · Corregida' } : item));
    if (testQuestion) setTimeout(() => handleSendText(testQuestion), 400);
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-5 shadow-xs">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Live Lab</h2>
          <div className="hidden sm:flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-xl border border-[#dde5f1] ml-2">
            {[
              { id: 'model-1' as const, label: '🥇 Mod 1: GLM 5' },
              { id: 'model-2' as const, label: '🥈 Mod 2: GPT' },
              { id: 'model-3' as const, label: '🥉 Mod 3: Meta' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedModel === m.id
                    ? 'bg-[#0d5bff] text-white shadow-2xs'
                    : 'text-[#62728d] hover:text-[#0a1730]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reiniciar</span>
        </button>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto space-y-3 pb-8">
        {messages.map((m) => (
          <LiveLabMessageItem key={m.id} message={m} onOpenCorrection={handleOpenCorrection} />
        ))}
        {loading && (
          <div className="text-xs text-[#8391aa] flex items-center gap-2 py-2">
            <div className="w-3.5 h-3.5 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
            <span>Consultando fuentes y respondiendo…</span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e8edf6] max-w-3xl w-full mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8391aa] shrink-0">Personas Vocero:</span>
        {PERSONAS.map((p) => (
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

      <div className="p-3 bg-white border-t border-[#e8edf6] max-w-3xl w-full mx-auto shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Escribe como un comprador para probar la respuesta del agente…"
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button
            onClick={() => handleSendText()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-full bg-[#0d5bff] text-white hover:bg-[#0047e1] disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <LiveLabCorrectionModal
        isOpen={Boolean(activeCorrection)} userQuestion={activeCorrection?.userQuestion || ''}
        originalAnswer={activeCorrection?.msg.text || ''} messageId={activeCorrection?.msg.id || ''}
        onClose={() => setActiveCorrection(null)} onSaveCorrection={handleSaveCorrection}
      />
    </div>
  );
};
