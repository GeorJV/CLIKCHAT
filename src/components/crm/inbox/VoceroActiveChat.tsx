import React, { useState, useRef, useEffect } from 'react';
import { PanelRight, Bot, UserCheck, Send, Zap } from 'lucide-react';
import { CrmLead, CrmMessage } from '../../../types/crm';
import { CannedResponsesPopover } from './CannedResponsesPopover';
import { useLiveTyping } from '../../../hooks/useLiveTyping';
import { splitMessageByDeliveryMode, DeliveryMode } from '../../../utils/messageSplitter';

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
  lead, messages, isLoadingMessages, panelOpen, onTogglePanel, onToggleTakeover, onSendMessage,
}) => {
  const [draft, setDraft] = useState('');
  const [showCanned, setShowCanned] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { isTyping, draftText } = useLiveTyping(lead?.session_id || lead?.id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (draft.startsWith('/')) setShowCanned(true);
    else if (!draft) setShowCanned(false);
  }, [draft]);

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#f6f8fc]">
        <p className="font-serif text-[22px] italic text-[#42506b]">Elige una conversación para ver el hilo</p>
        <p className="vocero-kicker mt-1">Bandeja · tiempo real</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    onSendMessage(lead.id, draft);
    setDraft('');
    setShowCanned(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8fc] border-r border-[#e8edf6] font-sans">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#eef2f9] border border-[#dde5f1] flex items-center justify-center font-bold text-xs text-[#0a1730]">
            {lead.name ? lead.name.slice(0, 2).toUpperCase() : 'LE'}
          </div>
          <div className="min-w-0">
            <span className="text-[14px] font-bold tracking-tight text-[#0a1730] truncate block">{lead.name || 'Sin Nombre'}</span>
            <span className="text-[11px] text-[#62728d] truncate block">{lead.channel} · {lead.stage}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleTakeover(lead.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              lead.ai_paused ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#eaf7ef] text-[#0f8b44] border border-[#d7eede]'
            }`}
          >
            {lead.ai_paused ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            <span>{lead.ai_paused ? 'Asesor Humano' : 'IA Respondiendo'}</span>
          </button>
          <button onClick={onTogglePanel} className="p-2 text-[#42506b] hover:text-[#0a1730] rounded-lg hover:bg-[#f6f8fc] cursor-pointer">
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Lista de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          const deliveryMode: DeliveryMode = (typeof window !== 'undefined'
            ? (localStorage.getItem('clikchat_delivery_mode') as DeliveryMode)
            : null) || 'interleaved';
          const bubbles = !isUser ? splitMessageByDeliveryMode(m.message, deliveryMode) : [];

          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
              {!isUser && bubbles.length > 1 ? (
                <div className="flex flex-col items-end space-y-1 max-w-[78%]">
                  {bubbles.map((b, i) => (
                    <div key={i} className="rounded-2xl px-4 py-2 text-[13px] leading-relaxed shadow-xs bg-[#0d5bff] text-white rounded-br-sm">
                      {b}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs ${
                  isUser ? 'bg-white border border-[#dde5f1] text-[#0a1730] rounded-bl-sm' : 'bg-[#0d5bff] text-white rounded-br-sm'
                }`}>
                  {bubbles[0] || m.message}
                </div>
              )}
              <span className="font-mono text-[9.5px] text-[#8391aa] mt-1 px-1">
                {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          );
        })}
        {isTyping && draftText && (
          <div className="flex flex-col items-start animate-in fade-in duration-200">
            <div className="rounded-2xl px-3.5 py-1.5 bg-blue-50/90 border border-blue-200/70 text-[#0a1730] text-[12px] flex items-center gap-2 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[#0d5bff] font-bold text-[11px]">Tecleando en vivo:</span>
              <span className="italic text-slate-700 font-sans">"{draftText}"</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Compositor con Atajos Rápidos */}
      <div className="p-3 bg-white border-t border-[#e8edf6] space-y-2 relative">
        {showCanned && (
          <CannedResponsesPopover
            filter={draft}
            onSelect={(text) => { setDraft(text); setShowCanned(false); }}
            onClose={() => setShowCanned(false)}
          />
        )}

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setShowCanned(!showCanned)}
            className="text-[10.5px] font-mono text-[#0d5bff] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer font-bold transition"
          >
            <Zap className="w-3 h-3 text-[#0d5bff]" /> Atajos (/)
          </button>
          {['/sinpe', '/horario', '/catalogo', '/express'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => { setDraft(cmd); setShowCanned(true); }}
              className="px-2 py-0.5 rounded-full border border-[#dde5f1] text-[10.5px] text-[#42506b] hover:bg-[#f6f8fc] cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje o escribe / para atajos..."
            className="flex-1 rounded-full border border-[#dde5f1] bg-[#f6f8fc] px-4 py-2 text-[13px] text-[#0a1730] outline-none focus:border-[#0d5bff] focus:bg-white"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d5bff] hover:bg-[#0a4de6] disabled:opacity-40 text-white shadow-xs cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
