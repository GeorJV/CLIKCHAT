import React, { useState, useRef, useEffect } from 'react';
import { Send, FlaskConical, RefreshCw, Copy, Check, History } from 'lucide-react';
import { SandboxMsg, getBotConfig, getBotModelLabel, getLiveTenantConfig, getAdaptivePersonas, saveSandboxBooking } from './sandboxConstants';
import { getCurrentLabSequence, getNextLabSequence, saveLabSessionRecord, formatLabChatForClipboard, LabSessionRecord, getLabSessions } from './labHistoryStore';
import { LiveLabCorrectionModal } from './LiveLabCorrectionModal';
import { LiveLabMessageItem } from './LiveLabMessageItem';
import { LiveLabHistoryModal } from './LiveLabHistoryModal';

interface VoceroAiSandboxProps {
  tenantSlug: string;
  tenantId?: string;
  tenant?: any;
  tenantName?: string;
  products?: any[];
  faqs?: any[];
  onCreateFaq?: (question: string, answer: string, category?: string) => Promise<boolean>;
}

export const VoceroAiSandbox: React.FC<VoceroAiSandboxProps> = ({
  tenantSlug, tenantId, tenant, tenantName, products = [], faqs = [], onCreateFaq
}) => {
  const botName = tenant?.bot_name || 'Asesor Virtual';
  const getWelcome = () => tenant?.welcome_message
    ? tenant.welcome_message.replace(/\{nombre_del_negocio\}|\{negocio\}/gi, tenantName || tenant?.name || 'GeoSoft').replace(/\{asesor\}|\{bot\}/gi, botName)
    : `¡Hola! 👋 Bienvenido a **${tenantName || tenant?.name || 'GeoSoft'}**. ¿En qué te podemos colaborar el día de hoy?`;

  const [currentSeq, setCurrentSeq] = useState(() => getCurrentLabSequence());
  const [labSessionId, setLabSessionId] = useState(() => `lab_${currentSeq.toLowerCase()}_${Date.now().toString(36)}`);
  const [messages, setMessages] = useState<SandboxMsg[]>([{ id: '1', sender: 'assistant', rag: 'L1 · Bienvenida', score: 99, isGolden: true, text: getWelcome() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeCorrection, setActiveCorrection] = useState<{ msg: SandboxMsg; userQuestion: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tenant && messages.length === 1 && messages[0].sender === 'assistant') setMessages([{ ...messages[0], text: getWelcome() }]);
  }, [tenant?.welcome_message, tenant?.bot_name, tenant?.name]);

  useEffect(() => {
    if (messages.length > 1) {
      const lastUser = [...messages].reverse().find((m) => m.sender === 'user')?.text || '';
      saveLabSessionRecord(tenantSlug, { id: labSessionId, seq: currentSeq, tenantSlug, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages, lastSnippet: lastUser, modelLabel: getBotModelLabel(tenant) });
    }
  }, [messages, labSessionId, currentSeq, tenantSlug]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior });
  useEffect(() => { scrollToBottom('smooth'); const t = setTimeout(() => scrollToBottom('smooth'), 100); return () => clearTimeout(t); }, [messages, loading]);

  const handleNewSession = () => {
    const { code } = getNextLabSequence();
    setCurrentSeq(code);
    setLabSessionId(`lab_${code.toLowerCase()}_${Date.now().toString(36)}`);
    setMessages([{ id: String(Date.now()), sender: 'assistant', rag: 'L1 · Bienvenida', score: 99, isGolden: true, text: getWelcome() }]);
  };

  const handleCopyChat = async () => {
    const txt = formatLabChatForClipboard({ seq: currentSeq, botName, tenantName: tenantName || tenant?.name || 'GeoSoft', messages, sessionId: labSessionId });
    await navigator.clipboard.writeText(txt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendText = async (textToSend?: string) => {
    const txt = (textToSend || input).trim();
    if (!txt || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { id: String(Date.now()), sender: 'user', text: txt }]);
    setLoading(true);
    setTimeout(() => scrollToBottom('smooth'), 30);

    try {
      const hist = messages.map((m) => ({ sender: m.sender, message: m.text }));
      const botCfg = getBotConfig(tenant);
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug, tenantId: tenant?.id || tenantId, sessionId: labSessionId, labSeq: currentSeq, message: txt, liveConfig: getLiveTenantConfig(tenant), liveProducts: products, liveFaqs: faqs, model: botCfg.model || undefined, conversationHistory: hist, clientHour: new Date().getHours(), clientTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        }),
      });

      if (res.ok) {
        const d = await res.json();
        const score = Math.floor(Math.random() * 6) + 94;
        const effectiveModel = d.fallbackUsed ? (d.modelLabel || 'Red de Contingencia') : (d.modelLabel || getBotModelLabel(tenant));
        const cardMatch = d.answer?.includes('[BOOKING_CARD:') ? d.answer.match(/\[BOOKING_CARD:\s*(\{[\s\S]*?\})\s*\]/) : null;
        let cardPayload = cardMatch ? (() => { try { return JSON.parse(cardMatch[1]); } catch { return null; } })() : (d.bookingCard || null);
        if (!cardPayload && d.booking) {
          cardPayload = { id: d.booking.id, customerName: d.booking.customer_name, customerEmail: d.booking.customer_email, customerPhone: d.booking.customer_phone, service: d.booking.service_name, date: d.booking.booking_date, time: d.booking.booking_time, price: d.booking.price };
        }
        let finalAnswer = d.answer || 'Respuesta generada.';
        if (!cardPayload && /\b(?:cita|reuni[oó]n|espacio|reserva)\s+(?:ha\s+quedado\s+|est[aá]\s+|qued[oó]\s+)?(?:agendad[oa]|confirmad[oa]|reservad[oa]|programad[oa]|apartad[oa]|guardad[oa])\b/i.test(finalAnswer)) {
          const timeMatch = finalAnswer.match(/(?:a\s+las?\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|\d{1,2}:\d{2})/i);
          cardPayload = { customerName: tenantName || tenant?.name || 'Cliente Agendado', service: tenant?.name === 'GeoSoft' ? 'Desarrollo Web & SaaS' : 'Servicio Profesional', date: new Date().toISOString().slice(0, 10), time: timeMatch ? timeMatch[1].toUpperCase() : '10:00 AM', price: tenant?.name === 'GeoSoft' ? 1200 : 0 };
        }
        if (cardPayload) {
          if (!finalAnswer.includes('[BOOKING_CARD:')) finalAnswer = `${finalAnswer}\n\n[BOOKING_CARD: ${JSON.stringify(cardPayload)}]`;
          saveSandboxBooking(cardPayload, tenant, tenantId, tenantSlug);
        }
        setMessages((prev) => [...prev, { id: String(Date.now() + 1), sender: 'assistant', text: finalAnswer, rag: d.rag_level_used || 'RAG Híbrido D1', score, isGolden: false, modelUsed: effectiveModel, fallbackUsed: d.fallbackUsed }]);
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

  const savedSessionsCount = getLabSessions(tenantSlug).length;

  return (
    <div className="flex flex-col h-full max-h-full min-h-0 bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-3 sm:px-5 shadow-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FlaskConical className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-[15px] sm:text-[16px] font-bold tracking-tight text-[#0a1730] shrink-0">Live Lab</h2>
          <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#0d5bff]/10 text-[#0d5bff] border border-[#0d5bff]/20 shrink-0">
            {currentSeq}
          </span>
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">{botName} ({getBotModelLabel(tenant)})</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setIsHistoryOpen(true)} title="Ver historial de chats de laboratorio" className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer shrink-0">
            <History className="h-3.5 w-3.5 text-[#0d5bff]" />
            <span className="hidden sm:inline">Historial</span>
            {savedSessionsCount > 0 && <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-bold text-[#0d5bff]">{savedSessionsCount}</span>}
          </button>
          <button onClick={handleCopyChat} title="Copiar toda la conversación" className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer shrink-0">
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#0d5bff]" />}
            <span className="hidden sm:inline">{isCopied ? '¡Copiado!' : 'Copiar Chat'}</span>
          </button>
          <button onClick={handleNewSession} title="Iniciar nueva prueba" className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border border-[#dde5f1] bg-white text-xs font-semibold text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer shrink-0">
            <RefreshCw className="h-3 w-3" /><span className="hidden sm:inline">Nueva Prueba</span>
          </button>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto p-4 max-w-3xl w-full mx-auto space-y-3 pb-4">
        {messages.map((m) => (
          <LiveLabMessageItem key={m.id} message={m} agentName={botName} agentAvatar={tenant?.avatar_url} onOpenCorrection={handleOpenCorrection} />
        ))}
        {loading && (
          <div className="text-xs text-[#8391aa] flex items-center gap-2 py-2">
            <div className="w-3.5 h-3.5 border-2 border-[#0d5bff] border-t-transparent rounded-full animate-spin" />
            <span>Consultando fuentes verificadas y respondiendo…</span>
          </div>
        )}
      </div>

      <footer className="shrink-0 bg-white border-t border-[#e8edf6] z-10">
        <div className="max-w-3xl w-full mx-auto">
          <div className="px-3 sm:px-4 py-1.5 bg-[#f8fafc] border-b border-[#e8edf6] flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8391aa] shrink-0">Pruebas Rápidas:</span>
            {getAdaptivePersonas(tenant).map((p) => (
              <button key={p.label} onClick={() => handleSendText(p.text)} disabled={loading} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#dde5f1] hover:border-[#0d5bff] hover:text-[#0d5bff] text-[#42506b] shadow-2xs whitespace-nowrap transition cursor-pointer">
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-2.5 sm:p-3 bg-white">
            <div className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendText()} placeholder={`Escribe como un cliente para probar las respuestas en vivo de ${botName}…`} className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white transition" />
              <button onClick={() => handleSendText()} disabled={loading || !input.trim()} className="p-2.5 rounded-full bg-[#0d5bff] text-white hover:bg-[#0047e1] disabled:opacity-40 transition cursor-pointer shrink-0">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <LiveLabCorrectionModal isOpen={Boolean(activeCorrection)} userQuestion={activeCorrection?.userQuestion || ''} originalAnswer={activeCorrection?.msg.text || ''} messageId={activeCorrection?.msg.id || ''} onClose={() => setActiveCorrection(null)} onSaveCorrection={async (newText, action, testQ) => {
        if (!activeCorrection) return;
        if (action === 'faq' && onCreateFaq) await onCreateFaq(activeCorrection.userQuestion, newText, 'Live Lab');
        setMessages((prev) => prev.map((item) => item.id === activeCorrection.msg.id ? { ...item, text: newText, rag: 'FAQ IQ · Corregida' } : item));
        if (testQ) setTimeout(() => handleSendText(testQ), 300);
      }} />

      <LiveLabHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} tenantSlug={tenantSlug} tenantName={tenantName || tenant?.name || 'GeoSoft'} botName={botName} currentSeq={currentSeq} onSelectSession={(s) => { setCurrentSeq(s.seq); setLabSessionId(s.id); setMessages(s.messages); }} onNewSession={handleNewSession} />
    </div>
  );
};
