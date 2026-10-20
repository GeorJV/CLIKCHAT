import React, { useState } from 'react';
import { CrmLead, CrmMessage, TrafficSource } from '../../../types/crm';
import { Sparkles, MessageSquare, Instagram, ExternalLink, Smartphone, QrCode, Globe, Send, User, Pause, Play } from 'lucide-react';

interface Props {
  leads: CrmLead[];
  selectedLead: CrmLead | null;
  selectedLeadId: string | null;
  onSelectLead: (id: string) => void;
  messages: CrmMessage[];
  onToggleTakeover: (leadId: string, paused: boolean) => void;
  onSendMessage: (sessionId: string, text: string) => void;
}

export const ClikChatConversationsView: React.FC<Props> = ({
  leads,
  selectedLead,
  selectedLeadId,
  onSelectLead,
  messages,
  onToggleTakeover,
  onSendMessage
}) => {
  const [sourceFilter, setSourceFilter] = useState<'all' | TrafficSource>('all');
  const [replyText, setReplyText] = useState('');

  // Filtramos únicamente leads que provienen de ClikChat Web o enlaces propios
  const webLeads = leads.filter(l => l.channel === 'web' || l.channel === 'clikchat' || l.source);
  const filteredLeads = webLeads.filter(l => sourceFilter === 'all' || l.source === sourceFilter);

  const getSourceBadge = (source?: TrafficSource) => {
    switch (source) {
      case 'anuncio': return { label: 'Anuncio (Ads)', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Sparkles };
      case 'dm': return { label: 'DM Instagram / FB', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: Instagram };
      case 'post': return { label: 'Post / Bio', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ExternalLink };
      case 'sms': return { label: 'SMS / WhatsApp', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Smartphone };
      case 'qr': return { label: 'Código QR', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: QrCode };
      default: return { label: 'Web Directa', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Globe };
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedLead) return;
    onSendMessage(selectedLead.session_id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-xs font-sans">
      {/* Columna Izquierda: Lista de Chats con Atribución */}
      <div className="w-80 shrink-0 border-r border-[#e8edf6] flex flex-col bg-[#f8fafc]">
        {/* Filtros de Origen */}
        <div className="p-3 border-b border-[#e8edf6] overflow-x-auto [scrollbar-width:none] flex items-center gap-1.5 shrink-0">
          {(['all', 'anuncio', 'dm', 'post', 'sms', 'web', 'qr'] as const).map((sf) => (
            <button
              key={sf}
              onClick={() => setSourceFilter(sf)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                sourceFilter === sf ? 'bg-[#0d5bff] text-white shadow-xs' : 'bg-white text-[#62728d] border border-[#e2e8f0] hover:text-[#0a1730]'
              }`}
            >
              {sf === 'all' ? 'Todos' : sf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredLeads.length === 0 ? (
            <p className="text-center text-xs text-[#8391aa] py-12">No hay chats web en este filtro</p>
          ) : (
            filteredLeads.map((l) => {
              const active = selectedLeadId === l.id;
              const badge = getSourceBadge(l.source);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={l.id}
                  onClick={() => onSelectLead(l.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    active ? 'bg-white border-[#0d5bff] shadow-sm' : 'bg-white/80 border-[#e8edf6] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs text-[#0a1730] truncate">{l.name}</span>
                    <span className={`inline-flex items-center gap-1 font-mono text-[9.5px] px-1.5 py-0.2 rounded-full border ${badge.color}`}>
                      <BadgeIcon className="h-2.5 w-2.5" /> {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#62728d] line-clamp-1">{l.last_message || 'Chat web iniciado'}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Columna Derecha: Detalle de Chat & Atribución */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedLead ? (
          <>
            {/* Cabecera del Chat */}
            <div className="h-14 shrink-0 px-4 border-b border-[#e8edf6] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#0d5bff]/10 text-[#0d5bff] font-bold text-xs flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0a1730]">{selectedLead.name}</h4>
                  <div className="flex items-center gap-2 text-[10.5px] text-[#8391aa]">
                    <span>Origen: <strong>{getSourceBadge(selectedLead.source).label}</strong></span>
                    {selectedLead.deal_value > 0 && <span className="text-[#0f8b44] font-mono font-bold">₡{selectedLead.deal_value.toLocaleString()}</span>}
                  </div>
                </div>
              </div>

              {/* Botón Human Takeover */}
              <button
                type="button"
                onClick={() => onToggleTakeover(selectedLead.id, !selectedLead.ai_paused)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedLead.ai_paused ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#eaf7ef] text-[#0f8b44] border border-[#d7eede]'
                }`}
              >
                {selectedLead.ai_paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                <span>{selectedLead.ai_paused ? 'IA Pausada (Atendiendo Asesor)' : 'IA Activa'}</span>
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f6f8fc]">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs border ${
                      isUser ? 'bg-[#eaf7ef] border-[#d7eede] text-[#0a1730] rounded-tr-sm' : 'bg-white border-[#e2e8f0] text-[#0a1730] rounded-tl-sm'
                    }`}>
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#e8edf6] flex items-center gap-2 bg-white">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta como asesor humano..."
                className="flex-1 rounded-xl border border-[#d8e2f0] bg-[#f8fafc] px-3.5 py-2 text-xs text-[#0a1730] focus:border-[#0d5bff] focus:bg-white focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d5bff] text-white text-xs font-bold hover:bg-[#0047e1] transition cursor-pointer">
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8391aa]">
            Selecciona una conversación para ver los mensajes y atribución
          </div>
        )}
      </div>
    </div>
  );
};
