import React, { useRef, useEffect } from 'react';
import { PanelRight, Bot, UserCheck, Send, Zap } from 'lucide-react';
import { CrmLead, CrmMessage } from '../../../types/crm';

interface VoceroActiveChatProps {
  lead: CrmLead | null;
  messages: CrmMessage[];
  isLoadingMessages: boolean;
  panelOpen: boolean;
  onTogglePanel: () => void;
  onToggleTakeover: (leadId: string) => void;
  onSendMessage: (leadId: string, text: string) => void;
}

export const VoceroActiveChat: React.FC<VoceroActiveChatProps> = ({
  lead,
  messages,
  isLoadingMessages,
  panelOpen,
  onTogglePanel,
  onToggleTakeover,
  onSendMessage,
}) => {
  const [draft, setDraft] = React.useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f6f8fc]">
        <p className="font-serif text-[22px] italic text-[#42506b]">
          Elige una conversación para ver el hilo
        </p>
        <p className="vocero-kicker mt-1">Bandeja · tiempo real</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    onSendMessage(lead.id, draft);
    setDraft('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8fc] border-r border-[#e8edf6] font-sans">
      {/* Cabecera idéntica a Vocero */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#eef2f9] border border-[#dde5f1] flex items-center justify-center font-bold text-xs text-[#0a1730]">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold tracking-tight text-[#0a1730] truncate">
                {lead.name || 'Sin Nombre'}
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#eaf7ef] text-[#157a41]">
                {lead.channel === 'whatsapp' ? 'WhatsApp' : 'Web'}
              </span>
            </div>
            <p className="font-mono text-[10.5px] text-[#157a41] leading-none mt-0.5">
              ventana abierta (24h)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Human Takeover */}
          <button
            onClick={() => onToggleTakeover(lead.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
              lead.ai_paused
                ? 'bg-[#fef6e6] text-[#935f0b] border-[#f8e3b5]'
                : 'bg-[#e9f7ee] text-[#157a41] border-[#c9ebd6]'
            }`}
          >
            {lead.ai_paused ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#157a41]" />}
            <span>{lead.ai_paused ? 'Pausado (Humano)' : 'IA Activa'}</span>
          </button>

          {/* Toggle Panel Detalles */}
          <button
            onClick={onTogglePanel}
            aria-label="Detalles del contacto"
            className="rounded-full border border-[#dde5f1] p-1.5 text-[#8391aa] hover:border-[#8391aa] hover:text-[#0a1730] transition cursor-pointer"
          >
            <PanelRight className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Hilo de Mensajes con Burbujas Vocero */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f6f8fc]">
        {messages.map((m, i) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id || i} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-[13px] leading-relaxed border shadow-sm ${
                  isUser
                    ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tl-sm'
                    : 'bg-[#ebf1ff] border-[#d3e2ff] text-[#0a1730] rounded-tr-sm'
                }`}
              >
                {m.message}
              </div>
              <span className="font-mono text-[9.5px] text-[#8391aa] mt-1 px-1">
                {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Compositor Vocero con Macros */}
      <div className="p-3 bg-white border-t border-[#e8edf6] space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10.5px] font-mono text-[#8391aa] flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#f2a71b]" /> Macros:
          </span>
          {['💳 Link de Pago', '🍕 Comanda Lista', '📅 Agendar Cita'].map((macro) => (
            <button
              key={macro}
              onClick={() => setDraft(macro + ': ')}
              className="px-2 py-0.5 rounded-full border border-[#dde5f1] text-[10.5px] text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
            >
              {macro}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje…"
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-40 text-white shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
