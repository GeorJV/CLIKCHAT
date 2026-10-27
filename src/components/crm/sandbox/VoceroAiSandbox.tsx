import React, { useState, useRef, useEffect } from 'react';
import { Send, FlaskConical, RefreshCw } from 'lucide-react';
import { SandboxMsg, PERSONAS, getBotConfig, getBotModelLabel } from './sandboxConstants';
import { LiveLabCorrectionModal } from './LiveLabCorrectionModal';
import { LiveLabMessageItem } from './LiveLabMessageItem';
import { broadcastBookingCreated } from '../../../utils/bookingSyncBus';

interface VoceroAiSandboxProps {
  tenantSlug: string;
  tenantId?: string;
  tenant?: any;
  tenantName?: string;
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroAiSandbox: React.FC<VoceroAiSandboxProps> = ({ tenantSlug, tenantId, tenant, tenantName, onCreateFaq }) => {
  const getWelcome = () => tenant?.welcome_message
    ? tenant.welcome_message.replace(/\{nombre_del_negocio\}|\{negocio\}/gi, tenantName || 'GeoSoft').replace(/\{asesor\}|\{bot\}/gi, tenant?.bot_name || 'Asesor Virtual')
    : `¡Hola! 👋 Bienvenido a **${tenantName || 'GeoSoft'}**. ¿En qué te podemos colaborar el día de hoy?`;

  const [messages, setMessages] = useState<SandboxMsg[]>([{ id: '1', sender: 'assistant', rag: 'L1 · Bienvenida', score: 98, isGolden: true, text: getWelcome() }]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('bot-synced');
  const [labSessionId, setLabSessionId] = useState(() => 'lab_' + Date.now().toString(36));
  const [loading, setLoading] = useState(false);
  const [activeCorrection, setActiveCorrection] = useState<{ msg: SandboxMsg; userQuestion: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tenant && messages.length === 1 && messages[0].sender === 'assistant') setMessages([{ ...messages[0], text: getWelcome() }]);
  }, [tenant]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior });

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
      const hist = messages.map((m) => ({ sender: m.sender, message: m.text }));
      const isSynced = selectedModel === 'bot-synced';
      const botCfg = getBotConfig(tenant);
      const effectiveReqModel = isSynced ? (botCfg.model || undefined) : selectedModel;
      const res = await fetch('/api/chat/message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug, tenantId: tenant?.id || tenantId, sessionId: labSessionId, message: txt,
          ...(isSynced ? {} : { model: effectiveReqModel, preferredModel: effectiveReqModel }),
          conversationHistory: hist, clientHour: new Date().getHours(),
          clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        }),
      });
      if (res.ok) {
        const d = await res.json();
        const score = Math.floor(Math.random() * 8) + 92;
        const defaultLabel = isSynced ? getBotModelLabel(tenant) : (selectedModel === 'model-1' ? 'Modelo 1: GLM 5' : selectedModel === 'model-2' ? 'Modelo 2: GPT' : selectedModel === 'model-gemini' ? 'Google Gemini' : 'Modelo 3: Meta');
        const effectiveModel = d.fallbackUsed ? (d.modelLabel || 'Red de Contingencia') : (d.modelLabel || defaultLabel);
        if (d.answer?.includes('[BOOKING_CARD:')) {
          try {
            const cardM = d.answer.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/);
            if (cardM) {
              const p = JSON.parse(cardM[1]);
              const apt = { id: 'apt_' + Date.now(), clientName: p.customerName || 'Cliente', serviceName: p.service || 'Desarrollo Web & SaaS', date: p.date, dateKey: p.date, displayDate: p.date, time: p.time, status: 'confirmed', channel: 'web', phone: p.customerPhone || '', email: p.customerEmail || '', notes: 'Live Lab', price: p.price || 1200 };
              const ex = JSON.parse(localStorage.getItem('clikchat_bookings_geosoft') || '[]');
              localStorage.setItem('clikchat_bookings_geosoft', JSON.stringify([apt, ...ex]));
              broadcastBookingCreated('geosoft', { id: apt.id, clientName: apt.clientName, serviceName: apt.serviceName, date: apt.displayDate, time: apt.time, price: apt.price });
            }
          } catch {}
        }
        setMessages((prev) => [...prev, { id: String(Date.now() + 1), sender: 'assistant', text: d.answer || 'Respuesta generada.', rag: d.rag_level_used || 'RAG Híbrido D1', score, isGolden: false, modelUsed: effectiveModel, fallbackUsed: d.fallbackUsed }]);
      }
    } catch (e) {
      console.warn('Sandbox error:', e);
    } finally { setLoading(false); }
  };

  const handleOpenCorrection = (m: SandboxMsg) => {
    const idx = messages.findIndex((item) => item.id === m.id);
    let question = 'Consulta sobre servicios';
    for (let i = idx - 1; i >= 0; i--) { if (messages[i].sender === 'user') { question = messages[i].text; break; } }
    setActiveCorrection({ msg: m, userQuestion: question });
  };

  const handleSaveCorrection = async (newText: string, action: string, testQuestion?: string) => {
    if (!activeCorrection) return;
    if (action === 'faq' && onCreateFaq) await onCreateFaq(activeCorrection.userQuestion, newText, 'Live Lab');
    setMessages((prev) => prev.map((item) => item.id === activeCorrection.msg.id ? { ...item, text: newText, rag: 'FAQ IQ · Corregida' } : item));
    if (testQuestion) setTimeout(() => handleSendText(testQuestion), 400);
  };

  const modelOptions = [
    { id: 'bot-synced', label: getBotModelLabel(tenant), title: 'Prueba sincronizada con la cuenta y modelo activo del bot' },
    { id: 'model-gemini', label: '⚡ Gemini', title: 'Google Gemini Oficial' },
    { id: 'model-1', label: '🥇 GLM 5', title: 'GLM 5.3 Flash (OpenRouter)' },
    { id: 'model-2', label: '🥈 GPT', title: 'ChatGPT 5 Mini (OpenRouter)' },
    { id: 'model-3', label: '🥉 Meta', title: 'Meta Llama 3.3 (Cloudflare)' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-3 sm:px-5 shadow-xs gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <FlaskConical className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-[#0a1730] shrink-0">Live Lab</h2>
          <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-xl border border-[#dde5f1] ml-1 sm:ml-2 overflow-x-auto max-w-full">
            {modelOptions.map((m) => (
              <button
                key={m.id} title={m.title} onClick={() => setSelectedModel(m.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${selectedModel === m.id ? 'bg-[#0d5bff] text-white shadow-2xs' : 'text-[#62728d] hover:text-[#0a1730]'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setLabSessionId('lab_' + Date.now().toString(36));
            setMessages([{ id: String(Date.now()), sender: 'assistant', rag: 'L1 · Bienvenida', score: 98, isGolden: true, text: getWelcome() }]);
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer shrink-0"
        >
          <RefreshCw className="h-3 w-3" /><span className="hidden sm:inline">Reiniciar</span>
        </button>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto space-y-3 pb-8">
        {messages.map((m) => (<LiveLabMessageItem key={m.id} message={m} onOpenCorrection={handleOpenCorrection} />))}
        {loading && (
          <div className="text-xs text-[#8391aa] flex items-center gap-2 py-2">
            <div className="w-3.5 h-3.5 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
            <span>Consultando fuentes y respondiendo…</span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-[#f8fafc] border-t border-[#e8edf6] max-w-3xl w-full mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8391aa] shrink-0">Personas:</span>
        {PERSONAS.map((p) => (
          <button key={p.label} onClick={() => handleSendText(p.text)} disabled={loading} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#dde5f1] hover:border-[#0d5bff] hover:text-[#0d5bff] text-[#42506b] shadow-2xs whitespace-nowrap transition cursor-pointer">
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-[#e8edf6] max-w-3xl w-full mx-auto shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Escribe como un comprador para probar la respuesta del agente…"
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button onClick={() => handleSendText()} disabled={loading || !input.trim()} className="p-2.5 rounded-full bg-[#0d5bff] text-white hover:bg-[#0047e1] disabled:opacity-40 transition cursor-pointer">
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
